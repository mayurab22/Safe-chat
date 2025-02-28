const { Int32 } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const reports = new mongoose.Schema({
    RPTUname: {
        type: String,
        required: true,
    },
    commentID: {
        type: Number,
        required: true,
    },
    PSTId: {
        type: Number,
        required: true,
    },
    reportDetails: {
        type: String,
        required: true,
    },
},
    {
        collection: 'reports' // Specify the collection name here
    });

module.exports = mongoose.model('reports', reports);
