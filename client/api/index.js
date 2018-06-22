
'use strict'

const axios = require('axios')

/**
 * Style Booking logic
 */
const logic = {

  url: 'NO-URL',

  token: 'NO-TOKEN',

  /**
     * 
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

        return axios.post(`${this.url}/user`, { name, surname, email, password })
          .then(({ status, data }) => {
            if (status !== 201 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return true
          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err
          })
      })
  },
  /**
   *
   *  Should update user
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
        if (typeof id !== 'string') throw Error('userId is not a string')

        if (!(id = id.trim()).length) throw Error('userId is empty or blank')

        if (typeof name !== 'string') throw Error('user name is not a string')

        if (!(name = name.trim()).length) throw Error('user name is empty or blank')

        if (typeof surname !== 'string') throw Error('user surname is not a string')

        if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return axios.patch(`${this.url}/user`, { id, name, surname, email, password, newEmail, newPassword }, {headers: { authorization: 'Bearer ' + _this3.token }} )
          .then(({ status, data }) => {
            if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return data.data
          }).catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

          })
      })
  },

  /**
   * 
   * Should unregister user
   * 
   * @param {String} id
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

        return axios.delete(`${this.url}/user`, { headers: { authorization: `Bearer ${this.token}` }, data: { userId, email, password } })
          .then(({ status, data }) => {
            if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return true
          }).catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

          })
      })

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

        return axios.post(`${this.url}/auth`, { email, password })
          .then(({ status, data }) => {
            if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)
            const { data: { id, token } } = data

            this.token = token

            return { id, token }
          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

          })
      })
  },
  /**
   * Should declare token
   * 
   * @param {String} token 
   */
  setToken(token){
    this.token = token
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
        // if (typeof month !== 'number') throw Error('month is not a number')

        return axios.get(`${this.url}/booking/hours/${year}/${month}`, {headers: { authorization: `Bearer ${this.token}` }})
          .then(({ status, data }) => {
            if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return data.data

          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

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
   */
  getBookingHoursForYearMonthDay(year, month, day) { // yyyy-MM-dd
    return Promise.resolve()
      .then(() => {

        // if (typeof year !== 'number') throw Error('year is not a number')
        // if (typeof month !== 'number') throw Error('month is not a number')
        // if (typeof day !== 'number') throw Error('day is not a number')
        
        return axios.get(`${this.url}/booking/hours/${year}/${month}/${day}`, { headers: { authorization: `Bearer ${this.token}` }})
          .then(({ status, data }) => {
            if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return data.data

          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

          })
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
        return axios.post(`${this.url}/booking`, { userId, serviceIds, date }, { headers: { authorization: `Bearer ${this.token}` } })
          .then(({ status, data }) => {
            if (status !== 201 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return data.data

          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

          })
      })
  },

  /**
   * This function should list the bookings of user
   * @returns {Promise<Data>}
   */
  listBookingsUser(userId) {
    return Promise.resolve()
      .then(() => {
        return axios.get(`${this.url}/booking/user/${userId}`, { headers: { authorization: `Bearer ${this.token}` }})
          .then(({ status, data }) => {
            if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return data.data

          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

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
        return axios.delete(`${this.url}/booking/user/${bookingId}/${userId}`, { headers: { authorization: `Bearer ${this.token}` }})
          .then(({ status, data }) => {
            if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return true
          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

          })

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
  listServices(){
    return Promise.resolve()
      .then(() => {
        return axios.get(`${this.url}/services`)
          .then(({status, data}) => {
            if (status !== 200 && data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

            return data.data
          })
          .catch(err => {
            if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

            if (err.response) {
              const { response: { data: { error: message } } } = err

              throw Error(message)
            } else throw err

          })
      })
  }
}
module.exports = logic
