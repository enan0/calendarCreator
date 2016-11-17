/**
 * @OnlyCurrentDoc
 */
var weekDays = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
var yearMonths = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function onOpen(e) {

  SpreadsheetApp.getUi()
       .createMenu('AddCalendar')
       .addItem('Crear calendario', 'showSidebar')
       .addToUi();
/* 
  SpreadsheetApp.getUi()
       .createAddonMenu()
       .addItem('Crear calendario', 'showSidebar')
       .addToUi();
*/
}

function onInstall(e){
  onOpen(e);
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sideBar.html')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle("Calendar Creator")
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function createCalendar(mounthNumber, year, hideWeekEndOption) {
  
  var thisSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = yearMonths[mounthNumber-1];
  sheetName = sheetName+" "+year;
  var nextMounthSheet = thisSpreadsheet.insertSheet(sheetName, thisSpreadsheet.getNumSheets()+1);
  
  populateCellsCalendar( nextMounthSheet, year, mounthNumber );
  hideWeekEnd( nextMounthSheet, hideWeekEndOption );
  decorateCellsCalendar( nextMounthSheet );
  
}

function hideWeekEnd(sheet, option){
  if( option == 1 )
    sheet.deleteColumn( weekDays.indexOf("Sábado")+1 );
  else if( option == 2 )
    sheet.deleteColumn( weekDays.indexOf("Domingo")+1 );
  else if( option == 3 ) {
    sheet.deleteColumn( weekDays.indexOf("Sábado")+1 );
    sheet.deleteColumn( weekDays.indexOf("Domingo")+1 );
  }
}

function decorateCellsCalendar(sheet){
  var calendarRange = sheet.getDataRange();
  var firstRow = '1';
  var firstColumn = '1';
  var weekDaysRange = sheet.getRange(firstRow, firstColumn, 1, calendarRange.getLastColumn() )
  var daysRange = sheet.getRange(2, firstColumn, calendarRange.getLastRow(), calendarRange.getLastColumn() )
  
  calendarRange.setBorder(true, true, true, true, true, true);
  weekDaysRange.setBackground('#efefef');
  daysRange.setFontSize(11);
  daysRange.setFontFamily('Inconsolata')
  daysRange.setFontWeight('bold');
}

function populateCellsCalendar(sheet, year, mounthNumber){
  var firstOfMonth = new Date(year, mounthNumber-1, 1);
  var lastOfMonth = new Date(year, mounthNumber, 0);
  
  var mounthDay = 1;
  for(var i=0, cellCounter=0; i<weekCount(year, mounthNumber); i++){
    var row = [];
    for(var j=0; j<weekDays.length; j++, cellCounter++){
      if( cellCounter < firstOfMonth.getDay() 
          || mounthDay > lastOfMonth.getDate() ){
        row.push("");
      } else {
        row.push( mounthDay );
        mounthDay++;
      }
    }
    sheet.appendRow( row );
  }
}

function weekCount(year, month_number) {
    // month_number is in the range 1..12
    var firstOfMonth = new Date(year, month_number-1, 1);
    var lastOfMonth = new Date(year, month_number, 0);
    var used = firstOfMonth.getDay() + lastOfMonth.getDate();
    return Math.ceil( used / 7);
}
