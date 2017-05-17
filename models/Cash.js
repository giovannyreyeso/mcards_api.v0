const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CashSchema = Schema({
    description: String,
    aviable: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shops: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Shop'
        }
    ]
}, {
    timestamps: true,
    versionKey: false
})
module.exports = mongoose.model('Cash', CashSchema)
