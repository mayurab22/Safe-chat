const { Int32 } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const adminAccounts = new mongoose.Schema({
    ADID: {
        type: String,
        required: true,
    },
    ADname: {
        type: String,
        required: true,
    },
    ADProfilePic: {
        type: String,
        default:'temp_profile_pic',
    },
    ADPassword: {
        type: String,
        required: true,
    },
},
    {
        collection: 'adminAccounts' // Specify the collection name here
    });

module.exports = mongoose.model('Admin', adminAccounts);
