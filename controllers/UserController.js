const User = require('../models/User')

function Me(req, res) {
    //console.log(req.user._id)
    User.findOne({
        'uid': req.user.user_id
    }).then(function(user) {
        if (user != null) {
            return res.status(200).json(user)
        }
        const newUser = User({
            uid: req.user.user_id,
            name: req.user.name,
            email: req.user.email,
            picture: req.user.picture
        })
        newUser.save(function(err, user) {
            if (err)
                res.status(500).json(err)
            res.status(200).json(user)
        });
    })
}
module.exports = {
    Me
}
