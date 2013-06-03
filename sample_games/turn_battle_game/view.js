// Generated by CoffeeScript 1.6.2
var Background, Button, Footer, Header, HpBar, HpUnderBar, Map, MsgBox, MsgWindow, NextButton, Plate, PlayerHp, R, RemainingBullet, RemainingBullets, StatusBox, StatusWindow,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

R = Config.R;

Header = (function(_super) {
  __extends(Header, _super);

  Header.WIDTH = 640;

  Header.HEIGHT = 32;

  function Header(x, y) {
    Header.__super__.constructor.call(this, Header.WIDTH, Header.HEIGHT);
    this.x = x;
    this.y = y;
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.HEADER];
  }

  return Header;

})(Sprite);

HpBar = (function(_super) {
  __extends(HpBar, _super);

  function HpBar(x, y, resource) {
    if (resource == null) {
      resource = PlayerHp.YELLOW;
    }
    HpBar.__super__.constructor.call(this, x, y);
    this.height = Header.HEIGHT;
    this.value = Header.WIDTH / 2;
    this.maxValue = Header.WIDTH / 2;
    switch (resource) {
      case PlayerHp.BLUE:
        this.image = Game.instance.assets[R.BACKGROUND_IMAGE.HP_BULE];
        break;
      case PlayerHp.YELLOW:
        this.image = Game.instance.assets[R.BACKGROUND_IMAGE.HP_YELLOW];
    }
  }

  return HpBar;

})(Bar);

HpUnderBar = (function(_super) {
  __extends(HpUnderBar, _super);

  HpUnderBar.WIDTH = Header.WIDTH / 2;

  HpUnderBar.HEIGHT = Header.HEIGHT;

  function HpUnderBar(x, y) {
    HpUnderBar.__super__.constructor.call(this, HpUnderBar.WIDTH, HpUnderBar.HEIGHT);
    this.x = x;
    this.y = y;
    this.height = Header.HEIGHT;
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.HEADER_UNDER_BAR];
  }

  return HpUnderBar;

})(Sprite);

Background = (function(_super) {
  __extends(Background, _super);

  Background.SIZE = 640;

  function Background(x, y) {
    Background.__super__.constructor.call(this, Background.SIZE, Background.SIZE);
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.SPACE];
  }

  return Background;

})(Sprite);

PlayerHp = (function(_super) {
  __extends(PlayerHp, _super);

  PlayerHp.YELLOW = 1;

  PlayerHp.BLUE = 2;

  PlayerHp.MAX_HP = 4;

  function PlayerHp(x, y, resource) {
    PlayerHp.__super__.constructor.apply(this, arguments);
    this.hp = new HpBar(x, y, resource);
    this.addChild(this.hp);
    this.underBar = new HpUnderBar(x, y);
    this.addChild(this.underBar);
  }

  PlayerHp.prototype.direct = function(direct) {
    this.underBar.scale(-1, 1);
    this.hp.direction = direct;
    return this.hp.x = Header.WIDTH;
  };

  PlayerHp.prototype.reduce = function() {
    if (this.hp.value > 0) {
      return this.hp.value -= this.hp.maxValue / PlayerHp.MAX_HP;
    }
  };

  return PlayerHp;

})(Group);

Plate = (function(_super) {
  __extends(Plate, _super);

  Plate.HEIGHT = 74;

  Plate.WIDTH = 64;

  function Plate(x, y, ix, iy) {
    this.ix = ix;
    this.iy = iy;
    Plate.__super__.constructor.call(this, Plate.WIDTH, Plate.HEIGHT);
    this.x = x;
    this.y = y;
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.PLATE];
  }

  Plate.prototype.setPlayerSelected = function() {
    var map;

    this.frame = 1;
    map = Map.instance;
    return map.object[this.frame] = new Point(map.x + this.x, map.y + this.y);
  };

  Plate.prototype.setEnemySelected = function() {
    var map;

    this.frame = 2;
    map = Map.instance;
    return map.object[this.frame] = new Point(map.x + this.x, map.y + this.y);
  };

  Plate.prototype.setNormal = function() {
    return this.frame = 0;
  };

  Plate.prototype.getAbsolutePos = function() {
    var i, offsetX, offsetY;

    i = this.parentNode;
    offsetX = offsetY = 0;
    while (i != null) {
      offsetX += i.x;
      offsetY += i.y;
      i = i.parentNode;
    }
    return new Point(this.x + offsetX, this.y + offsetY);
  };

  return Plate;

})(Sprite);

Map = (function(_super) {
  __extends(Map, _super);

  Map.WIDTH = 9;

  Map.HEIGHT = 7;

  Map.UNIT_HEIGHT = Plate.HEIGHT;

  Map.UNIT_WIDTH = Plate.WIDTH;

  function Map(x, y) {
    var list, offset, plate, tx, ty, _i, _j, _ref, _ref1;

    if (Map.instance != null) {
      return Map.instance;
    }
    Map.__super__.constructor.apply(this, arguments);
    Map.instance = this;
    this.plateMatrix = [];
    offset = 64 / 4;
    for (ty = _i = 0, _ref = Map.HEIGHT; 0 <= _ref ? _i < _ref : _i > _ref; ty = 0 <= _ref ? ++_i : --_i) {
      list = [];
      for (tx = _j = 0, _ref1 = Map.WIDTH; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; tx = 0 <= _ref1 ? ++_j : --_j) {
        if (ty % 2 === 0) {
          plate = new Plate(tx * Map.UNIT_WIDTH, (ty * Map.UNIT_HEIGHT) - ty * offset, tx, ty);
        } else {
          plate = new Plate(tx * Map.UNIT_WIDTH + Map.UNIT_HEIGHT / 2, (ty * Map.UNIT_HEIGHT) - ty * offset, tx, ty);
        }
        list.push(plate);
        this.addChild(plate);
      }
      this.plateMatrix.push(list);
    }
    this.x = x;
    this.y = y;
    this.width = Map.WIDTH * Map.UNIT_WIDTH;
    this.height = (Map.HEIGHT - 1) * (Map.UNIT_HEIGHT - offset) + Map.UNIT_HEIGHT + 16;
    this.object = {};
  }

  Map.prototype.getTargetPoision = function(plate, direct) {
    var offset;

    if (direct == null) {
      direct = Direct.RIGHT;
    }
    if (direct === Direct.RIGHT) {
      if (this.plateMatrix[plate.iy].length > plate.ix + 1) {
        return this.plateMatrix[plate.iy][plate.ix + 1];
      } else {
        return null;
      }
    } else if (direct === Direct.LEFT) {
      if (plate.ix > 0) {
        return this.plateMatrix[plate.iy][plate.ix - 1];
      } else {
        return null;
      }
    }
    if ((direct & Direct.RIGHT) !== 0 && (direct & Direct.UP) !== 0) {
      offset = plate.iy % 2 === 0 ? 0 : 1;
      if (offset + plate.ix < Map.WIDTH && plate.iy > 0) {
        return this.plateMatrix[plate.iy - 1][offset + plate.ix];
      } else {
        return null;
      }
    } else if ((direct & Direct.RIGHT) !== 0 && (direct & Direct.DOWN) !== 0) {
      offset = plate.iy % 2 === 0 ? 0 : 1;
      if (offset + plate.ix < Map.WIDTH && plate.iy + 1 < Map.HEIGHT) {
        return this.plateMatrix[plate.iy + 1][offset + plate.ix];
      } else {
        return null;
      }
    } else if ((direct & Direct.LEFT) !== 0 && (direct & Direct.UP) !== 0) {
      offset = plate.iy % 2 === 0 ? -1 : 0;
      if (offset + plate.ix >= 0 && plate.iy > 0) {
        return this.plateMatrix[plate.iy - 1][offset + plate.ix];
      } else {
        return null;
      }
    } else if ((direct & Direct.LEFT) !== 0 && (direct & Direct.DOWN) !== 0) {
      offset = plate.iy % 2 === 0 ? -1 : 0;
      if (offset + plate.ix >= 0 && plate.iy + 1 < Map.HEIGHT) {
        return this.plateMatrix[plate.iy + 1][offset + plate.ix];
      } else {
        return null;
      }
    }
    return null;
  };

  return Map;

})(Group);

Button = (function(_super) {
  __extends(Button, _super);

  Button.WIDTH = 120;

  Button.HEIGHT = 50;

  function Button(x, y) {
    Button.__super__.constructor.call(this, Button.WIDTH, Button.HEIGHT);
    this.x = x;
    this.y = y;
  }

  Button.prototype.setOnClickEventListener = function(listener) {
    return this.on_click_event = listener;
  };

  Button.prototype.ontouchstart = function() {
    if (this.on_click_event != null) {
      this.on_click_event();
    }
    return this.frame = 1;
  };

  Button.prototype.ontouchend = function() {
    return this.frame = 0;
  };

  return Button;

})(Sprite);

NextButton = (function(_super) {
  __extends(NextButton, _super);

  function NextButton(x, y) {
    NextButton.__super__.constructor.call(this, x, y);
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.NEXT_BUTTON];
  }

  return NextButton;

})(Button);

MsgWindow = (function(_super) {
  __extends(MsgWindow, _super);

  MsgWindow.WIDTH = 450;

  MsgWindow.HEIGHT = 150;

  function MsgWindow(x, y) {
    MsgWindow.__super__.constructor.call(this, MsgWindow.WIDTH, MsgWindow.HEIGHT);
    this.x = x;
    this.y = y;
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.MSGBOX];
  }

  return MsgWindow;

})(Sprite);

MsgBox = (function(_super) {
  __extends(MsgBox, _super);

  function MsgBox(x, y) {
    MsgBox.__super__.constructor.call(this, MsgWindow.WIDTH, MsgWindow.HEIGHT);
    this.x = x;
    this.y = y;
    this.window = new MsgWindow(0, 0);
    this.addChild(this.window);
    this.label = new Label;
    this.label.font = "16px 'Meiryo UI'";
    this.label.color = '#FFF';
    this.label.x = 30;
    this.label.y = 30;
    this.addChild(this.label);
    this.label.width = MsgWindow.WIDTH * 0.85;
  }

  MsgBox.prototype.print = function(msg) {
    return this.label.text = "" + msg;
  };

  return MsgBox;

})(Group);

StatusWindow = (function(_super) {
  __extends(StatusWindow, _super);

  StatusWindow.WIDTH = 180;

  StatusWindow.HEIGHT = 150;

  function StatusWindow(x, y) {
    StatusWindow.__super__.constructor.call(this, StatusWindow.WIDTH, StatusWindow.HEIGHT);
    this.x = x;
    this.y = y;
    this.image = Game.instance.assets[R.BACKGROUND_IMAGE.STATUS_BOX];
  }

  return StatusWindow;

})(Sprite);

RemainingBullet = (function(_super) {
  __extends(RemainingBullet, _super);

  RemainingBullet.SIZE = 24;

  function RemainingBullet(x, y) {
    RemainingBullet.__super__.constructor.call(this, 24, 24);
    this.x = x;
    this.y = y;
    this.image = Game.instance.assets[R.ITEM.STATUS_BULLET];
  }

  return RemainingBullet;

})(Sprite);

RemainingBullets = (function(_super) {
  __extends(RemainingBullets, _super);

  RemainingBullets.HEIGHT = 100;

  RemainingBullets.WIDTH = 120;

  function RemainingBullets(x, y) {
    RemainingBullets.__super__.constructor.call(this, RemainingBullets.WIDTH, RemainingBullets.HEIGHT);
    this.x = x;
    this.y = y;
    this.size = 0;
    this.stack = new Stack(5);
  }

  RemainingBullets.prototype.increment = function() {
    var b;

    b = new RemainingBullet(this.size * RemainingBullet.SIZE, 0);
    this.stack.push(b);
    this.size++;
    if (b != null) {
      return this.addChild(b);
    }
  };

  RemainingBullets.prototype.decrement = function() {
    var b;

    b = this.stack.pop();
    this.size--;
    if (b != null) {
      return this.removeChild(b);
    }
  };

  return RemainingBullets;

})(Group);

StatusBox = (function(_super) {
  __extends(StatusBox, _super);

  function StatusBox(x, y) {
    StatusBox.__super__.constructor.call(this, StatusWindow.WIDTH, StatusWindow.HEIGHT);
    this.x = x;
    this.y = y;
    this.window = new StatusWindow(0, 0);
    this.addChild(this.window);
    this.label = new Label("弾:");
    this.label.font = "16px 'Meiryo UI'";
    this.label.color = '#FFF';
    this.label.x = 30;
    this.label.y = 30;
    this.addChild(this.label);
    this.label.width = MsgWindow.WIDTH * 0.25;
    this.remainingBullets = new RemainingBullets(30, 30);
    this.addChild(this.remainingBullets);
  }

  return StatusBox;

})(Group);

Footer = (function(_super) {
  __extends(Footer, _super);

  function Footer(x, y) {
    Footer.__super__.constructor.apply(this, arguments);
    this.x = x;
    this.y = y;
    this.msgbox = new MsgBox(0, 0);
    this.addChild(this.msgbox);
    this.statusBox = new StatusBox(x + MsgWindow.WIDTH - 10, 0);
    this.addChild(this.statusBox);
  }

  return Footer;

})(Group);
