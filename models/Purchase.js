const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Cash = require('../models/Cash')
const Card = require('../models/Card')
const ObjectId = require('mongoose').Types.ObjectId
const PurchaseSchema = Schema({
    description: {
        type: String,
    },
    date: {
        type: Number,
        required: true
    },
    msi: {
        type: Boolean,
        default: false
    },
    noMSI: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0,
        require: true
    },
    voucherPhoto: [{
        type: String
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cash: {
        type: Schema.Types.ObjectId,
        ref: 'Cash'
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }
}, {
        timestamps: true,
        versionKey: false
    })
PurchaseSchema.pre('save', function (next) {
    const totalPurchase = this.total;
    if (this.cash) {
        Cash.findOne({ '_id': new ObjectId(this.cash) }).then(function (cash) {
            if (cash === null)
                throw new Error('El monto en efectivo no existe');
            const newAviable = cash.available - totalPurchase;
            return Cash.update({ '_id': new ObjectId(cash._id) }, { 'available': newAviable });
        }).then(function (cash) {
            next();
        }).catch(function (err) {
            next(new Error(err));
        })
    } else {
        
        Card.findOne({ '_id': new ObjectId(this.card) }).then(function (card) {
            if (card === null)
                throw new Error('La tarjeta no existe');
            const newAviable = card.available - totalPurchase;
            const newBalance = card.balance + totalPurchase;
            return Card.update({ '_id': new ObjectId(card._id) }, { 'available': newAviable, 'balance': newBalance });
        }).then(function (card) {
            next();
        }).catch(function (err) {
            next(new Error(err));
        })
    }
});
PurchaseSchema.pre('find', function (next) {
    this.populate('category');
    next();
});
PurchaseSchema.pre('findOne', function (next) {
    this.populate('category');
    next();
});
module.exports = mongoose.model('Purchase', PurchaseSchema)
