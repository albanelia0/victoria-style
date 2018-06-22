'use strict'

const mongoose = require('mongoose')
const { Booking } = require('./schemas')

module.exports = mongoose.model('Booking', Booking)