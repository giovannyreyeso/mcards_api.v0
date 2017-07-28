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
    Category.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (category) {
        if (category === null)
            throw new Error('La categoria en efectivo no existe');
        return category;
    }).then(function (category) {
        return Category.update({ '_id': category._id }, req.body);
    }).then(function (categoryUpdated) {
        return Category.findOne({
            '_id': new ObjectId(req.params.id)
        });
    }).then(function (categoryUpdated) {
        return res.status(200).json(categoryUpdated);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })
}
function Delete(req, res) {
    Category.findOne({
        '_id': new ObjectId(req.params.id)
    }).then(function (category) {
        if (category === null)
            throw new Error('La categoria en efectivo no existe');
        return Category.deleteOne({ '_id': new ObjectId(req.params.id) })
    }).then(function () {
        return res.status(200).json({ statusCode: 200, message: 'Categoria eliminada correctamente' });
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    });
}
module.exports = {
    List,
    Modify,
    Delete,
    Create
}
