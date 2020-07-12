# Start The Conversation
An interactive app to facilitate difficult conversations with those we love surrounding the racial justice movement.

First, let’s talk about why I made this app and what our goals are.  I’ve been having some difficult conversations with family members surrounding racial injustice in the US and the Black Lives Matter movement.  I have been met with denial, deflection or “what-about-ism”, and defensiveness.  It reminded me of the old adage, ”You can lead a horse to water, but you can’t make them drink.”  

My goal for this project is to see if we can make that horse thirsty.  
By sharing events or pieces of information that changed our minds or galvanized us towards a more just world, we can offer this same understanding to those we love.  This could also mean sharing a moving story, either our own or someone else’s, or sharing a compelling piece of data that plainly illustrates widespread injustice.

# Installation 
Via Terminal >>> Clone the repo, cd do the directory and do `npm install` to install the necessary dependencies.  

You can run this on a server that is exposed to the web or use `ngrok` to expose your local computer by doing `ngrok http 3001` and note the `Forwarding` address `http://************.ngrok.io/sms`. 

From the Twilio Dashboard on your web browser, look on the left hand side.  Click the `(...)` and then `Phone Numbers` and then `+1##########`.  Scroll down to `Message` and `"A Message Comes In"`.  For the `Webhook` field, paste the `ngrok` link that was provided when it launched.  If you're using a web server, then the link is simply `http://<your-server-IP-address>:3001/sms`

You must also change the `.env-example` file to simply `.env` and add the following variables accordingly:
```
ACCOUNT_SID='<from your Twilio Dashboard>'
AUTH_TOKEN='<from your Twilio Dashboard>'
ADMIN_NUMBER='<your own mobile number>'
TWILIO_NUMBER='<your working Twilio number>'
```
