'use strict'

const { Schema } = require('mongoose')

module.exports = new Schema({
    serviceName: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})