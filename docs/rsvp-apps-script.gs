/**
 * Feral Affair RSVP receiver.
 * Paste into the "Feral Affair RSVPs" sheet: Extensions → Apps Script.
 * Then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 */
var SHEET_ID = '1MO4fREX8IL7gSEaaS6eKqhxunzXN8DP6UYf5Fd0Znao';
var TAB = 'RSVPs';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
    sheet.appendRow([
      new Date(),
      clean(d.name, 100),
      d.rsvp === 'in' ? 'Yes' : 'No',
      d.poison === 'A' || d.poison === 'B' ? d.poison : '',
      clean(d.poisonName, 100),
      clean(d.userAgent, 300)
    ]);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

// Lets you check the deployment in a browser: the /exec URL should show this text.
function doGet() {
  return ContentService.createTextOutput('Feral Affair RSVP endpoint is running.');
}

// Trim length and stop a guest typing "=..." from being run as a formula.
function clean(v, max) {
  var s = String(v == null ? '' : v).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
