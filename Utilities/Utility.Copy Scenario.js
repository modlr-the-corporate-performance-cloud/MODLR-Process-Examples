function pre() {
    //this function is called once before the processes is executed.
    //Use this to setup prompts.
    script.log('process pre-execution parameters parsed.');

    script.prompt("Cube Name","cube_name","");
    script.prompt("Scenario From","scenario_from","");
    script.prompt("Scenario To","scenario_to","");
    script.prompt("Measures List","measures_list","");
    script.prompt("Wipe Destination","should_wipe","1");
}


function begin() {
    //this function is called once at the start of the process
    script.log('process execution started.');

    //abort if the cube doesnt exist
    if( !cube.exists(cube_name) ) {
        script.abort("The specified cube is not found: " + cube_name);
        return;
    }

    //find the scenario dimension position in the cube.
    var scenarioPosition = -1;
    var dims = JSON.parse(cube.dimensions(cube_name));
    for(var i=0;i<dims.length;i++) {
        var dim = dims[i];
        if( dimension.getType(dim.id) == "scenario" ) { 
            scenarioPosition = i;
            break;
        }
    }

    //abort if we can not find the scenario dimension.
    if( scenarioPosition == -1 ) {
        script.abort("Could not find the Scenario dimension within the target cube.");
        return;
    }

    //abort if the from scenario doesnt exist
    var scenarioDim = dims[scenarioPosition];
    if( element.exists(scenarioDim.name,scenario_from) == false ) {
        script.abort("Could not find the Scenario: "+scenario_from+" within the scenario dimension: " + scenarioDim.name + ".");
        return;
    }

    //abort if the to scenario doesnt exist
    var scenarioDim = dims[scenarioPosition];
    if( element.exists(scenarioDim.name,scenario_to) == false ) {
        script.abort("Could not find the Scenario: "+scenario_to+" within the scenario dimension: " + scenarioDim.name + ".");
        return;
    }

    //wipe the cube if directed to do so
    if( should_wipe == "1" ) {
        var elements = [];
        for(var i=0;i<dims.length;i++) {
            if( i == scenarioPosition ) {
                elements.push(scenario_to);    //add the destination scenario for clearing
            } else if( i == dims.length-1 ) {
                elements.push(measures_list); //add the measures list
            } else {
                elements.push("");
            }
        }
        cube.wipe(cube_name,elements);
    }

    //change the element list to from slice options
    elements[scenarioPosition] = scenario_from;

    //turn cube logging off (as it is unnecessary)
    cube.log(cube_name,false);

    //create the slice
    var slice = cube.slice(cube_name,elements);
    while( !slice.EOF() ) {
        //get the next cell from the slice
        var elms = slice.Next();

        //build a new target location (array of element names)
        var elmsSet = [];
        for(var i=0;i<elms.length-1;i++){
            if( i == scenarioPosition ) {    //ensure that we are "looking at" the destination scenario
                elmsSet.push(scenario_to);
            } else {
                elmsSet.push(elms[i]);        //otherwise we are looking at the same elements as the slice
            }
        }

        //get the value from the slice (the last item in the slice array).
        var value = elms[elms.length-1];
        if ( value ){ //check that the value is not null.
            //set the value in the destination scenario to the same from the source
            cube.set(value,cube_name,elmsSet);    
        }
    }

    //turn cube logging back on
    cube.log(cube_name,true);
}

function data(record) {
    //this function is called once for each line of data on the second cycle
    //use this to build dimensions and push data into cubes

}

function end() {
    //this function is called once at the end of the process
    script.log('process execution finished.');
}

