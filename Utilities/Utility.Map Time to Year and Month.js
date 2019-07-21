
var monthDimensionName = "Months";
var yearDimensionName = "Year";
var timeDimensionName = "Time";

function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');
}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');
    
	var mappingName = "Map.Time to Year and Month";
    if( mapping.exists(mappingName) ){
    	mapping.wipe(mappingName);
    } else {
    	mapping.create(mappingName, [timeDimensionName],[yearDimensionName,monthDimensionName]);
    }
    
    var months = JSON.parse(hierarchy.rootElements("Time","Month List"));
    script.log('mapping ' + months.length + " elements.");
   	for(var i=0;i<months.length;i++) {
    	var m = months[i];
        var month = Right(m,3);
        var year = "FY" + Left(m,4);
        
        mapping.rowAdd(mappingName, [m],[year,month]);
    }
    
}

function data(record) {
	//no datasource needed
}

function end() {
	//this function is called once at the end of the process
	script.log('process execution finished.');
}

function Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}
 
function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}

