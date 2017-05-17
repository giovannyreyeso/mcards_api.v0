const Card = require('../models/Card')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const CardService = require('../services/CardService')

function List(req, res) {
    Card.find({
        'user': new ObjectId(req.user._id)
    }).then(function(cards) {

        let allCards = []
        for (var i = 0; i < cards.length; i++) {
            allCards.push({
                name: cards[i].name,
                aviable: cards[i].aviable,
                _id: cards[i]._id,
                cutDay: cards[i].cutDay,
                nextCutDay: CardService.GetNextDayCut(cards[i].cutDay)
            })
            console.log(allCards[i].nextCutDay)
            /*cards[i].cutDay = */
        }
        return res.status(200).json(allCards)
    })
}

function Create(req, res) {
    const newCard = new Card({
        user: req.user._id,
        name: req.body.name,
        aviable: req.body.aviable,
        cutDay: req.body.cutDay
    })
    newCard.save(function(err, card) {
        if (err)
            return res.status(500).json(err)
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
    Create
}
