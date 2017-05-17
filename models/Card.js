const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CardSchema = Schema({
    name: String,
    isCreditCard: {
        type: Boolean,
        default: true
    },
    cutDay: Number,
    limit: Number,
    aviable: Number,
    cat: Number,
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
module.exports = mongoose.model('Card', CardSchema)
