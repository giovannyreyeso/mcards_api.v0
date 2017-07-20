'use strict'
const firebase_admin = require("firebase-admin")
const moment = require('moment')

function GetNextDayCut(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    //console.log(mcutDay.add(1, 'month').format('x'))
    let month = mcutDay.add(1, 'month');
    //console.log(month);
    //console.log(month.unix());
    return month;
}
function GetNextDayCutUnix(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    //console.log(mcutDay.add(1, 'month').format('x'))
    let month = mcutDay.add(1, 'month');
    //console.log(month);
    //console.log(month.unix());
    return month.unix()
}
function GetPastDayCut(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    //console.log(mcutDay.add(1, 'month').format('x'))
    let month = mcutDay.subtract(1, 'month');
    //console.log(month);
    //console.log(month.unix());
    return month;
}

function GetPastDayCutUnix(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    //console.log(mcutDay.add(1, 'month').format('x'))
    let month = mcutDay.subtract(1, 'month');
    //console.log(month);
    //console.log(month.unix());
    return month.unix()
}
function GetActualDayCut(cutDay) {

    let mcutDay = createDateFromCutDay(cutDay);
    //console.log(mcutDay.unix())
    return mcutDay;
}
function GetActualDayCutUnix(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    //console.log(mcutDay.unix())
    return mcutDay.unix();
}
function GetNextPayDay(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    mcutDay = mcutDay.add(1, 'month');
    let month = null;
    if (mcutDay.weekday() == 0) {
        month = mcutDay.add(19, 'days');
    }
    else if (mcutDay.weekday() == 6) {
        month = mcutDay.add(19, 'days');
    } else {
        month = mcutDay.add(20, 'days');
    }
    //console.log(month)
    return month;
}
function GetNextPayDayUnix(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    mcutDay = mcutDay.add(1, 'month');
    let month = null;
    if (mcutDay.weekday() == 0) {
        month = mcutDay.add(19, 'days');
    }
    else if (mcutDay.weekday() == 6) {
        month = mcutDay.add(19, 'days');
    } else {
        month = mcutDay.add(20, 'days');
    }
    return month.unix();
}
function GetPayDay(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    let month = null;
    if (mcutDay.get('day') == 0) {
        month = mcutDay.add(21, 'days');
    }
    if (mcutDay.get('day') == 6) {
        month = mcutDay.add(19, 'days');
    }
    month = mcutDay.add(20, 'days');
    return month;
}
function GetPayDayUnix(cutDay) {
    let mcutDay = createDateFromCutDay(cutDay);
    let month = null;
    if (mcutDay.get('day') == 0) {
        month = mcutDay.add(21, 'days');
    }
    if (mcutDay.get('day') == 6) {
        month = mcutDay.add(19, 'days');
    }
    month = mcutDay.add(20, 'days');
    return month.unix();
}
function createDateFromCutDay(day) {
    var anno = moment().get('year');
    var mes = moment().get('month');
    let date = moment({
        year: anno,
        month: mes,
        day: day
    });
    return date
}
module.exports = {
    GetNextDayCut,
    GetNextDayCutUnix,
    GetActualDayCut,
    GetPastDayCut,
    GetPastDayCutUnix,
    GetPayDayUnix,
    GetPayDay,
    GetNextPayDay,
    GetNextPayDayUnix,
    GetActualDayCutUnix
}
