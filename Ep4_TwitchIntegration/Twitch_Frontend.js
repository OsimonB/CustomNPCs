//If there are any new followers
if(world.hasTempData("follows")) {
	//Get the list of new followers
	var follows = world.getTempData("follows");
  
	//If twitch time is set
	if(world.hasTempData("twitchTime")) {
		//Get the twitch time
		var twitchTime = world.getTempData("twitchTime");
		
		//If twitch time is less than zero, celebrate a new arrival
		if(twitchTime < 0) {
			//Zap a bolt of lightning
			world.thunderStrike(940, 80, 1020);
		
			//Spawn a clone in at the same spot
			var clone = world.spawnClone(940, 80, 1020, 1, "follower");
			//Change the name to the last follower, then remove that follower from the list.
			clone.setName(follows.pop());
	   
			//If we have more followers
			if(follows.length > 0) {
				//Reset the timer
				world.setTempData("twitchTime", 20);
				//Update the followers
				world.setTempData("follows", follows);
			} else {
				//Otherwise remove the timer
				world.removeTempData("twitchTime");
				//And remove the followers
				world.removeTempData("follows");
			}
		} else {
			//If it's not time to celebrate, decrement the timer
			world.setTempData("twitchTime", twitchTime - 1);
		}
	} else {
		//Set the initial timer
		world.setTempData("twitchTime", 20);
	}
}