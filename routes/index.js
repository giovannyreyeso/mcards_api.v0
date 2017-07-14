'use strict'
const config = require('../config')
const express = require('express')
const api = express.Router()
const auth = require('../middlewares/Auth')

const UserController = require('../controllers/UserController')
const CardController = require('../controllers/CardController')

api.get('/me', auth.isAuthorized, UserController.Me)
api.get('/card', auth.isAuthorized, CardController.List)
api.post('/card', auth.isAuthorized, CardController.Create)
//api.post('/register', auth.Register, UserController.Register)
module.exports = api
