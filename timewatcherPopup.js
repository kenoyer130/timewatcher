$(document).ready(function(){

		$("#btnRefresh").click(function() {
			refresh();
		});
		
		$("#btnClear").click(function() {
			if(!confirm("Are you sure you wish to clear all entries?"))
				return;
				
			TicketData.clear(function(){ refresh();});
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
		currentlyWorking.attr("title","");
		currentStartTime.text("");
		currentHours.text("");
		return;
	}
	
	currentlyWorking.text(trimTitle(ticket.title));
	
	currentStartTime.text(formatDate(ticket.timeStarted));
	currentlyWorking.attr("title",cleanTicket(ticket.title));
	
	currentHours.text(getTimeDiff(ticket.timeStarted != null ? getParsedDate(ticket.timeStarted) : null, new Date()));
}

function setTimeEntries(tickets) {
	var timeEntries = $("#timeEntries tbody");
	
	 timeEntries.empty();
	 
	 var rows = "";
	 
	 for(i = 0; i < tickets.length; i++){
		
		rows+='<tr><td><span title=\''+ cleanTicket(tickets[i].title) +'\'>'+tickets[i].recid+'</span></td>';
		rows+='<td>'+formatDate(tickets[i].timeStarted)+'</td>';
		rows+='<td>'+formatDate(tickets[i].timeEnded)+'</td>';
		rows+='<td>'+getTimeDiff(getParsedDate(tickets[i].timeStarted), getParsedDate(tickets[i].timeEnded))+'</td></tr>';	
	 }
	 
	 $(rows).appendTo(timeEntries);
}

function trimTitle(title) {
	if(isNullOrUndefined(title))
		return "";
		
	return (title.length >  60) ? title.substring(0,60) : title;
}

function cleanTicket(title) {
	title = title.replace('\'', "-");
	return title;
}

function formatDate(date) {
	if(isNullOrUndefined(date))
		return "";

	var parsed = getParsedDate(date);
		
	return parsed.toLocaleTimeString() + " " + parsed.toLocaleDateString()
		
}

function getParsedDate(date) {
	var parsed = new Date();
	parsed.setTime(Date.parse(date));
	
	return parsed;
}

function getTimeDiff(startDate, endDate) {
	if(isNullOrUndefined(startDate) || isNullOrUndefined(endDate))
		return "";

	var difference = (endDate.getTime() - startDate.getTime());
	
	var hours = Math.floor(difference / 36e5),
    minutes = Math.floor(difference % 36e5 / 60000),
    seconds = Math.floor(difference % 60000 / 1000);
	
	var parsed = new Date();
	
	parsed.setHours(hours);
	parsed.setMinutes(minutes);
	parsed.setSeconds(seconds);
	
	return parsed.getHours() + "h "+parsed.getMinutes()+"m "+parsed.getSeconds()+"s";
}


