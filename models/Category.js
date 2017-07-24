const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = require('mongoose').Types.ObjectId
const CategorySchema = Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
        timestamps: true,
        versionKey: false
    })
module.exports = mongoose.model('Category', CategorySchema)
