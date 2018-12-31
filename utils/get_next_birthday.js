"use strict";

const moment = require("moment");
const data= require('./data.json');

let birthdayText;
let daysToGo = -1;

function findMatchingDate(dataset, currentDate, searchQuery) {
	let result = [];
	let closestDateFound = -366;

	for (let i = 0; i < dataset.length; i++) {
		let birthday = moment().subtract(4,'hours').startOf('day');
		birthday.set('month', dataset[i]['month'] - 1);
		birthday.set('date', dataset[i]['day']);
		let daysTillBirthday = birthday.diff(currentDate, 'days');
		if (daysTillBirthday < 0) {
			birthday.add(1,'years');
			daysTillBirthday = birthday.diff(currentDate, 'days');
		}

		if (closestDateFound < 0 || daysTillBirthday < closestDateFound) {
			console.log(closestDateFound, 'being replaced with', daysTillBirthday);
			closestDateFound = daysTillBirthday;
			result[0] = dataset[i];
		}
	}
	console.log('Closest bday is', result);
	return {
		daysToGo: closestDateFound,
		results: result
	};
}

function findNextBirthday(){
	console.log('in next birthday intent handler');

	const dateEST = moment().subtract(4,'hours').startOf('day');
	const currentMonth = dateEST.format('M');
	const currentDay = dateEST.format('D');
	console.log('current month: ' + currentMonth, 'current day: ' +currentDay);

	const searchResults = findMatchingDate(data, dateEST, 'next');
	
	const output = generateUpcomingBirthdayMessage('next birthday', null, searchResults);

	birthdayText = generateUpcomingBirthdayText('next birthday', null, searchResults);

	daysToGo = searchResults.daysToGo;

	console.log('output: ', output);
	
	return output;
}

function generateUpcomingBirthdayMessage(searchQuery, searchRange, searchResults){
	let sentence;
	let details;
	const results = searchResults.results;

	if (results){
		switch (true) {
		case (results.length == 0):
			sentence = "Hmm. I couldn't find anyone who had " + searchQuery + ". " + getGenericHelpMessage(data);
			break;
		case (results.length == 1):
			let person = results[0];

			let dayOfWeek = moment();
			dayOfWeek.set('date', person.day);
			dayOfWeek.set('month', person.month - 1);
			dayOfWeek = dayOfWeek.format('dddd');

			details = "Your next birthday to remember is " +  titleCase(person.firstName) + " " + titleCase(person.lastName)
				+ ". " + titleCase(genderize("his-her", person.gender)) + " birthday is in " + searchResults.daysToGo
				+ " days, on " + dayOfWeek + " " + sayMonth(person.month) + " " + sayDay(person.day);
			sentence = details;
			console.log('generateUpcomingBirthdayMessage: ', sentence);
			break;
		case (results.length > 1):
			if (searchQuery === 'next birthday') {
				sentence = "I found " + results.length + " matching results";
			} else if (searchQuery === 'future birthday')  {
				sentence = "I found " + results.length + " birthdays in " + searchRange + ". They are ";

				for (let i = 0; i < results.length; i++) {
					let person = results[i];
					if (i + 1 === results.length) {
						sentence += "and "
					}
					sentence += person.firstName + " " + person.lastName + " on " + sayMonth(person.month) + " " + sayDay(person.day) + ", ";
				}
			}
			break;
		}
	}
	else{
		sentence = "Sorry, I didn't quite get that. " + getGenericHelpMessage(data);
	}
	console.log(sentence);
	return optimizeForSpeech(sentence);
}

function generateUpcomingBirthdayText(searchQuery, searchRange, searchResults){
	let sentence;
	const results = searchResults.results;
	let person = results[0];

	let dayOfWeek = moment();
	dayOfWeek.set('date', person.day);
	dayOfWeek.set('month', person.month - 1);
	dayOfWeek = dayOfWeek.format('dddd');

	sentence = titleCase(person.firstName) + " " + titleCase(person.lastName)
		+ "'s birthday is today, " + dayOfWeek + " " + person.month + "/" + person.day;
	return optimizeForSpeech(sentence);
}

function sayMonth(monthNumber){
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months[monthNumber - 1] ?  months[monthNumber - 1] : monthNumber;
}

function sayDay(dayNumber){
	const days = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twevlfth", "thirteenth", "fourteenth",
		"fifthteenth", "sixteenth", "seventeeth", "eightteenth", "nineteenth", "twentieth", "twenty first", "twenty second", "twenty third", "twenty fourth", 
		"twenty fifth", "twenty sixth", "twenty seventh", "twenty eighth", "twenty ninth", "thirtieth", "thirty first"];
	return days[dayNumber - 1] ? days[dayNumber - 1] : dayNumber;
}

function getGenericHelpMessage(data){
	let sentences = ["ask - when is " + getRandomName(data) + "'s birthday.","say - " + getRandomName(data)];
	return optimizeForSpeech("You can " + sentences[getRandom(0,sentences.length-1)]);
}

module.exports = {
	nextBirthdaySpeech: findNextBirthday(),
	nextBirthdayText: birthdayText,
	daysToGo
}

// =====================================================================================================
// ------------------------------------ Section 4. Helper Functions  -----------------------------------
// ======================================================================================================

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomName(arrayOfStrings) {
	let randomNumber = getRandom(0, data.length - 1);
	return arrayOfStrings[randomNumber].firstName + " " + arrayOfStrings[randomNumber].lastName;
}

function titleCase(str) {
	return str.replace(str[0], str[0].toUpperCase());
}

function genderize(type, gender) {
	let pronouns ={
		"m":{"he-she":"he","his-her":"his","him-her":"him"},
		"f":{"he-she":"she","his-her":"her","him-her":"her"}
	};
	return pronouns[gender][type];
}

function optimizeForSpeech(str){
	let optimizedString = str.replace("Montag","mahhn tag");
	return optimizedString;
}
