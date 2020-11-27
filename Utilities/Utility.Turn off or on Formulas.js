/*
This process will turn off or on the formula evaluation for the specified cube. 
This can be helpfull if sending in a bulk of data via the MODLR Excel addin (>100k datapoints) where the datapoints will cause other datapoints to recalculate / invalidate as this will prevent the formula processing until the formulas are turned back on.
*/
function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');

    script.prompt("Cube","selCube","CubeName");
    script.prompt("Status","selStatus","Off");
}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');

    let changeTo = false;
    if( selStatus.toLowerCase() == "on") {
        changeTo = true; 
    }
    cube.formulaEvaluation(selCube, changeTo);
}

function data(record) {
	//this function is called once for each line of data on the second cycle
	//use this to build dimensions and push data into cubes
}

function end() {
	//this function is called once at the end of the process
	script.log('process execution finished.');
}