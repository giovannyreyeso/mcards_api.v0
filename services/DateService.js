'use strict'
const moment = require('moment')

function IsValidDate(unixDate, timeValidInMinutes) {
    let date = moment().unix(unixDate);
    let dif = moment().diff(date, 'minutes')
    if (dif > timeValidInMinutes)
        return true;
    return false;
}
module.exports = {
    IsValidDate
}
