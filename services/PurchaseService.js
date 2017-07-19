'use strict'
const firebase_admin = require("firebase-admin")
const moment = require('moment')

function SumPurchase(purchases) {
    let total = 0;
    for (var i = 0; i < purchases.length; i++) {
        total += purchases[i].total
    }
    return total;
}
module.exports = {
    SumPurchase
}
