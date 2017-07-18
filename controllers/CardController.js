'use strict'
const Card = require('../models/Card')
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const CardService = require('../services/CardService')

function Purchases(req, res) {

    Purchase.find({
        'card': new ObjectId(req.params.id),
        'user': req.user._id
    }).then(function (purchases) {
        return res.status(200).json(purchases);
    })
}
function List(req, res) {
    Card.find({
        'user': new ObjectId(req.user._id)
    }).then(function (cards) {
        let allCards = []
        for (var i = 0; i < cards.length; i++) {
            allCards.push({
                _id: cards[i]._id,
                name: cards[i].name,
                balance: cards[i].balance,
                aviable: cards[i].aviable,
                cutDay: cards[i].cutDay,
                nextCutDay: CardService.GetNextDayCut(cards[i].cutDay)
            })
            console.log(allCards[i].nextCutDay)
            /*cards[i].cutDay = */
        }
        return res.status(200).json(allCards)
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
        aviable: req.body.aviable,
        cutDay: req.body.cutDay
    })
    newCard.save(function (err, card) {
        if (err)
            return res.status(500).json({
                statusCode: 500,
                message: err.message
            })
        let card_ = {
            name: card.name,
            aviable: card.aviable,
            _id: card._id,
            cutDay: card.cutDay,
            nextCutDay: CardService.GetNextDayCut(card.cutDay)
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
    Purchases
}
