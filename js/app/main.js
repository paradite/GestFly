// The main logic for your project goes in this file.

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
var keys = {
  up: ['up', 'w'],
  down: ['down', 's'],
  left: ['left', 'a'],
  right: ['right', 'd'],
};


/**
 * Resources and Images Part
 * Jinyao
 * @type {Array}
 */
var background;
var mapWidth = 3;   // in 1024x1024 tiles
var mapHeight = 3;  // in 1024x1024 tiles

var preloadables = ['js/app/images/skyTile1.png'];

/**
 * Game logic
 * Zhu Liang
 */
/**
 * A magic-named function where all updates should occur.
 */
function update() {
  player.update();
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

  // Initialize the player.
  player = new Player();

  // Set up the background layer and tile sky over it
  background = new Layer();
  background.context.drawPattern('js/app/images/skyTile1.png', 0, 0, world.width, world.height);
}
