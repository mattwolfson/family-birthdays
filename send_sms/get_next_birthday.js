"use strict";
const moment = require("moment");

//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  const APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
//NOTE: This will limit your skill to only work with that particular app ID
const APP_ID = "";

// =====================================================================================================
// --------------------------------- Section 1. Data and Text strings  ---------------------------------
// =====================================================================================================
//TODO: Replace this data with your own.
//======================================================================================================

const data= require('./data.json');

//======================================================================================================
//TODO: Replace these text strings to edit the welcome and help messages
//======================================================================================================

const skillName = "Birthday Buddy";

//This is the welcome message for when a user starts the skill without a specific intent.
const WELCOME_MESSAGE = "Welcome to " + skillName + ". Which Family Member's birthday would you like to know?. For example, " + getGenericHelpMessage(data);

//This is the message a user will hear when they ask Alexa for help in your skill.
const HELP_MESSAGE = "I can help you find Family and friends birthdays. ";

//This is the message a user will hear when they begin a new search
const NEW_SEARCH_MESSAGE = getGenericHelpMessage(data);

//This is the message a user will hear when they ask Alexa for help while in the SEARCH state
const SEARCH_STATE_HELP_MESSAGE = getGenericHelpMessage(data);

const DESCRIPTION_STATE_HELP_MESSAGE = "Here are some things you can say: Tell me more, or give me his or her contact info";

const MULTIPLE_RESULTS_STATE_HELP_MESSAGE = "Sorry, please say the first and last name of the person you'd like to learn more about";

// This is the message use when the decides to end the search
const SHUTDOWN_MESSAGE = "Ok. ";

//This is the message a user will hear when they try to cancel or stop the skill.
const EXIT_SKILL_MESSAGE = "Ok. ";

let birthdayText;
let daysToGo = -1;

// =====================================================================================================
// ------------------------------ Section 2. Skill Code - Intent Handlers  -----------------------------
// =====================================================================================================
// CAUTION: Editing anything below this line might break your skill.
//======================================================================================================

// ------------------------- END of Intent Handlers  ---------------------------------

function loopSearchDatabase(dataset, searchQueryArray, searchTypeArray) {
	console.log('In loop search database');
	let dataToSearch = dataset;
	let resultObject;

	for (let i = 0; i < searchTypeArray.length; i++) {
		resultObject = searchDatabase(dataToSearch, searchQueryArray[i], searchTypeArray[i]);
		console.log('results:',resultObject);
		if (resultObject.count < 2) {
			break;
		}
		dataToSearch = resultObject.results;
	}

	return resultObject;
}

function searchDatabase(dataset, searchQuery, searchType) {
	console.log('In searchDatabase Function');
	console.log('Search Query', searchQuery, 'Search Type', searchType);
	let matchFound = false;
	let results = [];

	//beginning search
	for (let i = 0; i < dataset.length; i++) {
		if (sanitizeSearchQuery(searchQuery) == dataset[i][searchType]) {
			results.push(dataset[i]);
			matchFound = true;
		}
		if ((i == dataset.length - 1) && (matchFound == false)) {
			//this means that we are on the last record, and no match was found
			matchFound = false;
			console.log("no match was found using " + searchType);
			//if more than searchable items were provided, set searchType to the next item, and set i=0
			//ideally you want to start search with lastName, then firstname, and then cityName
		}
	}
	return {
		count: results.length,
		results: results
	};
}

function figureOutWhichSlotToSearchBy(firstName,lastName,cityName) {
	let slotsToSearchBy = [];

	if (lastName) { slotsToSearchBy.push("lastName"); }
	if (firstName) { slotsToSearchBy.push("firstName"); }
	if (cityName) { slotsToSearchBy.push("cityName"); }

	if (slotsToSearchBy.length === 0) {
		console.log("no valid slot provided. can't search.");
		return false;
	} else if (slotsToSearchBy.length === 1) {
		console.log("search by " +  slotsToSearchBy[0]);
		return slotsToSearchBy[0];
	} else {
		console.log("search by multiple slots " + slotsToSearchBy);
		return slotsToSearchBy;
	}
}

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

function findBirthdayByDateRange(dataset, currentDate, number, timePeriod) {
	console.log(number, timePeriod);
	let results = [];
	let closestDateFound = -366;

	for (let i = 0; i < dataset.length; i++) {
		let birthday = moment().subtract(4,'hours');
		const birthdayMonthNumber = dataset[i]['month'] - 1;
		birthday.set('month', birthdayMonthNumber);
		birthday.set('date', dataset[i]['day']);
		const daysTillBirthday = birthday.diff(currentDate, 'days');
		if (timePeriod === 'days' && daysTillBirthday >= 0 && daysTillBirthday <= number) {
			results.push(dataset[i]);
		} else if (timePeriod === 'months' && birthdayMonthNumber === number) {
			results.push(dataset[i]);
		}
	}
	console.log(results.length, 'results found');
	return {
		daysToGo: closestDateFound,
		results: results
	};
}

function findNextBirthdayIntentHandler(){
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
// =====================================================================================================
// ------------------------------- Section 3. Generating Speech Messages -------------------------------
// =====================================================================================================

function generateNextPromptMessage(person,mode){
	let prompt;

	if (mode == "current"){
		// if the mode is current, we should give more informaiton about the current contact
		prompt = ". You can ask - when is " + getRandomName(data) + "'s birthday. or say " + getRandomName(data);
	}
	//if the mode is general, we should provide general help information
	else if (mode == "general"){
		prompt = ". " + getGenericHelpMessage(data);
	}
	return prompt;
}

function generateSendingCardToAlexaAppMessage(person,mode){
	let sentence = "I have sent " + person.firstName + "'s contact card to your Alexa app" + generateNextPromptMessage(person,mode);
	return sentence;
}


function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateUpcomingBirthdayMessage(searchQuery, searchRange, searchResults){
	let sentence;
	let details;
	let prompt;
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

			details = "Your next birthday to remember is " +  jsUcfirst(person.firstName) + " " + jsUcfirst(person.lastName)
				+ ". " + jsUcfirst(genderize("his-her", person.gender)) + " birthday is in " + searchResults.daysToGo
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

function getDaysToGo(searchResults) {
	return searchResults.daysToGo;
}
function generateUpcomingBirthdayText(searchQuery, searchRange, searchResults){
	let sentence;
	const results = searchResults.results;
	let person = results[0];

	let dayOfWeek = moment();
	dayOfWeek.set('date', person.day);
	dayOfWeek.set('month', person.month - 1);
	dayOfWeek = dayOfWeek.format('dddd');

	sentence = jsUcfirst(person.firstName) + " " + jsUcfirst(person.lastName)
		+ "'s birthday is today, " + dayOfWeek + " " + person.month + "/" + person.day;
	return optimizeForSpeech(sentence);
}

function generateSearchResultsMessage(searchQuery,results){
	let sentence;
	let details;
	let prompt;

	if (results){
		switch (true) {
		case (results.length == 0):
			sentence = "Hmm. I couldn't find " + searchQuery + ". " + getGenericHelpMessage(data);
			break;
		case (results.length == 1):
			let person = results[0];
			details = person.firstName + " " + person.lastName + "'s birthday is " + sayMonth(person.month) + " " + sayDay(person.day);
			prompt = generateNextPromptMessage(person,"current");
			sentence = details + prompt;
			console.log(sentence);
			break;
		case (results.length > 1):
			sentence = "I found " + results.length + " matching results";
			break;
		}
	}
	else{
		sentence = "Sorry, I didn't quite get that. " + getGenericHelpMessage(data);
	}
	return optimizeForSpeech(sentence);
}

function sayMonth(monthNumber){
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months[monthNumber - 1] ?  months[monthNumber - 1] : monthNumber;
}

function getMonthNumber(monthName){
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months.indexOf(monthName);
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

function generateSearchHelpMessage(gender){
	let sentence = "Sorry, I don't know that. You can ask me - what's " + genderize("his-her", gender) +" twitter, or give me " + genderize("his-her", gender) + " git-hub username";
	return sentence;
}

function generateTellMeMoreMessage(person){
	let sentence = person.firstName + " joined the Alexa team in " + person.joinDate + ". " + genderize("his-her", person.gender) + " Twitter handle is " + person.saytwitter + " . " + generateSendingCardToAlexaAppMessage(person,"general");
	return sentence;
}
function generateSpecificInfoMessage(slots,person){
	let infoTypeValue;
	let sentence;

	if (slots.infoType.value == "git hub"){
		infoTypeValue = "github";
		console.log("resetting gith hub to github");
	}
	else{
		console.log("no reset required for github");
		infoTypeValue = slots.infoType.value;
	}

	sentence = person.firstName + "'s " + infoTypeValue.toLowerCase() + " is - " + person["say" + infoTypeValue.toLowerCase()] + " . Would you like to find another evangelist? " + getGenericHelpMessage(data);
	return optimizeForSpeech(sentence);
}

module.exports = {
	nextBirthdaySpeech: findNextBirthdayIntentHandler(),
	nextBirthdayText: birthdayText,
	daysToGo
}

// =====================================================================================================
// ------------------------------------ Section 4. Helper Functions  -----------------------------------
// =====================================================================================================
// For more helper functions, visit the Alexa cookbook at https://github.com/alexa/alexa-cookbook
//======================================================================================================

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

function generateCard(person) {
	let cardTitle = "Contact Info for " + titleCase(person.firstName) + " " + titleCase(person.lastName);
	let cardBody = "Twitter: " + "@" + person.twitter + " \n" + "GitHub: " + person.github + " \n" + "LinkedIn: " + person.linkedin;
	let imageObj = {
		smallImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/team-lookup/avatars/" + person.firstName + "._TTH_.jpg",
		largeImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/team-lookup/avatars/" + person.firstName + "._TTH_.jpg",
	};
	return {
		"title": cardTitle,
		"body": cardBody,
		"image": imageObj
	};
}

function loopThroughArrayOfObjects(arrayOfStrings) {
	let joinedResult = "";
	// Looping through the each object in the array
	for (let i = 0; i < arrayOfStrings.length; i++) {
		//concatenating names (firstName + lastName ) for each item
		joinedResult = joinedResult + ", " + arrayOfStrings[i].firstName + " " + arrayOfStrings[i].lastName;
	}
	return joinedResult;
}

function genderize(type, gender) {
	let pronouns ={
		"m":{"he-she":"he","his-her":"his","him-her":"him"},
		"f":{"he-she":"she","his-her":"her","him-her":"her"}
	};
	return pronouns[gender][type];
}

function sanitizeSearchQuery(searchQuery){
	searchQuery = searchQuery.replace(/’s/g, "").toLowerCase();
	searchQuery = searchQuery.replace(/'s/g, "").toLowerCase();
	return searchQuery;
}

function optimizeForSpeech(str){
	let optimizedString = str.replace("montag","mahhn tag");
	return optimizedString;
}

function isSlotValid(request, slotName){
	let slot = request.intent.slots[slotName];
	//console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
	let slotValue;

	//if we have a slot, get the text and store it into speechOutput
	if (slot && slot.value) {
		//we have a value in the slot
		slotValue = slot.value.toLowerCase();
		return slotValue;
	} else {
		//we didn't get a value in the slot.
		return false;
	}
}

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

function isInfoTypeValid(infoType){
	let validTypes = ["git hub","github","twitter","linkedin"];
	return isInArray(infoType,validTypes);
}