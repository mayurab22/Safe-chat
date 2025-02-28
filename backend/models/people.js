const { Int32 } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const people = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
},
    {
        collection: 'people' // Specify the collection name here
    });

module.exports = mongoose.model('people', people);
