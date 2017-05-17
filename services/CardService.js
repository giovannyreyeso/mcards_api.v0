'use strict'
const firebase_admin = require("firebase-admin")
const moment = require('moment')

function GetNextDayCut(cutDay) {
    var anno = moment().get('year');
    var mes = moment().get('month') + 1;
    let mcutDay = moment({
        year: anno,
        month: mes,
        day: cutDay
    })
    console.log(mcutDay)
    return mcutDay.add(1, 'month').format('x')
}
module.exports = {
    GetNextDayCut
}
