const SHEET_NAME = "Bookings";

function doPost(event) {
  try {
    const booking = JSON.parse(event.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet =
      spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Confirmed At",
        "Booking Reference",
        "Status",
        "Guest Name",
        "Phone",
        "Email",
        "Room",
        "Check In",
        "Check Out",
        "Nights",
        "Rooms",
        "Guests",
        "Subtotal",
        "GST",
        "Total Paid",
        "Payment ID",
        "Order ID",
      ]);
    }

    sheet.appendRow([
      booking.confirmedAt || new Date().toISOString(),
      booking.bookingReference || "",
      booking.status || "confirmed",
      booking.fullName || booking.guestName || "",
      booking.phone || "",
      booking.email || "",
      booking.roomName || "",
      booking.checkIn || "",
      booking.checkOut || "",
      booking.nights || "",
      booking.roomCount || booking.rooms || "",
      booking.guests || "",
      booking.subtotal || "",
      booking.gst || "",
      booking.amountPaid || booking.total || "",
      booking.paymentId || "",
      booking.orderId || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: error.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
