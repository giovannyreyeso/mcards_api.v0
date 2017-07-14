'use strict'
const firebase_admin = require("firebase-admin")
const moment = require('moment')

function GetNextDayCut(cutDay) {
    var anno = moment().get('year');
    var mes = moment().get('month');
    let mcutDay = moment({
        year: anno,
        month: mes,
        day: cutDay
    })
    //console.log(mcutDay.add(1, 'month').format('x'))
    let month = mcutDay.add(1, 'month');
    console.log(month);
    console.log(month.unix());
    return month.unix()
}
module.exports = {
    GetNextDayCut
}
