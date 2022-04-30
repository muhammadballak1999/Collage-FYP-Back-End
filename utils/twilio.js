const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function send_message(message, phone) {
await client.messages
  .create({
     body: message,
     from: '+19706477946',
     to: `+964${phone}`
   })
  .then(message => console.log(message.sid))
  .catch(err => {console.log(err)});
}

module.exports = { send_message }