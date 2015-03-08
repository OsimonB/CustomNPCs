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

var twitchEvent = {
	faction: 3,		//Restricted to NPCs that are a part of faction 3
	condition: function(npc) {
		return world.hasTempData("twitchTime"); //Only celebrate at the right time
	},
	action: function(npc) {
		//This sets the speed of rotation
		var angle = (world.getTime() / 25) % (Math.PI * 2); 
		//This sets the point to rotate around
		npc.navigateTo(717 + Math.sin(angle) * 4, 70, 845 + Math.cos(angle) * 4, 1.5); 
		//This makes them dance
		npc.setAnimation(5);
	  
	    //This makes them swing their arms occasionally
		if(world.getTime() % 100 == 0) {
			npc.swingHand();
		}  

		return true;
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
		
		return idleEvent;
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
	danceEvent
];

//Load the global events into the temp data
world.setTempData("globalEvents", globalEvents);
//Load the event module into the temp data
world.setTempData("eventModule", eventModule);
