// The main logic for your project goes in this file.

var PLANE_MOVE_SPEED = 50;
var ANGLE_FACTOR = 0.1;
var DIRECTION_LEFT = 1;
var DIRECTION_RIGHT = 2;

/**
 * The {@link Player} object; an {@link Actor} controlled by user input.
 */
var player;

/**
 * Control codes
 * Yiyang
 */
/**
 * Keys used for various directions.
 *
 * The property names of this object indicate actions, and the values are lists
 * of keyboard keys or key combinations that will invoke these actions. Valid
 * keys include anything that {@link jQuery.hotkeys} accepts. The up, down,
 * left, and right properties are required if the `keys` variable exists; if
 * you don't want to use them, just set them to an empty array. {@link Actor}s
 * can have their own {@link Actor#keys keys} which will override the global
 * set.
 */
var keysCustom = {
  up: ['up', 'w'],
  down: ['down', 's'],
  left: ['left', 'a'],
  right: ['right', 'd'],
};

Leap.loop(function(frame) {
    frame.hands.forEach(function(hand, index) {
        //output.innerHTML = 'Frame: ' + frame.id + ' roll: ' + hand.roll();
        //output.innerHTML = frame.toString() +'<br/>'+hand.toString();
        if (hand.roll()>0.1 && hand.roll()<1 || hand.roll()<-0.1 && hand.roll()>-1)
            if (hand.roll()>0)
                move(DIRECTION_RIGHT, ANGLE_FACTOR);
            else
                move(DIRECTION_LEFT, ANGLE_FACTOR);
        else;
    });

}).use('screenPosition', {scale: 0.5});


/**
 * Resources and Images Part
 * Jinyao
 * @type {Array}
 */
var background;
var mapWidth = 5;   // in 1024x1024 tiles
var mapHeight = 5;  // in 1024x1024 tiles

var preloadables = ['js/app/images/skyTile.png'];

/**
 * Game logic
 * Zhu Liang
 */

/**
 * Actors belonging to a Team that fight other Soldiers.
 */
var Plane = Player.extend({
    MOVEAMOUNT: PLANE_MOVE_SPEED,
    CONTINUOUS_MOVEMENT: true,
    //DEFAULT_WIDTH: SOLDIER_SIZE,
    //DEFAULT_HEIGHT: SOLDIER_SIZE,
    //NEAR_THRESHOLD: SHOOT_NEAR_THRESHOLD,
    //SHOOT_DELAY: RELOAD_DELAY,
    team: null,
    selected: false,
    moveToX: 0,
    moveToY: 0,
    //health: SOLDIER_MAX_HEALTH,
    lastShot: 0,
    //Orientation of the plane, to be multiplied to PI
    //0 means facing top, 1/4 right, 1/2 down, 3/4 left
    orientation: 0,
    init: function(team, x, y) {
        this._super.call(this, x, y);
        this.team = team;
        this.lastShot = App.physicsTimeElapsed;
        this.orientation = 0;
        //if (team != myTeam) return; // Only allow selecting the player's team
        var t = this;
        // Allow selecting soldiers by clicking on them
        this.listen('mousedown.select touchstart.select', function(e) {
            // Left click or touch only
            if (typeof e !== 'undefined' && e.type == 'mousedown' && e.which !== 1) {
                return;
            }
            // Holding down CTRL allows selecting multiple soldiers.
            //if (!jQuery.hotkeys.areKeysDown('ctrl')) {
            //    t.team.soldiers.forEach(function(soldier) {
            //        soldier.selected = false;
            //    });
            //}
            console.log("selected");
            t.toggleSelected.call(t);
            // Don't bubble the event
            e.stopPropagation();
        });
    },
    /**
     * Draw a soldier with colors and a health indicator.
     */
    drawDefault: function(ctx, x, y, w, h) {
        // Draw the soldier
        //this.fillStyle = this.selected ? this.team.soldierSelectedColor :
        //    (this.isHovered() ? this.team.soldierHoverColor : this.team.soldierColor);
        this._super.call(this, ctx, x, y, w, h);

        // Draw the health indicator
        //drawProgressBar(ctx, x, y - 10, w, h*0.2, this.health/SOLDIER_MAX_HEALTH,
        //    '#00DA00', '#EA3311', 'black');
    },
    toggleSelected: function() {
        this.selected = !this.selected;
        // Stop moving
        this.moveToX = this.xC();
        this.moveToY = this.yC();
    },
    moveTo: function(x, y) {
        this.moveToX = x;
        this.moveToY = y;
    },
    /**
     * Choose the best direction in order to move towards the target.
     *
     * Since this is just an example, the algorithm is simple: move directly
     * towards the target. A more sophisticated algorithm should avoid obstacles.
     */
    chooseBestDirection: function() {
        var dir = [];
        if (this.xC() < this.moveToX - 1) dir.push(keys.right[0]);
        else if (this.xC() > this.moveToX + 1) dir.push(keys.left[0]);
        if (this.yC() < this.moveToY - 1) dir.push(keys.down[0]);
        else if (this.yC() > this.moveToY + 1) dir.push(keys.up[0]);
        return dir;
    },
    /**
     * Cause damage to the soldier's health.
     */
    damage: function(dmg) {
        this.health -= dmg;
    },
    /**
     * Whether this soldier is close enough to another soldier to shoot.
     */
    near: function(other) {
        return (this.x-other.x)*(this.x-other.x) +
            (this.y-other.y)*(this.y-other.y) <
            this.NEAR_THRESHOLD*this.NEAR_THRESHOLD;
    },
    /**
     * Shoot at a target soldier.
     */
    shoot: function(target) {
        if (App.physicsTimeElapsed > this.lastShot + this.SHOOT_DELAY) {
            this.lastShot = App.physicsTimeElapsed;
            bullets.add(new Projectile(
                    this.x+this.width*0.5,
                    this.y+this.width*0.5,
                this.team,
                target
            ));
        }
    },
    destroy: function() {
        this._super.apply(this, arguments);
        this.unlisten('.select');
        this.team.soldiers.remove(this);
    },
});

function move(direction, turn_angle) {
    if(direction == DIRECTION_LEFT){
        player.orientation -= turn_angle;
    }else{
        player.orientation += turn_angle;
    }
    if (player.orientation <= -2) {
        player.orientation = 0;
    }
    if (player.orientation >= 2) {
        player.orientation = 0;
    }
    console.log(player.orientation);
    console.log(player.getVelocityVector());
}
/**
 * Record the last key pressed so the player moves in the correct direction.
 */
jQuery(document).keydown(keysCustom.up.concat(keysCustom.down, keysCustom.left, keysCustom.right).join(' '), function(e) {
    console.log(e.keyPressed);
    if(e.keyPressed == keysCustom.right[1]){
        move(DIRECTION_RIGHT, ANGLE_FACTOR);
    }else if(e.keyPressed == keysCustom.left[1]){
        move(DIRECTION_LEFT, ANGLE_FACTOR);
    }
});

/**
 * A magic-named function where all updates should occur.
 */
function update() {
  player.update();
    player.setVelocityVector(Math.PI * player.orientation, PLANE_MOVE_SPEED);
}

/**
 * A magic-named function where all drawing should occur.
 */
function draw() {

  // Draw the background layer
  background.draw();

	player.draw();
}

/**
 * A magic-named function for one-time setup.
 *
 * @param {Boolean} first
 *   true if the app is being set up for the first time; false if the app has
 *   been reset and is starting over.
 */
function setup(first) {
  // Change the size of the playable area. Do this before placing items!
  if(first) {
    world.resize(1024 * mapWidth, 1024 * mapHeight);
  }

    // Switch from side view to top-down.
  Actor.prototype.GRAVITY = false;

    // Set up the background layer and tile sky over it
    background = new Layer();
    background.context.drawPattern('js/app/images/skyTile.png', 0, 0, world.width, world.height);

  // Initialize the player.
  player = new Plane();
    player.setVelocityVector(Math.PI * player.orientation, PLANE_MOVE_SPEED);
    console.log(player.getVelocityVector());

}
