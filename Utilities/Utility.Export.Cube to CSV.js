function pre() {
    //this function is called once before the processes is executed.
    //Use this to setup prompts.
    script.log('process pre-execution parameters parsed.');
    script.prompt('Cube Name', 'cubeName', '')
}

function begin() {
    //this function is called once at the start of the process
    script.log('process execution started.');

    // Sanitise user input
    if (!cube.exists(cubeName)) {
        script.abort(`Can not find a cube by the name: "${cubeName}"`)
        return
    }

    // Get dimensions
    let dimensions = JSON.parse(cube.dimensions(cubeName))
    script.log(`Slicing on the "${cubeName}" cube and it's ${dimensions.length} dimensions`)

    // Create slice based on number of dimensions
    let slice = cube.slice(cubeName, new Array(dimensions.length).fill(''))
    // Use this line instead to narrow down the slice to your liking
    // let slice = cube.slice(cubeName, 'Forecast', '', '', '', '', '')

    // Create CSV
    let filename = `Exports/Cube_To_CSV_Export-${cubeName}.csv`
    let file = datasource.csv(filename)
    script.log(`Created csv file: "${filename}"`)

    // Write dimension names as headers in the CSV
    file.write(dimensions.map(i => i.name).concat("value"))

    // Load the rest of the CSV
    let i = 0;
    while (!slice.EOF()) {
        if (script.IsCancelled()) return;
        if (++i % 10000 == 0) script.log(`${i} lines written to csv file`)
        let data = slice.Next();
        file.write(data);
    }
    script.log(`Finished writing ${i} lines to csv file.`)
    script.log(`Check "${filename}" for results.`)

    file.close()
}

function data(record) {
    //this function is called once for each line of data on the second cycle
    //use this to build dimensions and push data into cubes
}

function end() {
    //this function is called once at the end of the process
    script.log('process execution finished.');
}