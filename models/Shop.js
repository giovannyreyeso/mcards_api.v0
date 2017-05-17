const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ShopSchema = Schema({
    description: String,
    date: Date,
    msi: Boolean,
    noMSI: Number,
    total: Number,
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
module.exports = mongoose.model('Shop', ShopSchema)
