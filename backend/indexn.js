//importing the required modules
const connectToMango = require("./middleware/db.js");
const censorVulgarity = require("./middleware/core.js");
const express = require('express');
var cors = require('cors')
const WebSocket = require('ws');
const app = express();
const port = 5010;
const path = require('path')
const https = require('https');
const fs = require('fs');
const User = require('./models/user_accounts.js');
const { addUser, removeUser, getUsersList, isUserConnected, sendMessageToClient, broadcastMessage, addNameIP, getIP } = require('./middleware/websocket_and_userMap.js');
//importing the websocket_and_useMap.js
// const { wss, useMap } = require('./middleware/websocket_and_useMap.js')
const apiKey = 'be0afa28b06c7e3e239fa7c6847ba084';
const text = 'i am good boy';
//caller for connecting to database
app.use(cors())
app.use(express.json());
connectToMango();

// routes section STATUS : DONE
const path1 = require('./routes/user_api.js');
app.use('/user', path1);

const path2 = require('./routes/admin_api.js');
app.use('/admin', path2);

const path3 = require('./routes/posts_api.js');
app.use('/posts', path3);

//serving websites STATUS : PENDING
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/adminSite', express.static(path.join(__dirname, 'publicA')));
app.use('/images', express.static(path.join(__dirname, 'uploads')))

//***********code to be erased once nwe websocket is tested begins here**********
//creation of a web socket server STATUS : PENDING
const wss = new WebSocket.Server({ port: 5006 });
// const connectedClients = new Map();
wss.on('connection', (socket) => {
    console.log('New client connected:', socket._socket.remoteAddress);
    // connectedClients.set(socket._socket.remoteAddress, socket);
    addUser(socket._socket.remoteAddress, socket)

    // Handle messages, events, etc.
    socket.on('message', (message) => {
        // console.log('Received message:', message);
        const decoded = JSON.parse(message);
        const sender = decoded.author;
        const senderMail = decoded.mail;
        const messageText = decoded.message;
        // console.log(sender, messageText);

        // Assuming `apiKey` is defined somewhere in your code
        censorVulgarity(messageText)
            .then(censoredText => {
                // console.log('Censored message:', censoredText);
                const newMessage = {
                    author: sender, // Replace with the user's name or ID
                    message: censoredText
                };
                broadcastMessage(JSON.stringify(newMessage));
            })
            .catch(error => {
                console.error('Error censoring message:', error);
            });
    });
    // Event handler when a client disconnects
    socket.on('close', () => {
        console.log('Client disconnected:', socket._socket.remoteAddress);
        // Remove the client from the Map
        removeUser(socket._socket.remoteAddress);
    });
});

wss.on('listening', () => {
    console.log('WebSocket server listening on port 8080');
});

// const options = {
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// };

// const server = https.createServer(options, app);

// receiving the requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// const server = https.createServer(options, app).listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });


//***********code to be erased once nwe websocket is tested ends here**********

