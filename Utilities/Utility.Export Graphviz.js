/*
This process is a work in progress for outputting a graphviz diagram of a data model built on MODLR.
*/
function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');
}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');

	var usedProcesses = [];

    var cubes = JSON.parse(cube.list());
    var dimensions = JSON.parse(dimension.list());
    var processes = JSON.parse(process.list());

    var dot ='digraph G {';
        dot+=' ratio = auto;';
        //dot+=' size="10,10";';
        dot+=' graph [fontsize=26 fontname="Calibri" label="" splines=true overlap=false ];';
        dot+=' node [fontname="Calibri" shape="Mrecord"];';
        dot+=' edge [fontname="Calibri"];';


    //build cube nodes
    for(var i=0;i<cubes.length;i++) {
        var name = cubes[i].name;
        var nodeId = nameToSlug(name);

        dot+=nodeId+' [label="'+name+'"];';
    }
    
    //build process nodes
    for(var i=0;i<processes.length;i++) {
        var name = processes[i].name;
        var nodeId = nameToSlug(name);

        //dot+=nodeId+' [label="'+name+'" shape="cds"];';
    }

    //link nodes
    for(var i=0;i<cubes.length;i++) {
        var sources = JSON.parse(cube.sources(cubes[i].id));

        var name = cubes[i].name;
        var nodeId = nameToSlug(name);

        for(var k=0;k<sources.length;k++) {
            var source = sources[k];
			console.log(source.type);
            if( source.type == "Process" ) {
            	var sourceSlug = nameToSlug(source.source);
                if( usedProcesses.indexOf(sourceSlug) == -1 ) {
                    dot+=sourceSlug+' [label="'+source.source+'" shape="cds"];';
                    usedProcesses.push(sourceSlug);
                }
            }

            dot+=nameToSlug(source.source)+' -> ' + nodeId + ';';
        }
    }

    //link nodes
    for(var i=0;i<processes.length;i++) {
        console.log(processes[i].id);
        var sources = JSON.parse(process.sources(processes[i].id));

        var name = processes[i].name;
        var nodeId = nameToSlug(name);

		if( sources.length > 0 ) {
          if( usedProcesses.indexOf(nodeId) == -1 ) {
            dot+=nodeId+' [label="'+name+'" shape="cds"];';
            usedProcesses.push(nodeId);
          }
        }

        for(var k=0;k<sources.length;k++) {
            var source = sources[k];

            dot+=nameToSlug(source.source)+' -> ' + nodeId + ';';
        }
    }

    dot+='}';

    console.log(dot);
}

function nameToSlug(name) {
    return name.replace(/ /gi,"").replace(/\./gi,"").replace(/\(/gi,"").replace(/\)/gi,"").replace(/\-/gi,"").trim();
}

function data(record) {
	//this function is called once for each line of data on the second cycle
	//use this to build dimensions and push data into cubes
	
}

function end() {
	//this function is called once at the end of the process
	script.log('process execution finished.');
}

