'use strict'

/**
 * Creates demo bookings
 * 
 * @example
 * 
 * $ node demos/create-bookings.js
 */

require('dotenv').config()

const { mongoose, models: { User, Service, Booking } } = require('../')
const moment = require('moment')

const { env: { DB_URL } } = process

mongoose.connect(DB_URL)
    .then(() => {
        const serviceData = { serviceName: 'lavado de pelo', duration: 30, price: 15 }
        const serviceData2 = { serviceName: 'corte de pelo', duration: 60, price: 45 }
        const serviceData3 = { serviceName: 'trenzas completa', duration: 45, price: 60 }
        

        return Promise.all([
            User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
            Service.create(serviceData),
            Service.create(serviceData2),
            Service.create(serviceData3)
        ])
            .then(res => {
                const [{ _doc: { _id: userId } }, { _doc: service1 }, { _doc: service2 }, { _doc: service3 }] = res

                // first booking data
                const date = moment("2018-06-24 10:00").format()
                const totalDuration = service1.duration
                const endDate = moment(date).add(totalDuration, 'minutes').toDate()

                // second booking data
                const date2 = moment().add(1, 'days').toDate()
                const date3 = moment().add(7, 'days').toDate()
                const date4 = moment().add(11, 'days').toDate()
                
                
                const totalDuration2 = service1.duration + service2.duration
                const endDate2 = moment(date2).add(totalDuration2, 'minutes').toDate()
                const endDate3 = moment(date3).add(totalDuration2, 'minutes').toDate()
                const endDate4 = moment(date4).add(totalDuration2, 'minutes').toDate()
                

                return Promise.all([
                    Booking.create({
                        userId,
                        services: [service1._id],
                        date,
                        endDate
                    }),
                    Booking.create({
                        userId,
                        services: [service1._id],
                        date: date2,
                        endDate: endDate2
                    }),
                    Booking.create({
                        userId,
                        services: [service2._id],
                        date: date3,
                        endDate: endDate3
                    }),
                    Booking.create({
                        userId,
                        services: [service1._id, service2._id, service3._id],
                        date: date4,
                        endDate: endDate4
                    }),
                ])
            })
            .then(() => mongoose.connection.close((() => console.log('done'))))
    })
