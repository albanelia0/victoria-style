'use strict'

/**
 * Creates demo services
 * 
 * @example
 * 
 * $ node demos/create-services.js
 */

require('dotenv').config()

const { mongoose, models: { User, Service, Booking } } = require('../')

const { env: { DB_URL } } = process

mongoose.connect(DB_URL)
    .then(() => {
        const serviceData = { serviceName: 'lavado de pelo', duration: 30, price: 10 }
        const serviceData1 = { serviceName: 'corte de pelo', duration: 60, price: 20 }
        const serviceData2 = { serviceName: 'trenzas pegadas', duration: 180, price: 100 }
        const serviceData3 = { serviceName: 'peinar', duration: 40, price: 20 }


        return Promise.all([
            User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
            Service.create(serviceData),
            Service.create(serviceData2)
        ])
            .then(() => mongoose.connection.close((() => console.log('done'))))
    })
