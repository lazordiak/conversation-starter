# conversation-starter
An interactive app to facilitate difficult conversations with family surrounding the racial justice movement.

Clone the repo, cd to the directory and do `npm install` to install the necessary dependencies.  

You'll either need to run this on a server that is exposed to the web or use `ngrok` to expose your local computer.  Note the `Forwarding` address before the `->`. 

If using `ngrok`, log in to the Twilio Dashboard on your browser and look on the left hand side.  Click the `(...)` and click `Phone Numbers` and then click your number `+1##########`.  Scroll down to `Message` and `"A Message Comes In"` and in `Webhook` paste the `ngrok` link that is provided in your terminal terminal `http://************.ngrok.io/sms`  If you're using a web server, then the link is simply `http://<your-server-IP-address>:3001/sms`

You must also change the `.env-example` file to simply `.env` and add the following variables accordingly:
```
ACCOUNT_SID='<from your Twilio Dashboard>'
AUTH_TOKEN='<from your Twilio Dashboard>'
ADMIN_NUMBER='<your own mobile number>'
TWILIO_NUMBER='<your working Twilio number>'
```
