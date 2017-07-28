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

PurchaseSchema.pre('find', function (next) {
    this.populate('category');
    next();
});
PurchaseSchema.pre('findOne', function (next) {
    this.populate('category');
    next();
});
module.exports = mongoose.model('Purchase', PurchaseSchema)
