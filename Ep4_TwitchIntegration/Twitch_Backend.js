// --- Init Function ---
//Load the current time into the next update variable
npc.setTempData("nextUpdate", world.getTotalTime());

// --- Update Function ---
//If it's time for another update
if(world.getTotalTime() > npc.getTempData("nextUpdate")) {
 //Load the HTTP Module
 var HTTP = world.getTempData("HTTP");
 //Get our response code (replace "<your channel>" with channel name)
 var response = JSON.parse(HTTP.get("https://api.twitch.tv/kraken/channels/<your channel>/follows"));
  
 //Load the last known amount of followers
 var followers = 0;
 if(world.hasStoredData("followers")) followers = world.getStoredData("followers");
  
 //Check to see if it's a valid response
 if(response.hasOwnProperty("_total")) {

  if(response._total - followers < 0) {
   //If we have lost followers, update our last known amount
   world.setStoredData("followers", response._total);
  } else if(response._total != followers) {
   //If we've gained followers, then load the current array of new followers (if there is one)
   var follows = [];
   if(world.hasTempData("follows")) follows = world.getTempData("follows");
   
   //Calculate how many new followers we have
   var newFollowers = response._total - followers;
   
   //For every new follower in our list of followers
   for(var i = 0; i < (newFollowers > 25 ? 25 : newFollowers); i++) {
	//Push their name into the array
    follows.push(response.follows[i].user.display_name);
	//Welcome them into our followers
    npc.executeCommand("say " + response.follows[i].user.display_name + " is now following on Twitch!");
   }
   
   //For every other group of new followers
   for(var i = 25; i <= newFollowers; i+=25) {
    //Get the next group
    nextGroup = JSON.parse(HTTP.get("https://api.twitch.tv/kraken/channels/<your channel>/follows?limit=25&offset="+i));
	//If we get it successfully...
    if(nextGroup.hasOwnProperty("_total")) {
	 //Add each new follower from the group into our follows array
     for(var j = 0; j < (i + 25 > newFollowers ? newFollowers % 25 : 25); j++) {
      follows.push(nextGroup.follows[j].user.display_name);
      npc.executeCommand("say " + nextGroup.follows[j].user.display_name + " is now following on Twitch!");
     }
    } else {
     //Otherwise, try again
     i -= 25;
    }
   }

   //Store the array in temp data
   world.setTempData("follows", follows);
   //Store the known amount of followers in stored data
   world.setStoredData("followers", response._total);
  }
 }
 
 //Plan next update for a thousand ticks time.
 npc.setTempData("nextUpdate", world.getTotalTime() + 1000);
}