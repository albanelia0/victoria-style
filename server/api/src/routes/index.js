
const express = require('express')
const bodyParser = require('body-parser')
const logic = require('logic')
const jwt = require('jsonwebtoken')
const jwtValidation = require('./utils/jwt-validation')

const router = express.Router()
const { env: { TOKEN_SECRET, TOKEN_EXP } } = process
const jwtValidator = jwtValidation(TOKEN_SECRET)


router.post('/user', bodyParser.json(), (req, res) => {
  const { body: { name, surname, email, password } } = req

  logic.registerUser(name, surname, email, password)
    .then(() => {
      res.status(201)
      res.json({ status: 'OK' })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.patch('/user', [jwtValidator, bodyParser.json()], (req, res) => {
  const { body: { userId, name, surname, email, password, newEmail, newPassword } } = req

  logic.updateUser(userId, name, surname, email, password, newEmail, newPassword )
    .then(() => {
      res.status(200)
      res.json({ status: 'OK' })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.delete('/user', [jwtValidator, bodyParser.json()], (req, res) => {
  const { body: { userId, email, password } } = req
  logic.unregisterUser(userId, email, password)
    .then(() => {
      res.status(200)
      res.json({ status: 'OK' })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })

})

router.post('/auth', bodyParser.json(), (req, res) => {
  const { body: { email, password } } = req
  logic.authenticateUser(email, password)
    .then(id => {

      const token = jwt.sign({ id }, TOKEN_SECRET, { expiresIn: TOKEN_EXP })

      res.status(200)
      
      res.json({ status: 'OK', data: { id, token } })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.get('/booking/hours/:year/:month', (req, res) => {
  const { params: { year, month } } = req
   logic.getBookingHoursForYearMonth(year, month)
    .then((data) => {
      res.status(200)
      res.json({ status: 'OK', data })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
}),

  router.get('/booking/hours/:year/:month/:day', (req, res) => {
    const { params: { year, month, day } } = req
    
    logic.getBookingHoursForYearMonthDay(year, month, day)
      .then((data) => {
        res.status(200)
        res.json({ status: 'OK', data })
      })
      .catch(({ message }) => {
        res.status(400)
        res.json({ status: 'KO', error: message })
      })
  }),

  router.post('/booking', [jwtValidator, bodyParser.json()], (req, res) => {
    const { body: { userId, serviceIds, date } } = req

  logic.placeBooking(userId, serviceIds, date)
      .then((booking) => {
        res.status(201)
        res.json({ status: 'OK', data: booking })
      })
      .catch(({ message }) => {
        res.status(400)
        res.json({ status: 'KO', error: message })
      })
  })

router.get('/ownerId/:ownerId/booking', jwtValidator, (req, res) => {
  const { params: {ownerId} } = req

  logic.listBookings(ownerId)
    .then((booking) => {
      res.status(200)
      res.json({ status: 'OK', data: booking })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.get('/booking/user/:userId', jwtValidator, (req, res) => {
  const { params: { userId } } = req

  logic.listBookingsUser(userId)
    .then((booking) => {
      res.status(200)
      res.json({ status: 'OK', data: booking})
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.get('/services', (req, res) => {
  const { params: { userId } } = req

  logic.listServices()
    .then((services) => {
      res.status(200)
      res.json({ status: 'OK', data: services })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.delete('/booking/user/:bookingId/:userId', jwtValidator, (req, res) => {
    const { params: { bookingId, userId } } = req

    logic.deleteBooking(bookingId, userId)
      .then((booking) => {
        res.status(200)
        res.json({ status: 'OK', })
      })
      .catch(({ message }) => {
        res.status(400)
        res.json({ status: 'KO', error: message })
      })
  })


module.exports = router
