const User = require('../models/User')
function FinByEmail(req, res) {
    User.find({
        'email': req.query.email
    }).select({ "name": 1, "_id": 1, "email": 1, "picture": 1 }).then(function (users) {
        return res.status(200).json(users);
    }).catch(function (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    })

}
function Me(req, res) {
    //console.log(req.user._id)
    User.findOne({
        'uid': req.user.user_id
    }).then(function (user) {
        if (user != null) {
            return res.status(200).json(user)
        }
        const newUser = User({
            uid: req.user.user_id,
            name: req.user.name,
            email: req.user.email,
            picture: req.user.picture
        })
        newUser.save(function (err, user) {
            if (err)
                res.status(500).json(err)
            res.status(200).json(user)
        });
    })
}
function Register(req, res) {
    User.findOne({
        'uid': req.user.user_id
    }).then(function (userSearched) {
        if (userSearched != null) {
            return res.status(500).json({
                error: true,
                mensaje: 'El usuario ya se encuentra registrado'
            })
        }
        const user = new User({
            uid: req.user.user_id,
            name: req.user.name,
            email: req.user.email,
            picture: req.user.picture
        });
        user.save(function (err, userSaved) {
            if (err)
                res.status(500).json(err)
            res.status(200).json(userSaved)
        });
    })

}
module.exports = {
    Me,
    Register,
    FinByEmail
}
