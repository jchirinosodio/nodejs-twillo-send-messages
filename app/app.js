// READ FROM A .ENV file to register env variables
require('dotenv').config()

const fs = require('fs');
const { setTimeout } = require('timers/promises');
const { CompositionPage } = require('twilio/lib/rest/video/v1/composition');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const jsonData = JSON.parse(fs.readFileSync('peopleToTalk.json', 'utf8'));



// *** - Execute message sending - ***
sendMessages();



async function sendMessages() {
    // *** - For each person inside peopleToTalk.json file take out the number property and use it to send messages
    for (let index = 0; index < jsonData.length; index++) {
        const intervalBetweenMessages = 1000;
        const element = jsonData[index];
        // Await 1 second between each iteration to avoid issues due many requests
        await setTimeout(intervalBetweenMessages * index);
        if (element.number) {
            await client.messages
                .create({
                    messagingServiceSid: process.env.MESSAGING_SERVICE_ID,
                    body: process.env.BODY_MESSAGE,
                    to: element.number
                })
                .then(message => {
                    console.log(message.sid);
                })
                .catch(e => { console.error('Got an error:', e.code, e.message) })
                .done();
        }
    }
}