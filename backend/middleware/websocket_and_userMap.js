//Importing required modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const router = express.Router();
const WebSocket = require('ws');

//defining a map for storing the connected clients to the web socket
const connectedClients = new Map();
const nameIPMap =  new Map();

//funciton to add the name and ip address of the client to the map
function addNameIP(name, ip) {
    nameIPMap.set(name, ip);
}
//function to get the ip address of the client
function getIP(name) {
    return nameIPMap.get(name);
}

//Function to add user to map  of connected users
function addUser(username, id) {
    connectedClients.set(username, id);
}

//Function to remove user from the map of connected users
function removeUser(id) {
    let keyToRemove;
    for (let [key, value] of connectedClients) {
        if (value === id) {
            keyToRemove = key;
        }
    }
    connectedClients.delete(keyToRemove);
}

//Function to get the list of connected user  names
function getUsersList() {
    return Array.from(connectedClients.keys());
}

//function to check weather a user is in the map
function isUserConnected(userName) {
    return connectedClients.has(userName);
}


// function for sending message to a specific client 
function sendMessageToClient(clientAddress, message) {
    const clientSocket = connectedClients.get(clientAddress);
    if (clientSocket) {
        // console.log("sending the websocket message to the client", message);
        clientSocket.send(JSON.stringify({text : message}));
    } else {
        console.log('Client not found:', clientAddress);
    }
}

// Broadcast a message to all connected clients
function broadcastMessage(message) {
    // console.log(connectedClients)
    connectedClients.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`);
        value.send(message);
    });
}

module.exports = {addUser, removeUser, getUsersList, isUserConnected, sendMessageToClient,broadcastMessage ,addNameIP, getIP};

//***********************     NOTE     ***********************

// sendMessageToClient('192.168.1.100', 'Hello, specific client!');
// broadcastMessage('Broadcasting to all clients!');
