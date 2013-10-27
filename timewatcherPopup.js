var MaxTicketTitle = 160;

var currentDate = new Date();

$(document).ready(function(){

		$("#btnRefresh").click(function() {
			refresh();
		});
		
		$("#btnClear").click(function() {
			if(!confirm("Are you sure you wish to clear all entries?"))
				return;
				
			TicketData.clear(function(){ refresh();});
		});
		
		$(".prevDate").click(function() {
			currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1);
			refresh();
		});
		
		$(".nextDate").click(function() {			
			currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1);
			refresh();
		});
		
		refresh();
	}
);

function refresh() {

	TicketData.load(function(data){
		if(data == null)
			return;
			
		renderCurrentDate(currentDate);
		
		setCurrentTicket(data.currentTicket);
		setTimeEntries(data.tickets);
	});
}

function renderCurrentDate(currentDate) {
	$(".curDate").text((currentDate.getMonth() + 1 ) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear());
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

function getDate(date) {
	date = date.replace(/-/g,'');
	return new Date(date.substr(0,4), parseInt(date.substr(4,2))-1, date.substr(6,2));
}

function sameDay(date1, date2) {
	return date1.getFullYear()==date2.getFullYear() && date1.getMonth()==date2.getMonth() && date1.getDate()==date2.getDate();
}

function setTimeEntries(tickets) {
	var timeEntries = $("#timeEntries tbody");
	
	 timeEntries.empty();
	 
	  var selectedTickets = tickets.filter(function(ticket) {		
		return (sameDay(getDate(ticket.timeStarted) , currentDate)) || (sameDay(getDate(ticket.timeEnded) , currentDate));
	 });
	 
	 var rows = selectedTickets.map(function(ticket){
		var row ='<tr><td><span title=\''+ cleanTicket(ticket.title) +'\'>'+ticket.recid+'</span></td>';
		row+='<td>'+formatDate(ticket.timeStarted)+'</td>';
		row+='<td>'+formatDate(ticket.timeEnded)+'</td>';
		row+='<td>'+getTimeDiff(getParsedDate(ticket.timeStarted), getParsedDate(ticket.timeEnded))+'</td></tr>';
		return row;
	 });
	 
	 $(rows.join("")).appendTo(timeEntries);
}

function trimTitle(title) {
	if(isNullOrUndefined(title))
		return "";
		
	return (title.length >  MaxTicketTitle) ? title.substring(0, MaxTicketTitle) : title;
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


