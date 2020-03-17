var appId = null;
var dim = null;
var hier = null;
var elm = null;
var accTag = null;
var rOrW = null;

function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');

    appId = script.prompt("Application ID","appId","App ID");
    dim = script.prompt("Dimension","dim","Input Dimension");
    hier = script.prompt("Hierarchy","hier","Input Hierarchy");
    elm = script.prompt("Parent Element","elm","Input Parent Element");
    accTag = script.prompt("Access Tag","accTag","TagName");
    rOrW = script.prompt("Access","rOrW","Access (W or R)");
}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');

    // App ID
    if(appId == null || appId == "App ID") {
        console.log("Please provide a valid application id.");
        return;
    }
    // Dimension
    if(dim == null || dim == "Input Dimension") {
        console.log("Please provide a valid dimension.");
        return;
    }

    // Hierarchy
    if(hier == null || hier == "Input Hierarchy") {
        console.log("Please provide a valid hierarchy.");
        return;
    }

    // Element
    if(elm == null || elm == "Input Parent Element") {
        console.log("Please provide a valid element.");
        return;
    }

    // Access Tag
    if(accTag == null || accTag == "TagName") {
        console.log("Please provide a valid access tag.");
        return;
    }

    if(rOrW == null || rOrW == "Access (W or R)") {
        console.log("Please provide a valid access.");
        return;
    }

    if( rOrW == "W" || rOrW == "R" || rOrW == "N"){

    } else {
        console.log("Please provide a valid access mode. This needs to be R (Read), W (Write) or N (None)");
        return;
    }

    // Check Dim exists
    if(!dimension.exists(dim)) {
        console.log("Please provide a valid dimension.");
        return;
    }
    
    // Check Hierarchy Exists
    if(!hierarchy.exists(dim, hier)) {
        console.log("Please provide a valid hierarchy.");
        return;
    }
    
    // Check Tag Exists if not create - (applicationId, tag, hierarchyId, AllElements)
    var exists = security.applicationTagExists(appId, accTag);
    if(!exists) {
        console.log("Could not find a tag \""+accTag+"\", created tag.");
        var dimId = dimension.getId(dim);
        var created = security.applicationAddTag(appId, accTag, dimId, hier, false);
    }

    // Add Access For First Elm
    var boolean = security.applicationAddTagElementSecurity(appId, accTag, elm, rOrW);
    console.log("Updated " + elm + " to access: " + rOrW);
    hasChildrenLoop(dim, hier, elm, appId, accTag, rOrW);
}

function hasChildrenLoop(dim, hier, elm, appId, accTag, rOrW) {
    var children = hierarchy.childCount(dim, hier, elm);
    if(children > 0) {
        for(var i = 0; i < children; i++) {
            var child = hierarchy.childByIndex(dim, hier, elm, i);
            security.applicationAddTagElementSecurity(appId, accTag, child, rOrW);
            console.log("Updated " + child + " to access: " + rOrW);
            hasChildrenLoop(dim, hier, child, appId, accTag, rOrW);
        }
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