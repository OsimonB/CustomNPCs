//Load the date from the world's tempdata
var date = world.getTempData("date");
//Get the current time of day
var time = world.getTime() % 24000;

//Check whether or not it's a new day
if(time < npc.getTempData("last_time")) {
	//If it is, increment the day and check to see if it's a new month
	if(++date.day > 8) {
		//If it is, increment the month and check to see if it's a new year
		date.day = 1;
		if(++date.month > 16) {
			//If it is, increment the year
			date.month = 1;
			++date.year;
		}
	}
	
	//Store the new date object in tempdata
	world.setTempData("date", date);
	
	//Store the date on hard drive 
	//It's ok that we write it here, because this only get's called once a day
	world.setStoredData("year", date.year|0);
	world.setStoredData("month", date.month|0);
	world.setStoredData("day", date.day|0);
}

//Update the last time the date keeper was updated
npc.setTempData("last_time", time);

//Bonus feature
//When a player holds a clock in their hand, the time keeper will whisper them the date
//If you don't want to add this feature, just ignore the code below here.

//If you want to do the challenge, don't read this!
//Get a list of all the players on the server
var players = world.getAllServerPlayers();

//Loop through each player
for(var i = 0; i < players.length; i++) {
	//Get the item in their hand
	var item = players[i].getHeldItem();
	//Check if they're holding an item and the item is a clock.
	if(item != null && item.getItemName() == "Clock") {
		//Check if the have already been notified
		if(players[i].getTempData("has_clock") == false) {
			//If not, proceed to notify them of the date.
			npc.executeCommand("tell " + players[i].getName() + " The date is: " + date.day + "/" + date.month + "/" + date.year);
			//Remember that we have notified them
			players[i].setTempData("has_clock", true);
		}
	}else {
		//If they aren't holding the clock, forget we ever notified them
		players[i].setTempData("has_clock", false);
	}
}