const routes = require('express').Router()

const paymentController = require('./controller/paymentsController')

routes
    .get('/list', paymentController.list)
    .post('/add', paymentController.add)
    .post('/del', paymentController.remove)
    .post('/update', paymentController.update)

module.exports = routes