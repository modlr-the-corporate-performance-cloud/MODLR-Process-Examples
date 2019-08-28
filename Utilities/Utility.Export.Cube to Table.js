var ds = "Internal Datastore";
var sql = "";

function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');

	//Prompt for script parameters. Change defaults as necessary
	script.prompt("Cube","cubeName","Default Cube");
	script.prompt("Destination Table","tableName","table_name");
	script.prompt("Measure","measureName","Cube Measure Element");
}

//Generates a column name from a dimension 
//	e.g. "Foo Bar" becomes "foo_bar"
function dimToColumn(dimName) {
	var columnName = dimName.toLowerCase();

	return columnName.replace(/\s/gi,"_");
}

function begin() {
	//this function is called once at the start of the process
	script.log('process execution started.');

	var dims = JSON.parse(cube.dimensions(cubeName));
	var elements = [];
	var measureDimName = "";
	var sqlInsert = "INSERT INTO exports." + tableName + " (";

	sql = " CREATE TABLE IF NOT EXISTS exports." + tableName + " ( ";
	sql += " `data_id` int(11) NOT NULL AUTO_INCREMENT, ";
	for(var i=0;i<dims.length;i++) {
		var dim = dims[i];
		var column = dimToColumn(dim.name);

		sql += " `"+column+"` varchar(512) DEFAULT NULL, ";

		sqlInsert += column + ", ";
		elements.push("");

		measureDimName = column;
	}

	sqlInsert += "dataValue) VALUES ";

	var sqlLine = " (";
	for(var i=0;i<dims.length;i++) {
		sqlLine += "?, ";
	}
	sqlLine += "?) ";

	sql += " `dataValue` double DEFAULT NULL, ";
	sql += " PRIMARY KEY (`data_id`) ";
	sql += " ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";

	datasource.update(ds,sql);
	datasource.update(ds,"DELETE FROM exports." + tableName + " WHERE " + measureDimName + " = ?",[measureName]);

	elements[elements.length-1] = measureName;

	var batchCount = 0;
	var batchSize = 100;
	var batchSql = sqlInsert;
	var prompts = [];
	var isFirstLineInBatch = true;

	var slice = cube.slice(cubeName,elements);
	while( !slice.EOF() ) {
		//get the next cell from the slice
		var elms = slice.Next();

		prompts = prompts.concat(elms);

		if( !isFirstLineInBatch ) {
			batchSql += ", ";
		} else {
			isFirstLineInBatch = false;
		}
		batchSql += sqlLine;

		batchCount++;
		if( batchCount > batchSize ) {
			//Only batchSize-amount per query;
			datasource.update(ds,batchSql,prompts);

			batchCount = 0;
			batchSql = sqlInsert;
			prompts = [];
			isFirstLineInBatch = true;
		}
	}

	if( batchCount > 0 ) {
		datasource.update(ds,batchSql,prompts);
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
