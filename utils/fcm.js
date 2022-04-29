const serviceAccount = require('../fcm-admin-credentials.json');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


var options = {
  priority: "high",
  timToLive: 100
}

async function send_notification(title, body, token) {
    var payload = {
        notification: {
        title,
        body
        }
    }
    admin.messaging().sendToDevice(token, payload, options)
    .then((response) => {
      console.log("SUCESSS: ", response)
    })
    .catch(err=> {
      console.log("ERROR: ", err)
    })
}

module.exports = { send_notification }