// This will get called every time an NPC updates.
// This is pretty much identical to the other one, only swapping how the targets work.

// Get the new target
var target = event.getAttackTarget();

// First check to see if there is a target, if there isn't target will equal null and this code won't run.
// Second, check to see if the light level of the target is above 8.
if(target && world.getMCWorld().func_72957_l(target.getX(), target.getY(), target.getZ()) > 8) {

    // If both those checks pass, then set the target to null (nothing).
    event.setAttackTarget(null);

}