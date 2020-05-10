
function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');

    script.prompt("User ID","userId","");
    script.prompt("Application ID","appId","");
    script.prompt("Dimension Name","dim","");
    script.prompt("Hierarchy Name","element","");
}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');

    let access = security.applicationUserElementAccess(appId, userId, dim, element);

    if( access == "W") {
        console.log("User has Write access.");
    } else if( access == "R") {
        console.log("User has Read access.");
    } else {
        console.log("User has no access.");
    }

}

function data(record) {
	//this function is called once for each line of data on the second cycle
	//use this to build dimensions and push data into cubes
}

function end() {
	//this function is called once at the end of the process
	script.log('process execution finished.');
}