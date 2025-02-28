const { Int32 } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const friends = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userFriends: [
        {
            name :{type: String},
            FUserName:{type: String},
            profilePicPAth:{type: String, default: 'temp_profile_pic'}
        }
    ],
},
    {
        collection: 'friends' // Specify the collection name here
    });

module.exports = mongoose.model('Friends', friends);
