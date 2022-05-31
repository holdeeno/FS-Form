function doGet(request) {
  return HtmlService.createTemplateFromFile('Index').evaluate();
}

/* DEFINE GLOBAL VARIABLES */
function globalVariables() { 
  var varArray = {
    spreadsheetId   : '1T97Qi1knLMUVihs_H7kezvU-lE_IpeRm5VSrqRpTsh4', // Staging Area Google Sheet //** Ref: 
    finalSheetId    : '1Gn4ZbeIpD7_rg_fKp4nZdk59A9AKN99XHWlM9zuCH8U', // Final DB Google Sheet //** Ref: 
    dataRange       : 'Data!A2:E',                                    // All data, minus header row
    sheetRange      : 'Data!A1:E',                                   // All data, including header row
    idRange         : 'Data!A2:A',                                    
    lastCol         : 'E',                                            
    insertRange     : 'Data!A1:E1',                                   
    sheetID         : '0'     //** Ref:https://developers.google.com/sheets/api/guides/concepts#sheet_id
  };
  return varArray;
}

/* INITIALIZING THE LIST THAT WILL CONTAIN THE MATCHING FIELD NAMES */
const matchingFieldsList = []; // This will contain an array of all the fields with matching values for the first two submissions

/* INTITIALIZING KEY-VALUE PAIR TO HOLD THE FORM TWO SUBMISSIONS */
const formTwoArray = [];

/*
# PROCESSING FORM -------------------------------------start--------------------------------------------
*/

/* PROCESS INITIAL ENTRY FORM */
function processInitialEntryForm(formObject){
  // This is going to insert initial entry form data to the Staging Area Google Sheet
  appendData(getFormValues(formObject),globalVariables().spreadsheetId,globalVariables().insertRange);
}

/* PROCESS SECOND ENTRY FORM */
function processSecondEntryForm(formObject) {  
  // This is going to insert the second entry form data to the Staging Area Google Sheet
  appendData(getFormValues(formObject),globalVariables().spreadsheetId,globalVariables().insertRange);

  // This will retrieve all the data from the Staging Area Google Sheet
  var stagingData = getAllStagingData();

  // Set iterator equal to zero
  var i = 0;
 
  for (var col = 1 ; i < (stagingData[0].length - 1); col++) {
  
    var fieldName = stagingData[0][col] // This gets the name of the fields we're comparing (header row)
    var initialFormFieldValue = stagingData[1][col]; // This gets the value for that field from the first submission
    var secondFormFieldValue = stagingData[2][col]; // This gets the value for that field from the second submission
    i++; // increment

    if (initialFormFieldValue == secondFormFieldValue) { // If the values from the two submissions match:


      matchingFieldsList.push(fieldName); // Add the name of that field to our global array 'matchingFieldsList'
      Logger.log(matchingFieldsList);

      formTwoArray.push([fieldName, secondFormFieldValue]); // Add the field name and it's value to our global array 'formTwoArray'
      Logger.log(formTwoArray);

    } else {

        formTwoArray.push([fieldName, null]); // Add the field name and a null value to our global array 'formTwoArray'
        Logger.log(formTwoArray);
    }

  }
  Logger.log(matchingFieldsList);
  Logger.log(formTwoArray);

  var secondEntryFormResponses = [matchingFieldsList, formTwoArray];
  Logger.log(secondEntryFormResponses);

  return secondEntryFormResponses;
  
}


/* PROCESS FINAL ENTRY FORM */
function processFinalForm(formObject) {

  // This sends the same data to the final DB sheet.
  appendDataFinalSheet(getFormValues(formObject),globalVariables().finalSheetId,globalVariables().insertRange);
}

/*
# PROCESSING FORM ---------------------------------------end------------------------------------------
*/

/* GET FORM VALUES AS AN ARRAY */
function getFormValues(formObject){
/* ADD OR REMOVE VARIABLES ACCORDING TO YOUR FORM*/
  if(formObject.RecId && checkID(formObject.RecId)){
    var values = [[formObject.RecId.toString(),
                  formObject.clientID,
                  formObject.D0120,
                  formObject.D0140,
                  formObject.D0145]];
  }else{
    var values = [[new Date().getTime().toString(),//https://webapps.stackexchange.com/a/51012/244121
                  formObject.clientID,
                  formObject.D0120,
                  formObject.D0140,
                  formObject.D0145]];
  }
  return values;
}




/*
## CURD FUNCTIONS ----------------------------------------------------------------------------------------
*/


/* APPEND DATA TO STAGING AREA SHEET */
function appendData(values, spreadsheetId,range){
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.sheetID = spreadsheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range,{valueInputOption: "RAW"});
}

/* APPEND DATA TO FINAL SHEET */
function appendDataFinalSheet(values, finalSheetId,range){
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.sheetID = finalSheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, finalSheetId, range,{valueInputOption: "RAW"});
}


/* READ DATA */
function readData(spreadsheetId,range){
  var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
  return result.values;
}


/* UPDATE DATA */
/* Note - we are not currently using this function */
function updateData(values,spreadsheetId,range){
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
  valueInputOption: "RAW"});
}



/* 
## HELPER FUNCTIONS FOR CRUD OPERATIONS --------------------------------------------------------------
*/ 


/* CHECK FOR EXISTING ID, RETURN BOOLEAN */
/* Note - we are not currently using this function */
function checkID(ID){
  var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange,).reduce(function(a,b){return a.concat(b);});
  return idList.includes(ID);
}


/* GET DATA RANGE A1 NOTATION FOR GIVEN ID */
function getRangeByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        return 'Data!A'+(i+2)+':'+globalVariables().lastCol+(i+2);
      }
    }
  }
}


/* GET RECORD BY ID */
function getRecordById(id){
  if(id && checkID(id)){
    var result = readData(globalVariables().spreadsheetId,getRangeByID(id));
    return result;
  }
}


/* GET ROW NUMBER FOR GIVEN ID */
function getRowIndexByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        var rowIndex = parseInt(i+1);
        return rowIndex;
      }
    }
  }
}


/* GET ALL DATA FROM STAGING AREA GOOGLE SHEET (including header row) */
// This is called inside of processSecondEntryForm()
function getAllStagingData(){
  var data = readData(globalVariables().spreadsheetId,globalVariables().sheetRange);
  return data;
}

function getAllFinalData(){
  var data = readData(globalVariables().finalSheetId, globalVariables().sheetRange);

  return data;
}





/*
## OTHER HELPERS FUNCTIONS ------------------------------------------------------------------------
*/

/* INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}