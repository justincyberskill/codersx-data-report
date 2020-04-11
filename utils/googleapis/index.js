import { google } from 'googleapis';

const { SHEET_CLIENT_EMAIL, SHEET_PRIVATE_KEY } = process.env;

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
function connect() {
  // Create client's credential object
  const client = new google.auth.JWT(
    SHEET_CLIENT_EMAIL,
    null,
    SHEET_PRIVATE_KEY,
    scopes,
  );

  // Get BEARER token for client's credential
  client.authorize((err) => {
    if (err) {
      console.log('Fail to authorize Google Sheet\n', err.message);
      return;
    }
    console.log('🍣 Great! Connected to GoogleSheet API');
  });

  // Use client's credential included BEARER token
  return client;
}

const clientConnected = connect();
const gsapi = google.sheets({
  version: 'v4',
  auth: clientConnected,
});

// ------ Setup codes ------
export function appendDataToSheet(spreadsheetId, range, values) {
  gsapi.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

export default gsapi;
