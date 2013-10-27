// constants
var ticketBannerID = ".detailLabel";

var ticketDataKey = "ticketData";

// chrome extensions do not reliably support the document ready so we will just trigger a load when the js file loads.
ready();

function ready() {
	pollForTicketBannerElement();
}

// poll for the existance of the ticket banner. When/if found will call setTimePicker.
function pollForTicketBannerElement() {
	var ticketBanner = null;
	var timesChecked = 0;
	var timeBetweenAttempt = 500;
	
	var searchInterval = setInterval(function() {
		var ticketBanner = findTicketBannerExists();
		
		if(ticketBanner !== null) {
			clearInterval(searchInterval);
			setTimePicker(ticketBanner);		
		}
	},timeBetweenAttempt);
}

// query the dom for the ticket banner and return it if found.
function findTicketBannerExists() {

	var ticketBanner = selectTicketBanner();
	if(ticketBanner === null || ticketBanner === undefined)
		return null;

	// if the star is already added
	if(selectStarPicker(ticketBanner).length !== 0)
		return null;
	
	return ticketBanner;
}

function selectTicketBanner() {
	var ticketBanner =  $(ticketBannerID);
	if(ticketBanner===null)
		return null;
			
	if(ticketBanner.text()!== "") {
		var txt = ticketBanner.text();
		if(txt.match(/Service Ticket \#([0-9]+)/)){
			return ticketBanner;
		}
	}
}

// add the picker element to the ticket banner.
function setTimePicker(ticketBanner) {

	var ticketNumber = getTicketNumber(ticketBanner.text());

	TicketData.load(function(data) {
		createStarPicker(data, ticketBanner);
	});
}

function createStarPicker(ticketData, ticketBanner) {
	if(ticketData === null) {
		prependStarPickerElement(false, ticketBanner, null);
		return;
	}
	
	var currentTicket = ticketData.currentTicket;
	var ticketNumber = getTicketNumber(ticketBanner.text());
	
	// if no current ticket or a different current ticket.
	var current;
	
	if(isNullOrUndefined(currentTicket))
		prependStarPickerElement(false, ticketBanner, currentTicket)
	else if(!isNullOrUndefined(currentTicket) && currentTicket.recid === ticketNumber)
		prependStarPickerElement(true, ticketBanner, currentTicket)
	else
		prependStarPickerElement(false, ticketBanner, currentTicket);
}

function prependStarPickerElement(current, ticketBanner, currentTicket) {
	var starPicker = getStarPickerElement(current, currentTicket);
	ticketBanner.prepend(starPicker);
	
	// this is horrible but we just keep polling and recreate the star if something clears it.
	pollForTicketBannerElement();
}

function getStarPickerElement(current, currentTicket) {		
	var starPicker = $("<img class='starPicker' style='cursor: pointer;' />");
	
	if(!isNullOrUndefined(currentTicket) && !current)
		starPicker.attr("title","currently working on \n"+ currentTicket.title);
	else if(current) {
		starPicker.attr("title","click to stop working on this ticket");
	} else {
		starPicker.attr("title","click to start working on this ticket");
	}
		
	
	starPicker.click(onStarPickerClicked);
	
	setStarPickerImage(starPicker, current);
	return starPicker;
}

function setStarPickerImage(starPicker, current) {
	var img = (current ? "starSelected.png" : "star.png");
	var imgUrl = chrome.extension.getURL(img);
	starPicker.attr('src',imgUrl);
}

function getTicketTitle(txt) {
	return txt;
}

function selectStarPicker(ticketBanner) {
	return $('.starPicker', ticketBanner);
}

function onStarPickerClicked() {
	TicketData.load(function(data) {
		if(data === null) {
			toggleCurrent(null);
		} else {
			var ticketData = data;
			toggleCurrent(ticketData);
		}
	});
}

function toggleCurrent(ticketData) {
	var ticket = getTicketFromBanner();

	// if null then just set the current ticket to starting work.
	if(isNullOrUndefined(ticketData) || isNullOrUndefined(ticketData.currentTicket)) {
		startNewCurrent(ticket, isNullOrUndefined(ticketData) ? new TicketData() : ticketData);
		setStarPickerImage(selectStarPicker(selectTicketBanner()), true);
		return;
	}	
	
	// if not null, see if the current ticket differs
	if(ticketData.currentTicket.recid !== ticket.recid) {
		// set the previous current ticket end time and push.
		ticketData.currentTicket.timeEnded = new Date();
		ticketData.tickets.push(ticketData.currentTicket);
		
		ticket.timeStarted = new Date();
		
		// set our new current ticket
		ticketData.currentTicket = ticket;
		
		TicketData.save(ticketData);
		
		setStarPickerImage(selectStarPicker(), true);
		
		return;
	}
		
	// set this ticket as not being worked.
	ticketData.currentTicket.timeEnded = new Date();
	ticketData.tickets.push(ticketData.currentTicket);
	
	// clear current ticket
	ticketData.currentTicket = null;
	
	TicketData.save(ticketData);
	
	setStarPickerImage(selectStarPicker(), false);
}

function getTicketFromBanner(){
	var ticket = new Ticket();
	
	var ticketBanner = selectTicketBanner();
	if(ticketBanner===null)
		return ticket;
		
	ticket.recid = getTicketNumber(ticketBanner.text());
	ticket.title = getTicketTitle(ticketBanner.text());
	
	return ticket;
}

function startNewCurrent(ticket, ticketData) {
	
	ticketData.currentTicket = ticket;
	ticket.timeStarted = new Date();
	TicketData.save(ticketData);
}












