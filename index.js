exports.send_sms = (event, context, callback) => {
    require('./send_sms/index').handler();
}

exports.flash_briefing = (event, context, callback) => {
    require('./flash_briefing/index').handler();
}