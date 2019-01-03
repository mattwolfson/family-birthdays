exports.send_sms = (event, context, callback) => {
    require('./send_sms/index').handler();
}

exports.flash_briefing = (event, context, callback) => {
    require('./flash_briefing/index').handler();
}

exports.alexa_skill = (event, context, callback) => {
    console.log('In lambda top level handler');
    require('./lamda/index').handler(event, context, callback);
}