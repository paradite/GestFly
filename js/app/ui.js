var ui = (function(window, $){
    var animationDefaults = "fa animated infinite",
        hasVisionPromptDisplayed = false;

    // Displays a prompt with the given text and icons
    function displayPrompt(text,icon,animation){
        var iconClass = "";
        animation = animation || "pulse";

        if(icon)
            iconClass = " fa-" + icon;

        // Set Prompt Icon
        $('#prompt i')
            .removeClass()
            .addClass(animationDefaults + iconClass + " " + animation);

        // Set Prompt Text
        $('#prompt span')
            .text(text);

        // Show Prompt
        $('#prompt').show();
    }

    function hidePrompt(){
        $('#prompt').hide();
    }

    return {
        displayPrompt: displayPrompt,
        hidePrompt: hidePrompt,
        hasVisionPromptDisplayed: hasVisionPromptDisplayed,
    };
})(window, $);