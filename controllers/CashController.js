'use strict'
const Cash = require('../models/Cash')
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId

function Purchases(req, res) {
    console.log(req.params.id);
    Purchase.find({
        'cash': new ObjectId(req.params.id),
        'user': req.user._id
    }).then(function (purchases) {
        return res.status(200).json(purchases);
    })
}

function List(req, res) {
    Cash.find({
        'user': new ObjectId(req.user._id)
    }).then(function (cash) {
        return res.status(200).json(cash)
    }).then(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}

function GetById(req, res) {
    Cash.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (cash) {
        if (cash === null)
            throw new Error('El monto en efectivo no existe');
        return res.status(200).json(cash)
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}

function Delete(req, res) {
    Cash.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (cash) {
        if (cash === null)
            throw new Error('El monto en efectivo no existe');
        return Cash.deleteOne({ '_id': new ObjectId(req.params.id) })
    }).then(function () {
        return res.status(200).json({ statusCode: 200, message: 'Monto en efectivo eliminado correctamente' });
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}

function Modify(req, res) {
    Cash.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (cash) {
        if (cash === null)
            throw new Error('El monto en efectivo no existe');
        return cash;
    }).then(function (cash) {
        return Cash.update({ '_id': cash._id }, req.body);
    }).then(function (cashUpdated) {
        return Cash.findOne({
            '_id': new ObjectId(req.params.id)
        });
    }).then(function (cashUpdated) {
        return res.status(200).json(cashUpdated);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}

function Create(req, res) {
    const newCash = new Cash({
        user: req.user._id,
        description: req.body.description,
        aviable: req.body.aviable
    })
    newCash.save(function (err, cash) {
        if (err)
            return res.status(500).json({
                statusCode: 500,
                message: err.message
            })
        return res.status(200).json(cash)
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
