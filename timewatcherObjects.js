
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
	chrome.storage.local.set( {"ticketData" : JSON.stringify(data) });
};

TicketData.clear = function(data) {
	chrome.storage.local.remove( "ticketData" );
};

TicketData.load = function(callback) {
  chrome.storage.local.get("ticketData", function(data) {
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