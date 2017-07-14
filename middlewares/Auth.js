'use strict'
const firebase_admin = require("firebase-admin")
const User = require('../models/User')

function isAuthorized(req, res, next) {
    let token;

    if (req.headers && req.headers.authorization) {
        let parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0],
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            return res.json(401, {
                statusCode: 401,
                message: 'El formato para la autorizacion: Bearer [token]'
            });
        }
    } else if (req.param('token')) {
        token = req.param('token');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else {
        return res.json(401, {
            statusCode: 401,
            message: 'La cabezera authorization no se encuentra'
        });
    }
    firebase_admin.auth().verifyIdToken(token).then(function (result) {
        //console.log(result)
        req.user = result;
        User.findOne({
            'uid': req.user.user_id
        }).then(function (user) {
            req.user._id = user._id
            next();
        }).catch(function (err) {
            const user = new User({
                uid: req.user.user_id,
                name: req.user.name,
                email: req.user.email,
                picture: req.user.picture
            });
            user.save(function (err, userSaved) {
                if (err)
                    res.status(500).json(err)
                req.user._id = userSaved._id
                next();
            });
        })
    }).catch(function (error) {
        return res.json(401, {
            statusCode: 401,
            message: 'el token es invalido'
        });
    })
}
module.exports = {
    isAuthorized
}
