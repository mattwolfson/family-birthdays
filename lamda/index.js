"use strict";
const Alexa = require("alexa-sdk"); // import the library
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

const data= require('data.json');

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

// =====================================================================================================
// ------------------------------ Section 2. Skill Code - Intent Handlers  -----------------------------
// =====================================================================================================
// CAUTION: Editing anything below this line might break your skill.
//======================================================================================================

const states = {
	SEARCHMODE: "_SEARCHMODE",
	DESCRIPTION: "_DESCRIPTION",
	MULTIPLE_RESULTS: "_MULTIPLE_RESULTS"
};

const newSessionHandlers = {
	"LaunchRequest": function() {
		this.handler.state = states.SEARCHMODE;
		this.response.speak(WELCOME_MESSAGE).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"SearchByNameIntent": function() {
		console.log("SEARCH INTENT");
		this.handler.state = states.SEARCHMODE;
		this.emitWithState("SearchByNameIntent");
	},
	"FindNextBirthdayIntent": function() {
		console.log("Find Next Brithday INTENT");
		this.handler.state = states.SEARCHMODE;
		this.emitWithState("FindNextBirthdayIntent");
	},
	"FindFutureBirthdayIntent": function() {
		console.log("Find future birthday INTENT");
		this.handler.state = states.SEARCHMODE;
		this.emitWithState("FindFutureBirthdayIntent");
	},
	"TellMeMoreIntent": function() {
		this.handler.state = states.SEARCHMODE;
		this.response.speak(WELCOME_MESSAGE).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"TellMeThisIntent": function() {
		this.handler.state = states.SEARCHMODE;
		this.emitWithState("SearchByNameIntent");
	},
	"SearchByInfoTypeIntent": function() {
		this.handler.state = states.SEARCHMODE;
		this.emitWithState("SearchByInfoTypeIntent");
	},
	"AMAZON.YesIntent": function() {
		this.response.speak(getGenericHelpMessage(data)).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function() {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.RepeatIntent": function() {
		this.response.speak(HELP_MESSAGE).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"AMAZON.StopIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.CancelIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.StartOverIntent": function() {
		this.handler.state = states.SEARCHMODE;
		var output = "Ok, starting over. " + getGenericHelpMessage(data);
		this.response.speak(output);
		this.emit(':responseReady');
	},
	"AMAZON.HelpIntent": function() {
		this.response.speak(HELP_MESSAGE + getGenericHelpMessage(data)).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"SessionEndedRequest": function() {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function() {
		this.handler.state = states.SEARCHMODE;
		this.emitWithState("SearchByNameIntent");
	}
};
let startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
	"AMAZON.YesIntent": function() {
		this.response.speak(NEW_SEARCH_MESSAGE).listen(NEW_SEARCH_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function() {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.RepeatIntent": function() {
		let output;
		if(this.attributes.lastSearch){
			output = this.attributes.lastSearch.lastSpeech;
			console.log("repeating last speech");
		}
		else{
			output = getGenericHelpMessage(data);
			console.log("no last speech availble. outputting standard help message.");
		}
		this.emit(":ask",output, output);
	},
	"SearchByNameIntent": function() {
		searchByNameIntentHandler.call(this);
	},
	"FindNextBirthdayIntent": function() {
		console.log('in find birthday next intent');
		findNextBirthdayIntentHandler.call(this);
	},
	"FindFutureBirthdayIntent": function() {
		console.log('in find birthday future intent');
		findFutureBirthdayIntentHandler.call(this);
	},
	"SearchByCityIntent": function() {
		searchByCityIntentHandler.call(this);
	},
	"SearchByInfoTypeIntent": function() {
		searchByInfoTypeIntentHandler.call(this);
	},
	"TellMeThisIntent": function() {
		this.handler.state = states.DESCRIPTION;
		this.emitWithState("TellMeThisIntent");
	},
	"TellMeMoreIntent": function() {
		this.handler.state = states.DESCRIPTION;
		this.emitWithState("TellMeMoreIntent");
	},
	"AMAZON.HelpIntent": function() {
		this.response.speak(getGenericHelpMessage(data)).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"AMAZON.StopIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.CancelIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.StartOverIntent": function() {
		this.handler.state = states.SEARCHMODE;
		var output = "Ok, starting over. " + getGenericHelpMessage(data);
		this.response.speak(output);
		this.emit(':responseReady');
	},
	"SessionEndedRequest": function() {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function() {
		console.log("Unhandled intent in startSearchHandlers");
		this.response.speak(SEARCH_STATE_HELP_MESSAGE).listen(SEARCH_STATE_HELP_MESSAGE);
		this.emit(':responseReady');
	}
});
let multipleSearchResultsHandlers = Alexa.CreateStateHandler(states.MULTIPLE_RESULTS, {

	"AMAZON.StartOverIntent": function() {
		this.handler.state = states.SEARCHMODE;
		var output = "Ok, starting over. " + getGenericHelpMessage(data);
		this.response.speak(output);
		this.emit(':responseReady');
	},
	"AMAZON.YesIntent": function() {
		var output = "Hmm. I think you said - yes, but can you please say the name of the person you'd like to learn more about?";
		this.response.speak(output);
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function() {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.RepeatIntent": function() {
		this.response.speak(this.attributes.lastSearch.lastSpeech).listen(this.attributes.lastSearch.lastSpeech);
		this.emit(':responseReady');
	},
	"SearchByNameIntent": function() {
		let slots = this.event.request.intent.slots;
		let firstName = isSlotValid(this.event.request, "firstName");
		let lastName = isSlotValid(this.event.request, "lastName");
		let cityName = isSlotValid(this.event.request, "cityName");
		let infoType = isSlotValid(this.event.request, "infoType");

		console.log("firstName:" + firstName);
		console.log("lastName:" + lastName);
		console.log("cityName:" + cityName);
		console.log("infoType:" + infoType);
		console.log("Intent Name:" + this.event.request.intent.name);

		let canSearch = figureOutWhichSlotToSearchBy(firstName,lastName,cityName);
		console.log("Multiple results found. canSearch is set to = " + canSearch);
		let speechOutput;

		if (canSearch) {
			let searchQuery = "";
			let searchResults;
			var data = this.attributes.lastSearch.results;

			if (canSearch.constructor === Array) {
				let searchQueryArray = [];
				for (let i = 0; i < canSearch.length; i++) {
					let query = this.event.request.intent.slots[canSearch[i]].value;
					searchQuery += query + " ";
					searchQueryArray.push(query);
				}
				searchResults = loopSearchDatabase(data, searchQueryArray, canSearch);
			} else {
				searchQuery = this.event.request.intent.slots[canSearch].value;
				searchResults = searchDatabase(data, searchQuery, canSearch);
			}

			var lastSearch;
			var output;

			if (searchResults.count > 1) { //multiple results found again
				console.log("multiple results were found again");
				this.handler.state = states.MULTIPLE_RESULTS;
				output = this.attributes.lastSearch.lastSpeech;
				this.response.speak(output);
			} else if (searchResults.count == 1) { //one result found
				this.attributes.lastSearch = searchResults;
				lastSearch = this.attributes.lastSearch;
				this.handler.state = states.DESCRIPTION;
				output = generateSearchResultsMessage(searchQuery,searchResults.results);
				this.attributes.lastSearch.lastSpeech = output;
				this.response.speak(output);

			} else { //no match found
				lastSearch = this.attributes.lastSearch;
				let listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
				speechOutput = MULTIPLE_RESULTS_STATE_HELP_MESSAGE + ", " + listOfPeopleFound;
				this.response.speak(speechOutput).listen(speechOutput);
			}
		} else {
			console.log("no searchable slot was provided");
			console.log("searchQuery was  = " + searchQuery);
			console.log("searchResults.results was  = " + searchResults);

			this.response.speak(generateSearchResultsMessage(searchQuery,false)).listen(generateSearchResultsMessage(searchQuery,false));
		}
		this.emit(':responseReady');
	},
	"SearchByCityIntent": function() {
		this.handler.state = states.SEARCHMODE;
		this.emitWithState("SearchByCityIntent");
	},
	"AMAZON.HelpIntent": function() {
		this.response.speak(MULTIPLE_RESULTS_STATE_HELP_MESSAGE).listen(MULTIPLE_RESULTS_STATE_HELP_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.StopIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.CancelIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"SessionEndedRequest": function() {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function() {
		console.log("Unhandled intent in multipleSearchResultsHandlers");
		this.response.speak(MULTIPLE_RESULTS_STATE_HELP_MESSAGE).listen(MULTIPLE_RESULTS_STATE_HELP_MESSAGE);
		this.emit(':responseReady');
	}
});
let descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTION, {
	"TellMeMoreIntent": function() {
		let person;
		let speechOutput;
		let repromptSpeech;
		let cardContent;

		if(this.attributes.lastSearch){
			person = this.attributes.lastSearch.results[0];
			cardContent = generateCard(person); //calling the helper function to generate the card content that will be sent to the Alexa app.
			speechOutput = generateTellMeMoreMessage(person);
			repromptSpeech = "Would you like to find another evangelist? Say yes or no";

			console.log("the contact you're trying to find more info about is " + person.firstName);
			this.handler.state = states.SEARCHMODE;
			this.attributes.lastSearch.lastSpeech = speechOutput;
			this.response.cardRenderer(cardContent.title, cardContent.body, cardContent.image);
			this.response.speak(speechOutput).listen(repromptSpeech);
		}
		else{
			speechOutput = getGenericHelpMessage(data);
			repromptSpeech = getGenericHelpMessage(data);
			this.handler.state = states.SEARCHMODE;
			this.response.speak(speechOutput).listen(repromptSpeech);
		}

		this.emit(':responseReady');
	},
	"TellMeThisIntent": function() {
		let slots = this.event.request.intent.slots;
		let person = this.attributes.lastSearch.results[0];
		let infoType = isSlotValid(this.event.request, "infoType");
		let speechOutput;
		let repromptSpeech;
		let cardContent;

		console.log(isInfoTypeValid("github"));

		if(this.attributes.lastSearch && isInfoTypeValid(infoType)){
			person =  this.attributes.lastSearch.results[0];
			cardContent = generateCard(person);
			speechOutput = generateSpecificInfoMessage(slots,person);
			repromptSpeech = "Would you like to find another evangelist? Say yes or no";
			this.handler.state = states.SEARCHMODE;
			this.attributes.lastSearch.lastSpeech = speechOutput;
			this.response.cardRenderer(cardContent.title, cardContent.body, cardContent.image);
			this.response.speak(speechOutput).listen(repromptSpeech);
		} else {
			//not a valid slot. no card needs to be set up. respond with simply a voice response.
			speechOutput = generateSearchHelpMessage(person.gender);
			repromptSpeech = "You can ask me - what's " + genderize("his-her", person.gender) + " twitter, or give me " + genderize("his-her", person.gender) + " git-hub username";
			this.attributes.lastSearch.lastSpeech = speechOutput;
			this.handler.state = states.SEARCHMODE;
			this.response.speak(speechOutput).listen(repromptSpeech);
		}
		this.emit(':responseReady');
	},
	"SearchByNameIntent": function() {
		searchByNameIntentHandler.call(this);
	},
	"FindNextBirthdayIntent": function() {
		findNextBirthdayIntentHandler.call(this);
	},
	"FindFutureBirthdayIntent": function() {
		findFutureBirthdayIntentHandler.call(this);
	},
	"SearchByCityIntent": function() {
		searchByCityIntentHandler.call(this);
	},
	"AMAZON.HelpIntent": function() {
		var person = this.attributes.lastSearch.results[0];
		this.response.speak(generateNextPromptMessage(person,"current")).listen(generateNextPromptMessage(person,"current"));
		this.emit(':responseReady');
	},
	"AMAZON.StopIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.CancelIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function() {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.YesIntent": function() {
		this.emit("TellMeMoreIntent");
	},
	"AMAZON.RepeatIntent": function() {
		this.response.speak(this.attributes.lastSearch.lastSpeech).listen(this.attributes.lastSearch.lastSpeech);
		this.emit(':responseReady');
	},
	"AMAZON.StartOverIntent": function() {
		this.handler.state = states.SEARCHMODE;
		var output = "Ok, starting over. " + getGenericHelpMessage(data);
		this.response.speak(output);
		this.emit(':responseReady');
	},
	"SessionEndedRequest": function() {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function() {
		let person = this.attributes.lastSearch.results[0];
		console.log("Unhandled intent in DESCRIPTION state handler");
		this.response.speak("Sorry, I don't know that" + generateNextPromptMessage(person,"general"))
		.listen("Sorry, I don't know that" + generateNextPromptMessage(person,"general"));
		this.emit(':responseReady');
	}
});

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
		let birthday = moment().subtract(4,'hours');;
		birthday.set('month', dataset[i]['month'] - 1);
		birthday.set('date', dataset[i]['day']);
		const daysTillBirthday = birthday.diff(currentDate, 'days');

		if (daysTillBirthday > 0) {
			if (closestDateFound < 0 || daysTillBirthday < closestDateFound) {
				console.log(closestDateFound, 'being replaced with', daysTillBirthday);
				closestDateFound = daysTillBirthday;
				result[0] = dataset[i];
			}
		} else if (daysTillBirthday > closestDateFound) {
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

	const dateEST = moment().subtract(4,'hours');
	const currentMonth = dateEST.format('M');
	const currentDay = dateEST.format('D');
	console.log('current month: ' + currentMonth, 'current day: ' +currentDay);

	const searchResults = findMatchingDate(data, dateEST, 'next');
	
	var lastSearch = this.attributes.lastSearch = searchResults;
	this.handler.state = states.DESCRIPTION;
	this.attributes.lastSearch.lastIntent = "FindNextBirthdayIntent";
	const output = generateUpcomingBirthdayMessage('next birthday', null, searchResults);

	this.attributes.lastSearch.lastSpeech = output;
	console.log('last search: ',this.attributes.lastSearch);
	this.response.speak(output);
	this.emit(':responseReady');
}

function findFutureBirthdayIntentHandler() {
	console.log('in future birthday intent handler');

	let month = isSlotValid(this.event.request, "month");
	let number = isSlotValid(this.event.request, "number");
	let timePeriod = isSlotValid(this.event.request, "timePeriod");
	console.log('slots', month, number, timePeriod);

	const dateEST = moment().subtract(4,'hours');
	const currentMonth = dateEST.format('M');
	const currentDay = dateEST.format('D');
	console.log('current month: ' + currentMonth, 'current day: ' +currentDay);

	let timeNumber;
	let rangeValue;
	let searchRange;
	let timePeriodValue;
	let numberValue;

	if (month) {
		timeNumber = getMonthNumber(this.event.request.intent.slots['month'].value);
		rangeValue = 'months';
		searchRange = this.event.request.intent.slots['month'].value;
	} else if (number && timePeriod) {
		rangeValue = 'days';
		timePeriodValue = this.event.request.intent.slots['timePeriod'].value;
		numberValue = this.event.request.intent.slots['number'].value;
		if (timePeriodValue.indexOf('month') > -1) {
			timeNumber = numberValue*30;
		} else if (timePeriodValue.indexOf('week') > -1) {
			timeNumber = numberValue*7;
		}
		searchRange = "the next " + numberValue + " " + timePeriodValue;
	} else if (timePeriod) {
		timePeriodValue = this.event.request.intent.slots['timePeriod'].value;
		if (timePeriodValue.indexOf('month') > -1) {
			timeNumber = currentMonth;
			rangeValue = 'months';
			searchRange = "a month";
		} else if (timePeriodValue.indexOf('week') > -1) {
			timeNumber = 7;
			rangeValue = 'days';
			searchRange = "a week";
		}
	} else {
		//Default to search next week
		timeNumber = 7;
		rangeValue = 'days';
		searchRange = "the default range of a week"
	}

	const searchResults = findBirthdayByDateRange(data, dateEST, timeNumber, rangeValue);
	
	var lastSearch = this.attributes.lastSearch = searchResults;
	this.handler.state = states.DESCRIPTION;
	this.attributes.lastSearch.lastIntent = "FindNextBirthdayIntent";
	const output = generateUpcomingBirthdayMessage("future birthday", searchRange, searchResults);

	this.attributes.lastSearch.lastSpeech = output;
	console.log('last search: ',this.attributes.lastSearch);
	this.response.speak(output);
	this.emit(':responseReady');
}

function searchByNameIntentHandler(){
	let firstName = isSlotValid(this.event.request, "firstName");
	let lastName = isSlotValid(this.event.request, "lastName");
	let cityName = isSlotValid(this.event.request, "cityName");
	let infoType = isSlotValid(this.event.request, "infoType");

	let canSearch = figureOutWhichSlotToSearchBy(firstName,lastName,cityName);
	console.log("canSearch is set to = " + canSearch);

	if (canSearch){
		let searchQuery = "";
		let searchResults;
		if (canSearch.constructor === Array) {
			let searchQueryArray = [];
			for (let i = 0; i < canSearch.length; i++) {
				let query = this.event.request.intent.slots[canSearch[i]].value;
				searchQuery += query + " ";
				searchQueryArray.push(query);
			}
			searchResults = loopSearchDatabase(data, searchQueryArray, canSearch);
		} else {
			searchQuery = this.event.request.intent.slots[canSearch].value;
			searchResults = searchDatabase(data, searchQuery, canSearch);
		}

		//saving lastSearch results to the current session
		var lastSearch = this.attributes.lastSearch = searchResults;
		var output;

		//saving last intent to session attributes
		this.attributes.lastSearch.lastIntent = "SearchByNameIntent";

		if (searchResults.count > 1) { //multiple results found
			console.log("Search complete. Multiple results were found");
			let listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
			output = generateSearchResultsMessage(searchQuery,searchResults.results) + listOfPeopleFound + ". Who would you like to learn more about?";
			this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
			this.attributes.lastSearch.lastSpeech = output;
			this.response.speak(output);
		} else if (searchResults.count == 1) { //one result found
			this.handler.state = states.DESCRIPTION; // change state to description
			console.log("one match was found");
			if (infoType) {
				//if a specific infoType was requested, redirect to specificInfoIntent
				console.log("infoType was provided as well");
				this.emitWithState("TellMeThisIntent");
			}
			else{
				console.log("no infoType was provided.");
				output = generateSearchResultsMessage(searchQuery,searchResults.results);
				this.attributes.lastSearch.lastSpeech = output;
				this.response.speak(output);
			}
		}
		else{//no match found
			console.log("no match found");
			console.log("searchQuery was  = " + searchQuery);
			console.log("searchResults.results was  = " + searchResults);
			output = generateSearchResultsMessage(searchQuery,searchResults.results);
			this.attributes.lastSearch.lastSpeech = output;
			// this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
			this.response.speak(output);
		}
	}
	else {
		console.log("no searchable slot was provided");
		console.log("searchQuery was  = " + searchQuery);
		console.log("searchResults.results was  = " + searchResults);

		this.response.speak(generateSearchResultsMessage(searchQuery,false)).listen(generateSearchResultsMessage(searchQuery,false));
	}

	this.emit(':responseReady');
}

function searchByCityIntentHandler(){
	var slots = this.event.request.intent.slots;
	var cityName = isSlotValid(this.event.request, "cityName");

	if (cityName){
		var searchQuery = slots.cityName.value;
		console.log("will begin search with  " + slots.cityName.value + " in cityName");
		var searchResults = searchDatabase(data, searchQuery, "cityName");

		//saving lastSearch results to the current session
		let lastSearch = this.attributes.lastSearch = searchResults;
		let output;

		//saving last intent to session attributes
		this.attributes.lastSearch.lastIntent = "SearchByNameIntent";

		if (searchResults.count > 1) { //multiple results found
			console.log("Search completed by city. Multiple results were found");
			let listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
			output = generateSearchResultsMessage(searchQuery,searchResults.results) + listOfPeopleFound + ". Who would you like to learn more about?";
			this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
			this.attributes.lastSearch.lastSpeech = output;
			this.response.speak(output);
		} else if (searchResults.count == 1) { //one result found
			console.log("one match found");
			this.handler.state = states.DESCRIPTION; // change state to description
			output = generateSearchResultsMessage(searchQuery,searchResults.results);
			this.attributes.lastSearch.lastSpeech = output;
			// this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
			this.response.speak(output);

		}
		else{//no match found
			console.log("no match found");
			console.log("searchQuery was  = " + searchQuery);
			console.log("searchResults.results was  = " + searchResults);
			output = generateSearchResultsMessage(searchQuery,searchResults.results);
			this.attributes.lastSearch.lastSpeech = output;
			// this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
			this.response.speak(output);

		}
	}
	else {
		console.log("no searchable slot was provided");
		console.log("searchQuery was  = " + searchQuery);
		console.log("searchResults.results was  = " + searchResults);

		this.response.speak(generateSearchResultsMessage(searchQuery,false)).listen(generateSearchResultsMessage(searchQuery,false));
	}

	this.emit(':responseReady');

}

function searchByInfoTypeIntentHandler(){
	var slots = this.event.request.intent.slots;
	var firstName = isSlotValid(this.event.request, "firstName");
	var lastName = isSlotValid(this.event.request, "lastName");
	var cityName = isSlotValid(this.event.request, "cityName");
	var infoType = isSlotValid(this.event.request, "infoType");

	var canSearch = figureOutWhichSlotToSearchBy(firstName,lastName,cityName);
	console.log("canSearch is set to = " + canSearch);

	if (canSearch){
		var searchQuery = slots[canSearch].value;
		var searchResults = searchDatabase(data, searchQuery, canSearch);

		//saving lastSearch results to the current session
		var lastSearch = this.attributes.lastSearch = searchResults;
		var output;

		//saving last intent to session attributes
		this.attributes.lastSearch.lastIntent = "SearchByNameIntent";

		if (searchResults.count > 1) { //multiple results found
			console.log("multiple results were found");
			let listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
			output = generateSearchResultsMessage(searchQuery,searchResults.results) + listOfPeopleFound + ". Who would you like to learn more about?";
			this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
			this.attributes.lastSearch.lastSpeech = output;
			this.response.speak(output);
		} else if (searchResults.count == 1) { //one result found
			this.handler.state = states.DESCRIPTION; // change state to description
			console.log("one match was found");
			if (infoType) {
				//if a specific infoType was requested, redirect to specificInfoIntent
				console.log("infoType was provided as well");
				let person = this.attributes.lastSearch.results[0];
				let cardContent = generateCard(person);
				let speechOutput = generateSpecificInfoMessage(slots,person);
				let repromptSpeech = "Would you like to find another evangelist? Say yes or no";
				this.attributes.lastSearch.lastSpeech = speechOutput;
				this.handler.state = states.SEARCHMODE;
				this.response.cardRenderer(cardContent.title, cardContent.body, cardContent.image);
				this.response.speak(speechOutput).listen(repromptSpeech);
				// this.emitWithState("TellMeThisIntent");
			}
			else{
				console.log("no infoType was provided.");
				output = generateSearchResultsMessage(searchQuery,searchResults.results);
				this.attributes.lastSearch.lastSpeech = output;
				// this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
				this.response.speak(output);
			}
		}
		else{//no match found
			console.log("no match found");
			console.log("searchQuery was  = " + searchQuery);
			console.log("searchResults.results was  = " + searchResults);
			output = generateSearchResultsMessage(searchQuery,searchResults.results);
			this.attributes.lastSearch.lastSpeech = output;
			// this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
			this.response.speak(output);
		}
	}
	else {
		console.log("no searchable slot was provided");
		console.log("searchQuery was  = " + searchQuery);
		console.log("searchResults.results was  = " + searchResults);

		this.response.speak(generateSearchResultsMessage(searchQuery,false)).listen(generateSearchResultsMessage(searchQuery,false));
	}

	this.emit(':responseReady');

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

			details = "Your next birthday to remember is " +  person.firstName + " " + person.lastName 
				+ ". " + genderize("his-her", person.gender) + " birthday is in " + searchResults.daysToGo
				+ " days, on " + dayOfWeek + " " + sayMonth(person.month) + " " + sayDay(person.day);
			sentence = details;
			console.log(sentence);
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

exports.handler = function(event, context, callback) {
	let alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
	alexa.registerHandlers(newSessionHandlers, startSearchHandlers, descriptionHandlers, multipleSearchResultsHandlers);
	alexa.execute();
};

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