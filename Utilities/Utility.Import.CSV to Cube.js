function pre() {
    //this function is called once before the processes is executed.
    //Use this to setup prompts.
    script.log('process pre-execution parameters parsed.')
    script.prompt('CSV file path/name (include .csv extension)', 'filename', 'Exports/example.csv')
    script.prompt('Cube Name', 'cubeName', '')
}

function begin() {
    //this function is called once at the start of the process
    script.log('process execution started.')

    // Each line read from the csv ends up in either one of two formats based on if a header row is detected:
    // {"column1":"2020 - Feb","column0":"Actual","column5":"1.886009194","column4":"Average Rate","column3":"AUD","column2":"GBP"}
    // {"month":"2020 - Feb","scenario":"Actual","forex_measures":"Average Rate","value":"1.886009194","currency_to":"AUD","currency_from":"GBP"}
    // For now this process assumes there is a header row

    let file = datasource.csvRead(filename, 0)
    if (file == null) {
        script.abort(`Could not find a file under the name/path: "${filename}"`)
        return
    }
    if (!cube.exists(cubeName)) {
        script.abort(`Can not find a cube by the name: "${cubeName}"`)
        return
    }

    // Get dimensions
    let dimensions = JSON.parse(cube.dimensions(cubeName))
    let cleaned_dimensions = dimensions.map(i => i.name.toLowerCase().replace(' ', '_'))

    // Optional cube.wipe here
    console.log(`Wiping part of ${cubeName} cube`)
    cube.wipe(cubeName, 'Forecast', '', '', '', '', '')

    let checked_if_columns_match = false
    let i = 0;
    while (!file.isEOF()) {
        if (script.IsCancelled()) return;

        let line = file.read()

        // On the first row of data, check if it contains all of the cube's dimensions
        if (!checked_if_columns_match) {
            script.log("Checking if csv and cube contain the same dimensions.")
            let columns = Object.keys(line)

            // Remove the "value" column that gets added in the corresponding csv export process. Uses https://stackoverflow.com/a/5767357.
            const index = columns.indexOf('value');
            if (index > -1) columns.splice(index, 1);

            // Check if the dimensions in the cube matches up with the columns in the csv. Uses https://stackoverflow.com/a/6230314. slice() used to clone array so it doesn't get sorted.
            if (cleaned_dimensions.slice().sort().join(',') != columns.sort().join(',')) {
                script.abort(`The dimensions in the "${cubeName}" cube and the csv file do not match up.`)
                console.log(`Cube dimensions: ${cleaned_dimensions.slice().sort()}.`)
                console.log(`CSV columns: ${columns}.`)
                return
            }
            checked_if_columns_match = true
        }

        cube.set(line.value, cubeName, cleaned_dimensions.map(d => line[d]))
        if (++i % 10000 == 0) script.log(`${i} lines read and input into cube`)
    }

    file.close()
}

function data(record) {
    //this function is called once for each line of data on the second cycle
    //use this to build dimensions and push data into cubes
}

function end() {
    //this function is called once at the end of the process
    script.log('process execution finished.')
}