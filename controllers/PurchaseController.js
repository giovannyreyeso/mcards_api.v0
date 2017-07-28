'use strict'
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const Cash = require('../models/Cash')
const Card = require('../models/Card')

function List(req, res) {
    Purchase.find({
        'user': new ObjectId(req.user._id)
    }).then(function (purchase) {
        return res.status(200).json(purchase)
    }).then(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function GetById(req, res) {
    Purchase.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (purchase) {
        if (purchase === null)
            throw new Error('la compra no existe');
        return res.status(200).json(purchase)
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function Delete(req, res) {
    let purchaseToDeleted;
    Purchase.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (purchase) {
        if (purchase === null)
            throw new Error('la compra no existe');
        purchaseToDeleted = purchase;
        return Purchase.deleteOne({ '_id': new ObjectId(req.params.id) })
    }).then(function () {
        updateAvailableAfterDelete(purchaseToDeleted);
        return res.status(200).json({ statusCode: 200, message: 'compra eliminada eliminado correctamente' });
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}

function Modify(req, res) {
    Purchase.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (purchase) {
        if (purchase === null)
            throw new Error('La compra no existe');
        return purchase;
    }).then(function (purchase) {
        return Purchase.update({ '_id': purchase._id }, req.body);
    }).then(function (purchaseUpdated) {
        return Purchase.findOne({
            '_id': new ObjectId(req.params.id)
        });
    }).then(function (purchaseUpdated) {
        return res.status(200).json(purchaseUpdated);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function Create(req, res) {
    let newPurchase = new Purchase({
        user: req.user._id,
        description: req.body.description,
        date: req.body.date,
        total: req.body.total,
        cash: req.body.cash,
        category: req.body.category
    })
    if (req.body.card) {
        delete newPurchase.cash;
        newPurchase = new Purchase({
            user: req.user._id,
            description: req.body.description,
            date: req.body.date,
            total: req.body.total,
            card: req.body.card,
            category: req.body.category
        })
    }
    newPurchase.save(function (err, purchase) {
        if (err)
            return res.status(500).json({
                statusCode: 500,
                message: err.message
            })
        return res.status(200).json(purchase)
    })
}

function updateAvailableAfterDelete(purchase) {
    const totalPurchase = purchase.total;
    if (purchase.cash) {
        Cash.findOne({ '_id': new ObjectId(purchase.cash) }).then(function (cash) {
            if (cash === null)
                throw new Error('El monto en efectivo no existe');
            const newAviable = cash.available + totalPurchase;
            Cash.update({ '_id': new ObjectId(cash._id) }, { 'available': newAviable });
        });
    } else {
        Card.findOne({ '_id': new ObjectId(purchase.card) }).then(function (card) {
            if (card === null)
                throw new Error('La tarjeta no existe');
            const newAviable = card.available + totalPurchase;
            const newBalance = card.balance - totalPurchase;
            Card.update({ '_id': new ObjectId(card._id) }, { 'available': newAviable, 'balance': newBalance });
        })
    }
}

module.exports = {
    List,
    Create,
    Modify,
    GetById,
    Delete
}
