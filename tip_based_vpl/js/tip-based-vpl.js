// Generated by CoffeeScript 1.6.2
(function() {
  var arg, d, s, _i, _len, _results;

  s = document.getElementsByTagName("script");
  d = s[s.length - 1].src.substring(0, s[s.length - 1].src.lastIndexOf("/") + 1);
  _results = [];
  for (_i = 0, _len = arguments.length; _i < _len; _i++) {
    arg = arguments[_i];
    _results.push(document.write('<script type="text/javascript" src="' + d + arg + '"></script>'));
  }
  return _results;
})("vpl/sprite.group.js", "vpl/tip.model.js", "vpl/tip.instruction.js", "vpl/tip.instruction.stack.js", "vpl/test.js", "vpl/util.js", "vpl/resource.js", "vpl/tip.effect.js", "vpl/transition.js", "vpl/tip.view.js", "vpl/tip.icon.js", "vpl/tip.parameter.js", "vpl/tip.factory.js", "vpl/instruction.preset.js", "vpl/ui.js", "vpl/background.js", "vpl/cpu.js", "vpl/cpu.executer.js", "vpl/error-checker.js", "vpl/ui.slider.js", "vpl/ui.sidebar.js", "vpl/ui.config.js", "vpl/main.js");
