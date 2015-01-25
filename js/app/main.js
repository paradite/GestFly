// Constants
var currentLevel = 1,
    PLANE_MOVE_SPEED = 0,
    BIRD_MOVE_SPEED = 50,
    DEFAULT_SPEED = 500,
    ANGLE_FACTOR = 0.1,
    DIRECTION_LEFT = 1,
    DIRECTION_RIGHT = 2,
    UNIT = 30,
    showZoomLevel = true,
    lastZoom = App.physicsTimeElapsed,
    numScrollEvents=0,
    aTimer = new Timer(),
    swipeCount = 0,
    MAX_FUEL = 200,
    lastSwipe = 0,
    lastSwipeTime = 0;

var player,
    showDir = true,
    dirSignal,
    inProcess=false,
    takeoff = false,
    fuelTank,
    dragOverlay;

// Controls
var keysCustom = {
  up: ['up', 'w'],
  down: ['down', 's'],
  left: ['left', 'a'],
  right: ['right', 'd'],
  takeoff: ['takeoff', 't'],
  vision: ['vision', 'v'],
  escape: ['escape', 'e']
};

Leap.loop({enableGestures: true}, function(frame) {
    frame.hands.forEach(function(hand, index) {
        rotationalAngle = -hand.roll();
        MAX_ROTATIONAL_ANGLE=1.2;
        MIN_ROTATIONAL_ANGLE=0.1;
        ROLL_FACTOR=0.15;

        if (!inProcess && frame.gestures.length == 0){
            if (rotationalAngle>0) {//right
                if (rotationalAngle<-MAX_ROTATIONAL_ANGLE)
                    move(DIRECTION_RIGHT, ANGLE_FACTOR*MAX_ROTATIONAL_ANGLE*MAX_ROTATIONAL_ANGLE*ROLL_FACTOR);
                else if (rotationalAngle>MIN_ROTATIONAL_ANGLE)
                    move(DIRECTION_RIGHT, ANGLE_FACTOR*rotationalAngle*rotationalAngle*ROLL_FACTOR);
            }
            else
                if (rotationalAngle<MAX_ROTATIONAL_ANGLE)
                    move(DIRECTION_LEFT, ANGLE_FACTOR*MAX_ROTATIONAL_ANGLE*MAX_ROTATIONAL_ANGLE*ROLL_FACTOR);
                else if (rotationalAngle<-MIN_ROTATIONAL_ANGLE)
                    move(DIRECTION_LEFT, ANGLE_FACTOR*rotationalAngle*rotationalAngle*ROLL_FACTOR);

            //if (hand.pitch()>0.2 && PLANE_MOVE_SPEED>1*hand.pitch()) PLANE_MOVE_SPEED-=1*hand.pitch(); //lift the tip of the hand to slow down
            //else if (hand.pitch()<-0.2 && PLANE_MOVE_SPEED<DEFAULT_SPEED) PLANE_MOVE_SPEED-=1.1*hand.pitch();

            //if (screenPosition[1]>0)

            zoom=-hand.screenPosition()[1];
            if (zoom>300 || zoom<-200)
            leapZoom(zoom);
            //console.log(zoom);
            
            if (hand.motion);
        }
    });

    if(frame.valid && frame.gestures.length > 0 && !inProcess){
        inProcess=true;
        frame.gestures.forEach(function(gesture){
            switch (gesture.type){
                case "circle":
                    console.log("Circle Gesture");
                    /*var circleProgress = gesture.progress;
                    //var completeCircles = Math.floor(circleProgress);
                    console.log(circleProgress);
                    //tmp=PLANE_MOVE_SPEED;
                    //PLANE_MOVE_SPEED=tmp;
                    var clockwise = false;
                    var pointableID = gesture.pointableIds[0];
                    var direction = frame.pointable(pointableID).direction;
                    var dotProduct = Leap.vec3.dot(direction, gesture.normal);
                    if (dotProduct  >  0) clockwise = true;
                    for (i=0;i<90;i++){
                        if (clockwise)
                            move(DIRECTION_RIGHT, ANGLE_FACTOR/160);
                        else move(DIRECTION_LEFT, ANGLE_FACTOR/160);
                        //update();
                    }*/
                    player.loseControl(false)
                    inProcess=false;
                    //PLANE_MOVE_SPEED=tmp;
                    break;
                case "keyTap":
                    console.log("Key Tap Gesture");
                    break;
                case "screenTap":
                    console.log("Screen Tap Gesture");
                    break;
                case "swipe":
                    console.log("Swipe Gesture");
                    if (App.physicsTimeElapsed-lastSwipeTime>1000){
                        lastSwipe=0;
                        lastSwipeTime=App.physicsTimeElapsed;
                    }
                    else {
                        //delta=aTimer.getDelta();
                        //if (delta>0.05 && delta<0.5) {
                        //  console.log(delta);

                        //Classify swipe as either horizontal or vertical
                        //var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
                        //Classify as right-left or up-down
                        //if (isHorizontal) {
                            if (gesture.direction[0] > 0) {
                                swipeDirection = "right";
                                nowSwipe = DIRECTION_RIGHT;
                            } else {
                                swipeDirection = "left";
                                nowSwipe = DIRECTION_LEFT;
                            }
                        //} else { //vertical
                        //    if (gesture.direction[1] > 0) {
                        //        swipeDirection = "up";
                        //    } else {
                        //        swipeDirection = "down";
                        //    }
                        //}
                        var duration = gesture.duration;
                        console.log(swipeDirection + " " + duration);
                        if (nowSwipe!=lastSwipe){
                            if (App.physicsTimeElapsed-lastSwipeTime<800){
                                player.toggleVision(true);
                            }
                            lastSwipe=nowSwipe;
                            lastSwipeTime=App.physicsTimeElapsed;
                        }
                        //}
                    }
                    break;
            }
        });
        inProcess=false;
    }
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
var endPointReal;

var birdFlocks;
var tornado;

var gameBgMusic;
var sndGameLevelComplete, sndGameLevelFailed;

var preloadables = ['js/app/images/skyTile.png',
                    'js/app/images/Aeroplane.png',
                    'js/app/images/startEnd.png',
                    'js/app/images/startPoint.png',
                    'js/app/images/endPoint.png',
                    'js/app/images/planeArrowMap.png',
                    'js/app/images/BirdFlockMap.png',
                    'js/app/images/TornadoMap.png'];

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
    }
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
 * Bird
 * @type {void|*}
 */
var Bird = Actor.extend({
    BIRD_MOVE_SPEED: 0,
    CONTINUOUS_MOVEMENT: true,
    orientation: 0,
    valid: true,
    src: new SpriteMap('js/app/images/BirdFlockMap.png',
        {stand:[0, 0, 0, 9]}, {frameW: 512, frameH: 512, interval: 40,
            useTimer: false}),
    updateOrientaion: function(fraction){
        this.radians = fraction * Math.PI;
        this.orientation = fraction;
    },
    init: function(x, y, sizex, sizey, speed, orientaion) {
        this.updateOrientaion(orientaion);
        this.BIRD_MOVE_SPEED = speed;
        this._super.call(this, x, y, sizex, sizey);
        this.valid = true;
    }
});

/**
 * Tornado
 */
var Tornado = Actor.extend({
    active: true,
    src: new SpriteMap('js/app/images/TornadoMap.png',
    {stand:[0, 0, 0, 10]}, {frameW: 512, frameH: 512, interval: 20, useTimer: false}),
    init: function(x, y, sizeX, sizeY) {
        this._super.call(this, x, y, sizeX, sizeY);
    }
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
    fuel: 0,
    vision: true,
    draggedByTornado: false,
    init: function(team, x, y) {
        this._super.call(this, x, y);
        this.team = team;
        this.lastShot = App.physicsTimeElapsed;
        this.orientation = 0;
        this.fuel = MAX_FUEL;
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
    toggleVision: function(allow_vision) {
        if(allow_vision){
            this.vision = true;
            game.destroyBirdShit();
            ui.hidePrompt();
        }else{
            if(this.vision == true){
                this.vision = false;
                if(!game.birdShit()) {
                    var canvas = background.canvas;
                    game.createBirdShit($(window).height(),$(window).width());
                }
                if(! ui.hasVisionPromptDisplayed){
                    ui.displayPrompt("Shake the birds off", "hand-o-up", "shake")
                    ui.hasVisionPromptDisplayed = true;
                }

            }
        }
    },
    directionToDest: function(){
        var xDist = endPoint.xC() - this.x;
        var yDist = endPoint.yC() - this.y;

        // angle in radians
        var angleRadians = Math.atan2(yDist, xDist);
        return angleRadians;
    },
    loseControl: function(bLostControl) {
        if(bLostControl) {
            ui.displayPrompt("Move your hand in a circle","hand-o-up","circle");

            this.draggedByTornado = true;

            // Deactivate the tornado, prevent getting stuck in again
            tornado.active = false;

            // Slow down the plane's speed
            PLANE_MOVE_SPEED = DEFAULT_SPEED / 10;

            // Ask player to do something to get rid of the tornado
        }
        else {
            ui.hidePrompt();
            this.draggedByTornado = false;
        }
    }
});

function move(direction, turn_angle) {
    if(!takeoff || !player.vision){
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

reachDist = function(level) {
    console.log("reach level " + level);

    App.isGameOver = true;
    stopAnimating();
    gameBgMusic.pause();
    gameBgMusic.currentTime = 0;

    if (player) {
        player.destroy();
    }

    var text = "Level " + level + " completed!";

    if(level == 0) {
        text = "Failed!"; // What is this for?
    }
    else if(level == -1) {
        text = "You ran out of fuel!";
        level = 0;

        // Play 'level failed' sound
        sndGameLevelFailed.play();
    }
    else {
        // Made it to next level
        // Play 'level complete' sound
        sndGameLevelComplete.play();
    }

    advanceToLevel(level + 1);

    // This runs during update() before the final draw(), so we have to delay it.
    setTimeout(function() {
        context.save();
        context.font = '100px Arial';
        context.fillStyle = 'black';
        context.strokeStyle = 'lightGray';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.shadowColor = 'black';
        context.shadowBlur = 8;
        context.lineWidth = 5;
        var x = Math.round(world.xOffset+canvas.width/2);
        var y = Math.round(world.yOffset+canvas.height/2);
        context.strokeText(text, x, y);
        context.fillText(text, x, y);
        context.restore();
    }, 100);
    $canvas.css('cursor', 'pointer');
    $canvas.one('click.gameover', function(e) {
        e.preventDefault();
        $canvas.css('cursor', 'auto');
        //App.reset();
        setup(false);
        console.log("finished set up for level " + level);
        App.isGameOver = false;
        startAnimating();
    });
};

/**
 * KEYBOARD
 * Record the last key pressed so the player moves in the correct direction.
 */
jQuery(document).keydown(keysCustom.up.concat(keysCustom.down, keysCustom.left, keysCustom.right, keysCustom.takeoff, keysCustom.vision, keysCustom.escape).join(' '), function(e) {

    if(e.keyPressed == keysCustom.right[1]){
        move(DIRECTION_RIGHT, ANGLE_FACTOR);
    }else if(e.keyPressed == keysCustom.left[1]){
        move(DIRECTION_LEFT, ANGLE_FACTOR);
    }else if(e.keyPressed == keysCustom.takeoff[1]){
        takeOffPlane();
    }else if(e.keyPressed == keysCustom.vision[1]){
        //TODO: Yiyang, use this method for clearing the vision
        //TODO: Also create correspond methods for circling the tornado
        player.toggleVision(true);
    }else if(e.keyPressed == keysCustom.escape[1]){
        player.loseControl(false);
    }
});

/**
 * A magic-named function where all updates should occur.
 */
function update() {

    if(!App.isGameOver && takeoff){
        player.fuel -= 0.05;

        if(!player.draggedByTornado && PLANE_MOVE_SPEED != DEFAULT_SPEED) {
            PLANE_MOVE_SPEED += 2;
        }

        //Offset for the default orientation towards the right
        player.setVelocityVector(Math.PI * (player.orientation), PLANE_MOVE_SPEED);
        player.update();

        if(player.fuel < 0){
            reachDist(-1);
        }

        birdFlocks.forEach(function(bird){
            bird.setVelocityVector(Math.PI * (bird.orientation), bird.BIRD_MOVE_SPEED);
            bird.update();
            if(bird.valid && bird.collides(player)){
                player.toggleVision(false);
                bird.valid = false;
            }
        });

        if(!player.draggedByTornado && tornado.active && tornado.collides(player)) {
            player.loseControl(true);
            console.log("Player lost control!");
        }
        else if(player.draggedByTornado && !tornado.collides(player)) {
            player.loseControl(false);
            console.log("Player regained control!");
        }

        //console.log("fuel:" + player.fuel);
        //console.log(player.x + " " + player.y);

        if(player.collides(endPointReal)){
            reachDist(currentLevel);
        }

        var dir = player.directionToDest();
        dirSignal.x = player.x-144;
        dirSignal.y = player.y-144;
        dirSignal.radians = dir;
        var diff_in_angle = dir - player.radians;
        if(diff_in_angle < -Math.PI/6 || diff_in_angle > Math.PI/6){
            showDir = true;
        }else{
            showDir = false;
        }
    }
}

function advanceToLevel(level){
    currentLevel = level;
    var $level = jQuery('#level .level').text(level);
}

/**
 * A magic-named function where all drawing should occur.
 */
function draw() {

    //console.log("drawing");
  // Draw the background layer
  background.draw();

  // Draw a different 'grid' for start & end points
  startGrid.draw();
  endGrid.draw();

  // Draw a different start & end point
  startPoint.draw();
  endPoint.draw();
  //endPointReal.draw();

	player.draw();
    if(showDir){
        dirSignal.draw();
    }
    birdFlocks.forEach(function(bird){
        bird.draw();
    });

    tornado.draw();

    dragOverlay.context.clear();
    if(game.birdShit())
        game.birdShit().draw(dragOverlay.context);
    fuelTank.draw();
}

function takeOffPlane() {
    takeoff = true;
    PLANE_MOVE_SPEED = DEFAULT_SPEED;
    ui.hidePrompt();
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
    //App.debugMode = true;
  // Change the size of the playable area. Do this before placing items!
  if(first) {
        //Level related
      advanceToLevel(1);
  }
    world.resize(1024 * mapWidth, 1024 * mapHeight);
    takeoff = false;
    PLANE_MOVE_SPEED = 0;

    $.get("http://highscoreserver.herokuapp.com/api/entries", function(data){
        console.log(data[0].name);
        console.log(data[0].score);
    });


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
  endPointReal = new Box((world.width - 640), (1024-256)/2, 256, 256);
  //endPointReal.src = 'js/app/images/endPoint.png';

  birdFlocks = new Collection();
  var birdFlock = new Bird(1536, (world.height - 1536), 512, 512, 75, 1/4);
  var birdFlock2 = new Bird((world.height/2), (world.height/2), 512, 512, 100, 3/4);
  var birdFlock3 = new Bird((world.height/2 + 200), (world.height/2 - 100), 512, 512, 30, 1/4);
  birdFlocks.add(birdFlock);
  birdFlocks.add(birdFlock2);
  birdFlocks.add(birdFlock3);

  // Create a tornado
  tornado = new Tornado(2196, world.height-1792, 512, 512);

  // Initialize the player.
  player = new Plane(null, startPoint.xC() - 200, startPoint.yC() + 30);
  player.src = new SpriteMap('js/app/images/Aeroplane.png',
  {stand: [0, 0, 3, 0]},
  {frameW: 256, frameH: 256,
  interval: 20, useTimer: false});
    console.log("set up: " + player.x +"  "+ player.y);

  //New Direction signal
  dirSignal = new Box(player.xC(), player.yC(), 400, 400);
  dirSignal.src = new SpriteMap('js/app/images/planeArrowMap.png',
  {stand:[0, 0, 0, 9]}, {frameW: 400, frameH: 400, interval: 20,
  useTimer: false});

  fuelTank = new FuelTank(0, 56, 130, 400);
  dragOverlay = new Layer({relative: 'canvas'});
  dragOverlay.positionOverCanvas();
  // Set velocity vector for player
  player.setVelocityVector(Math.PI * player.orientation, PLANE_MOVE_SPEED);

  console.log(player.getVelocityVector());

// Enable zooming, and display the zoom level indicator
    Mouse.Zoom.enable(showZoomLevel);
    aTimer.start();

    gameBgMusic = document.getElementById('gameBgMusic');
    gameBgMusic.setAttribute("preload", "auto");
    gameBgMusic.autobuffer = true;    
    gameBgMusic.load();
    gameBgMusic.play();

    sndGameLevelComplete = document.getElementById('gameLevelComplete');
    sndGameLevelComplete.setAttribute("preload", "auto");
    sndGameLevelComplete.autobuffer = true;    
    sndGameLevelComplete.load();

    sndGameLevelFailed = document.getElementById('gameLevelFailed');
    sndGameLevelFailed.setAttribute("preload", "auto");
    sndGameLevelFailed.autobuffer = true;    
    sndGameLevelFailed.load();
}


/**
 * Draw a progress bar.
 *
 * @param {CanvasRenderingContext2D} ctx
 *   A canvas graphics context onto which this progress bar should be drawn.
 * @param {Number} x
 *   The x-coordinate of the upper-left corner of the progress bar.
 * @param {Number} y
 *   The y-coordinate of the upper-left corner of the progress bar.
 * @param {Number} w
 *   The width of the progress bar.
 * @param {Number} h
 *   The height of the progress bar.
 * @param {Number} pct
 *   The fractional percent that the progress bar is complete.
 * @param {String} doneColor
 *   The CSS color of the completed portion of the progress bar.
 * @param {String} [remainingColor='transparent']
 *   The CSS color of the remaining portion of the progress bar.
 * @param {String} [borderColor='black']
 *   The CSS color of the border of the progress bar.
 */
function drawProgressBar(ctx, x, y, w, h, pct, doneColor, remainingColor, borderColor) {
    console.log("drawProgressBar left: " + pct);
    pct = 1 - pct;
    ctx.lineWidth = 1;
    ctx.fillStyle = doneColor;
    ctx.fillRect(x, y+h*pct, w, h*(1-pct));
    ctx.fillStyle = remainingColor || 'transparent';
    ctx.fillRect(x, y, w, h*pct);
    ctx.strokeStyle = borderColor || 'black';
    ctx.strokeRect(x, y, w, h);
}

var FuelTank = Box.extend({
    progressBarColor: 'green',
    drawDefault: function(ctx, x, y, w, h) {
        console.log("fuel left: " + player.fuel/MAX_FUEL);
        drawProgressBar(dragOverlay.context, x, y, w, h, player.fuel/MAX_FUEL,
            this.progressBarColor, 'black', this.progressBarBorderColor);
    }
});
