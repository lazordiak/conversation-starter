/*
some code adapted from Mark Lamb and Vince Mu Ping Shoa's Coding Lab bot:
https://github.com/Emceelamb/codinglab-bot
*/
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
function fetchGoogle() {
  /* vince's note */
  // return a Promise function back to syncbot.js
  // and unpack the pulled data there
  return new Promise((resolve, reject) => {
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Sheets API.

      /* vince's note */
      // the .then() here is unpacking the read content from fs.readFile
      // returned from authorize()
      authorize(JSON.parse(content), datapull).then(unresolvedData => {
        // the unresolved data here is the raw data
        // coming from datapull()
        resolve(unresolvedData);
      });
    });
  });
}

function readCred() {
  let prom = new Promise((resolve, reject) => {
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Sheets API.
      // authorize(JSON.parse(content), datapull);
      resolve(content);
    });
  });
  prom.then(credentials => authorize(JSON.parse(credentials), datapull));
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, pullData) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.

  /* vince's note */
  // return a Promise function back to fetchGoogle()
  // and unpack the read data there
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, pullData);

      oAuth2Client.setCredentials(JSON.parse(token));
      const unresolvedData = pullData(oAuth2Client);

      resolve(unresolvedData);
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function datapull(auth) {
  const sheets = google.sheets({ version: "v4", auth });

  /* vince's note */
  // return this unresolved Promise function
  // and unpack it in synbot.js (entry point of the bot)
  const values = sheets.spreadsheets.values.get({
    spreadsheetId: "13PXxPdsHVKQaTGMFHtpV06B0zpbjJk5CG5tcXKQXRtA",
    range: "Sheet1"
  });
  // console.log("Did we get anything? " + values.values);
  return values;
}

function searchSheet(words) {

  // To store our matches
  var matches = []

  // For each of the words in the msg
  for (var word of words) {

    // Check the stats for tags
    for (var k of sheet) {
      var tags = k.tags;

      // Check each tag to see if it's a match with our word
      for (var tag of tags) {

        // if it is a match, store the matched object in an array
        if (word == tag) {

          // Return the text from that matched object
          if (!matches.find(e => e == k.text)) {
              // console.log("new item found")
              matches.push({
                text: k.text,
                source: k.source,
              })
          }
        }
      }
    }
  }
  return matches
}

// To get a random conversation starter
function getRandom() {

  console.log(`Getting random stat and source...`)

  // Get the stats from admin-messages.js
  // let stats = statistics;

  // Find a random category
  let randRow = random(sheet);
  // console.log(randRow)

  // And get the stat itself and the source
  let text = randRow.text
  let source = randRow.source;

  // console.log(`Found a random stat:\n>>> ${text}`)
  // console.log(`Source:\n>>> ${source}`)

  return [text, source]
}


// A Helper function
function random(array) {
  rand = array[Math.floor(Math.random() * array.length)]
  return rand
}

let sheet = [];
let unresolvedData = fetchGoogle()
.then((rawData) => {
  data = rawData.data.values;
  for (var row of data) {
    // The tags row is a string and must be split into an array for matching later.
    var splitTagsRow;
    // If the row is empty, we can't use the split function.  So we check that it isn't.
    if (row[3] != undefined) {
      splitTagsRow = row[3].split(",");
    }
    // We can also skip the first row.
    if(row[3] !== "tags") {
      sheet.push({
        "category":row[0],
        "text":row[1],
        "source":row[2],
        "tags":splitTagsRow
      })
    }
  }
  // var words = ["incarceration", "poverty"];
  // console.log(matchSearch(words));
  // console.log(sheet)
  // getRandom();
})
.catch((err) => console.log(err));


exports.getRandom = getRandom;
exports.searchSheet = searchSheet;
exports.sheet = sheet;
