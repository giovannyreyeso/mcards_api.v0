const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = Schema({
    uid: String,
    name: String,
    email: String,
    picture: String,
    moneda: {
        type: String,
        enum: ['MXN', 'USD'],
        default: 'MXN'
    },
    cash: {
        type: Schema.Types.ObjectId,
        ref: 'Cash'
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }],
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]
}, {
        timestamps: true,
        versionKey: false
    })
module.exports = mongoose.model('User', UserSchema)
