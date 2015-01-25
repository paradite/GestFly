var game = (function(window, $){
    var animationDefaults = "fa animated infinite",
        hasVisionPromptDisplayed = false,
        birdShit;

    function createBirdShit(height,width){
        birdShit = new Box(width / 5.5, 0, height * 1, height * 1);
        birdShit.src = "js/app/images/BirdShit.png";
    }

    function getBirdShit(){
        return birdShit;
    }

    function destroyBirdShit(){
        birdShit = null;
    }

    return {
        createBirdShit : createBirdShit,
        destroyBirdShit: destroyBirdShit,
        birdShit : getBirdShit
    };
})(window, $);