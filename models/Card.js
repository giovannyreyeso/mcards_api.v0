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
