// Generated by CoffeeScript 1.6.3
var ScreenLoader;

ScreenLoader = (function() {
  function ScreenLoader() {}

  ScreenLoader.show = function() {
    $("#overlay").append('<div id="loader-screen"><img class="loader" src="' + getRoot() + 'img/screen-loader.gif"</div>');
    return $('#overlay').show().fadeTo('slow', 0.8);
  };

  ScreenLoader.cancel = function() {
    $("#overlay").empty();
    return $('#overlay').fadeTo('fast', 0, function() {
      return $(this).hide();
    });
  };

  return ScreenLoader;

})();
