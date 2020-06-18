/*

June 2020

Built in cooperation with Tech & Society and The Coding Lab at NYU's ITP program.

The Rita.js portion is adapted from Allison Parrish's tutorial:
https://creative-coding.decontextualize.com/intro-to-ritajs/

Do we need Firebase to store our users or any data?
Could also port the statistics page to Google Sheets for ease.

*/

console.log(
`
--------------------------------
Welcome to Conversation Starter!
--------------------------------
`
);

// Import in our admin messages
const { adminMessages } = require('./admin-messages');
const { statistics } = require('./statistics');
// Import RiTa for parsing the keywords
const RiTa = require('RiTa')
// Import dotenv to use our .env file
require('dotenv').config();
// Import the Twilio API
let twilio = require('twilio');

// Using our .env file to send parameters to our Twilio and server objects
const adminNum = process.env.ADMIN_NUMBER;
const appNum = process.env.TWILIO_NUMBER;
const port = process.env.PORT;

let client = new twilio(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

// Our webhook object for sending SMS via an HTML response
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// To handle incoming HTTP requests at the address set in our Twilio Dashboard > Phone Numbers > +1######## > Message, "A Message Comes In", Webhook <http://e61360cb536a.ngrok.io/sms>
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
  console.log(`SMS Received from: ${fromNum}\nMessage: ${msg}`);
  // Finding the first word in the SMS msg to evaluate later
  var msgTrim = msg.trim().toLowerCase();
  var firstWord = msg.split(' ')[0].toLowerCase();

  // Make a new Twiml object to respond with
  let resp = new MessagingResponse();
  // Variables to build our response
  let stat;
  let source;

  // If the user texts "random", then we do the following
  if (firstWord == 'random') {
    let rand = getRandomStat();
    stat = rand[0];
    source = rand[1];
  // Otherwise we parse their message and return a relevant response
  } else {
    // Get the keywords (noun(s) & adjectives) from the text using RiTa
    let keywords = getKeywords(msg);
    // Find the matches in the data and return a random one
    let match = random(matchSearch(keywords));

    if (match) {
      stat = match.text;
      source = ` // source: ${match.source}`;
    // If we can't find a match...
    } else {
      stat = "Thanks for texting Conversation Starter.  It appears we don't have information on that issue at this time, but you can slip us your own facts via DM: https://twitter.com/conv_starter";
      source = "";
    }
  }

  // Make a new message and append it to our response.
  let response = `${stat}${source}`
  resp.message(response);
  console.log(`HTML Response: ${response}`)
  // Format and send the message to the number recieved
  res.writeHead(200, { 'Content-Type':'text/xml' });
  res.end(resp.toString());

  // Send the admin number a message to monitor activity
  let toAdmin = `Text from ${fromNum}: \"${msg}\"\nResponding with: ${response}`
  textAdmin(toAdmin);

});


// A function to text the administrator to monitor activity
function textAdmin(msg) {

  let options = {
    to: adminNum,
    from: appNum,
    body: msg
  }

  client.messages.create(options, function( err, data ) {

    if (err) {
      console.log(`*********There was an error texting Admin: ${err}`);
    }

    console.log(`SMS sent to Admin ${adminNum}\n>>> ${msg}`);

  });
}

// Getting the keywords from the SMS message using RiTa
function getKeywords(str){

  let keywords = [];

  var params = {
    ignoreStopWords: true,
    ignoreCase: true,
    ignorePunctuation: true
  };

  let concord = RiTa.concordance(str, params)

  for (var word in concord) {
    if (concord.hasOwnProperty(word)) {
      var tags = RiTa.getPosTags(word);
      // Using nn and nns for noun(s) and jj for adjectives
      if ( tags[0] == 'nn' ||
           tags[0] == 'nns' ||
           tags[0] == 'jj' ) {
        keywords.push(word);
      }
    }
  }

  // console.log(`Keywords: ${keywords}`)
  return keywords

}

function matchSearch(words) {

  // To store our matches
  var matches = []

  // For each of the words in the msg
  for (word of words) {
    // console.log(word);

    // Check the stats for tags
    for (var k of statistics.data) {
      let tags = k.tags;
      // console.log(word, tags);

      // Check each tag to see if it's a match with our word
      for (tag of tags) {

        // if it is a match, store the matched object in an array
        if (word == tag) {
        // console.log(k.text)

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
  let stats = statistics;

  // Find a random category
  let randCat = stats[Math.floor(Math.random() * stats.length)];
  // console.log(`Found a random category:\n>>> ${randCat.category}`)

  // Pull a random entry from a category
  let data = randCat.data;
  let randStat = data[Math.floor(Math.random() * data.length)]

  // And get the stat itself and the source
  let stat = randStat.text
  let source = randStat.source;

  console.log(`Found a random stat:\n>>> ${stat}`)
  console.log(`with source\n>>> ${source}`)

  return [stat, source]
}

// A Helper function
function random(array) {
  rand = array[Math.floor(Math.random() * array.length)]
  return rand
}
