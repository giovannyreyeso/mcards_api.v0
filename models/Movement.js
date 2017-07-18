const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MovementSchema = Schema({
    type: {
        type: String,
        enum: ['PAY', 'BALANCE'],
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: 'Card'
    },
    cash: {
        type: Schema.Types.ObjectId,
        ref: 'Cash'
    }
}, {
        timestamps: true,
        versionKey: false
    })
module.exports = mongoose.model('Movement', MovementSchema)
