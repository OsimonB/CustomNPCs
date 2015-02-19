//	Event structure {
//		faction 	- Restrict to faction (null is any faction)
//		start		- Time of day to start
//		end			- Time of day to end
//		condition	- Condition that must be met to perform event
//						Returns true if event can happen
//						Returns false if event can't happen
//						Returns an event if there is a prerequisite event 
//		action		- Action to perform once event is called
//						Returns true if action is completed
//						Returns false if action hasn't finished yet

var danceEvent = {
	faction: 5, 	//Restricted to NPCs that are a part of faction 5
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
			npc.setAnimation(5);
			npc.setTempData("isDancing", true);
		} else if (this.end <= world.getTime() % 24000 || this.start > world.getTime() % 24000) {
			//Otherwise, if the event is over (or not started) end it
			npc.setAnimation(0);
			npc.removeTempData("isDancing");
			return true;
		}
		return false;
	}
}

var idleEvent = {
	//In the idle event, don't care about a condition or action
	condition: function(npc) { return true; },
	action: function(npc) { return true; }
}

var eventModule = {
	getNextEvent: function (npc) {
		//Eligibility test for an event/npc
		var isEligible = function (npc, event) {
			//Get the time of day
			var time = world.getTime() % 24000;
			
			//Check to see whether a start time is declared and has occurred
			if(event.start != null && event.start > time) return false;
			//Check to see whether an end time is declared and hasn't occurred
			if(event.end != null && event.end < time) return false;
			//Check to see if a faction has been declared and is the same as the NPC's
			if(event.faction != null && event.faction != npc.getFaction().getId()) return false;

			//Finally return the conditon of the Event
			return event.condition(npc);
		}

		//Check to see if the npc has custom events
		if(npc.hasTempData("npcEvents")) {
			//If it does, pull them into a variable
			var npcEvents = npc.getTempData("npcEvents");
			
			//Then check all of them to see if any are eligible
			for(var i = 0; i < npcEvents.length; i++) {
				var event = isEligible(npc, npcEvents[i]);
				
				if(event == true) {
					//If eligible return the event
					return npcEvents[i];
				} else if(event == false) {
					//If not eligible check the next event
					continue;
				} else if(event != null) {
					//If it requires a prerequisite, return that event
					return event;
				}
			}
		}

		//Check to see if global events exist
		if(world.hasTempData("globalEvents")) {
			//If it does, pull them into a variable
			var globalEvents = world.getTempData("globalEvents");
			
			//Then check all of them to see if any are eligible
			for(var i = 0; i < globalEvents.length; i++) {
				var event = isEligible(npc, globalEvents[i]);
				
				if(event == true) {
					//If eligible return the event
					return globalEvents[i];
				} else if(event == false) {
					//If not eligible check the next event
					continue;
				} else if(event != null) {
					//If it requires a prerequisite, return that event
					return event;
				}
			}
		}
		
		return null;
	}, doEvent: function (npc, event) {
		//Declare completed true (as a default value)
		var completed = true;
		
		//Check to see whether the npc has a current event
		if(npc.hasTempData("currentEvent")) {
			//If it does, pull it out and perform the action
			var event = npc.getTempData("currentEvent");
			completed = event.action(npc);
		}
		
		//Check if the action is completed
		if(completed) {
			//If it is, load the next one
			var event = this.getNextEvent(npc);
			
			//If one exists, store it in the temp data
			if(event != null) npc.setTempData("currentEvent", event);
		}
	}
}

//Store all the events in an array (order = priority)
var globalEvents = [
	danceEvent,
	idleEvent
];

//Load the global events into the temp data
world.setTempData("globalEvents", globalEvents);
//Load the event module into the temp data
world.setTempData("eventModule", eventModule);
