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
module.exports = {
    List
}
