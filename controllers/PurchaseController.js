'use strict'
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')

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
    Purchase.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (purchase) {
        if (purchase === null)
            throw new Error('la compra no existe');
        return Purchase.deleteOne({ '_id': new ObjectId(req.params.id) })
    }).then(function () {
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
        category:req.body.category
    })
    if (req.body.card) {
        delete newPurchase.cash;
        newPurchase = new Purchase({
            user: req.user._id,
            description: req.body.description,
            date: req.body.date,
            total: req.body.total,
            card: req.body.card,
            category:req.body.category
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
module.exports = {
    List,
    Create,
    Modify,
    GetById,
    Delete
}
