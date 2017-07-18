const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CardSchema = Schema({
    name: {
        type: String,
        required: true
    },
    isCreditCard: {
        type: Boolean,
        default: true
    },
    cutDay: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    limit: {
        type: Number,
        default: 0
    },
    aviable: {
        type: Number,
        default: 0
    },
    cat: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchases: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Purchase'
        }
    ]
}, {
        timestamps: true,
        versionKey: false
    })
module.exports = mongoose.model('Card', CardSchema)
