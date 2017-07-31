const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CashSchema = Schema({
    description: {
        type: String,
        required: true
    },
    available: {
        type: Number,
        required: true
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
module.exports = mongoose.model('Cash', CashSchema)
