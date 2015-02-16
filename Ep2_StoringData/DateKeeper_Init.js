//Declare the date variable
var date;

//Check to see if there is a date stored on the hard drive
if(world.hasStoredData("day")) {
	//If there is load the date into a date object
	date = { day:world.getStoredData("day")|0, 
		month:world.getStoredData("month")|0, 
		year:world.getStoredData("year")|0};
} else {
	//Otherwise calculate the date from the total time spent on that world
	var year = world.getTotalTime();
	
	//Get the current time from the total time and subtract it from the total
	var time = year % 24000;
	year -= time;
	
	//Get the amount of minutes we've spent in the current week and subtract it
	//from the total. We then divide this by the length of a day to figure out
	//how many days into the week we are.
	var day = (year % 192000);
	year -= day;
	day = Math.floor(day / 24000) + 1;
	
	//Get the amount of minutes we've spent in the current year and subtract it
	//from the total. We then divide this by the length of a month to figure out
	//how many months we are into the year.
	var month = (year % 3072000);
	year -=  month;
	month = Math.floor(month / 192000) + 1;
	
	//Finally we can work out how many years have passed by simply dividing the
	//remaining value by the amount of minutes in a year.
	year = Math.floor(year / 3072000) + 1;

	//Use that information to create a date object
	date = {day:day, month:month, year:year};
	
	//Then save the values to the hard drive so next time we can load it instead
	//of having to calculate it all over again.
	world.setStoredData("year", date.year);
	world.setStoredData("month", date.month);
	world.setStoredData("day", date.day);
}

//Now that we have a date object, we store it in the world's TempData.
world.setTempData("date", date);

//As well as recording the last time the date keeper updated
npc.setTempData("last_time", time % 24000);