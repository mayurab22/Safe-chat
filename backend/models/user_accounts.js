const mongoose = require('mongoose');
const { Int32 } = require('bson');
require('mongoose-type-email');
// import mongoose from 'mongoose';
const { Schema } = mongoose;


const userAccounts = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:true,
    },
    phoneNumber: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required:true,
    },
    friendsCount: {
        type: Number,
        // required:true,
        default: 0
    },
    postCount: {
        type: Number,
        // required:true,
        default: 0
    },
    goodTexts: {
        type: Number,
        // required:true,
        default: 0
    },
    badTexts: {
        type: Number,
        // required:true,
        default: 0
    },
    avgScore: {
        type: Number,
        // required:true,
        default: 0
    },
    about: {
        type: String,
        // required:true,
    },
    profilePic: {
        type: String,
        // required:true,
        default: 'temp_profile_pic' // need to provide the path to a random picture for the temporary purpose
    },
    accountStatus: {
        type: Boolean,
        required:true,
        default: true
    }
},
    {
        collection: 'userAccounts' // Specify the collection name here
    });

module.exports = mongoose.model('User', userAccounts);