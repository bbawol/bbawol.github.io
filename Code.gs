function doGet(e) {
  if (e.parameter.action === 'getArtists') {
    return getArtistList();  // Fetch the list of artists if the action is 'getArtists'
  } else if (e.parameter.action === 'submitForm') {
    return handleFormSubmission(e); // Handle the form submission data
  } else {
    return ContentService.createTextOutput("Invalid action").setMimeType(ContentService.MimeType.TEXT);
  }
}

function handleFormSubmission(e) {
  let sheet;
  try {
    sheet = SpreadsheetApp.openById("1BqE6F0caU6WRoZJgInEi5akQrhLRQ3YTCxZPQRaImb8").getSheetByName("2024");
    if (!sheet) {
      throw new Error("Could not find sheet with name '2024'");
    }
  } catch (error) {
    Logger.log("Error opening sheet: " + error.message);
    return ContentService.createTextOutput("Error opening sheet: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }

  // Get parameters
  const shopperId = e.parameter.shopperId;
  
  // Check for multiple artist IDs and product amounts
  let artistIds = e.parameters.artistId;
  let productAmounts = e.parameters.productAmount;

  // If there is only one artistId or productAmount, convert them to arrays for consistent processing
  if (!Array.isArray(artistIds)) {
    artistIds = [artistIds];
  }
  
  if (!Array.isArray(productAmounts)) {
    productAmounts = [productAmounts];
  }

  try {
    // Append each artist and amount to the Google Sheet
    for (let i = 0; i < artistIds.length; i++) {
      sheet.appendRow([
        shopperId,
        artistIds[i],
        productAmounts[i]
      ]);
    }
  } catch (error) {
    Logger.log("Error appending row: " + error.message);
    return ContentService.createTextOutput("Error appending row: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }

  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

function getArtistList() {
  try {
    const sheet = SpreadsheetApp.openById("1BqE6F0caU6WRoZJgInEi5akQrhLRQ3YTCxZPQRaImb8").getSheetByName("artists");
    if (!sheet) {
      throw new Error("Could not find sheet with name 'artists'");
    }
    const data = sheet.getRange("B2:B" + sheet.getLastRow()).getValues(); // Assuming artist codes start in B2
    const artistCodes = data.flat(); // Flatten the array

    Logger.log("Fetched artist list: " + JSON.stringify(artistCodes));

    return ContentService
      .createTextOutput(JSON.stringify(artistCodes))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error fetching artist list: " + error.message);
    return ContentService.createTextOutput("Error fetching artist list: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
