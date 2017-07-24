'use strict'
const moment = require('moment')

function DateIsLowerThanOneDay(unixDate) {
    let day = moment(1500253200 * 1000);
    let diff = moment().diff(day,'day')
    if (dif <= 0)
        return true;
    return false;
}
module.exports = {
    DateIsLowerThanOneDay
}
