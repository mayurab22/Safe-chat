const { Int32 } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const requests = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    FRequests: [
        {
            name: { type: String },
            RUserName:{type: String},
            profilePicPAth:{type: String, default: 'temp_profile_pic'}
        }
    ],
},
    {
        collection: 'requests' // Specify the collection name here
    });

module.exports = mongoose.model('Requests', requests);
