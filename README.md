# conversation-starter
An interactive app to facilitate difficult conversations with family surrounding the racial justice movement.

Installation via Terminal >>> Clone the repo, cd do the directory and do `npm install` to install the necessary dependencies.  

You can run this on a server that is exposed to the web or use `ngrok` to expose your local computer by doing `ngrok http 3001` and note the `Forwarding` address `http://************.ngrok.io/sms`. 

From the Twilio Dashboard on your web browser, look on the left hand side.  Click the `(...)` and then `Phone Numbers` and then `+1##########`.  Scroll down to `Message` and `"A Message Comes In"`.  For the `Webhook` field, paste the `ngrok` link that was provided when it launched.  If you're using a web server, then the link is simply `http://<your-server-IP-address>:3001/sms`

You must also change the `.env-example` file to simply `.env` and add the following variables accordingly:
```
ACCOUNT_SID='<from your Twilio Dashboard>'
AUTH_TOKEN='<from your Twilio Dashboard>'
ADMIN_NUMBER='<your own mobile number>'
TWILIO_NUMBER='<your working Twilio number>'
```
