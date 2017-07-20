'use strict'
const Card = require('../models/Card')
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const CardService = require('../services/CardService')
const PurchaseService = require('../services/PurchaseService')
const DateService = require('../services/DateService')
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
    let card_obj = null;
    Card.findOne({ '_id': req.params.id }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        let actualCutDay = CardService.GetActualDayCutUnix(card.cutDay);
        let pastCutDay = CardService.GetPastDayCutUnix(card.cutDay);
        card_obj = card;
        return Purchase.find({
            'card': new ObjectId(card._id),
            'user': req.user._id,
            'date': { "$gte": pastCutDay, "$lt": actualCutDay }
        })
    }).then(function (purchases) {
        let purchasesData = {
            payDay: CardService.GetPayDayUnix(card_obj.cutDay),
            total: PurchaseService.SumPurchase(purchases),
            purchases: purchases
        }
        return res.status(200).json(purchasesData)
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function PurchasesNextMonth(req, res) {
    let card_obj = null;
    Card.findOne({ '_id': req.params.id }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        let actualCutDay = CardService.GetActualDayCutUnix(card.cutDay);
        let nextCutDay = CardService.GetNextDayCutUnix(card.cutDay);
        card_obj = card;
        return Purchase.find({
            'card': new ObjectId(card._id),
            'user': req.user._id,
            'date': { "$gte": actualCutDay, "$lt": nextCutDay }
        })
    }).then(function (purchases) {
        let purchasesData = {
            payDay: CardService.GetNextPayDay(card_obj.cutDay),
            total: PurchaseService.SumPurchase(purchases),
            purchases: purchases
        }
        return res.status(200).json(purchasesData)
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function SharedWith(req, res) {
    let date = req.params.date;
    if (!DateService.IsValidDate(date, 30)) {
        throw new Error("El link para compartir ha caducado");
    }
    Card.findOne({ '_id': req.params.id }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        return Card.update(
            { _id: req.params.id },
            { $push: { sharedWith: req.body.sharedWithUser } }
        );
    }).then(function (result) {
        return res.status(200).json(result);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function UndoShared(req, res) {
    Card.findOne({ '_id': req.params.id }).then(function (card) {
        if (card === null)
            throw new Error('La tarjeta no existe');
        card.sharedWith.pull(req.params.iduser)
        return card.save()
    }).then(function (result) {
        return res.status(200).json({ statusCode: 200, message: 'Ya no compartes esta tarjeta con este usuario' });
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function List(req, res) {
    let allCards = []
    let resultCards = []
    Card.find({
        'user': new ObjectId(req.user._id)
    }).then(function (cards) {
        allCards = allCards.concat(cards);
        return Card.find({ sharedWith: { "$in": [req.user._id] } });
    }).then(function (cards) {
        allCards = allCards.concat(cards);
        for (var i = 0; i < allCards.length; i++) {
            let available = 0;
            if (allCards[i].available >= 0) {
                available = allCards[i].available;
            }
            let isOwner = false;
            if (allCards[i].user.toString() == req.user._id.toString())
                isOwner = true;
            resultCards.push({
                _id: allCards[i]._id,
                name: allCards[i].name,
                isCreditCard: allCards[i].isCreditCard,
                limit: allCards[i].limit,
                balance: allCards[i].balance,
                available: available,
                cutDay: allCards[i].cutDay,
                nextCutDay: CardService.GetNextDayCutUnix(allCards[i].cutDay),
                owner: isOwner
            })
            /*cards[i].cutDay = */
        }
        return res.status(200).json(resultCards)
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
        if (card.user.toString() == req.user._id.toString())
            throw new Error('La tarjeta no te pertenece =(');
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
        limit: req.body.limit,
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
    PurchasesNextMonth,
    SharedWith,
    UndoShared
}
