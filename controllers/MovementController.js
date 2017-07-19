'use strict'
const Movement = require('../models/Purchase')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')

function List(req, res) {
    Movement.find({
        'user': new ObjectId(req.user._id)
    }).then(function (movement) {
        return res.status(200).json(movement)
    }).then(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function GetById(req, res) {
    Movement.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (movement) {
        if (movement === null)
            throw new Error('El movimiento no existe');
        return res.status(200).json(movement)
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function Delete(req, res) {
    Movement.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (movement) {
        if (movement === null)
            throw new Error('El movimiento no existe');
        return Movement.deleteOne({ '_id': new ObjectId(req.params.id) })
    }).then(function () {
        return res.status(200).json({ statusCode: 200, message: 'compra eliminada eliminado correctamente' });
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function Modify(req, res) {
    Movement.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (movement) {
        if (movement === null)
            throw new Error('El movimiento no existe');
        return movement;
    }).then(function (movement) {
        return Movement.update({ '_id': movement._id }, req.body);
    }).then(function (movementUpdated) {
        return Movement.findOne({
            '_id': new ObjectId(req.params.id)
        });
    }).then(function (movementUpdated) {
        return res.status(200).json(movementUpdated);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function Create(req, res) {
    let newMovement = new Movement({
        user: req.user._id,
        type: req.body.type,
        date: req.body.date,
        amount: req.body.amount,
        cash: req.body.cash
    })
    if (req.body.card) {
        delete newMovement.cash;
        newPurchase = new Movement({
            user: req.user._id,
            type: req.body.type,
            date: req.body.date,
            amount: req.body.amount,
            card: req.body.card
        })
    }
    newMovement.save(function (err, movement) {
        if (err)
            return res.status(500).json({
                statusCode: 500,
                message: err.message
            })
        return res.status(200).json(movement)
    })
}
function GetMovementByCard(req, res) {
    Movement.find({
        'user': new ObjectId(req.user._id),
        'cash': req.params.cash
    }).then(function (movement) {
        return res.status(200).json(movement)
    }).then(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
function GetMovementByCash(req, res) {
    Movement.find({
        'user': new ObjectId(req.user._id),
        'card': req.params.card
    }).then(function (movement) {
        return res.status(200).json(movement)
    }).then(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
module.exports = {
    List,
    Create,
    Modify,
    GetById,
    Delete,
    GetMovementByCard,
    GetMovementByCash
}
