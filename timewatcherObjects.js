var timewatcher = {};
timewatcher.indexedDB = {};

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

TicketData.open = function() {
	
	timewatcher.indexedDB.db = null;
	timewatcher.indexedDB.open = function() {
	
		var version = 1;
		var request = indexedDB.open("timewatcher", version);
		
		// We can only create Object stores in a versionchange transaction.
		request.onupgradeneeded = function(e) {
		var db = e.target.result;

		// A versionchange transaction is started automatically.
		e.target.transaction.onerror = timewatcher.indexedDB.onerror;

		if(db.objectStoreNames.contains("timewatcher")) {
		  db.deleteObjectStore("timewatcher");
		}

		var store = db.createObjectStore("timewatcher",
		  {keyPath: "recid"});
		};
	

		request.onsuccess = function(e) {
		timewatcher.indexedDB.db = e.target.result;
			
		};

		request.onerror = timewatcher.indexedDB.onerror;
	};
}

TicketData.load = function(callback) {

  var db = timewatcher.indexedDB.db;
  var trans = db.transaction(["timewatcher"], "readwrite");
  var store = trans.objectStore("timewatcher");

  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;

	TicketData.results.push(result);
	  
    result.continue();
  };

  cursorRequest.onerror = html5rocks.indexedDB.onerror;
};

// shared methods
function isNullOrUndefined(item) {
	return ( item === null || item === undefined);
}

function getTicketNumber(txt) {
	return txt.match(/(Service|Project) Ticket \#([0-9]+)/)[2];
}

function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}