const { Int32 } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;
const mongooseSerial = require('mongoose-serial');

const publicPosts = new mongoose.Schema({
    PSTId: {
        type: String,
    },
    PSTName: {
        type: String,
        required: true,
    },
    PSTPic: {
        type: String,
        required: true,
    },
    PSTUname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    comments: [{
        commenterUname: { type: String },
        comment: { type: String },
    }],
},

    {
        collection: 'publicPosts' // Specify the collection name here
    });

    publicPosts.plugin(mongooseSerial, { field: "PSTId" });

module.exports = mongoose.model('Posts', publicPosts);
