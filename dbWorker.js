const { parentPort } = require('worker_threads');
const admin = require('firebase-admin');
var serviceAccount = require("./spidey-firebase-adminsdk.json");

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

let date = new Date();
let currDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

parentPort.once("message", (message) => {
    console.log('Received data from mainWorker..');
    db.collection('Rates').doc(currDate).set({
        rates: JSON.stringify(message)
    }).then(() => {
        parentPort.postMessage('Data saved successfulllly');
    }).catch(err => console.log(err))
});
