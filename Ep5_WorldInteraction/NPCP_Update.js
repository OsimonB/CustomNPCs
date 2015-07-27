if (world.hasTempData("npc+")) {
 var npcp = world.getTempData("npc+");
 npcp.date.update(world);
}

//Bonus content
var players = world.getAllServerPlayers();
for(var i = 0; i < players.length; i++) {
	var item = players[i].getHeldItem();
	if(item != null && item.getItemName() == "Clock") {
		if(players[i].getTempData("has_clock") == false) {
		players[i].setTempData("has_clock", true);
		npc.executeCommand("tell " + players[i].getName() + " The date is: " + date.day + "/" + date.month + "/" + date.year);
		}
	}else {
		players[i].setTempData("has_clock", false);
	}
}