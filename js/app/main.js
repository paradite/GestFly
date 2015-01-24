// The main logic for your project goes in this file.

var PLANE_MOVE_SPEED = 0;
var DEFAULT_SPEED = 300;
var ANGLE_FACTOR = 0.1;
var DIRECTION_LEFT = 1;
var DIRECTION_RIGHT = 2;
var UNIT = 30;
var showZoomLevel = true;
var lastZoom = App.physicsTimeElapsed;
var numScrollEvents=0;
/**
 * The {@link Player} object; an {@link Actor} controlled by user input.
 */
var player;
var showDir = true;
var dirSignal;
var inProcess=false;

var takeoff = false;
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
  takeoff: ['takeoff', 't']
};

Leap.loop({enableGestures: true}, function(frame) {
    if (!inProcess)
    frame.hands.forEach(function(hand, index) {
        //output.innerHTML = 'Frame: ' + frame.id + ' roll: ' + hand.roll();
        //output.innerHTML = frame.toString() +'<br/>'+hand.toString();
        rotationalAngle=hand.roll();
        MAX_ROTATIONAL_ANGLE=1.2;
        MIN_ROTATIONAL_ANGLE=0.1;
        ROLL_FACTOR=0.2;
        
        if (rotationalAngle<0) {//right
            if (rotationalAngle<-MAX_ROTATIONAL_ANGLE)
                move(DIRECTION_RIGHT, ANGLE_FACTOR*MAX_ROTATIONAL_ANGLE*MAX_ROTATIONAL_ANGLE*ROLL_FACTOR);
            else if (rotationalAngle<-MIN_ROTATIONAL_ANGLE)
                move(DIRECTION_RIGHT, ANGLE_FACTOR*rotationalAngle*rotationalAngle*ROLL_FACTOR);
        }
        else
            if (rotationalAngle>MAX_ROTATIONAL_ANGLE)
                move(DIRECTION_LEFT, ANGLE_FACTOR*MAX_ROTATIONAL_ANGLE*MAX_ROTATIONAL_ANGLE*ROLL_FACTOR);
            else if (rotationalAngle>MIN_ROTATIONAL_ANGLE)
                move(DIRECTION_LEFT, ANGLE_FACTOR*rotationalAngle*rotationalAngle*ROLL_FACTOR);
        
        if (hand.pitch()>0.2 && PLANE_MOVE_SPEED>20) PLANE_MOVE_SPEED-=1.1*hand.pitch(); //lift the tip of the hand to slow down
        else if (hand.pitch()<-0.2) PLANE_MOVE_SPEED-=1.1*hand.pitch();
        
        //if (screenPosition[1]>0)
        
        zoom=-hand.screenPosition()[1];
        if (zoom>400 || zoom<-200)
        leapZoom(zoom);
        //console.log(zoom);
    });


    /*if(frame.valid && frame.gestures.length > 0 && !inProcess){
        inProcess=true;
        frame.gestures.forEach(function(gesture){
            switch (gesture.type){
                case "circle":
                    console.log("Circle Gesture");
                    tmp=PLANE_MOVE_SPEED;
                    PLANE_MOVE_SPEED=tmp;
                    var clockwise = false;
                    var direction = frame.pointable(pointableID).direction;
                    var dotProduct = Leap.vec3.dot(direction, gesture.normal);
                    if (dotProduct  >  0) clockwise = true;
                    for (i=0;i<10;i++){
                        if (clockwise)
                        move(DIRECTION_RIGHT, 0.005);
                        else move(DIRECTION_LEFT, 0.005);
                        //update();
                    }
                    PLANE_MOVE_SPEED=tmp;
                    break;
                case "keyTap":
                    console.log("Key Tap Gesture");
                    break;
                case "screenTap":
                    console.log("Screen Tap Gesture");
                    break;
                case "swipe":
                    console.log("Swipe Gesture");
                    break;
            }
        });
        inProcess=false;
    }*/

}).use('screenPosition', {scale: 0.5});


/**
 * Resources and Images Part
 * Jinyao
 * @type {Array}
 */
var background;
var mapWidth = 8;   // in 1024x1024 tiles
var mapHeight = 6;  // in 1024x1024 tiles

var startGrid, endGrid;
var startPoint, endPoint;

var preloadables = ['js/app/images/skyTile.png',
                    'js/app/images/AeroMap.png',
                    'js/app/images/startEnd.png',
                    'js/app/images/startPoint.png',
                    'js/app/images/endPoint.png',
                    'js/app/images/planeArrowMap.png'];

/**
 * Game logic
 * Zhu Liang
 */

var Destination = Box.extend({
    // Check whether a Box is within some distance of this dot
    near: function(otherBox, units) {
        return this.nearX(otherBox, units) && this.nearY(otherBox, units);
    },
    nearX: function(otherBox, units) {
        return this.x + this.width + units > otherBox.x && otherBox.x + otherBox.width + units > this.x;
    },
    nearY: function(otherBox, units) {
        return this.y + this.height + units > otherBox.y && otherBox.y + otherBox.height + units > this.y;
    },
    // Initialize the Dot in a random location that doesn't overlap the snake
    //init: function() {
    //    var x, y;
    //    do {
    //        x = this.getRand(world.width);
    //        y = this.getRand(world.height);
    //    } while (this.near(player, UNIT*5) || this.overlapsPieces());
    //    this._super.call(this, x, y, UNIT, UNIT);
    //},
});

/**
 * Aeroplane
 */
var Plane = Player.extend({
    MOVEAMOUNT: PLANE_MOVE_SPEED,
    CONTINUOUS_MOVEMENT: true,
    MOVEWORLD: 0.4,
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
    directionToDest: function(){
        var xDist = endPoint.xC() - this.x;
        var yDist = endPoint.yC() - this.y;

        // angle in radians
        var angleRadians = Math.atan2(yDist, xDist);
        return angleRadians;
    }
});

function move(direction, turn_angle) {
    if(!takeoff){
        return;
    }
    if(direction == DIRECTION_LEFT){
        player.orientation -= turn_angle;
        player.radians-= turn_angle*Math.PI;
    }else{
        player.orientation += turn_angle;
        player.radians+= turn_angle*Math.PI;
    }
    if (player.orientation <= -2 || player.orientation >= 2) {
        player.orientation = 0;
        player.radians = 0;
    }
    //console.log(player.orientation);
}
/**
 * KEYBOARD
 * Record the last key pressed so the player moves in the correct direction.
 */
jQuery(document).keydown(keysCustom.up.concat(keysCustom.down, keysCustom.left, keysCustom.right, keysCustom.takeoff).join(' '), function(e) {
    console.log(e.keyPressed);
    if(e.keyPressed == keysCustom.right[1]){
        move(DIRECTION_RIGHT, ANGLE_FACTOR);
    }else if(e.keyPressed == keysCustom.left[1]){
        move(DIRECTION_LEFT, ANGLE_FACTOR);
    }else if(e.keyPressed == keysCustom.takeoff[1]){
        takeOffPlane();
    }
});

/**
 * A magic-named function where all updates should occur.
 */
function update() {
    //Offset for the default orientation towards the right
    player.setVelocityVector(Math.PI * (player.orientation), PLANE_MOVE_SPEED);
    player.update();
    var dir = player.directionToDest();
    dirSignal.x = player.x;
    dirSignal.y = player.y;
    dirSignal.radians = dir;
    if(dir < -Math.PI/6 || dir > Math.PI/6){
        showDir = true;
    }else{
        showDir = false;
    }
    console.log(dir);
}

function advanceToLevel(level){
    var $level = jQuery('#level .level').text(level);
}

/**
 * A magic-named function where all drawing should occur.
 */
function draw() {

  // Draw the background layer
  background.draw();

  // Draw a different 'grid' for start & end points
  startGrid.draw();
  endGrid.draw();

  // Draw a different start & end point
  startPoint.draw();
  endPoint.draw();

	player.draw();
    if(showDir){
        dirSignal.draw();
    }
}

function takeOffPlane() {
    takeoff = true;
    PLANE_MOVE_SPEED = DEFAULT_SPEED;
    $('#prompt').hide();
}
/**
 * Zooming with Leap Motion
 * @param direction
 * <0 means zoom in, >0 means zoom out
 */
function leapZoom(direction) {
    // Avoid overzealous scrolling causing unexpected zooming
    if (lastZoom + Mouse.Zoom.ZOOM_TIMEOUT > App.physicsTimeElapsed) return;
    if (++numScrollEvents < Mouse.Zoom.MIN_SCROLL_EVENTS) return;
    lastZoom = App.physicsTimeElapsed;
    numScrollEvents = 0;

    // Get an indication of the direction of the scroll.
    // Depending on the browser, OS, and device settings, the actual value
    // could be in pixels, lines, pages, degrees, or arbitrary units, so all
    // we can consistently deduce from this is the direction.
    //var delta = e.originalEvent.deltaY || -e.originalEvent.wheelDelta;
    // We want to scroll in around the mouse coordinates.
    var mx = player.x,
        my = player.y;
    // Scroll up; zoom in
    if (direction < 0) {
        if (world.scale > Mouse.Zoom.MIN_ZOOM) {
            world.scaleResolution(world.scale - Mouse.Zoom.ZOOM_STEP, mx, my);
            /**
             * @event zoom
             *   Fires on the document when the user zooms in or out.
             *
             * @param {Boolean} zoomIn
             *   Whether the user zoomed in or out.
             *
             * @member global
             */
            jQuery(document).trigger('zoom', true);
        }
    }
    // Scroll down; zoom out
    else {
        if(!takeoff){
            takeOffPlane();
        }
        if (world.scale < Mouse.Zoom.MAX_ZOOM) {
            world.scaleResolution(world.scale + Mouse.Zoom.ZOOM_STEP, mx, my);
            jQuery(document).trigger('zoom', false);
        }
    }
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
    $.get("http://highscoreserver.herokuapp.com/api/entries", function(data){
        console.log(data[0].name);
        console.log(data[0].score);
    });
    //Level related
    advanceToLevel(1);

  // Switch from side view to top-down.
  Actor.prototype.GRAVITY = false;

  // Set up the background layer
  background = new Layer();
  background.context.drawPattern('js/app/images/skyTile.png', 0, 0, world.width, world.height);

  startGrid = new Box(0, (world.height - 1024), 1024, 1024);
  startGrid.src = 'js/app/images/startEnd.png';

  endGrid = new Box((world.width - 1024), 0, 1024, 1024);
  endGrid.src = 'js/app/images/startEnd.png';

  startPoint = new Box((1024-512)/2, (world.height - 768), 512, 512);
  startPoint.src = 'js/app/images/startPoint.png';

  endPoint = new Box((world.width - 768), (1024-512)/2, 512, 512);
  endPoint.src = 'js/app/images/endPoint.png';

  // Initialize the player.
  player = new Plane(null, startPoint.xC() - 200, startPoint.yC() + 30);
  player.src = new SpriteMap('js/app/images/AeroMap.png',
  {stand: [0, 0, 0, 23]},
  {frameW: 256, frameH: 256,
  interval: 20, useTimer: false});

  //New Direction signal
  dirSignal = new Actor(player.xC() - 72, player.yC() - 72, 400, 400);
  dirSignal.src = new SpriteMap('js/app/images/planeArrowMap.png',
  {stand:[0, 0, 0, 9]}, {frameW: 400, frameH: 400, interval: 20,
  useTimer: false});

  // Set velocity vector for player
  player.setVelocityVector(Math.PI * player.orientation, PLANE_MOVE_SPEED);

  console.log(player.getVelocityVector());

  // Enable zooming, and display the zoom level indicator
  Mouse.Zoom.enable(showZoomLevel);

}
