// This will get called every time an NPC targets something new.

// Get the new target
var target = npc.getTarget();

// First check to see if there is a target, if there isn't target will equal null and this code won't run.
// Second, check to see if the light level of the target is above 10.
if(target && world.getMCWorld().func_72957_l(target.getX(), target.getY(), target.getZ()) > 10) {

    // If both those checks pass, then cancel the targeting
    event.setCancelled(true);

}

// If event.setCancelled(true) isn't called, then the NPC will target the player.