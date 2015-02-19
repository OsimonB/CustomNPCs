//Regular Dancer NPCs

	//Init function:
	npc.removeTempData("currentEvent");

	//Update function:
	var eventModule = world.getTempData("eventModule");
	eventModule.doEvent(npc);

//Crazy Dancer NPC

	//Init function:
	var danceEvent = {
		start: 20000, 	//Start dancing at 8pm (20000)
		end: 21000, 	//End dancing at 9pm (21000)
		condition: function(npc) {
			//Only dance if it isn't raining
			return (world.isRaining() == false);
		},
		action: function(npc) {
			//Check to see if the NPC is already dancing
			if(npc.hasTempData("isDancing") == false) {
				//If not, tell the NPC to dance
				npc.setAnimation(3); //Animation 3 is a zombie animation
				npc.setTempData("isDancing", true);
			} else if (this.end <= world.getTime() % 24000 || this.start > world.getTime() % 24000) {
				//Otherwise, if the event is over (or not started) end it
				npc.setAnimation(0);
				npc.removeTempData("isDancing");
				return true;
			}
			
			//Swing hand to the music!
			npc.swingHand();
			return false;
		}
	}

	var npcEvents = [ danceEvent ];	//Load the event into an array
	npc.setTempData("npcEvents", npcEvents);	//Store the array in temp data
	
	//Update function:
	var eventModule = world.getTempData("eventModule");
	eventModule.doEvent(npc);