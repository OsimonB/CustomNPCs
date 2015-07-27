var dateModule = {
 init: function(world) {
  var date;
  if(world.hasStoredData("day")) {
   date = {
    day:world.getStoredData("day")|0,
    month:world.getStoredData("month")|0,
    year:world.getStoredData("year")|0
   };
  } else {
   var year = world.getTotalTime();
   var time = year % 24000;
   year -= time;
   var day = (year % 192000);
   year -= day;
   day = Math.floor(day / 24000) + 1;
   var month = (year % 3072000);
   year -=  month;
   month = Math.floor(month / 192000) + 1;
   year = Math.floor(year / 3072000) + 1;

   date = {day:day, month:month, year:year};
   world.setStoredData("year", date.year);
   world.setStoredData("month", date.month);
   world.setStoredData("day", date.day);
  }
  world.setTempData("date", date);
  world.setTempData("last_time", time % 24000);
 }, update: function(world) {var date = world.getTempData("date");
  var time = world.getTime() % 24000;

  if(time < world.getTempData("last_time")) {
   if(++date.day > 8) {
	date.day = 1;
	if(++date.month > 16) {
	 date.month = 1;
	 ++date.year;
	}
   }
   world.setTempData("date", date);
   world.setStoredData("year", date.year|0);
   world.setStoredData("month", date.month|0);
   world.setStoredData("day", date.day|0);
  }
  world.setTempData("last_time", time);
 }
}

var idleEvent = {
 condition: function(npc) { return true; },
 action: function(npc) { return true; }
}

var eventModule = {
 getNextEvent: function (npc) {
  var isEligible = function (npc, event) {
   var time = world.getTime() % 24000;
    if(event.start != null && event.start > time)
     return false;
    if(event.end != null && event.end < time)
     return false;
    if(event.faction != null && event.faction != npc.getFaction().getId())
     return false;

    return event.condition(npc);
   }

   if(world.hasTempData("globalEvents")) {
    var globalEvents = world.getTempData("globalEvents");
    for(var i = 0; i < globalEvents.length; i++) {
    var event = isEligible(npc, globalEvents[i]);
    if(event == true) {
     return globalEvents[i];
    } else if(event == false) {
     continue;
    } else if(event != null) {
     return event;
    }
   }

   if(npc.hasTempData("npcEvents")) {
    var npcEvents = npc.getTempData("npcEvents");
    for(var i = 0; i < npcEvents.length; i++) {
     var event = isEligible(npc, npcEvents[i]);
     if(event == true) {
      return npcEvents[i];
     } else if(event == false) {
      continue;
     } else if(event != null) {
      return event;
     }
    }
   }

   return idleEvent;
  }
 }, doEvent: function (npc, event) {
  var completed = true;
  if(npc.hasTempData("currentEvent")) {
   var event = npc.getTempData("currentEvent");
   completed = event.action(npc);
  }

  if(completed) {
   var event = this.getNextEvent(npc);
   if(event != null) {
    npc.setTempData("currentEvent", event);
   }
  }
 }, addLocalEvent: function(npc, event) {
  if(npc.hasTempData("npcEvents")) {
   npc.getTempData("npcEvents").push(event);
  } else {
   var events = [event];
   npc.setTempData("npcEvents", event);
  }
 }, addGlobalEvent: function(world, event) {
  if(world.hasTempData("globalEvents")) {
   world.getTempData("globalEvents").push(event);
  } else {
   var events = [event];
   world.setTempData("globalEvents", event);
  }
 }
}

var worldModule = {
 getBlockMetadata: function(world, x, y, z) {
  return world.getMCWorld().func_72805_g(x, y, z);
 }, setBlockMetadata: function(world, x, y, z, metadata) {
  world.getMCWorld().func_72921_c(x, y, z, metadata, 3);
 }, hitSwitch: function(world, npc, x, y, z) {
  var data = this.getBlockMetadata(world, x, y, z);
  this.setBlockMetadata(world, x, y, z, data ^ 0x8);
  npc.swingHand();
 }
}

var npcp = {
 version: [0, 1],
 date: dateModule,
 events: eventModule,
 world: worldModule
}

world.setTempData("npc+", npcp);