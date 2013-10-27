
function Ticket() {
	this.recid =  0;
	this.title = "";
	this.timeStarted = null;
	this.timeEnded = null;
}

function TicketData() {
	this.currentTicket =  new Ticket();
	this.tickets = new Array();
}

TicketData.save = function(data) {
	chrome.storage.sync.set( {"ticketData" : JSON.stringify(data) });
};

TicketData.clear = function(callback) {
	chrome.storage.sync.remove( "ticketData" , callback);
};

TicketData.load = function(callback) {
  chrome.storage.sync.get("ticketData", function(data) {
		if(isNullOrUndefined(data["ticketData"])) {
			callback(null);
		} else {
			var ticketData = JSON.parse(data["ticketData"]);
			callback(ticketData);
		}
	});
};

// shared methods
function isNullOrUndefined(item) {
	return ( item === null || item === undefined);
}

function getTicketNumber(txt) {
	return txt.match(/Service Ticket \#([0-9]+)/)[1];
}

function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}