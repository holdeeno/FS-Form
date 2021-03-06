function doGet(request) {

  var htmlOutput = HtmlService.createTemplateFromFile('Index');
  return htmlOutput.evaluate();

}

/* DEFINE GLOBAL VARIABLES */
function globalVariables() { 
  var varArray = {
    spreadsheetId   : '1T97Qi1knLMUVihs_H7kezvU-lE_IpeRm5VSrqRpTsh4', // Staging Area Google Sheet //** Ref: https://docs.google.com/spreadsheets/d/1T97Qi1knLMUVihs_H7kezvU-lE_IpeRm5VSrqRpTsh4/edit#gid=0
    finalSheetId    : '1VhgdD_13zb0mBVoNCGeGR9sk2HzhCJ4MLvvEWGbyEmo', // Final DB Google Sheet //** Ref: https://docs.google.com/spreadsheets/d/1VhgdD_13zb0mBVoNCGeGR9sk2HzhCJ4MLvvEWGbyEmo/edit#gid=0
    dataRange       : 'Data!A2:ADA',                                    // All data, minus header row
    sheetRange      : 'Data!A1:ADA',                                   // All data, including header row
    idRange         : 'Data!A2:A',                                    
    lastCol         : 'ADA',                                            
    insertRange     : 'Data!A1:ADA1',                                   
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
function processInitialEntryForm(formObject) {

  // This adds the initial entry form response data to the FS Staging Area
  appendData(getFormValues(formObject),globalVariables().spreadsheetId,globalVariables().insertRange);

}

/* PROCESS SECOND ENTRY FORM */
function processSecondEntryForm(formObject) {  

  // This adds the second entry form response data to the FS Staging Area
  appendData(getFormValues(formObject),globalVariables().spreadsheetId,globalVariables().insertRange);

  // This will retrieve all the data from the FS Staging Area
  var stagingData = getAllStagingData();

  var i = 0;
 
  for (var col = 1 ; i < (stagingData[0].length - 1); col++) {
  
    var fieldName = stagingData[0][col] // Get the name of the fields we're comparing (header row)
    var initialFormFieldValue = stagingData[1][col]; // Get the value for that field from the first submission
    var secondFormFieldValue = stagingData[2][col]; // Get the value for that field from the second submission
    i++; // iterate through all columns

    if (initialFormFieldValue == secondFormFieldValue) { // If the values from the two submissions match:


      matchingFieldsList.push(fieldName); // Add the name of that field to our global array 'matchingFieldsList'
      // Logger.log(matchingFieldsList);

      formTwoArray.push([fieldName, secondFormFieldValue]); // Add the field name and it's value to our global array 'formTwoArray'
      // Logger.log(formTwoArray);

    } else { // If the values from the two form submissions don't match:

        formTwoArray.push([fieldName, null]); // Add the field name and a null value to our global array 'formTwoArray'
        // Logger.log(formTwoArray);
    }

  }
  //Logger.log(matchingFieldsList);
  // Logger.log(formTwoArray);

  var secondEntryFormResponses = [matchingFieldsList, formTwoArray]; // Save both of these arrays into one larger array so we can return them to the client side
  // Logger.log(secondEntryFormResponses);

  return secondEntryFormResponses; 
  
}


/* PROCESS FINAL ENTRY FORM */
function processFinalForm(formObject) {

  // This sends the final form data to the FS Target DB
  appendDataFinalSheet(getFormValues(formObject),globalVariables().finalSheetId,globalVariables().insertRange);

  // clearStagingSheet(); // This function clears the FS Staging Area once the data has been passed to the client side

}

/*
# PROCESSING FORM ---------------------------------------end------------------------------------------
*/


/*
## CURD FUNCTIONS ----------------------------------------------------------------------------------------
*/


/* GET ALL FORM DATA */
function getFormValues(formObject) {

  if (formObject.RecId && checkID(formObject.RecId)) { // Check that records are unique
    var values = [[formObject.RecId.toString(),
                  formObject.clientID,
                  formObject.zipCode,
                  formObject.insuranceCompany,
                  formObject.insurancePlan,
                  formObject.feeScheduleType,
                  formObject.feeScheduleID,
                  formObject.effectiveDate,
                  formObject.D0120,
                  formObject.D0140,
                  formObject.D0145,
                  formObject.D0150,
                  formObject.D0160,
                  formObject.D0170,
                  formObject.D0171,??
                  formObject.D0180,
                  formObject.D0190,??
                  formObject.D0191,??
                  formObject.D0210,??
                  formObject.D0220,??
                  formObject.D0230,
                  formObject.D0240,??
                  formObject.D0250,
                  formObject.D0251,??
                  formObject.D0270,??
                  formObject.D0272,??
                  formObject.D0273,??
                  formObject.D0277,??
                  formObject.D0310,??
                  formObject.D0320,??
                  formObject.D0321,??
                  formObject.D0322,??
                  formObject.D0330,??
                  formObject.D0340,??
                  formObject.D0350,??
                  formObject.D0351,??
                  formObject.D0364,??
                  formObject.D0365,??
                  formObject.D0366,??
                  formObject.D0367,??
                  formObject.D0368,??
                  formObject.D0369,??
                  formObject.D0370,??
                  formObject.D0371,??
                  formObject.D0380,??
                  formObject.D0381,??
                  formObject.D0382,??
                  formObject.D0383,??
                  formObject.D0384,??
                  formObject.D0385,
                  formObject.D0386,??
                  formObject.D0391,??
                  formObject.D0393,??
                  formObject.D0394,??
                  formObject.D0395,??
                  formObject.D0411,??
                  formObject.D0412,??
                  formObject.D0414,??
                  formObject.D0415,??
                  formObject.D0416,??
                  formObject.D0417,??
                  formObject.D0419,??
                  formObject.D0423,??
                  formObject.D0431,??
                  formObject.D0470,??
                  formObject.D0472,??
                  formObject.D0473,??
                  formObject.D0474,??
                  formObject.D0475,??
                  formObject.D0476,??
                  formObject.D0477,??
                  formObject.D0478,??
                  formObject.D0479,??
                  formObject.D0480,??
                  formObject.D0481,??
                  formObject.D0482,??
                  formObject.D0483,??
                  formObject.D0484,??
                  formObject.D0485,??
                  formObject.D0486,??
                  formObject.D0502,??
                  formObject.D0600,??
                  formObject.D0601,??
                  formObject.D0602,??
                  formObject.D0603,??
                  formObject.D0604,??
                  formObject.D0605,??
                  formObject.D0606,??
                  formObject.D0701,??
                  formObject.D0702,??
                  formObject.D0703,??
                  formObject.D0704,??
                  formObject.D0705,??
                  formObject.D0706,??
                  formObject.D0707,??
                  formObject.D0708,??
                  formObject.D0709,??
                  formObject.D0999,??
                  formObject.D1110,??
                  formObject.D1120,??
                  formObject.D1206,??
                  formObject.D1208,??
                  formObject.D1310,
                  formObject.D1320,??
                  formObject.D1321,??
                  formObject.D1330,??
                  formObject.D1351,
                  formObject.D1352,??
                  formObject.D1353,??
                  formObject.D1354,??
                  formObject.D1355,??
                  formObject.D1510,??
                  formObject.D1516,??
                  formObject.D1517,??
                  formObject.D1520,??
                  formObject.D1526,??
                  formObject.D1527,??
                  formObject.D1551,??
                  formObject.D1552,??
                  formObject.D1553,??
                  formObject.D1556,??
                  formObject.D1557,??
                  formObject.D1558,??
                  formObject.D1575,??
                  formObject.D1701,??
                  formObject.D1702,??
                  formObject.D1703,??
                  formObject.D1704,
                  formObject.D1705,??
                  formObject.D1706,??
                  formObject.D1707,??
                  formObject.D1999,??
                  formObject.D2140,??
                  formObject.D2150,??
                  formObject.D2160,??
                  formObject.D2161,??
                  formObject.D2330,??
                  formObject.D2331,??
                  formObject.D2332,??
                  formObject.D2335,??
                  formObject.D2390,??
                  formObject.D2391,??
                  formObject.D2392,??
                  formObject.D2393,??
                  formObject.D2394,??
                  formObject.D2410,??
                  formObject.D2420,??
                  formObject.D2430,
                  formObject.D2510,??
                  formObject.D2520,??
                  formObject.D2530,??
                  formObject.D2542,??
                  formObject.D2543,??
                  formObject.D2544,??
                  formObject.D2610,??
                  formObject.D2620,??
                  formObject.D2630,??
                  formObject.D2642,??
                  formObject.D2643,??
                  formObject.D2644,??
                  formObject.D2650,??
                  formObject.D2651,??
                  formObject.D2652,??
                  formObject.D2662,??
                  formObject.D2663,??
                  formObject.D2664,??
                  formObject.D2710,??
                  formObject.D2712,??
                  formObject.D2720,??
                  formObject.D2721,??
                  formObject.D2722,??
                  formObject.D2740,
                  formObject.D2750,??
                  formObject.D2751,??
                  formObject.D2752,??
                  formObject.D2753,??
                  formObject.D2780,??
                  formObject.D2781,??
                  formObject.D2782,??
                  formObject.D2783,??
                  formObject.D2790,??
                  formObject.D2791,??
                  formObject.D2792,??
                  formObject.D2794,??
                  formObject.D2799,??
                  formObject.D2910,??
                  formObject.D2915,??
                  formObject.D2920,??
                  formObject.D2921,??
                  formObject.D2928,??
                  formObject.D2929,??
                  formObject.D2930,??
                  formObject.D2931,??
                  formObject.D2932,??
                  formObject.D2933,??
                  formObject.D2934,??
                  formObject.D2940,??
                  formObject.D2941,??
                  formObject.D2949,??
                  formObject.D2950,??
                  formObject.D2951,??
                  formObject.D2952,??
                  formObject.D2953,??
                  formObject.D2954,??
                  formObject.D2955,??
                  formObject.D2957,??
                  formObject.D2960,??
                  formObject.D2961,??
                  formObject.D2962,??
                  formObject.D2971,??
                  formObject.D2975,??
                  formObject.D2980,??
                  formObject.D2981,??
                  formObject.D2982,??
                  formObject.D2983,??
                  formObject.D2990,??
                  formObject.D2999,
                  formObject.D3110,??
                  formObject.D3120,
                  formObject.D3220,??
                  formObject.D3221,??
                  formObject.D3222,??
                  formObject.D3230,??
                  formObject.D3240,??
                  formObject.D3310,??
                  formObject.D3320,??
                  formObject.D3330,
                  formObject.D3331,??
                  formObject.D3332,??
                  formObject.D3333,??
                  formObject.D3346,??
                  formObject.D3347,??
                  formObject.D3348,??
                  formObject.D3351,??
                  formObject.D3352,??
                  formObject.D3353,??
                  formObject.D3355,??
                  formObject.D3356,??
                  formObject.D3357,??
                  formObject.D3410,??
                  formObject.D3421,??
                  formObject.D3425,??
                  formObject.D3426,??
                  formObject.D3428,??
                  formObject.D3429,??
                  formObject.D3430,??
                  formObject.D3431,??
                  formObject.D3432,??
                  formObject.D3450,??
                  formObject.D3460,
                  formObject.D3470,??
                  formObject.D3471,??
                  formObject.D3472,??
                  formObject.D3473,??
                  formObject.D3501,??
                  formObject.D3502,??
                  formObject.D3503,??
                  formObject.D3910,??
                  formObject.D3911,??
                  formObject.D3920,??
                  formObject.D3921,??
                  formObject.D3950,??
                  formObject.D3999,??
                  formObject.D4210,??
                  formObject.D4211,??
                  formObject.D4212,??
                  formObject.D4230,??
                  formObject.D4231,??
                  formObject.D4240,??
                  formObject.D4241,??
                  formObject.D4245,??
                  formObject.D4249,??
                  formObject.D4260,??
                  formObject.D4261,
                  formObject.D4263,??
                  formObject.D4264,??
                  formObject.D4265,??
                  formObject.D4266,??
                  formObject.D4267,??
                  formObject.D4268,??
                  formObject.D4270,??
                  formObject.D4273,??
                  formObject.D4274,??
                  formObject.D4275,??
                  formObject.D4276,??
                  formObject.D4277,??
                  formObject.D4278,??
                  formObject.D4283,??
                  formObject.D4285,??
                  formObject.D4322,??
                  formObject.D4323,??
                  formObject.D4341,??
                  formObject.D4342,??
                  formObject.D4346,??
                  formObject.D4355,??
                  formObject.D4381,??
                  formObject.D4910,??
                  formObject.D4920,??
                  formObject.D4921,??
                  formObject.D4999,??
                  formObject.D5110,??
                  formObject.D5120,??
                  formObject.D5130,??
                  formObject.D5140,??
                  formObject.D5211,??
                  formObject.D5212,
                  formObject.D5213,??
                  formObject.D5214,??
                  formObject.D5221,??
                  formObject.D5222,??
                  formObject.D5223,??
                  formObject.D5224,??
                  formObject.D5225,??
                  formObject.D5226,??
                  formObject.D5227,??
                  formObject.D5228,??
                  formObject.D5282,??
                  formObject.D5283,??
                  formObject.D5284,??
                  formObject.D5286,??
                  formObject.D5410,??
                  formObject.D5411,??
                  formObject.D5421,??
                  formObject.D5422,??
                  formObject.D5511,??
                  formObject.D5512,??
                  formObject.D5520,??
                  formObject.D5611,??
                  formObject.D5612,??
                  formObject.D5621,??
                  formObject.D5622,??
                  formObject.D5630,??
                  formObject.D5640,??
                  formObject.D5650,??
                  formObject.D5660,??
                  formObject.D5670,??
                  formObject.D5671,??
                  formObject.D5765,??
                  formObject.D5710,??
                  formObject.D5711,??
                  formObject.D5720,??
                  formObject.D5721,??
                  formObject.D5725,??
                  formObject.D5730,??
                  formObject.D5731,??
                  formObject.D5740,??
                  formObject.D5741,??
                  formObject.D5750,??
                  formObject.D5751,??
                  formObject.D5760,??
                  formObject.D5761,??
                  formObject.D5810,??
                  formObject.D5811,??
                  formObject.D5820,??
                  formObject.D5821,??
                  formObject.D5850,
                  formObject.D5851,??
                  formObject.D5862,??
                  formObject.D5863,??
                  formObject.D5864,??
                  formObject.D5865,??
                  formObject.D5866,??
                  formObject.D5867,??
                  formObject.D5875,??
                  formObject.D5876,??
                  formObject.D5899,??
                  formObject.D5911,??
                  formObject.D5912,??
                  formObject.D5913,??
                  formObject.D5914,??
                  formObject.D5915,??
                  formObject.D5916,??
                  formObject.D5919,??
                  formObject.D5922,
                  formObject.D5923,??
                  formObject.D5924,??
                  formObject.D5925,??
                  formObject.D5926,??
                  formObject.D5927,??
                  formObject.D5928,??
                  formObject.D5929,??
                  formObject.D5931,??
                  formObject.D5932,??
                  formObject.D5933,??
                  formObject.D5934,??
                  formObject.D5935,??
                  formObject.D5936,??
                  formObject.D5937,??
                  formObject.D5951,??
                  formObject.D5952,??
                  formObject.D5953,??
                  formObject.D5954,??
                  formObject.D5955,??
                  formObject.D5958,??
                  formObject.D5959,??
                  formObject.D5960,
                  formObject.D5982,??
                  formObject.D5983,??
                  formObject.D5984,??
                  formObject.D5985,??
                  formObject.D5986,??
                  formObject.D5987,??
                  formObject.D5988,??
                  formObject.D5991,??
                  formObject.D5992,??
                  formObject.D5993,??
                  formObject.D5995,??
                  formObject.D5996,??
                  formObject.D5999,
                  formObject.D6010,??
                  formObject.D6011,??
                  formObject.D6012,??
                  formObject.D6013,??
                  formObject.D6040,??
                  formObject.D6050,??
                  formObject.D6051,??
                  formObject.D6055,??
                  formObject.D6056,??
                  formObject.D6057,??
                  formObject.D6058,??
                  formObject.D6059,??
                  formObject.D6060,??
                  formObject.D6061,??
                  formObject.D6062,??
                  formObject.D6063,??
                  formObject.D6064,??
                  formObject.D6065,??
                  formObject.D6066,??
                  formObject.D6067,??
                  formObject.D6068,??
                  formObject.D6069,??
                  formObject.D6070,??
                  formObject.D6071,??
                  formObject.D6072,??
                  formObject.D6073,??
                  formObject.D6074,??
                  formObject.D6075,??
                  formObject.D6076,??
                  formObject.D6077,??
                  formObject.D6080,??
                  formObject.D6081,??
                  formObject.D6082,??
                  formObject.D6083,??
                  formObject.D6084,??
                  formObject.D6085,??
                  formObject.D6086,??
                  formObject.D6087,??
                  formObject.D6088,??
                  formObject.D6090,??
                  formObject.D6091,??
                  formObject.D6092,??
                  formObject.D6093,??
                  formObject.D6094,??
                  formObject.D6095,??
                  formObject.D6096,??
                  formObject.D6097,??
                  formObject.D6098,??
                  formObject.D6099,??
                  formObject.D6100,??
                  formObject.D6101,??
                  formObject.D6102,??
                  formObject.D6103,??
                  formObject.D6104,??
                  formObject.D6110,??
                  formObject.D6111,??
                  formObject.D6112,??
                  formObject.D6113,??
                  formObject.D6114,??
                  formObject.D6115,??
                  formObject.D6116,??
                  formObject.D6117,??
                  formObject.D6118,??
                  formObject.D6119,
                  formObject.D6120,??
                  formObject.D6121,??
                  formObject.D6122,??
                  formObject.D6123,??
                  formObject.D6190,??
                  formObject.D6191,??
                  formObject.D6192,??
                  formObject.D6194,??
                  formObject.D6195,??
                  formObject.D6198,??
                  formObject.D6199,??
                  formObject.D6205,??
                  formObject.D6210,
                  formObject.D6211,??
                  formObject.D6212,??
                  formObject.D6214,??
                  formObject.D6240,??
                  formObject.D6241,??
                  formObject.D6242,??
                  formObject.D6243,??
                  formObject.D6245,??
                  formObject.D6250,??
                  formObject.D6251,??
                  formObject.D6252,??
                  formObject.D6253,??
                  formObject.D6545,??
                  formObject.D6548,??
                  formObject.D6549,??
                  formObject.D6600,
                  formObject.D6601,??
                  formObject.D6602,??
                  formObject.D6603,??
                  formObject.D6604,??
                  formObject.D6605,??
                  formObject.D6606,??
                  formObject.D6607,??
                  formObject.D6608,??
                  formObject.D6609,??
                  formObject.D6610,??
                  formObject.D6611,??
                  formObject.D6612,??
                  formObject.D6613,??
                  formObject.D6614,??
                  formObject.D6615,??
                  formObject.D6624,??
                  formObject.D6634,??
                  formObject.D6710,??
                  formObject.D6720,??
                  formObject.D6721,??
                  formObject.D6722,??
                  formObject.D6740,
                  formObject.D6750,??
                  formObject.D6751,
                  formObject.D6752,??
                  formObject.D6753,??
                  formObject.D6780,??
                  formObject.D6781,??
                  formObject.D6782,??
                  formObject.D6783,??
                  formObject.D6784,??
                  formObject.D6790,
                  formObject.D6791,??
                  formObject.D6792,??
                  formObject.D6793,??
                  formObject.D6794,??
                  formObject.D6920,??
                  formObject.D6930,??
                  formObject.D6940,??
                  formObject.D6950,??
                  formObject.D6980,??
                  formObject.D6985,??
                  formObject.D6999,??
                  formObject.D7111,??
                  formObject.D7140,??
                  formObject.D7210,??
                  formObject.D7220,??
                  formObject.D7230,??
                  formObject.D7240,??
                  formObject.D7241,??
                  formObject.D7250,??
                  formObject.D7251,??
                  formObject.D7260,??
                  formObject.D7261,??
                  formObject.D7270,??
                  formObject.D7272,??
                  formObject.D7280,??
                  formObject.D7282,??
                  formObject.D7283,??
                  formObject.D7285,??
                  formObject.D7286,??
                  formObject.D7287,??
                  formObject.D7288,??
                  formObject.D7290,??
                  formObject.D7291,??
                  formObject.D7292,??
                  formObject.D7293,??
                  formObject.D7294,??
                  formObject.D7295,??
                  formObject.D7296,??
                  formObject.D7297,??
                  formObject.D7298,??
                  formObject.D7299,??
                  formObject.D7300,??
                  formObject.D7310,??
                  formObject.D7311,??
                  formObject.D7320,??
                  formObject.D7321,??
                  formObject.D7340,??
                  formObject.D7350,??
                  formObject.D7410,??
                  formObject.D7411,??
                  formObject.D7412,??
                  formObject.D7413,??
                  formObject.D7414,??
                  formObject.D7415,??
                  formObject.D7440,??
                  formObject.D7441,??
                  formObject.D7450,??
                  formObject.D7451,??
                  formObject.D7460,??
                  formObject.D7461,??
                  formObject.D7465,
                  formObject.D7471,??
                  formObject.D7472,??
                  formObject.D7473,??
                  formObject.D7485,??
                  formObject.D7490,??
                  formObject.D7510,??
                  formObject.D7511,??
                  formObject.D7520,??
                  formObject.D7521,??
                  formObject.D7530,??
                  formObject.D7540,??
                  formObject.D7550,??
                  formObject.D7560,??
                  formObject.D7610,??
                  formObject.D7620,??
                  formObject.D7630,??
                  formObject.D7640,??
                  formObject.D7650,??
                  formObject.D7660,??
                  formObject.D7670,??
                  formObject.D7671,??
                  formObject.D7680,??
                  formObject.D7710,??
                  formObject.D7720,??
                  formObject.D7730,??
                  formObject.D7740,??
                  formObject.D7750,??
                  formObject.D7760,??
                  formObject.D7770,??
                  formObject.D7771,??
                  formObject.D7780,??
                  formObject.D7810,??
                  formObject.D7820,??
                  formObject.D7830,??
                  formObject.D7840,??
                  formObject.D7850,??
                  formObject.D7852,??
                  formObject.D7854,??
                  formObject.D7856,??
                  formObject.D7858,??
                  formObject.D7860,??
                  formObject.D7865,??
                  formObject.D7870,??
                  formObject.D7871,??
                  formObject.D7872,??
                  formObject.D7873,??
                  formObject.D7874,??
                  formObject.D7875,??
                  formObject.D7876,??
                  formObject.D7877,??
                  formObject.D7880,??
                  formObject.D7881,??
                  formObject.D7899,??
                  formObject.D7910,??
                  formObject.D7911,??
                  formObject.D7912,??
                  formObject.D7920,??
                  formObject.D7921,??
                  formObject.D7922,??
                  formObject.D7940,??
                  formObject.D7941,??
                  formObject.D7943,??
                  formObject.D7944,
                  formObject.D7945,??
                  formObject.D7946,??
                  formObject.D7947,??
                  formObject.D7948,??
                  formObject.D7949,??
                  formObject.D7950,??
                  formObject.D7951,??
                  formObject.D7952,
                  formObject.D7953,??
                  formObject.D7955,??
                  formObject.D7961,??
                  formObject.D7962,??
                  formObject.D7963,??
                  formObject.D7970,??
                  formObject.D7971,??
                  formObject.D7972,??
                  formObject.D7979,??
                  formObject.D7980,??
                  formObject.D7981,??
                  formObject.D7982,??
                  formObject.D7983,??
                  formObject.D7990,??
                  formObject.D7991,??
                  formObject.D7993,??
                  formObject.D7994,??
                  formObject.D7995,??
                  formObject.D7996,??
                  formObject.D7997,??
                  formObject.D7998,??
                  formObject.D7999,??
                  formObject.D8010,??
                  formObject.D8020,??
                  formObject.D8030,??
                  formObject.D8040,??
                  formObject.D8070,??
                  formObject.D8080,??
                  formObject.D8090,??
                  formObject.D8210,??
                  formObject.D8220,
                  formObject.D8660,??
                  formObject.D8670,
                  formObject.D8680,??
                  formObject.D8681,??
                  formObject.D8695,??
                  formObject.D8696,
                  formObject.D8697,??
                  formObject.D8698,??
                  formObject.D8699,??
                  formObject.D8701,??
                  formObject.D8702,??
                  formObject.D8703,??
                  formObject.D8704,??
                  formObject.D8999,??
                  formObject.D9110,??
                  formObject.D9120,??
                  formObject.D9130,??
                  formObject.D9210,??
                  formObject.D9211,??
                  formObject.D9212,??
                  formObject.D9215,??
                  formObject.D9219,
                  formObject.D9222,??
                  formObject.D9223,??
                  formObject.D9230,??
                  formObject.D9239,??
                  formObject.D9243,??
                  formObject.D9248,??
                  formObject.D9310,??
                  formObject.D9311,??
                  formObject.D9410,??
                  formObject.D9420,??
                  formObject.D9430,??
                  formObject.D9440,??
                  formObject.D9450,??
                  formObject.D9610,
                  formObject.D9612,??
                  formObject.D9613,??
                  formObject.D9630,??
                  formObject.D9910,??
                  formObject.D9911,??
                  formObject.D9912,??
                  formObject.D9920,??
                  formObject.D9930,??
                  formObject.D9932,??
                  formObject.D9933,??
                  formObject.D9934,??
                  formObject.D9935,??
                  formObject.D9941,??
                  formObject.D9942,??
                  formObject.D9943,??
                  formObject.D9944,
                  formObject.D9945,??
                  formObject.D9946,
                  formObject.D9947,??
                  formObject.D9948,??
                  formObject.D9949,??
                  formObject.D9950,??
                  formObject.D9951,??
                  formObject.D9952,??
                  formObject.D9961,??
                  formObject.D9970,??
                  formObject.D9971,??
                  formObject.D9972,??
                  formObject.D9973,??
                  formObject.D9974,??
                  formObject.D9975,??
                  formObject.D9985,??
                  formObject.D9986,??
                  formObject.D9987,??
                  formObject.D9990,??
                  formObject.D9991,??
                  formObject.D9992,??
                  formObject.D9993,??
                  formObject.D9994,??
                  formObject.D9995,??
                  formObject.D9996,??
                  formObject.D9997,??
                  formObject.D9999,]];??
  } else {
    var values = [[new Date().getTime().toString(), //https://webapps.stackexchange.com/a/51012/244121
                  formObject.clientID,
                  formObject.zipCode,
                  formObject.insuranceCompany,
                  formObject.insurancePlan,
                  formObject.feeScheduleType,
                  formObject.feeScheduleID,
                  formObject.effectiveDate,
                  formObject.D0120,
                  formObject.D0140,
                  formObject.D0145,
                  formObject.D0150,
                  formObject.D0160,
                  formObject.D0170,
                  formObject.D0171,??
                  formObject.D0180,
                  formObject.D0190,??
                  formObject.D0191,??
                  formObject.D0210,??
                  formObject.D0220,??
                  formObject.D0230,
                  formObject.D0240,??
                  formObject.D0250,
                  formObject.D0251,??
                  formObject.D0270,??
                  formObject.D0272,??
                  formObject.D0273,??
                  formObject.D0277,??
                  formObject.D0310,??
                  formObject.D0320,??
                  formObject.D0321,??
                  formObject.D0322,??
                  formObject.D0330,??
                  formObject.D0340,??
                  formObject.D0350,??
                  formObject.D0351,??
                  formObject.D0364,??
                  formObject.D0365,??
                  formObject.D0366,??
                  formObject.D0367,??
                  formObject.D0368,??
                  formObject.D0369,??
                  formObject.D0370,??
                  formObject.D0371,??
                  formObject.D0380,??
                  formObject.D0381,??
                  formObject.D0382,??
                  formObject.D0383,??
                  formObject.D0384,??
                  formObject.D0385,
                  formObject.D0386,??
                  formObject.D0391,??
                  formObject.D0393,??
                  formObject.D0394,??
                  formObject.D0395,??
                  formObject.D0411,??
                  formObject.D0412,??
                  formObject.D0414,??
                  formObject.D0415,??
                  formObject.D0416,??
                  formObject.D0417,??
                  formObject.D0419,??
                  formObject.D0423,??
                  formObject.D0431,??
                  formObject.D0470,??
                  formObject.D0472,??
                  formObject.D0473,??
                  formObject.D0474,??
                  formObject.D0475,??
                  formObject.D0476,??
                  formObject.D0477,??
                  formObject.D0478,??
                  formObject.D0479,??
                  formObject.D0480,??
                  formObject.D0481,??
                  formObject.D0482,??
                  formObject.D0483,??
                  formObject.D0484,??
                  formObject.D0485,??
                  formObject.D0486,??
                  formObject.D0502,??
                  formObject.D0600,??
                  formObject.D0601,??
                  formObject.D0602,??
                  formObject.D0603,??
                  formObject.D0604,??
                  formObject.D0605,??
                  formObject.D0606,??
                  formObject.D0701,??
                  formObject.D0702,??
                  formObject.D0703,??
                  formObject.D0704,??
                  formObject.D0705,??
                  formObject.D0706,??
                  formObject.D0707,??
                  formObject.D0708,??
                  formObject.D0709,??
                  formObject.D0999,??
                  formObject.D1110,??
                  formObject.D1120,??
                  formObject.D1206,??
                  formObject.D1208,??
                  formObject.D1310,
                  formObject.D1320,??
                  formObject.D1321,??
                  formObject.D1330,??
                  formObject.D1351,
                  formObject.D1352,??
                  formObject.D1353,??
                  formObject.D1354,??
                  formObject.D1355,??
                  formObject.D1510,??
                  formObject.D1516,??
                  formObject.D1517,??
                  formObject.D1520,??
                  formObject.D1526,??
                  formObject.D1527,??
                  formObject.D1551,??
                  formObject.D1552,??
                  formObject.D1553,??
                  formObject.D1556,??
                  formObject.D1557,??
                  formObject.D1558,??
                  formObject.D1575,??
                  formObject.D1701,??
                  formObject.D1702,??
                  formObject.D1703,??
                  formObject.D1704,
                  formObject.D1705,??
                  formObject.D1706,??
                  formObject.D1707,??
                  formObject.D1999,??
                  formObject.D2140,??
                  formObject.D2150,??
                  formObject.D2160,??
                  formObject.D2161,??
                  formObject.D2330,??
                  formObject.D2331,??
                  formObject.D2332,??
                  formObject.D2335,??
                  formObject.D2390,??
                  formObject.D2391,??
                  formObject.D2392,??
                  formObject.D2393,??
                  formObject.D2394,??
                  formObject.D2410,??
                  formObject.D2420,??
                  formObject.D2430,
                  formObject.D2510,??
                  formObject.D2520,??
                  formObject.D2530,??
                  formObject.D2542,??
                  formObject.D2543,??
                  formObject.D2544,??
                  formObject.D2610,??
                  formObject.D2620,??
                  formObject.D2630,??
                  formObject.D2642,??
                  formObject.D2643,??
                  formObject.D2644,??
                  formObject.D2650,??
                  formObject.D2651,??
                  formObject.D2652,??
                  formObject.D2662,??
                  formObject.D2663,??
                  formObject.D2664,??
                  formObject.D2710,??
                  formObject.D2712,??
                  formObject.D2720,??
                  formObject.D2721,??
                  formObject.D2722,??
                  formObject.D2740,
                  formObject.D2750,??
                  formObject.D2751,??
                  formObject.D2752,??
                  formObject.D2753,??
                  formObject.D2780,??
                  formObject.D2781,??
                  formObject.D2782,??
                  formObject.D2783,??
                  formObject.D2790,??
                  formObject.D2791,??
                  formObject.D2792,??
                  formObject.D2794,??
                  formObject.D2799,??
                  formObject.D2910,??
                  formObject.D2915,??
                  formObject.D2920,??
                  formObject.D2921,??
                  formObject.D2928,??
                  formObject.D2929,??
                  formObject.D2930,??
                  formObject.D2931,??
                  formObject.D2932,??
                  formObject.D2933,??
                  formObject.D2934,??
                  formObject.D2940,??
                  formObject.D2941,??
                  formObject.D2949,??
                  formObject.D2950,??
                  formObject.D2951,??
                  formObject.D2952,??
                  formObject.D2953,??
                  formObject.D2954,??
                  formObject.D2955,??
                  formObject.D2957,??
                  formObject.D2960,??
                  formObject.D2961,??
                  formObject.D2962,??
                  formObject.D2971,??
                  formObject.D2975,??
                  formObject.D2980,??
                  formObject.D2981,??
                  formObject.D2982,??
                  formObject.D2983,??
                  formObject.D2990,??
                  formObject.D2999,
                  formObject.D3110,??
                  formObject.D3120,
                  formObject.D3220,??
                  formObject.D3221,??
                  formObject.D3222,??
                  formObject.D3230,??
                  formObject.D3240,??
                  formObject.D3310,??
                  formObject.D3320,??
                  formObject.D3330,
                  formObject.D3331,??
                  formObject.D3332,??
                  formObject.D3333,??
                  formObject.D3346,??
                  formObject.D3347,??
                  formObject.D3348,??
                  formObject.D3351,??
                  formObject.D3352,??
                  formObject.D3353,??
                  formObject.D3355,??
                  formObject.D3356,??
                  formObject.D3357,??
                  formObject.D3410,??
                  formObject.D3421,??
                  formObject.D3425,??
                  formObject.D3426,??
                  formObject.D3428,??
                  formObject.D3429,??
                  formObject.D3430,??
                  formObject.D3431,??
                  formObject.D3432,??
                  formObject.D3450,??
                  formObject.D3460,
                  formObject.D3470,??
                  formObject.D3471,??
                  formObject.D3472,??
                  formObject.D3473,??
                  formObject.D3501,??
                  formObject.D3502,??
                  formObject.D3503,??
                  formObject.D3910,??
                  formObject.D3911,??
                  formObject.D3920,??
                  formObject.D3921,??
                  formObject.D3950,??
                  formObject.D3999,??
                  formObject.D4210,??
                  formObject.D4211,??
                  formObject.D4212,??
                  formObject.D4230,??
                  formObject.D4231,??
                  formObject.D4240,??
                  formObject.D4241,??
                  formObject.D4245,??
                  formObject.D4249,??
                  formObject.D4260,??
                  formObject.D4261,
                  formObject.D4263,??
                  formObject.D4264,??
                  formObject.D4265,??
                  formObject.D4266,??
                  formObject.D4267,??
                  formObject.D4268,??
                  formObject.D4270,??
                  formObject.D4273,??
                  formObject.D4274,??
                  formObject.D4275,??
                  formObject.D4276,??
                  formObject.D4277,??
                  formObject.D4278,??
                  formObject.D4283,??
                  formObject.D4285,??
                  formObject.D4322,??
                  formObject.D4323,??
                  formObject.D4341,??
                  formObject.D4342,??
                  formObject.D4346,??
                  formObject.D4355,??
                  formObject.D4381,??
                  formObject.D4910,??
                  formObject.D4920,??
                  formObject.D4921,??
                  formObject.D4999,??
                  formObject.D5110,??
                  formObject.D5120,??
                  formObject.D5130,??
                  formObject.D5140,??
                  formObject.D5211,??
                  formObject.D5212,
                  formObject.D5213,??
                  formObject.D5214,??
                  formObject.D5221,??
                  formObject.D5222,??
                  formObject.D5223,??
                  formObject.D5224,??
                  formObject.D5225,??
                  formObject.D5226,??
                  formObject.D5227,??
                  formObject.D5228,??
                  formObject.D5282,??
                  formObject.D5283,??
                  formObject.D5284,??
                  formObject.D5286,??
                  formObject.D5410,??
                  formObject.D5411,??
                  formObject.D5421,??
                  formObject.D5422,??
                  formObject.D5511,??
                  formObject.D5512,??
                  formObject.D5520,??
                  formObject.D5611,??
                  formObject.D5612,??
                  formObject.D5621,??
                  formObject.D5622,??
                  formObject.D5630,??
                  formObject.D5640,??
                  formObject.D5650,??
                  formObject.D5660,??
                  formObject.D5670,??
                  formObject.D5671,??
                  formObject.D5765,??
                  formObject.D5710,??
                  formObject.D5711,??
                  formObject.D5720,??
                  formObject.D5721,??
                  formObject.D5725,??
                  formObject.D5730,??
                  formObject.D5731,??
                  formObject.D5740,??
                  formObject.D5741,??
                  formObject.D5750,??
                  formObject.D5751,??
                  formObject.D5760,??
                  formObject.D5761,??
                  formObject.D5810,??
                  formObject.D5811,??
                  formObject.D5820,??
                  formObject.D5821,??
                  formObject.D5850,
                  formObject.D5851,??
                  formObject.D5862,??
                  formObject.D5863,??
                  formObject.D5864,??
                  formObject.D5865,??
                  formObject.D5866,??
                  formObject.D5867,??
                  formObject.D5875,??
                  formObject.D5876,??
                  formObject.D5899,??
                  formObject.D5911,??
                  formObject.D5912,??
                  formObject.D5913,??
                  formObject.D5914,??
                  formObject.D5915,??
                  formObject.D5916,??
                  formObject.D5919,??
                  formObject.D5922,
                  formObject.D5923,??
                  formObject.D5924,??
                  formObject.D5925,??
                  formObject.D5926,??
                  formObject.D5927,??
                  formObject.D5928,??
                  formObject.D5929,??
                  formObject.D5931,??
                  formObject.D5932,??
                  formObject.D5933,??
                  formObject.D5934,??
                  formObject.D5935,??
                  formObject.D5936,??
                  formObject.D5937,??
                  formObject.D5951,??
                  formObject.D5952,??
                  formObject.D5953,??
                  formObject.D5954,??
                  formObject.D5955,??
                  formObject.D5958,??
                  formObject.D5959,??
                  formObject.D5960,
                  formObject.D5982,??
                  formObject.D5983,??
                  formObject.D5984,??
                  formObject.D5985,??
                  formObject.D5986,??
                  formObject.D5987,??
                  formObject.D5988,??
                  formObject.D5991,??
                  formObject.D5992,??
                  formObject.D5993,??
                  formObject.D5995,??
                  formObject.D5996,??
                  formObject.D5999,
                  formObject.D6010,??
                  formObject.D6011,??
                  formObject.D6012,??
                  formObject.D6013,??
                  formObject.D6040,??
                  formObject.D6050,??
                  formObject.D6051,??
                  formObject.D6055,??
                  formObject.D6056,??
                  formObject.D6057,??
                  formObject.D6058,??
                  formObject.D6059,??
                  formObject.D6060,??
                  formObject.D6061,??
                  formObject.D6062,??
                  formObject.D6063,??
                  formObject.D6064,??
                  formObject.D6065,??
                  formObject.D6066,??
                  formObject.D6067,??
                  formObject.D6068,??
                  formObject.D6069,??
                  formObject.D6070,??
                  formObject.D6071,??
                  formObject.D6072,??
                  formObject.D6073,??
                  formObject.D6074,??
                  formObject.D6075,??
                  formObject.D6076,??
                  formObject.D6077,??
                  formObject.D6080,??
                  formObject.D6081,??
                  formObject.D6082,??
                  formObject.D6083,??
                  formObject.D6084,??
                  formObject.D6085,??
                  formObject.D6086,??
                  formObject.D6087,??
                  formObject.D6088,??
                  formObject.D6090,??
                  formObject.D6091,??
                  formObject.D6092,??
                  formObject.D6093,??
                  formObject.D6094,??
                  formObject.D6095,??
                  formObject.D6096,??
                  formObject.D6097,??
                  formObject.D6098,??
                  formObject.D6099,??
                  formObject.D6100,??
                  formObject.D6101,??
                  formObject.D6102,??
                  formObject.D6103,??
                  formObject.D6104,??
                  formObject.D6110,??
                  formObject.D6111,??
                  formObject.D6112,??
                  formObject.D6113,??
                  formObject.D6114,??
                  formObject.D6115,??
                  formObject.D6116,??
                  formObject.D6117,??
                  formObject.D6118,??
                  formObject.D6119,
                  formObject.D6120,??
                  formObject.D6121,??
                  formObject.D6122,??
                  formObject.D6123,??
                  formObject.D6190,??
                  formObject.D6191,??
                  formObject.D6192,??
                  formObject.D6194,??
                  formObject.D6195,??
                  formObject.D6198,??
                  formObject.D6199,??
                  formObject.D6205,??
                  formObject.D6210,
                  formObject.D6211,??
                  formObject.D6212,??
                  formObject.D6214,??
                  formObject.D6240,??
                  formObject.D6241,??
                  formObject.D6242,??
                  formObject.D6243,??
                  formObject.D6245,??
                  formObject.D6250,??
                  formObject.D6251,??
                  formObject.D6252,??
                  formObject.D6253,??
                  formObject.D6545,??
                  formObject.D6548,??
                  formObject.D6549,??
                  formObject.D6600,
                  formObject.D6601,??
                  formObject.D6602,??
                  formObject.D6603,??
                  formObject.D6604,??
                  formObject.D6605,??
                  formObject.D6606,??
                  formObject.D6607,??
                  formObject.D6608,??
                  formObject.D6609,??
                  formObject.D6610,??
                  formObject.D6611,??
                  formObject.D6612,??
                  formObject.D6613,??
                  formObject.D6614,??
                  formObject.D6615,??
                  formObject.D6624,??
                  formObject.D6634,??
                  formObject.D6710,??
                  formObject.D6720,??
                  formObject.D6721,??
                  formObject.D6722,??
                  formObject.D6740,
                  formObject.D6750,??
                  formObject.D6751,
                  formObject.D6752,??
                  formObject.D6753,??
                  formObject.D6780,??
                  formObject.D6781,??
                  formObject.D6782,??
                  formObject.D6783,??
                  formObject.D6784,??
                  formObject.D6790,
                  formObject.D6791,??
                  formObject.D6792,??
                  formObject.D6793,??
                  formObject.D6794,??
                  formObject.D6920,??
                  formObject.D6930,??
                  formObject.D6940,??
                  formObject.D6950,??
                  formObject.D6980,??
                  formObject.D6985,??
                  formObject.D6999,??
                  formObject.D7111,??
                  formObject.D7140,??
                  formObject.D7210,??
                  formObject.D7220,??
                  formObject.D7230,??
                  formObject.D7240,??
                  formObject.D7241,??
                  formObject.D7250,??
                  formObject.D7251,??
                  formObject.D7260,??
                  formObject.D7261,??
                  formObject.D7270,??
                  formObject.D7272,??
                  formObject.D7280,??
                  formObject.D7282,??
                  formObject.D7283,??
                  formObject.D7285,??
                  formObject.D7286,??
                  formObject.D7287,??
                  formObject.D7288,??
                  formObject.D7290,??
                  formObject.D7291,??
                  formObject.D7292,??
                  formObject.D7293,??
                  formObject.D7294,??
                  formObject.D7295,??
                  formObject.D7296,??
                  formObject.D7297,??
                  formObject.D7298,??
                  formObject.D7299,??
                  formObject.D7300,??
                  formObject.D7310,??
                  formObject.D7311,??
                  formObject.D7320,??
                  formObject.D7321,??
                  formObject.D7340,??
                  formObject.D7350,??
                  formObject.D7410,??
                  formObject.D7411,??
                  formObject.D7412,??
                  formObject.D7413,??
                  formObject.D7414,??
                  formObject.D7415,??
                  formObject.D7440,??
                  formObject.D7441,??
                  formObject.D7450,??
                  formObject.D7451,??
                  formObject.D7460,??
                  formObject.D7461,??
                  formObject.D7465,
                  formObject.D7471,??
                  formObject.D7472,??
                  formObject.D7473,??
                  formObject.D7485,??
                  formObject.D7490,??
                  formObject.D7510,??
                  formObject.D7511,??
                  formObject.D7520,??
                  formObject.D7521,??
                  formObject.D7530,??
                  formObject.D7540,??
                  formObject.D7550,??
                  formObject.D7560,??
                  formObject.D7610,??
                  formObject.D7620,??
                  formObject.D7630,??
                  formObject.D7640,??
                  formObject.D7650,??
                  formObject.D7660,??
                  formObject.D7670,??
                  formObject.D7671,??
                  formObject.D7680,??
                  formObject.D7710,??
                  formObject.D7720,??
                  formObject.D7730,??
                  formObject.D7740,??
                  formObject.D7750,??
                  formObject.D7760,??
                  formObject.D7770,??
                  formObject.D7771,??
                  formObject.D7780,??
                  formObject.D7810,??
                  formObject.D7820,??
                  formObject.D7830,??
                  formObject.D7840,??
                  formObject.D7850,??
                  formObject.D7852,??
                  formObject.D7854,??
                  formObject.D7856,??
                  formObject.D7858,??
                  formObject.D7860,??
                  formObject.D7865,??
                  formObject.D7870,??
                  formObject.D7871,??
                  formObject.D7872,??
                  formObject.D7873,??
                  formObject.D7874,??
                  formObject.D7875,??
                  formObject.D7876,??
                  formObject.D7877,??
                  formObject.D7880,??
                  formObject.D7881,??
                  formObject.D7899,??
                  formObject.D7910,??
                  formObject.D7911,??
                  formObject.D7912,??
                  formObject.D7920,??
                  formObject.D7921,??
                  formObject.D7922,??
                  formObject.D7940,??
                  formObject.D7941,??
                  formObject.D7943,??
                  formObject.D7944,
                  formObject.D7945,??
                  formObject.D7946,??
                  formObject.D7947,??
                  formObject.D7948,??
                  formObject.D7949,??
                  formObject.D7950,??
                  formObject.D7951,??
                  formObject.D7952,
                  formObject.D7953,??
                  formObject.D7955,??
                  formObject.D7961,??
                  formObject.D7962,??
                  formObject.D7963,??
                  formObject.D7970,??
                  formObject.D7971,??
                  formObject.D7972,??
                  formObject.D7979,??
                  formObject.D7980,??
                  formObject.D7981,??
                  formObject.D7982,??
                  formObject.D7983,??
                  formObject.D7990,??
                  formObject.D7991,??
                  formObject.D7993,??
                  formObject.D7994,??
                  formObject.D7995,??
                  formObject.D7996,??
                  formObject.D7997,??
                  formObject.D7998,??
                  formObject.D7999,??
                  formObject.D8010,??
                  formObject.D8020,??
                  formObject.D8030,??
                  formObject.D8040,??
                  formObject.D8070,??
                  formObject.D8080,??
                  formObject.D8090,??
                  formObject.D8210,??
                  formObject.D8220,
                  formObject.D8660,??
                  formObject.D8670,
                  formObject.D8680,??
                  formObject.D8681,??
                  formObject.D8695,??
                  formObject.D8696,
                  formObject.D8697,??
                  formObject.D8698,??
                  formObject.D8699,??
                  formObject.D8701,??
                  formObject.D8702,??
                  formObject.D8703,??
                  formObject.D8704,??
                  formObject.D8999,??
                  formObject.D9110,??
                  formObject.D9120,??
                  formObject.D9130,??
                  formObject.D9210,??
                  formObject.D9211,??
                  formObject.D9212,??
                  formObject.D9215,??
                  formObject.D9219,
                  formObject.D9222,??
                  formObject.D9223,??
                  formObject.D9230,??
                  formObject.D9239,??
                  formObject.D9243,??
                  formObject.D9248,??
                  formObject.D9310,??
                  formObject.D9311,??
                  formObject.D9410,??
                  formObject.D9420,??
                  formObject.D9430,??
                  formObject.D9440,??
                  formObject.D9450,??
                  formObject.D9610,
                  formObject.D9612,??
                  formObject.D9613,??
                  formObject.D9630,??
                  formObject.D9910,??
                  formObject.D9911,??
                  formObject.D9912,??
                  formObject.D9920,??
                  formObject.D9930,??
                  formObject.D9932,??
                  formObject.D9933,??
                  formObject.D9934,??
                  formObject.D9935,??
                  formObject.D9941,??
                  formObject.D9942,??
                  formObject.D9943,??
                  formObject.D9944,
                  formObject.D9945,??
                  formObject.D9946,
                  formObject.D9947,??
                  formObject.D9948,??
                  formObject.D9949,??
                  formObject.D9950,??
                  formObject.D9951,??
                  formObject.D9952,??
                  formObject.D9961,??
                  formObject.D9970,??
                  formObject.D9971,??
                  formObject.D9972,??
                  formObject.D9973,??
                  formObject.D9974,??
                  formObject.D9975,??
                  formObject.D9985,??
                  formObject.D9986,??
                  formObject.D9987,??
                  formObject.D9990,??
                  formObject.D9991,??
                  formObject.D9992,??
                  formObject.D9993,??
                  formObject.D9994,??
                  formObject.D9995,??
                  formObject.D9996,??
                  formObject.D9997,??
                  formObject.D9999,]];??
  }

  return values;

}

/* APPEND DATA TO FS Staging Area */ 
function appendData(values, spreadsheetId,range) {
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.sheetID = spreadsheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range,{valueInputOption: "RAW"});
}

/* APPEND DATA TO FINAL DB */
function appendDataFinalSheet(values, finalSheetId,range) {
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.sheetID = finalSheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, finalSheetId, range,{valueInputOption: "RAW"});
}


/* READ DATA */
function readData(spreadsheetId,range) {
  var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
  return result.values;
}


/* UPDATE DATA */
/* Note - this function is not currently being used */
function updateData(values,spreadsheetId,range) {
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
  valueInputOption: "RAW"});
}

/* CLEAR STAGING SHEET */
function clearStagingSheet() {
  var sheets = SpreadsheetApp.openById(globalVariables().spreadsheetId);
  sheets.deleteRow(2);
  sheets.deleteRow(2);
}

/* 
## HELPER FUNCTIONS FOR CRUD OPERATIONS --------------------------------------------------------------
*/ 


/* CHECK FOR EXISTING ID, RETURN BOOLEAN */
/* Note - this function is not currently being used  */
function checkID(ID) {
  var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange,).reduce(function(a,b){return a.concat(b);});
  return idList.includes(ID);
}

/* GET DATA RANGE A1 NOTATION FOR GIVEN ID */
function getRangeByID(id) {
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
function getRecordById(id) {
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

/*function getAllFinalData(){
  var data = readData(globalVariables().finalSheetId, globalVariables().sheetRange);

  return data;
}
*/

/*
## OTHER HELPERS FUNCTIONS ------------------------------------------------------------------------
*/

/* INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}