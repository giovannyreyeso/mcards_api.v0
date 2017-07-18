'use strict'
const config = require('../config')
const express = require('express')
const api = express.Router()
const auth = require('../middlewares/Auth')

const UserController = require('../controllers/UserController')
const CardController = require('../controllers/CardController')
const CashController = require('../controllers/CashController')
const PurchaseController = require('../controllers/PurchaseController')
api.get('/me', auth.isAuthorized, UserController.Me)

/**BEGIN CARDS*/
api.get('/card/:id',auth.isAuthorized,CardController.GetById)
api.get('/card', auth.isAuthorized, CardController.List)
api.post('/card', auth.isAuthorized, CardController.Create)
api.put('/card/:id', auth.isAuthorized, CardController.Modify)
api.delete('/card/:id',auth.isAuthorized,CardController.Delete);
//api.get('/card/:id/movement',auth.isAuthorized,CashController.Movement);
/**END CARDS**/

/**BEGIN CASH*/
api.get('/cash/:id',auth.isAuthorized,CashController.GetById)
api.get('/cash', auth.isAuthorized, CashController.List)
api.post('/cash', auth.isAuthorized, CashController.Create)
api.put('/cash/:id', auth.isAuthorized, CashController.Modify)
api.delete('/cash/:id',auth.isAuthorized,CashController.Delete);
//api.get('/cash/:id/movement',auth.isAuthorized,CashController.Movement);
/**END CASH**/

/**BEGIN Purchase*/
api.get('/purchase/:id',auth.isAuthorized,PurchaseController.GetById)
api.get('/purchase', auth.isAuthorized, PurchaseController.List)
api.post('/purchase', auth.isAuthorized, PurchaseController.Create)
api.put('/purchase/:id', auth.isAuthorized, PurchaseController.Modify)
api.delete('/purchase/:id',auth.isAuthorized,PurchaseController.Delete);
/**END Purchase**/

/**BEGIN PURCHASE BY CARD*/
api.get('/cash/:id/purchase',auth.isAuthorized,CashController.Purchases)
api.get('/card/:id/purchase',auth.isAuthorized,CardController.Purchases)
//api.get('/card/:id/purchase/nextmonth',auth.isAuthorized,CardController.PurchasesNext)
//api.get('/card/:id/purchase/month',auth.isAuthorized,CardController.PurchasesNow)
/**END PURACHASE BY CARD**/

module.exports = api
