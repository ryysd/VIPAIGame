// Generated by CoffeeScript 1.6.3
var Background, MeterView, R, ViewGroup, ViewSprite,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

R = Config.R;

ViewGroup = (function(_super) {
  __extends(ViewGroup, _super);

  function ViewGroup(x, y) {
    ViewGroup.__super__.constructor.call(this, x, y);
    this._childs = [];
  }

  ViewGroup.prototype.addView = function(view) {
    this._childs.push(view);
    return this.addChild(view);
  };

  ViewGroup.prototype.initEvent = function(world) {
    var view, _i, _len, _ref, _results;
    _ref = this._childs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      _results.push(view.initEvent(world));
    }
    return _results;
  };

  return ViewGroup;

})(Group);

ViewSprite = (function(_super) {
  __extends(ViewSprite, _super);

  function ViewSprite(x, y) {
    ViewSprite.__super__.constructor.call(this, x, y);
  }

  ViewSprite.prototype.initEvent = function(world) {};

  return ViewSprite;

})(Sprite);

Background = (function(_super) {
  __extends(Background, _super);

  Background.SIZE = 640;

  function Background(x, y) {
    Background.__super__.constructor.call(this, Background.SIZE, Background.SIZE);
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.SPACE];
    this.x = x;
    this.y = y;
  }

  return Background;

})(ViewSprite);

MeterView = (function(_super) {
  var MeterBar, MeterEnclose, MeterEnclosePart;

  __extends(MeterView, _super);

  MeterView.MAX_HP = 4;

  /*
   inner class
  */


  MeterBar = (function(_super1) {
    __extends(MeterBar, _super1);

    function MeterBar(x, y, height, maxValue, resource) {
      this.height = height;
      this.maxValue = maxValue;
      MeterBar.__super__.constructor.call(this, x, y);
      this.height = height;
      this.value = this.maxValue;
      this.image = Game.instance.assets[resource];
    }

    return MeterBar;

  })(Bar);

  MeterEnclosePart = (function(_super1) {
    __extends(MeterEnclosePart, _super1);

    function MeterEnclosePart(x, y, width, height, i) {
      MeterEnclosePart.__super__.constructor.call(this, width, height);
      this.x = x;
      this.y = y;
      if (i === 0) {
        this.frame = 0;
      } else if (i === Robot.MAX_HP - 1) {
        this.frame = 2;
      } else {
        this.frame = 1;
      }
      this.image = Game.instance.assets[R.BACKGROUND_IMAGE.HP_ENCLOSE];
    }

    return MeterEnclosePart;

  })(ViewSprite);

  MeterEnclose = (function(_super1) {
    __extends(MeterEnclose, _super1);

    function MeterEnclose(x, y, width, height, count) {
      var i, _i;
      MeterEnclose.__super__.constructor.call(this, width, height);
      this.x = x;
      this.y = y;
      for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
        this.addChild(new MeterEnclosePart(i * width, 0, width, height, i));
      }
    }

    return MeterEnclose;

  })(ViewGroup);

  function MeterView(config) {
    MeterView.__super__.constructor.apply(this, arguments);
    this.hp = new MeterBar(config.x, config.y, config.height, config.width, resource);
    this.underMeter = new MeterEnclose(x, y, this.addChild(this.underMeter));
    this.addChild(this.hp);
  }

  MeterView.prototype.reduce = function() {
    if (this.hp.value > 0) {
      return this.hp.value -= this.hp.maxValue / Robot.MAX_HP;
    }
  };

  return MeterView;

})(ViewGroup);

MeterView = (function(_super) {
  var Meter, MeterBackground, MeterBackgroundPart;

  __extends(MeterView, _super);

  /*
   inner class
  */


  Meter = (function(_super1) {
    __extends(Meter, _super1);

    function Meter(x, y, width, height, resource) {
      Meter.__super__.constructor.call(this, 0, 0);
      this.height = height;
      this.value = width;
      this.maxValue = width;
      this.image = Game.instance.assets[resource];
    }

    return Meter;

  })(Bar);

  MeterBackgroundPart = (function(_super1) {
    __extends(MeterBackgroundPart, _super1);

    function MeterBackgroundPart(x, y, width, height, resource) {
      MeterBackgroundPart.__super__.constructor.call(this, width, height);
      this.x = x;
      this.y = y;
      this.image = Game.instance.assets[resource];
    }

    return MeterBackgroundPart;

  })(ViewSprite);

  MeterBackground = (function(_super1) {
    __extends(MeterBackground, _super1);

    function MeterBackground(x, y, width, height, count, resource) {
      var i, partWidth, _i;
      MeterBackground.__super__.constructor.call(this, width, height);
      partWidth = width / count;
      for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
        this.addChild(new MeterBackgroundPart(i * partWidth, 0, partWidth, height, resource));
      }
    }

    return MeterBackground;

  })(ViewGroup);

  function MeterView(config) {
    MeterView.__super__.constructor.apply(this, arguments);
    this.x = config.x;
    this.y = config.y;
    this.partWidth = config.partWidth;
    this.count = config.count;
    this.height = config.height;
    this.width = this.partWidth * this.count;
    this.foregroundImage = config.foregroundImage;
    this.backgroundImage = config.backgroundImage;
    this.meter = new Meter(this.x, this.y, this.width, this.height, this.foregroundImage);
    this.background = new MeterBackground(this.x, this.y, this.width, this.height, this.count, this.backgroundImage);
    this.addChild(this.background);
    this.addChild(this.meter);
  }

  MeterView.prototype.decrease = function(value) {
    if (this.meter.value - value >= 0) {
      this.meter.value -= value;
      return true;
    } else {
      return false;
    }
  };

  MeterView.prototype.decreaseForce = function(value) {
    if (this.meter.value - value >= 0) {
      return this.meter.value -= value;
    } else {
      return this.meter.value = 0;
    }
  };

  MeterView.prototype.increase = function(value) {
    if (this.meter.value + value <= this.meter.maxValue) {
      this.meter.value += value;
      return true;
    } else {
      return false;
    }
  };

  MeterView.prototype.increaseForce = function(value) {
    if (this.meter.value + value <= this.meter.maxValue) {
      return this.meter.value += value;
    } else {
      return this.meter.value = this.meter.maxValue;
    }
  };

  return MeterView;

})(ViewGroup);
