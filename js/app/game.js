var game = (function(window, $){
    var animationDefaults = "fa animated infinite",
        hasVisionPromptDisplayed = false,
        birdShit;

    function createBirdShit(height,width){
        birdShit = new Box((width/2)-(height/2), 0, height, height);
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