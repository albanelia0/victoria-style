
'use strict'

const { models: { User, Booking, Service } } = require('data')
const moment = require('moment')

/**
 * Style Booking logic
 */
const logic = {

  /**
   * Should register user
   *
   * @param {string} name
   * @param {string} surname
   * @param {string} email
   * @param {string} password
   *
   * @returns {Promise<boolean>}
   */
  registerUser(name, surname, email, password) {
    return Promise.resolve()
      .then(() => {
        if (typeof name !== 'string') throw Error('user name is not a string')

        if (!(name = name.trim()).length) throw Error('user name is empty or blank')

        if (typeof surname !== 'string') throw Error('user surname is not a string')

        if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email })
          .then((user) => {

            if (user) throw Error(`user with email ${email} already exists`)

            return User.create({ name, surname, email, password })
              .then(() => true)
          })
      })

  },
  /**
     *
     * Should update user
     * 
     * @param {string} id
     * @param {string} name
     * @param {string} surname
     * @param {string} email
     * @param {string} password
     * @param {string} newEmail
     * @param {string} newPassword
     *
     * @returns {Promise<boolean>}
     */
  updateUser(id, name, surname, email, password, newEmail, newPassword) {
    return Promise.resolve()
      .then(() => {
        if (typeof id !== 'string') throw Error('user id is not a string')

        if (!(id = id.trim()).length) throw Error('user id is empty or blank')

        if (typeof name !== 'string') throw Error('user name is not a string')

        if (!(name = name.trim()).length) throw Error('user name is empty or blank')

        if (typeof surname !== 'string') throw Error('user surname is not a string')

        if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email, password })
      })
      .then(user => {
        if (!user) throw Error('wrong credentials')

        if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

        if (newEmail) {
          return User.findOne({ email: newEmail })
            .then(_user => {
              if (_user && _user.id !== id) throw Error(`user with email ${newEmail} already exists`)

              return user
            })
        }

        return user
      })
      .then(user => {
        user.name = name
        user.surname = surname
        user.email = newEmail ? newEmail : email
        user.password = newPassword ? newPassword : password

        return user.save()
      })
      .then(() => true)
  },

  /**
   * 
   * Should unregister user
   * 
   * @param {String} userId
   * @param {String} email
   * @param {String} password
   * 
   * @returns {Promise<boolean>}
   *
   */
  unregisterUser(userId, email, password) {
    return Promise.resolve()
      .then(() => {
        if (typeof userId !== 'string') throw Error('userId is not a string')

        if (!(userId = userId.trim()).length) throw Error('userId is empty or blank')

        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email, password })
      })
      .then(user => {
        if (!user) throw Error('wrong credentials')

        if (user.id !== userId) throw Error(`no user found with id ${userId} for given credentials`)

        return user.remove()
      })
      .then(() => true)
  },

  /**
     *
     * Should authenticate user
     * 
     * @param {string} email
     * @param {string} password
     *
     * @returns {Promise<String>}
     */
  authenticateUser(email, password) {
    return Promise.resolve()
      .then(() => {
        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email, password })
      })
      .then(user => {
        if (!user) throw Error('wrong credentials')

        return user.id
      })
  },
  /**
   * Returns the booking hours (on existing days) for a given year and month
   *
   * @example
   *  logic.getBookingHoursByYearMonth(2018, 6)
   *    .then(bookingHours => bookingHours.forEach(console.log))
   * // output
   * { day: 5, bookingHours: 6 }
   * { day: 11, bookingHours: 3 }
   * { day: 25, bookingHours: 7 }
   * { day: 30, bookingHours: 2.5 }
   *
   * @param {Number} year
   * @param {Number} month
   *
   * @returns {Promise<[{day<Number>, bookingHours<Number>}]>}
   */
  getBookingHoursForYearMonth(year, month) {
    return Promise.resolve()
      .then(() => {

        // if (typeof year !== 'number') throw Error('year is not a number')

        // if (typeof month !== 'number') throw Error('month email is not a number')

        const monthStart = moment(`${year}-${month}-01`, 'YYYY-MM-DD')
        const monthEnd = moment(monthStart).add(1, 'M')
        const monthDays = monthEnd.diff(monthStart, 'days')
        return Booking.find({
          $and: [
            { "date": { $gte: monthStart } },
            { "date": { $lt: monthEnd } }
          ]
        })
          .then(bookings => {
            if (bookings.length) {
              const bookingHours = bookings.reduce((accum, booking) => {
                const { date, endDate } = booking
                const dayOfMonth = date.getDate()

                // calculate the duration of booking in hours
                const diff = moment(endDate).diff(date)
                const duration = moment.duration(diff).asHours()

                // add hours of this booking to the accum object's date key
                if (!accum[dayOfMonth]) accum[dayOfMonth] = 0
                accum[dayOfMonth] += duration

                return accum
              }, {})

              return Object.keys(bookingHours).map(key => ({ day: parseInt(key), bookingHours: bookingHours[key] }))
            } else return []
          })
      })
  },

  /**
   * Returns the booking hours for a given year, month, day
   *
   * @example
   *  logic.getBookingHoursForYearMonthDay(2018, 10, 1)
   *    .then(bookingHours => bookingHours.forEach(console.log))
   * // output
   * { start: 9, end: 10.5 }
   * { start: 12.5, end: 13.5 }
   * { start: 15.25, end: 16 }
   *
   * @param {Number} year
   * @param {Number} month
   * @param {Number} day
   * 
   * @returns {Promise<[{start<Number>, end<Number>}]>}
   */
  getBookingHoursForYearMonthDay(year, month, day) { // yyyy-MM-dd
    return Promise.resolve()
      .then(() => {
        const dayStart = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD')
        const dayEnd = moment(dayStart).add(1, 'days')
        return Booking.find({
          $and: [
            { "date": { $gte: dayStart } },
            { "date": { $lt: dayEnd } }
          ]
        })
          .then(bookings => {
            return bookings.map(booking => {
              const startHour = moment(booking.date).hour() + (moment(booking.date).minutes() / 60)
              const endHour = moment(booking.endDate).hour() + (moment(booking.endDate).minutes() / 60)
              return { "start": startHour, "end": endHour }
            })
          });
      })
  },
  /**
   * This function should create a booking
   * 
   * @param {object} userId
   * @param {Array} serviceIds
   * @param {Date} date
   *
   * @example
   * 
   *  Should return something like this = 
   * 
   * const data = [
   *    {
   * "bookingId": "5b2660ab250e08c950cd6126",
   * "servicesId": [5b2660ab250e08c950cd6139,5b2660ab250e08c950cd6178],
   * "userId": "5b266067250e08c950cd6114",
   * "date": "2018-06-02T09:45:00.000Z",
   * "endDate": "2018-06-02T10:25:00.000Z"
   * }
   * ]
   * @returns {Promise<Booking>}
   */
  placeBooking(userId, serviceIds, date) {
    return Promise.resolve()
      .then(() => {
        //TODO VALIDATIONS
        // - Comprobar que la hora de inicio de la reserva no sea menor al inicio de jornada
        //   o mayor al fin de jornada (tirar un error en ese caso)

        let totalDuration = 0

        if (serviceIds.length <= 0) throw Error("The service is not selected!")

        return Promise.all(serviceIds.map(serviceId => {
          return Service.findById(serviceId)
            .then(res => {

              const { _doc: { duration } } = res
              totalDuration += duration
            })
        }))
          .then(() => {
            // .tz("Europe/Madrid")
            const endDate = moment(date).add(totalDuration, 'minutes').toDate()
            return Booking.find({
              $or: [
                {
                  $and: [
                    { "date": { $lte: date } },
                    { "endDate": { $gte: endDate } }
                  ]
                },
                {
                  $and: [
                    { "date": { $gte: date } },
                    { "date": { $lt: endDate } }
                  ]
                },
                {
                  $and: [
                    { "endDate": { $gt: date } },
                    { "endDate": { $lte: endDate } }
                  ]
                },
              ]

            })
              .then(res => {
                if (res.length !== 0) {
                  const hourFull = "unavailable"
                  return hourFull
                } else {
                  return Booking.create({
                    userId,
                    services: serviceIds,
                    date,
                    endDate
                  }).then(res => {
                    const { _doc: { services, _id, userId, date, endDate } } = res
                    const data = {
                      bookingId: _id,
                      services: services.map(s => s._id),
                      userId,
                      date,
                      endDate
                    }
                    return data
                  })
                }
              })
          })
      })
  },
  /**
   * This function should list all bookings
   * @param {String} ownerId
   * @returns {Promise<Booking>}
   */
  listBookings(ownerId) {
    return Promise.resolve()
      .then(() => {
        // terminar de implementar
        return Booking.find()
          .then(res => {
            return res.map((obj) => {
              const { _id, services, userId, date, endDate } = obj
              const data = {
                bookingId: _id,
                services: services.map(s => s._id),
                userId: userId,
                date: date,
                endDate: endDate
              }
              return data
            })
          })
      })
  },

  /**
   * This function should list the bookings of user
   * 
   * @example
   *
   * Should return something like this =
   *
   * const data = [
   *    {
   * "bookingId": "5b2660ab250e08c950cd6126",
   * "services": [
   * {
   * "serviceName": "Baño de brillo",
   * "duration": 40,
   * "price": 16
   * }
   * ],
   * "userId": "5b266067250e08c950cd6114",
   * "date": "2018-06-02T09:45:00.000Z",
   * "endDate": "2018-06-02T10:25:00.000Z"
   * },...
   * ]
   * @returns {Promise<Booking>}
   */
  listBookingsUser(userId) {
    return Promise.resolve()
      .then(() => {
        if (!userId) throw Error('userId is empty or blank')

        return Booking.find({ userId })
          .populate('services')
          .exec()
          .then(result => {
            return result.map(obj => {
              const { _id, services, userId, date, endDate } = obj
              const data = {
                bookingId: _id,
                services: services.map(s => {
                  const { _doc: { serviceName, duration, price } } = s
                  const dataService = { serviceName, duration, price }
                  debugger
                  return dataService
                }),
                userId: userId,
                date: date,
                endDate: endDate
              }
              return data
            })
          })
      })
  },

  /**
   * @param {String} bookingId
   * @param {String} userId
   *
   * @returns {Promise<boolean>}
   */
  deleteBooking(bookingId, userId) {
    return Promise.resolve()
      .then(() => {
        // if (!userId) throw Error('userId is empty or blank')

        // if (!bookingId) throw Error('userId is empty or blank')

        // if (!(userId instanceof Object)) throw Error('userId is not a object')

        // if (!(bookingId instanceof Object)) throw Error('bookingId is not a object')
        return Booking.findOne({ _id: bookingId, userId })
          .then((booking) => {
            // if (!user) throw Error(`no user found with id ${userId}`)
            const id = booking._id
            return Booking.remove({ _id: id })
              .then(() => true)
          })

      })

  },

  /**
   * @param {String} bookingId
   * @param {String} service
   * @param {String} Date
   * 
   *
   * @returns {Promise<boolean>}
   */
  updateBooking(bookingId, service, Date) {

    return Promise.resolve()
      .then(() => {

        //TODO VALIDATIONS

        if (newEmail) {
          return User.findOne({ email: newEmail })
            .then(_user => {
              if (_user && _user.id !== id) throw Error(`user with email ${newEmail} already exists`)

              return user
            })
        }

        return user

          .then(user => {
            user.name = name
            user.surname = surname
            user.email = newEmail ? newEmail : email
            user.password = newPassword ? newPassword : password

            return user.save()
          })
          .then(() => true)

      })
  },
  /**
   * This function should list all services
   * @example
   * 
   * Should return something like this =
   * 
   * const data = [
   * {
   * serviceId: 5b2bbe3efe862e1abd22858d,
   * serviceName: Lavado de pelo,
   * duration: 30,
   * price: 15
   * }
   * ]
   * @returns {Promise<Service>}
   */
  listServices() {
    return Promise.resolve()
      .then(() => {
        const serviceData = { serviceName: 'Lavado de pelo', duration: 30, price: 15 }
        const serviceData1 = { serviceName: 'Secado', duration: 40, price: 15 }
        const serviceData2 = { serviceName: 'Lavado + Secado', duration: 60, price: 25 }
        const serviceData3 = { serviceName: 'Corte de pelo', duration: 30, price: 15 }
        const serviceData4 = { serviceName: 'Pack Lavar + Cortar + Secar', duration: 100, price: 50 }
        const serviceData5 = { serviceName: 'Trenzas pegadas', duration: 180, price: 100 }
        const serviceData6 = { serviceName: 'Peinado', duration: 40, price: 20 }
        const serviceData7 = { serviceName: 'Cambio de color', duration: 60, price: 15 }
        const serviceData8 = { serviceName: 'Baño de brillo', duration: 40, price: 16 }
        const serviceData9 = { serviceName: 'Mechas degradadas', duration: 80, price: 45 }
        const serviceData0 = { serviceName: 'Extensiones', duration: 120, price: 150 }
        const serviceData11 = { serviceName: 'Semirrecogido', duration: 35, price: 37 }
        const serviceData10 = { serviceName: 'Peinado Novia', duration: 80, price: 50 }
        const serviceData011 = { serviceName: 'Tratamiento anti-caída', duration: 60, price: 25 }
        const serviceData111 = { serviceName: 'Manicura express', duration: 35, price: 15 }
        const serviceData110 = { serviceName: 'Pedicura Vinylux', duration: 60, price: 35 }

        return Promise.all([
          Service.create(serviceData),
          Service.create(serviceData1),
          Service.create(serviceData2),
          Service.create(serviceData3),
          Service.create(serviceData4),
          Service.create(serviceData5),
          Service.create(serviceData6),
          Service.create(serviceData7),
          Service.create(serviceData8),
          Service.create(serviceData9),
          Service.create(serviceData0),
          Service.create(serviceData11),
          Service.create(serviceData10),
          Service.create(serviceData011),
          Service.create(serviceData111),
          Service.create(serviceData110)
        ]).then(res => {

          return res.map(res => {
            // const [{ _doc }] = res
            const data = {
              serviceId: res._doc._id,
              serviceName: res._doc.serviceName,
              duration: res._doc.duration,
              price: res._doc.price
            }
            return data
          })

        })
      })
  }




}
module.exports = logic
