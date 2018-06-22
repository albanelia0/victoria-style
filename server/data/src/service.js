'use strict'

const mongoose = require('mongoose')
const { Service } = require('./schemas')

module.exports = mongoose.model('Service', Service)