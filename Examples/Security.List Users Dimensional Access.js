

function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');

    script.prompt("User ID","userId","");
    script.prompt("Application ID","appId","");
    script.prompt("Dimension Name","dim","");
    script.prompt("Hierarchy Name","hier","");

}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');

    let elements = JSON.parse(security.applicationUserElements(appId, userId,dim,hier));
    console.log(elements);


}

function data(record) {
	//this function is called once for each line of data on the second cycle
	//use this to build dimensions and push data into cubes
}

function end() {
	//this function is called once at the end of the process
	script.log('process execution finished.');
}