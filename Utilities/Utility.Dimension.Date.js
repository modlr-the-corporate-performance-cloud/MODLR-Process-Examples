/*
This process builds a date dimension using two model variables to determine the date range.

Variables
    model.Time.Start
    model.Time.Finish


*/

var dim = "Date";

var dateFrom = null;
var dateTo = null;
var monthsCal = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function pre() {
	//this function is called once before the processes is executed.
	//Use this to setup prompts.
	script.log('process pre-execution parameters parsed.');

    script.prompt("Display Help Information","willShowHelp","No");
}

function begin() {
	//this function is called once at the start of the process

    if( willShowHelp != "No" ) {

        console.log("The two variables \"model.Time.Start\" and \"model.Time.Finish\" determine the range of dates to add to the \"Date\" Dimension." );
        console.log("This process maintains the \"Date\" Dimension." );
        console.log("Process: " + script.processName());

        return;
    }

	script.log('process execution started.');

    let dateVariableFrom = script.variableGet("model.Time.Start");
    let dateVariableTo = script.variableGet("model.Time.Finish");

    if( dateVariableFrom == "" ) {
        console.log("The variable \"model.Time.Start\" used to denote the start of the date dimension is not populated.");
        script.abort("The variable \"model.Time.Start\" used to denote the start of the date dimension is not populated.");
    }

    if( dateVariableTo == "" ) {
        console.log("The variable \"model.Time.Finish\" used to denote the start of the date dimension is not populated.");
        script.abort("The variable \"model.Time.Finish\" used to denote the start of the date dimension is not populated.");
    }

    dateFrom = new Date(dateVariableFrom);
    dateTo = new Date(dateVariableTo);

    dimension.wipe(dim);

    if( hierarchy.exists(dim,"Default") == false ) {
        hierarchy.create(dim,"Default");
    }
    if( hierarchy.exists(dim,"No Date") == false ) {
        hierarchy.create(dim,"No Date");
    }
    if( hierarchy.exists(dim,"Date List") == false ) {
        hierarchy.create(dim,"Date List");
    }
    if( hierarchy.exists(dim,"Month to Date") == false ) {
        hierarchy.create(dim,"Month to Date");
    }
    if( hierarchy.exists(dim,"Year to Date") == false ) {
        hierarchy.create(dim,"Year to Date");
    }

    hierarchy.group(dim,"No Date","","No Date");

    let dateListing = getDates(dateFrom, dateTo);
    let YTDStr = "";
    let YTDItems = [];
    let MTDStr = "";
    let MTDItems = [];
    for(let i=0;i<dateListing.length;i++) {
        let yearString = dateListing[i].getFullYear() + "";
        let monthString = dateListing[i].getMonthName();
        let dateString = dateListing[i].getName();
        hierarchy.group(dim,"Date List","",dateString);

        hierarchy.structure(dim,"Default","All Dates",yearString);
        hierarchy.structure(dim,"Default",yearString,monthString);
        hierarchy.group(dim,"Default",monthString,dateString);

        if( YTDStr != yearString ) {
            YTDItems = [];
        }
        YTDStr = yearString;
        YTDItems.push(dateString);
        for(let i=0;i<YTDItems.length;i++) {
            hierarchy.group(dim,"Year to Date",dateString + " - YTD",YTDItems[i]);
        }

        if( MTDStr != monthString ) {
            MTDItems = [];
        }
        MTDStr = monthString;
        MTDItems.push(dateString);
        for(let i=0;i<MTDItems.length;i++) {
            hierarchy.group(dim,"Month to Date",dateString + " - MTD",YTDItems[i]);
        }
    }
}

function data(record) {
	//this function is called once for each line of data on the second cycle
	//use this to build dimensions and push data into cubes
    if( willShowHelp != "No" ) {
        return;
    }
}

function end() {
	//this function is called once at the end of the process
    if( willShowHelp != "No" ) {
        return;
    }
	script.log('process execution finished.');
    
}



Date.prototype.addDays = function(days) {
       var dat = new Date(this.valueOf())
       dat.setDate(dat.getDate() + days);
       return dat;
}
Date.prototype.removeDays = function(days) {
       var dat = new Date(this.valueOf())
       dat.setDate(dat.getDate() - days);
       return dat;
}
Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

Date.prototype.getName = function() {
    let yr = this.getFullYear();
    let mth = this.getMonth()+1;
    let da = this.getDate();

    let mthStr = mth + "";
    if( mthStr.length == 1) {
        mthStr = "0" + mthStr;
    }

    let daStr = da + "";
    if( daStr.length == 1) {
        daStr = "0" + daStr;
    }
    
    return yr + "-" + mthStr + "-" + daStr;

}

Date.prototype.getMonthName = function() {
    let yr = this.getFullYear();
    let mth = monthsCal[this.getMonth()];
    
    return yr + " - " + mth;
}


Date.prototype.getName = function() {
    let yr = this.getFullYear();
    let mth = this.getMonth()+1;
    let da = this.getDate();

    let mthStr = mth + "";
    if( mthStr.length == 1) {
        mthStr = "0" + mthStr;
    }

    let daStr = da + "";
    if( daStr.length == 1) {
        daStr = "0" + daStr;
    }
    
    return yr + "-" + mthStr + "-" + daStr;

}

function getDates(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
        dateArray.push(currentDate)
        currentDate = currentDate.addDays(1);
      }
      return dateArray;
}
