const DOMParser = require('xmldom').DOMParser;
const fs = require('fs');
const nextBirthday = require('../utils/get_next_birthday.js');
const moment = require("moment");
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const xmlText = '<?xml version="1.0" encoding="UTF-8" ?>\n' +
'<rss version="2.0">\n' +
  '<channel>\n' +
    '<ttl>30</ttl>\n' +
    '<item>\n' +
      '<guid>urn:uuid:' + uuidv4() + '</guid>\n' +
      '<title> Here is your next birthday to remember</title>\n' +
      '<link>https://developer.amazon.com/public/community/blog</link>\n' +
      '<pubDate>'+ moment.utc().format() + '</pubDate>\n' +
      '<description>\n' +
         nextBirthday.nextBirthdaySpeech + '\n' +
      '</description>\n' +
     '</item>\n' +
  '</channel>\n' +
'</rss>\n';

console.log('In next birthday speech with speech: ', nextBirthday.nextBirthdaySpeech, ' and uuid: ', uuidv4());

var xmlDoc =  new DOMParser().parseFromString(xmlText, "text/xml");
fs.writeFileSync("/tmp/birthday_to_remember_today.xml", xmlDoc, function(err) {
    if(err) {
        return console.log('Error in writing file: ', err);
    }

    console.log("The file was saved for ", uuidv4());
}); 

const params = {
    Bucket: 'birthday-buddy-rss',
    Key: 'birthday_to_remember_today.xml',
    ContentType: 'application/rss+xml',
    ACL: 'public-read',
}

const bufferedFile = fs.readFileSync("/tmp/birthday_to_remember_today.xml",  function(err) {
    if(err) {
        return console.log('Read error: ' + err);
    }

    console.log("The file was read for ", uuidv4());
});

params.Body = bufferedFile;
console.log('BufferedFile is: ', bufferedFile);

exports.handler = () => {
    s3.putObject(params, function(err) {
        if (err) {
            return console.log('s3 upload error: ', err);
        }

        console.log('s3 upload success: ', uuidv4());
        return nextBirthday.nextBirthdaySpeech;
    })
}