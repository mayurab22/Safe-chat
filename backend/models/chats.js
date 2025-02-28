const { Int32 } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const chats = new mongoose.Schema({
        userName: {
            type: String,
            required: true
        },
        message: [
            {
                friendName: {
                    type: String,
                },
                chats:[
                    {
                        direction : {
                            type: Boolean,
                        },
                        message:{
                            type: String,
                        }
                    }
                ]
            }
        ]

    },
    {
        collection: 'chat' // Specify the collection name here
    });

module.exports = mongoose.model('Chats', chats);
