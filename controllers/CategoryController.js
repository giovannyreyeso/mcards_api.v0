'use strict'
const Category = require('../models/Category')
function List(req, res) {
    Category.find({
        'user': req.user._id
    }).then(function (category) {
        return res.status(200).json(category);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function Create(req, res) {
    let newCategory = new Category({
        user: req.user._id,
        name: req.body.name
    })
    newCategory.save(function (err, category) {
        if (err)
            return res.status(500).json({
                statusCode: 500,
                message: err.message
            })
        return res.status(200).json(category)
    }).catch(function (error) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })

}
function Modify(req, res) {

}
function Delete(req, res) {

}
module.exports = {
    List
}
