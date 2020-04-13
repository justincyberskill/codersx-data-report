/* eslint-disable no-console */
import { google } from 'googleapis';

const { SHEET_CLIENT_EMAIL } = process.env;
// eslint-disable-next-line max-len
const SHEET_PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDwBgEkv+8RN2eK\nZxOpAAiC6NROl3ZDACZ6ES7cQGtXvjN3qUG7TCTYLxLzODal6CwZy5gwEQNcwiEA\nhJ9UHfCQLqs2S7b0SY01QvDDGqGHmTBoEn7FyVQW8AzgFs9mXBjypm6VkVrPutsK\nQrIMcO7wrssbS+ILNPfBan3RBT8bljK4c5irPEmxmRR5WqvXFXicD9vuItCmKKmA\nQDXkjucMRCiRPZ+r1BsmPS6jlEj9h6V2kTEhf5KhK3bHC7zqhIziu64meLaLkQlX\nmDHCkGlHpWNYZwRJaRS+yYblonD/mObh+kYgUWj2DBg4EnE9ooEcTlrCdSDoHPeH\n6kRi5khjAgMBAAECggEADWD4TVkZdUc2UUOfl+r1jn513w+YOvHWMzWj/AjnMtPa\nQJBBprP+1cIB92apvSOs2Z88k2lPW6tCdanuy5yDnTXMu1ELGKDE6zQZAXcJi+ph\nBVwKjvHC6yhkP1VmKBl4FoZqYZHhkvSiYvcGv6TH3MiRb6sSJXfFW5WY/76gHuRr\nt87w7T8Fax+jsrhZpD7it4Dr22pOhFnUw4kf0agqU07BV+0bCc5yxuJcygyuhc3O\nmVE28ojyuG0Wvjq8nZhhssECrHddTTWzGrA1RWN0txrs/oN6D5qC5xcJGlgYqNjZ\nrw3xieTzKT5wSZ58/Awp2oMAWuwNCt76l+S2PMCDqQKBgQD/bTj/gNYXRNRjSyCz\nUFhfCcJhuc7x6x9KbTfTftZXxr6lM7Km1vfYfb9ScYIOOHZjTR9qwRHoDzYx4ghW\n2Y2TEvNnnjFfOJ6sVNBFNmt60OZVQrcu2Zhk61FXbzoTjqZMPrB249fmgMfDz7dx\na8Mp+i4YRxyzvrL1E2kbhPozfQKBgQDwj+469z6yGXCb/cxXXz89bMP00drHEVma\nr6sDhnL42Rpi3vKxJXzXadS2HRWflHqzHwQDFT2S7VrfU8Zww+CrhgJXY1gbOcnD\n7ifdlCcGz+mWE/jQ8jFcY7J6Wc0jj0GdzE+VpHAvZoIaPNoUvGryCBEP0d1wh/Mf\nVjV2+Q9xXwKBgQCt4Wa52LTlpj+HUK90Ii/mkrg22sycN1lXyz4DxgaYPn2t7KGj\nnhee0wuZThghIiLFusy2WbSc6y4TizHuHa+Y/X+hfDlT/zFVU29sjn1gYDFMvVwC\nkrKBkQgQo3E/uw5OPSbX6IcjLWvQSukwVxHG077pXA+X9SvSVmJpD39b6QKBgEr8\nwsk0uyFvVq/5jFIMCb2PAwJ0zBrTqLfUXJ2rsnkpy9TYJJTd162aeskOBeiJsznU\nyD5hx6DeRj5pcelC1e0ByAcPm65Y9DEUMu8aOJQiCXFT5nLTnFltZnxHM/AKvux+\nfKxr5uCPtqyRHXXrSfcKVq80vy9N4ZZ6HA5rEspHAoGAYdfNf06F18RyZq6Br0Ye\npan5q3Pt5KpdcsUhqLilyF8gATqsswGFcR8l36w/vyV2F/qF0Gx1QNIDGvVBODTi\n13v6gAYH+U4RHozZjkZwSFCpea3xBPRNYcnUBAJNHUExveBIF6f1pfkcqJ6FDxio\nooHrGwMhpH+s6fNCmGjDr14=\n-----END PRIVATE KEY-----\n';

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
