$(document).ready(function(){

		$("#btnRefresh").click(function() {
			refresh();
		});
		
		$("#btnClear").click(function() {
			if(!confirm("Are you sure you wish to clear all entries?"))
				return;
				
			TicketData.clear();
			refresh();
		});

		refresh();
	}
);

function refresh() {
	TicketData.load(function(data){
		if(data == null)
			return;
			
		setCurrentTicket(data.currentTicket);
		setTimeEntries(data.tickets);
	});
}

function setCurrentTicket(ticket) {
	var currentlyWorking = $("#currentlyWorking");
	var currentStartTime = $("#currentStartTime");
	var currentHours = $("#currentHours");
	
	if(ticket === null || ticket === undefined) {
		currentlyWorking.text("Nothing!");
		currentStartTime.text("");
		currentHours.text("");
		return;
	}
	
	currentlyWorking.text(ticket.title);
	currentStartTime.text(ticket.timeStarted);
	//todo: current hours
}

function setTimeEntries(tickets) {
	var timeEntries = $("#timeEntries");
	
	 timeEntries.find("tr:gt(0)").remove();
	 
	 for(i = 0; i < tickets.length; i++){
		$('#timeEntries tr:last').after('<tr><td>'+tickets[i].title+'</td><td>'+tickets[i].timeStarted+'</td><td>'+tickets[i].timeEnded+'</td></tr>');
	 }
}


