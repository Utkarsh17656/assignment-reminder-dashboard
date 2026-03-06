function onOpen() {

  var ui = SpreadsheetApp.getUi();

  ui.createMenu("Assignment Manager")
    .addItem("Open Dashboard", "showDashboard")
    .addItem("Send Reminders", "sendReminders")
    .addToUi();

}
function showDashboard() {

  var html = HtmlService.createHtmlOutputFromFile("Dashboard")
  .setTitle("Assignment Manager");

  SpreadsheetApp.getUi().showSidebar(html);

}
function sendReminders() {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var today = new Date();
  var emailsSent = 0;

  for (var i = 1; i < data.length; i++) {

    var name = data[i][0];
    var email = data[i][1];
    var assignment = data[i][2];
    var deadline = new Date(data[i][3]);
    var reminder = data[i][4];

    var diffDays = Math.ceil((deadline - today) / (1000*60*60*24));

    if (diffDays <= 3 && reminder != "Yes") {

      Logger.log("Sending reminder to: " + email);

      var subject = "Assignment Deadline Reminder";

      var message =
      "Hello " + name + ",\n\n" +
      "This is a reminder that your assignment:\n\n" +
      assignment + "\n\n" +
      "is due on: " + deadline.toDateString() + "\n\n" +
      "Please submit before the deadline.\n\n" +
      "Regards,\nAssignment Management System";

      MailApp.sendEmail(email, subject, message);

      sheet.getRange(i+1,5).setValue("Yes");

      emailsSent++;
    }
  }

  Logger.log("Total Emails Sent: " + emailsSent);
}
function addAssignment(name, email, assignment, deadline) {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  sheet.appendRow([
    name,
    email,
    assignment,
    new Date(deadline),
    "No"
  ]);

}