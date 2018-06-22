'use strict'


require('dotenv').config()

const { mongoose, models: { User, Service, Booking } } = require('data')
const { expect } = require('chai')
const logic = require('.')
const moment = require('moment')


const { env: { DB_URL } } = process

describe('logic (style-booking)', () => {
  const userData = { name: 'John', surname: 'Doe', email: 'jd@mail.com', password: '123' }
  const otherUserData = { name: 'Jack', surname: 'Wayne', email: 'jw@mail.com', password: '456' }
  const dummyUserId = '123456781234567812345678'
  const dummyNoteId = '123456781234567812345678'

  const serviceData = { serviceName: 'lavado de pelo', duration: 30, price: 10 }
  const serviceData1 = { serviceName: 'corte de pelo', duration: 60, price: 20 }
  const serviceData2 = { serviceName: 'trenzas pegadas', duration: 180, price: 100 }
  const serviceData3 = { serviceName: 'peinar', duration: 40, price: 20 }



  before(() => mongoose.connect(DB_URL))

  beforeEach(() => Promise.all([User.remove(), Service.deleteMany(), Booking.deleteMany()]))

  describe('register user', () => {

    describe('should succeed on correct dada', () => {

      it('should register', () =>
        logic.registerUser('John', 'Doe', 'jd@mail.com', '123')
          .then(res => expect(res).to.be.true)
      )
    })
    describe('should give error in the error data', () => {

      it('should fail on already registered user', () =>
        User.create(userData)
          .then(() => {
            const { name, surname, email, password } = userData

            return logic.registerUser(name, surname, email, password)
          })
          .catch(({ message }) => {
            expect(message).to.equal(`user with email ${userData.email} already exists`)
          })
      )

      it('should fail on no user name', () =>
        logic.registerUser()
          .catch(({ message }) => expect(message).to.equal('user name is not a string'))
      )

      it('should fail on empty user name', () =>
        logic.registerUser('')
          .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
      )

      it('should fail on blank user name', () =>
        logic.registerUser('     ')
          .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
      )

      it('should fail on no user surname', () =>
        logic.registerUser(userData.name)
          .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
      )

      it('should fail on empty user surname', () =>
        logic.registerUser(userData.name, '')
          .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
      )

      it('should fail on blank user surname', () =>
        logic.registerUser(userData.name, '     ')
          .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
      )

      it('should fail on no user email', () =>
        logic.registerUser(userData.name, userData.surname)
          .catch(({ message }) => expect(message).to.equal('user email is not a string'))
      )

      it('should fail on empty user email', () =>
        logic.registerUser(userData.name, userData.surname, '')
          .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
      )

      it('should fail on blank user email', () =>
        logic.registerUser(userData.name, userData.surname, '     ')
          .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
      )

      it('should fail on no user password', () =>
        logic.registerUser(userData.name, userData.surname, userData.email)
          .catch(({ message }) => expect(message).to.equal('user password is not a string'))
      )

      it('should fail on empty user password', () =>
        logic.registerUser(userData.name, userData.surname, userData.email, '')
          .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
      )

      it('should fail on blank user password', () =>
        logic.registerUser(userData.name, userData.surname, userData.email, '     ')
          .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
      )
    })
  })

  describe('unregister user', () => {
    it('should succeed on correct data', () =>
      User.create(userData)
        .then(({ id }) => {
          return logic.unregisterUser(id, 'jd@mail.com', '123')
            .then(res => {
              expect(res).to.be.true

              return User.findById(id)
            })
            .then(user => {
              expect(user).to.be.null
            })
        })
    )

    it('should fail on no user id', () =>
      logic.unregisterUser()
        .catch(({ message }) => expect(message).to.equal('userId is not a string'))
    )

    it('should fail on empty user id', () =>
      logic.unregisterUser('')
        .catch(({ message }) => expect(message).to.equal('userId is empty or blank'))
    )

    it('should fail on blank user id', () =>
      logic.unregisterUser('     ')
        .catch(({ message }) => expect(message).to.equal('userId is empty or blank'))
    )

    it('should fail on no user email', () =>
      logic.unregisterUser(dummyUserId)
        .catch(({ message }) => expect(message).to.equal('user email is not a string'))
    )

    it('should fail on empty user email', () =>
      logic.unregisterUser(dummyUserId, '')
        .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
    )

    it('should fail on blank user email', () =>
      logic.unregisterUser(dummyUserId, '     ')
        .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
    )

    it('should fail on no user password', () =>
      logic.unregisterUser(dummyUserId, userData.email)
        .catch(({ message }) => expect(message).to.equal('user password is not a string'))
    )

    it('should fail on empty user password', () =>
      logic.unregisterUser(dummyUserId, userData.email, '')
        .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
    )

    it('should fail on blank user password', () =>
      logic.unregisterUser(dummyUserId, userData.email, '     ')
        .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
    )
  })


  describe('authenticate user', () => {
    describe('should succeed on correct dada', () => {

      it('should succeed on correct data', () =>
        User.create(userData)
          .then(() =>
            logic.authenticateUser('jd@mail.com', '123')
              .then(id => expect(id).to.exist)
          )
      )
    })

    describe('should give error in the error data', () => {

      it('should fail on no user email', () =>
        logic.authenticateUser()
          .catch(({ message }) => expect(message).to.equal('user email is not a string'))
      )

      it('should fail on empty user email', () =>
        logic.authenticateUser('')
          .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
      )

      it('should fail on blank user email', () =>
        logic.authenticateUser('     ')
          .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
      )

      it('should fail on no user password', () =>
        logic.authenticateUser(userData.email)
          .catch(({ message }) => expect(message).to.equal('user password is not a string'))
      )

      it('should fail on empty user password', () =>
        logic.authenticateUser(userData.email, '')
          .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
      )

      it('should fail on blank user password', () =>
        logic.authenticateUser(userData.email, '     ')
          .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
      )
    })

  })

  describe('get Booking Hours For Year and Month', () => {
    it('should succeed on correct data', () =>
      Promise.all([
        User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
        Service.create(serviceData),
        Service.create(serviceData2)
      ])
        .then(res => {

          const [{ _doc: { _id: userId } }, { _doc: service1 }, { _doc: service2 }] = res


          // first booking data
          const date = new Date()
          const totalDuration = service1.duration + service2.duration
          const endDate = moment(date).add(totalDuration, 'minutes').toDate()

          // second booking data
          const date2 = moment().add(1, 'days').toDate()
          const totalDuration2 = service2.duration
          const endDate2 = moment("2018-6-12 00:00", "YYYY-MM-DD HH:mm Z").add(totalDuration2, 'minutes').toDate()

          return Promise.all([
            Booking.create({
              userId,
              services: [service1._id, service2._id],
              date,
              endDate
            }),
            Booking.create({
              userId,
              services: [service2._id],
              date: date2,
              endDate: endDate2
            }),
          ])
            .then(() => {
              return logic.getBookingHoursForYearMonth(2018, 6)
            })
            .then(res => {
              expect(res.length).to.equal(2)
              expect(res[1].day).to.equal(16)
              // expect(res[1].bookingHours).to.equal(3)
              expect(res[0].day).to.equal(15)
              expect(res[0].bookingHours).to.equal(3.5)
            })
        })
    )

    // describe('should give error in the error data', () => {
    //   it('should fail on no user id', () =>
    //     logic.getBookingHoursForYearMonthDay('', 6)
    //       .catch(({ message }) => expect(message).to.equal('year is not a number'))
    //   )

    //   it('should fail on empty user id', () =>
    //     logic.getBookingHoursForYearMonthDay(2018, '')
    //       .catch(({ message }) => expect(message).to.equal('month is not a number'))
    // )
    // })
})

describe('create a booking', () => {
  it('should succeed on correct data', () => {

    return Promise.all([
      User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
      Service.create(serviceData),
      Service.create(serviceData2)
    ])
      .then(_res => {
        debugger

        const date = new Date()
        const [{ _doc: { _id: userId } }, { _doc: service1 }, { _doc: service2 }] = _res

        return logic.placeBooking(userId, [service1._id, service2._id], date)
          .then(res => { 
            if (res != "unavailable") {
              debugger
              
              expect(res.bookingId).to.exist
              expect(res.services.length).to.equal(2)
              expect(res.date).to.exist
              expect(res.endDate).to.exist
            }
          })

      })

  })
})

describe('should list all Bookings', () => {
  it('should succeed on correct data', () => {
    return Promise.all([
      User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
      Service.create(serviceData),
      Service.create(serviceData2)
    ])
      .then(res => {
        const [{ _doc: { _id: userId } }, { _doc: service1 }, { _doc: service2 }] = res
        // first booking data
        const date = new Date()
        const totalDuration = service1.duration + service2.duration
        const endDate = moment(date).add(totalDuration, 'minutes').toDate()
        return Promise.all([
          Booking.create({
            userId,
            services: [service1._id, service2._id],
            date,
            endDate
          })
            .then(() => {
              return logic.listBookings()
                .then(res => {

                  expect(res[0].services.length).to.equal(2)
                  expect(res[0].userId).to.exist
                  expect(res[0].date).to.exist
                  expect(res[0].endDate).to.exist

                })
            })
        ])
      })
  })
})

describe('should list the Bookings of user', () => {
  it('should succeed on correct data', () => {
    return Promise.all([
      User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
      Service.create(serviceData),
      Service.create(serviceData2)
    ])
      .then(res => {
        const [{ _doc: { _id: userId } }, { _doc: service1 }, { _doc: service2 }] = res
        // first booking data
        const date = new Date()
        const totalDuration = service1.duration + service2.duration
        const endDate = moment(date).add(totalDuration, 'minutes').toDate()
        return Promise.all([
          Booking.create({
            userId,
            services: [service1._id, service2._id],
            date,
            endDate
          })
            .then(() => {

              return logic.listBookingsUser(userId)
                .then(res => {
                  expect(res[0].services.length).to.equal(2)
                  expect(res[0].userId).to.exist
                  expect(res[0].date).to.exist
                  expect(res[0].endDate).to.exist
                })
            })
        ])
      })
  })
})

describe('should delete the Bookings', () => {
  it('should succeed on correct data', () => {
    return Promise.all([
      User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
      Service.create(serviceData),
      Service.create(serviceData2)
    ])
      .then(res => {
        const [{ _doc: { _id: userId } }, { _doc: service1 }, { _doc: service2 }] = res
        // first booking data
        const date = new Date()
        const totalDuration = service1.duration + service2.duration
        const endDate = moment(date).add(totalDuration, 'minutes').toDate()
        return Promise.all([
          Booking.create({
            userId,
            services: [service1._id, service2._id],
            date,
            endDate
          })
            .then((res) => {
              const { _doc: booking } = res
              const userId = booking.userId
              const bookingId = booking._id

              return logic.deleteBooking(bookingId, userId)
                .then(result => {
                  return Booking.findById(bookingId).then((deletedBooking) => {

                    expect(deletedBooking).not.to.exist
                  })
                })
            })
        ])
      })
  })
})

describe('get Booking Hours For Year, Month and day', () => {
  it('should succeed on correct data', () =>
    Promise.all([
      User.create({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123' }),
      Service.create(serviceData),
      Service.create(serviceData2)
    ])
      .then(res => {

        const [{ _doc: { _id: userId } }, { _doc: service1 }, { _doc: service2 }] = res


        // first booking data
        const date = moment('2018-05-15 10:15').format()
        const totalDuration = service1.duration + service2.duration
        const endDate = moment(date).add(totalDuration, 'minutes').toDate()

        // second booking data
        const date2 = moment(date).add(3, 'hours').toDate()
        const totalDuration2 = service2.duration
        const endDate2 = moment(date2).add(totalDuration2, 'minutes').toDate()

        return Promise.all([
          Booking.create({
            userId,
            services: [service1._id, service2._id],
            date,
            endDate
          }),
          Booking.create({
            userId,
            services: [service2._id],
            date: date2,
            endDate: endDate2
          }),
        ])
          .then(() => {
            return logic.getBookingHoursForYearMonthDay(moment(date).year(), moment(date).month() + 1, moment(date).date())
          })
          .then(res => {
            expect(res.length).to.equal(2)
            expect(res[0].start).to.equal(10.25)
            expect(res[0].end).to.equal(13.75)
            expect(res[1].start).to.equal(13.25)
            expect(res[1].end).to.equal(16.25)
          })
      })
  )
  // describe('should give error in the error data', () => {
  //   it('should fail on no user id', () =>
  //     logic.getBookingHoursForYearMonthDay('', 6, 7)
  //       .catch(({ message }) => expect(message).to.equal('year is not a number'))
  //   )

  //   it('should fail on empty user id', () =>
  //     logic.getBookingHoursForYearMonthDay(2018, '', 7)
  //       .catch(({ message }) => expect(message).to.equal('month is not a number'))
  //   )
  //   it('should fail on empty user id', () =>
  //     logic.getBookingHoursForYearMonthDay(2018, 6, '7')
  //       .catch(({ message }) => expect(message).to.equal('day is not a number'))
  //   )
  // })
})

describe('List Services', () => {
  it('should succeed on correct data', () =>
    logic.listServices()
      .then(services => {

        expect(services.length).to.equal(16)
        expect(services[0].duration).to.equal(30)
        expect(services[1].price).to.equal(15)
        expect(services[2].duration).to.equal(60)
        expect(services[3].serviceName).to.equal('Corte de pelo')




      })

  )


})
after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})