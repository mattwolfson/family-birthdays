var AWS = require('aws-sdk');
const nextBirthday = require('../utils/get_next_birthday.js');
// Set region
AWS.config.update({region: 'us-east-1'});

exports.handler = () => {
    // Create publish parameters
    if (nextBirthday.daysToGo === 0 && nextBirthday.nextBirthdayText) {
        console.log('Next Birthday text should be sent with this text: ', nextBirthday.nextBirthdayText);
        var params = {
            Message: nextBirthday.nextBirthdayText, /* required */
            PhoneNumber: '+1973******',
        };

        // Create promise and SNS service object
        var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

        // handle promise's fulfilled/rejected states
        publishTextPromise.then(
            function(data) {
                console.log("MessageID is " + data.MessageId);
            }).catch(
                function(err) {
                console.error(err, err.stack);
            }
        );
    } else {
        console.log('Next Birthday text should not be sent today, but will be in '
            , nextBirthday.daysToGo, ' days.');
    }
}