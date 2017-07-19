'use strict'
const Card = require('../models/Card')
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const CardService = require('../services/CardService')
const PurchaseService = require('../services/PurchaseService')
/**TO DO
 * 1) Modificar la fecha de compra a Number para usar unix
 * 
****/
function Purchases(req, res) {
    Purchase.find({
        'card': req.params.id,
        'user': req.user._id
    }).then(function (purchases) {
        return res.status(200).json(purchases);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function PurchasesNow(req, res) {
    Card.findOne({ '_id': req.params.id }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        let actualCutDay = CardService.GetActualDayCut(card.cutDay);
        let pastCutDay = CardService.GetPastDayCut(card.cutDay);

        Purchase.find({
            'card': new ObjectId(card._id),
            'user': req.user._id,
            'date': { "$gte": pastCutDay._d, "$lt": actualCutDay._d }
        }).then(function (purchases) {
            let purchasesData = {
                payDay: CardService.GetPayDay(card.cutDay),
                total: PurchaseService.SumPurchase(purchases),
                purchases: purchases
            }
            return res.status(200).json(purchasesData)
        })
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function PurchasesNextMonth(req, res) {
    Card.findOne({ '_id': req.params.id }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        let actualCutDay = CardService.GetActualDayCut(card.cutDay);
        let nextCutDay = CardService.GetNextDayCut(card.cutDay);
        Purchase.find({
            'card': new ObjectId(card._id),
            'user': req.user._id,
            'date': { "$gte": actualCutDay._d, "$lt": nextCutDay._d }
        }).then(function (purchases) {
            let purchasesData = {
                payDay: CardService.GetNextPayDay(card.cutDay),
                total: PurchaseService.SumPurchase(purchases),
                purchases: purchases
            }
            return res.status(200).json(purchasesData)
        })
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function List(req, res) {
    Card.find({
        'user': new ObjectId(req.user._id)
    }).then(function (cards) {

        let allCards = []
        for (var i = 0; i < cards.length; i++) {
            let aviable = 0;
            if (cards[i].aviable >= 0) {
                aviable = cards[i].aviable;
            }
            allCards.push({
                _id: cards[i]._id,
                name: cards[i].name,
                isCreditCard: cards[i].isCreditCard,
                limit: cards[i].limit,
                balance: cards[i].balance,
                available: cards[i].available,
                cutDay: cards[i].cutDay,
                nextCutDay: CardService.GetNextDayCutUnix(cards[i].cutDay)
            })
            console.log(allCards[i].nextCutDay)
            /*cards[i].cutDay = */
        }
        return res.status(200).json(allCards)
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function GetById(req, res) {
    Card.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        return res.status(200).json(card)
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function Delete(req, res) {
    Card.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        return Card.deleteOne({ '_id': new ObjectId(req.params.id) })
    }).then(function () {
        return res.status(200).json({ statusCode: 200, message: 'Tarjeta eliminada correctamente' });
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function Modify(req, res) {
    Card.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        return card;
    }).then(function (card) {
        return Card.update({ '_id': card._id }, req.body);
    }).then(function (cardUpdated) {
        return Card.findOne({
            '_id': new ObjectId(req.params.id)
        });
    }).then(function (cardUpdated) {
        return res.status(200).json(cardUpdated);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function Create(req, res) {
    const newCard = new Card({
        user: req.user._id,
        name: req.body.name,
        available: req.body.available,
        cutDay: req.body.cutDay
    })
    newCard.save(function (err, card) {
        if (err)
            return res.status(500).json({
                statusCode: 500,
                message: err.message
            })
        let card_ = {
            _id: card._id,
            name: card.name,
            isCreditCard: card.isCreditCard,
            limit: card.limit,
            balance: card.balance,
            available: card.available,
            cutDay: card.cutDay,
            nextCutDay: CardService.GetNextDayCutUnix(card.cutDay)
        }
        return res.status(200).json(card_)
    })
}
module.exports = {
    List,
    Create,
    Modify,
    GetById,
    Delete,
    Purchases,
    PurchasesNow,
    PurchasesNextMonth
}
