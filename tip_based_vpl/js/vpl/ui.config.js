// Generated by CoffeeScript 1.6.3
var ParameterConfigPanel, ParameterSlider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ParameterSlider = (function(_super) {
  __extends(ParameterSlider, _super);

  function ParameterSlider(parameter) {
    this.parameter = parameter;
    ParameterSlider.__super__.constructor.call(this, this.parameter.min, this.parameter.max, this.parameter.step, this.parameter.value);
  }

  ParameterSlider.prototype.show = function() {
    this.scroll(this.parameter.getValue());
    return ParameterSlider.__super__.show.call(this);
  };

  ParameterSlider.prototype.setText = function() {
    return ParameterSlider.__super__.setText.call(this, this.parameter.mkLabel());
  };

  ParameterSlider.prototype.onValueChanged = function() {
    this.parameter.setValue(this.value);
    return this.setText(this.parameter.mkLabel());
  };

  return ParameterSlider;

})(Slider);

ParameterConfigPanel = (function(_super) {
  __extends(ParameterConfigPanel, _super);

  function ParameterConfigPanel() {
    ParameterConfigPanel.__super__.constructor.call(this);
  }

  ParameterConfigPanel.prototype.addParameter = function(parameter) {
    var slider;
    slider = new ParameterSlider(parameter);
    slider.moveTo(slider.titleWidth, this.childNodes.length * slider.getHeight());
    slider.setTitle(parameter.valueName);
    return this.addChild(slider);
  };

  ParameterConfigPanel.prototype.show = function(tip) {
    var backup, i, param, _i, _len, _ref,
      _this = this;
    if (tip.parameters != null) {
      backup = {};
      _ref = tip.parameters;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        param = _ref[i];
        backup[i] = param.getValue();
        if (param._onValueChanged == null) {
          param._onValueChanged = param.onValueChanged;
          param.onValueChanged = function() {
            this._onValueChanged();
            return tip.setDescription(tip.code.mkDescription());
          };
        }
        this.addParameter(param);
      }
      Game.instance.vpl.ui.configPanel.setContent(this);
      Game.instance.vpl.ui.configPanel.show(tip);
      return Game.instance.vpl.ui.configPanel.onClosed = function(closedWithOK) {
        var _j, _len1, _ref1, _results;
        if (closedWithOK) {
          tip.icon = tip.getIcon();
          return tip.setDescription(tip.code.mkDescription());
        } else {
          _ref1 = tip.parameters;
          _results = [];
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            param = _ref1[i];
            param.setValue(backup[i]);
            _results.push(param.onParameterComplete());
          }
          return _results;
        }
      };
    }
  };

  return ParameterConfigPanel;

})(Group);
