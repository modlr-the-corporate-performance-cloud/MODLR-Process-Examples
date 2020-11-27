function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');

    script.prompt("Mapping Name","mappingName","Map");
    script.prompt("Left Dimension Name","leftName","Leftie");
    script.prompt("Right Dimension Name","rightName","Rightie");
}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');

    mapping.create(mappingName,[leftName],[rightName],false,true);

}

function data(record) {
	//this function is called once for each line of data on the second cycle
	//use this to build dimensions and push data into cubes
}

function end() {
	//this function is called once at the end of the process
	script.log('process execution finished.');
}