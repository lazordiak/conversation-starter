console.log(
  `-----------------
  Welcome to Conversation Starter!
  -----------------
  `);

/*

Firebase Code to init our database, list our users, store any data.

*/

// Import in our admin messages
const { adminMessages } = require('./admin-messages');
const { statistics } = require('./statistics');

// An array to hold the phone numbers
let numbers = [];
const port = 3001

require('dotenv').config();

const adminNum = process.env.ADMIN_NUMBER;
const appNum = process.env.TWILIO_NUMBER;

let twilio = require('twilio');

let client = new twilio(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const MessagingResponse = require('twilio').twiml.MessagingResponse;

// To handle Twilio's web hooks to our server
const express = require('express');
bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// To respond to basic HTTP requests
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// To Init our server and port and print to the console.
let server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});

// When an SMS message is received, parse it
app.post('/sms', function (req, res) {

  // Get the phone number that the message was from
  let fromNum = req.body.From;

  // Get the SMS message text
  let msg = req.body.Body;
  console.log(`>>> SMS Received from:${fromNum}\n>>> Message: ${msg}`);

  // Make a new variable to respond with
  let resp = new MessagingResponse();

  // Get the stats from admin-messages.js
  let stats = statistics;
  // Find a random category
  let randCat = stats[Math.floor(Math.random() * stats.length)];
  console.log(`>>> Found a random category: ${randCat.category}`)
  // Pull a random entry from a category
  let data = randCat.data;
  let randStat = data[Math.floor(Math.random() * data.length)]
  // And get the stat itself and the source
  let stat = randStat.text
  let source = randStat.source;
  console.log(`
    >>> We found a random stat:
    ${stat}
    >>> with source
    ${source}
    `)

  // Make a new message out of them and append it to our response.
  let response = `${stat}
  ${source}`
  sendMsg(fromNum, response);
  textAdmin(fromNum + msg);
  resp.message(response);

  // Format and send the message to the number recieved
  res.writeHead(200, { 'Content-Type':'text/xml' });
  res.end(resp.toString());

});

function sendMsg(toNum, msg) {

  let options = {
    to: toNum,
    from: appNum,
    body: msg
  }

  client.messages.create( options, function( err, data ) {

    if (err) {
      console.log(`!! !! !! error: ${err}
        !! !! !! There was an error sending SMS to ${toNum}
        ${data.body}`);
    }

    console.log(`SMS sent to ${toNum}\n${data.body}`)

  });
}


function textAdmin(msg) {

  let options = {
    to: adminNum,
    from: appNum,
    body: msg
  }

  client.messages.create(options, function( err, data ) {

    if (err) console.log(`There was an error texting Admin: ${err}`);

    console.log(`--------------\nSent Admin this msg:\n${msg}`);

  });
}
