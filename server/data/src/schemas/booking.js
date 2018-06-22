'use strict'

const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    services: [{
        type: ObjectId,
        ref: 'Service'
    }],
    date: Date,
    endDate: Date,
    admin: {
        type: Boolean
    }
})