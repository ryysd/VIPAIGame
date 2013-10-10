// Generated by CoffeeScript 1.6.3
var AbstractMoveInstruction, EnemyScanInstructon, HoldBulletBranchInstruction, HpBranchInstruction, InstrCommon, ItemScanMoveInstruction, MoveInstruction, RandomMoveInstruction, ShotInstruction, TipInfo, TurnEnemyScanInstruction,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

InstrCommon = (function() {
  var RobotDirect, directs, frame;

  function InstrCommon() {}

  RobotDirect = (function() {
    function RobotDirect(value, frame) {
      this.value = value;
      this.frame = frame;
    }

    return RobotDirect;

  })();

  directs = [Direct.RIGHT, Direct.RIGHT | Direct.DOWN, Direct.LEFT | Direct.DOWN, Direct.LEFT, Direct.LEFT | Direct.UP, Direct.RIGHT | Direct.UP];

  frame = [0, 5, 7, 2, 6, 4];

  InstrCommon.getRobotDirect = function(i) {
    return new RobotDirect(directs[i], frame[i]);
  };

  InstrCommon.getDirectSize = function() {
    return directs.length;
  };

  InstrCommon.getDirectIndex = function(direct) {
    return directs.indexOf(direct);
  };

  InstrCommon.getFrame = function(direct) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = directs.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (directs[i] === direct) {
        return frame[i];
      }
    }
    return 0;
  };

  return InstrCommon;

})();

AbstractMoveInstruction = (function(_super) {
  __extends(AbstractMoveInstruction, _super);

  function AbstractMoveInstruction() {
    AbstractMoveInstruction.__super__.constructor.apply(this, arguments);
  }

  AbstractMoveInstruction.prototype.onComplete = function() {
    return AbstractMoveInstruction.__super__.onComplete.apply(this, arguments);
  };

  return AbstractMoveInstruction;

})(ActionInstruction);

TipInfo = (function() {
  function TipInfo(description) {
    this.description = description;
    this.params = {};
    this.labels = {};
  }

  TipInfo.prototype.addParameter = function(id, column, labels, value) {
    var param;
    param = {
      column: column,
      labels: labels
    };
    this.labels[id] = param.labels[value];
    return this.params[id] = param;
  };

  TipInfo.prototype.changeLabel = function(id, value) {
    return this.labels[id] = this.params[id].labels[value];
  };

  TipInfo.prototype.getLabel = function(id) {
    return this.labels[id];
  };

  TipInfo.prototype.getDescription = function() {
    var k, v, values;
    values = (function() {
      var _ref, _results;
      _ref = this.labels;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        _results.push(v);
      }
      return _results;
    }).call(this);
    return this.description(values);
  };

  return TipInfo;

})();

/*
  Random Move
*/


RandomMoveInstruction = (function(_super) {
  __extends(RandomMoveInstruction, _super);

  function RandomMoveInstruction(robot) {
    this.robot = robot;
    RandomMoveInstruction.__super__.constructor.apply(this, arguments);
    this.setAsynchronous(true);
    this.icon = new Icon(Game.instance.assets[R.TIP.ARROW], 32, 32);
  }

  RandomMoveInstruction.prototype.action = function() {
    var direct, rand, ret,
      _this = this;
    ret = false;
    while (!ret) {
      rand = Random.nextInt() % InstrCommon.getDirectSize();
      direct = InstrCommon.getRobotDirect(rand);
      ret = this.robot.move(direct.value, function() {
        return _this.onComplete();
      });
    }
    return this.setAsynchronous(ret !== false);
  };

  RandomMoveInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new RandomMoveInstruction(this.robot));
    return obj;
  };

  RandomMoveInstruction.prototype.mkDescription = function() {
    return "進むことができるマスにランダムに移動します";
  };

  RandomMoveInstruction.prototype.getIcon = function() {
    this.icon.frame = 0;
    return this.icon;
  };

  return RandomMoveInstruction;

})(AbstractMoveInstruction);

/*
  Move
*/


MoveInstruction = (function(_super) {
  __extends(MoveInstruction, _super);

  function MoveInstruction(robot) {
    var column, labels;
    this.robot = robot;
    MoveInstruction.__super__.constructor.apply(this, arguments);
    this.setAsynchronous(true);
    column = "移動方向";
    labels = ["右", "右下", "左下", "左", "左上", "右上"];
    this.directParam = new TipParameter(column, 0, 0, 5, 1);
    this.directParam.id = "direct";
    this.addParameter(this.directParam);
    this.tipInfo = new TipInfo(function(labels) {
      return "" + labels[0] + "に1マス移動します";
    });
    this.tipInfo.addParameter(this.directParam.id, column, labels, 0);
    this.icon = new Icon(Game.instance.assets[R.TIP.ARROW], 32, 32);
  }

  MoveInstruction.prototype.action = function() {
    var direct, ret,
      _this = this;
    ret = true;
    direct = InstrCommon.getRobotDirect(this.directParam.value);
    ret = this.robot.move(direct.value, function() {
      return _this.onComplete();
    });
    return this.setAsynchronous(ret !== false);
  };

  MoveInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new MoveInstruction(this.robot));
    obj.directParam.value = this.directParam.value;
    return obj;
  };

  MoveInstruction.prototype.onParameterChanged = function(parameter) {
    if (parameter.id === this.directParam.id) {
      this.directParam = parameter;
    }
    return this.tipInfo.changeLabel(parameter.id, parameter.value);
  };

  MoveInstruction.prototype.mkDescription = function() {
    return this.tipInfo.getDescription();
  };

  MoveInstruction.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  MoveInstruction.prototype.getIcon = function() {
    this.icon.frame = this.directParam.value;
    return this.icon;
  };

  return MoveInstruction;

})(AbstractMoveInstruction);

/*
 Turn Enemy Scan
*/


TurnEnemyScanInstruction = (function(_super) {
  __extends(TurnEnemyScanInstruction, _super);

  function TurnEnemyScanInstruction(robot, opponent) {
    var column, labels;
    this.robot = robot;
    this.opponent = opponent;
    this._turn = __bind(this._turn, this);
    TurnEnemyScanInstruction.__super__.constructor.apply(this, arguments);
    this.setAsynchronous(true);
    this.tipInfo = new TipInfo(function(labels) {
      return "" + labels[0] + "に" + labels[1] + "回ターンします。<br>その途中に所持している弾丸の射程圏内に入っていれば、<br>青い矢印に進む。そうでなければ赤い矢印に進む。<br>(消費フレーム 1回転当たり5フレーム)      ";
    });
    column = "回転方向";
    labels = ["時計回り", "反時計回り"];
    this.rotateParam = new TipParameter(column, 0, 0, 1, 1);
    this.rotateParam.id = "rotate";
    this.addParameter(this.rotateParam);
    this.tipInfo.addParameter(this.rotateParam.id, column, labels, 0);
    column = "回転回数";
    labels = [0, 1, 2, 3, 4, 5, 6];
    this.lengthParam = new TipParameter(column, 0, 0, 6, 1);
    this.lengthParam.id = "length";
    this.addParameter(this.lengthParam);
    this.tipInfo.addParameter(this.lengthParam.id, column, labels, 0);
    this.icon = new Icon(Game.instance.assets[R.TIP.SEARCH_ENEMY], 32, 32);
  }

  TurnEnemyScanInstruction.prototype._turn = function(directIndex, i, count) {
    var bullet, direct, k, v, _ref;
    if (i < count) {
      direct = InstrCommon.getRobotDirect(directIndex);
      this.robot.frame = direct.frame;
      _ref = this.robot.bulletQueue;
      for (k in _ref) {
        v = _ref[k];
        if (v.size() > 0) {
          bullet = v.index(0);
          if (bullet.withinRange(this.robot, this.opponent, direct.value)) {
            this.onComplete(true);
            return;
          }
        }
      }
      return setTimeout(this._turn, Util.toMillisec(15), (directIndex + 1) % InstrCommon.getDirectSize(), i + 1, count);
    } else {
      return this.onComplete(false);
    }
  };

  TurnEnemyScanInstruction.prototype.action = function() {
    var count, i, turnOnComplete,
      _this = this;
    count = this.lengthParam.value;
    i = 0;
    turnOnComplete = function(robot) {
      var bullet, k, v, _ref;
      if (i < count) {
        _ref = _this.robot.bulletQueue;
        for (k in _ref) {
          v = _ref[k];
          if (v.size() > 0) {
            bullet = v.index(0);
            if (bullet.withinRange(_this.robot, _this.opponent, _this.robot.direct)) {
              _this.onComplete(true);
              return;
            }
          }
        }
        i += 1;
        return _this.robot.turn(turnOnComplete);
      } else {
        return _this.onComplete(false);
      }
    };
    return this.robot.turn(turnOnComplete);
  };

  TurnEnemyScanInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new TurnEnemyScanInstruction(this.robot, this.opponent));
    obj.rotateParam.value = this.rotateParam.value;
    obj.lengthParam.value = this.lengthParam.value;
    return obj;
  };

  TurnEnemyScanInstruction.prototype.onParameterChanged = function(parameter) {
    if (parameter.id === this.rotateParam.id) {
      this.rotateParam = parameter;
    } else if (parameter.id === this.lengthParam.id) {
      this.lengthParam = parameter;
    }
    return this.tipInfo.changeLabel(parameter.id, parameter.value);
  };

  TurnEnemyScanInstruction.prototype.mkDescription = function() {
    return this.tipInfo.getDescription();
  };

  TurnEnemyScanInstruction.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  TurnEnemyScanInstruction.prototype.getIcon = function() {
    return this.icon;
  };

  return TurnEnemyScanInstruction;

})(BranchInstruction);

/*
  scan item -> go
*/


ItemScanMoveInstruction = (function(_super) {
  __extends(ItemScanMoveInstruction, _super);

  function ItemScanMoveInstruction(robot) {
    this.robot = robot;
    ItemScanMoveInstruction.__super__.constructor.apply(this, arguments);
    this.setAsynchronous(true);
    this.icon = new Icon(Game.instance.assets[R.TIP.SEARCH_BARRIER], 32, 32);
  }

  ItemScanMoveInstruction.prototype.action = function() {
    var _this = this;
    return setTimeout(function() {
      var ret, target, targetDirect;
      ret = false;
      target = null;
      targetDirect = null;
      Map.instance.eachSurroundingPlate(_this.robot.currentPlate, function(plate, direct) {
        if (target === null && (plate.spot != null)) {
          target = plate;
          return targetDirect = direct;
        }
      });
      if (target != null) {
        return ret = _this.robot.move(targetDirect, function() {
          return _this.onComplete();
        });
      } else {
        return setTimeout((function() {
          return _this.onComplete();
        }), Util.toMillisec(PlayerRobot.UPDATE_FRAME));
      }
    }, Util.toMillisec(PlayerRobot.UPDATE_FRAME));
  };

  ItemScanMoveInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new ItemScanMoveInstruction(this.robot));
    return obj;
  };

  ItemScanMoveInstruction.prototype.mkDescription = function() {
    return "周囲1マスを探索し、そのマスにセットされていないバリアーが存在した場合、そのマスへ進む。<br>(消費フレーム 40フレーム)      ";
  };

  ItemScanMoveInstruction.prototype.getIcon = function() {
    return this.icon;
  };

  return ItemScanMoveInstruction;

})(AbstractMoveInstruction);

EnemyScanInstructon = (function(_super) {
  __extends(EnemyScanInstructon, _super);

  function EnemyScanInstructon(robot, opponent) {
    var column, labels;
    this.robot = robot;
    this.opponent = opponent;
    EnemyScanInstructon.__super__.constructor.apply(this, arguments);
    this.tipInfo = new TipInfo(function(labels) {
      return "" + labels[0] + "バレットが射程圏内に入っていれば、青矢印に進む。<br>そうでなければ赤い矢印に進む";
    });
    column = "弾丸の種類";
    labels = {
      "1": "ストレート",
      "2": "ワイド",
      "3": "デュアル"
    };
    this.typeParam = new TipParameter(column, 1, 1, 3, 1);
    this.typeParam.id = "type";
    this.addParameter(this.typeParam);
    this.tipInfo.addParameter(this.typeParam.id, column, labels, 1);
    this.icon = new Icon(Game.instance.assets[R.TIP.SEARCH_ENEMY], 32, 32);
  }

  EnemyScanInstructon.prototype.action = function() {
    var bullet;
    bullet = BulletFactory.create(this.typeParam.value, this.robot);
    if (bullet != null) {
      return bullet.withinRange(this.robot, this.opponent, this.robot.direct);
    } else {
      return false;
    }
  };

  EnemyScanInstructon.prototype.clone = function() {
    var obj;
    obj = this.copy(new EnemyScanInstructon(this.robot, this.opponent));
    obj.typeParam.value = this.typeParam.value;
    return obj;
  };

  EnemyScanInstructon.prototype.onParameterChanged = function(parameter) {
    this.typeParam = parameter;
    return this.tipInfo.changeLabel(parameter.id, parameter.value);
  };

  EnemyScanInstructon.prototype.mkDescription = function() {
    return this.tipInfo.getDescription();
  };

  EnemyScanInstructon.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  EnemyScanInstructon.prototype.getIcon = function() {
    return this.icon;
  };

  return EnemyScanInstructon;

})(BranchInstruction);

ShotInstruction = (function(_super) {
  __extends(ShotInstruction, _super);

  function ShotInstruction(robot) {
    var column, labels;
    this.robot = robot;
    ShotInstruction.__super__.constructor.apply(this, arguments);
    this.tipInfo = new TipInfo(function(labels) {
      return "" + labels[0] + "バレットを撃つ";
    });
    column = "弾丸の種類";
    labels = {
      "1": "ストレート",
      "2": "ワイド",
      "3": "デュアル"
    };
    this.typeParam = new TipParameter(column, 1, 1, 3, 1);
    this.typeParam.id = "type";
    this.addParameter(this.typeParam);
    this.tipInfo.addParameter(this.typeParam.id, column, labels, 1);
    this.icon = new Icon(Game.instance.assets[R.TIP.SHOT_BULLET], 32, 32);
    this.setAsynchronous(true);
  }

  ShotInstruction.prototype.action = function() {
    var ret,
      _this = this;
    ret = this.robot.shot(this.typeParam.value, function() {
      return _this.onComplete();
    });
    this.setAsynchronous(ret !== false);
    return this.robot.onCmdComplete(RobotInstruction.SHOT, ret);
  };

  ShotInstruction.prototype.onComplete = function() {
    return ShotInstruction.__super__.onComplete.call(this);
  };

  ShotInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new ShotInstruction(this.robot));
    obj.typeParam.value = this.typeParam.value;
    return obj;
  };

  ShotInstruction.prototype.onParameterChanged = function(parameter) {
    this.typeParam = parameter;
    return this.tipInfo.changeLabel(parameter.id, parameter.value);
  };

  ShotInstruction.prototype.mkDescription = function() {
    return this.tipInfo.getDescription();
  };

  ShotInstruction.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  ShotInstruction.prototype.getIcon = function() {
    this.icon.frame = this.typeParam.value - 1;
    return this.icon;
  };

  return ShotInstruction;

})(ActionInstruction);

HpBranchInstruction = (function(_super) {
  __extends(HpBranchInstruction, _super);

  function HpBranchInstruction(robot) {
    var column, i, labels, _i, _ref;
    this.robot = robot;
    HpBranchInstruction.__super__.constructor.apply(this, arguments);
    this.tipInfo = new TipInfo(function(labels) {
      return "HPが" + labels[0] + "以上の時青矢印に進む。<br>" + labels[0] + "未満の時は赤矢印に進む。";
    });
    column = "HP";
    labels = {};
    for (i = _i = 1, _ref = Robot.MAX_HP; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
      labels[String(i)] = i;
    }
    this.hpParam = new TipParameter(column, 1, 1, Robot.MAX_HP, 1);
    this.hpParam.id = "size";
    this.addParameter(this.hpParam);
    this.tipInfo.addParameter(this.hpParam.id, column, labels, 1);
    this.icon = new Icon(Game.instance.assets[R.TIP.LIFE], 32, 32);
  }

  HpBranchInstruction.prototype.action = function() {
    return this.hpParam.value <= this.robot.hp;
  };

  HpBranchInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new HpBranchInstruction(this.robot));
    obj.hpParam.value = this.hpParam.value;
    return obj;
  };

  HpBranchInstruction.prototype.onParameterChanged = function(parameter) {
    if (parameter.id === this.hpParam.id) {
      this.hpParam = parameter;
    }
    return this.tipInfo.changeLabel(parameter.id, parameter.value);
  };

  HpBranchInstruction.prototype.mkDescription = function() {
    return this.tipInfo.getDescription();
  };

  HpBranchInstruction.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  HpBranchInstruction.prototype.getIcon = function() {
    return this.icon;
  };

  return HpBranchInstruction;

})(BranchInstruction);

HoldBulletBranchInstruction = (function(_super) {
  __extends(HoldBulletBranchInstruction, _super);

  function HoldBulletBranchInstruction(robot) {
    var column, labels;
    this.robot = robot;
    HoldBulletBranchInstruction.__super__.constructor.apply(this, arguments);
    this.tipInfo = new TipInfo(function(labels) {
      return "" + labels[0] + "バレッドの保有弾数が" + labels[1] + "以上の時青矢印に進む。<br>" + labels[1] + "未満の時は赤矢印に進む。";
    });
    column = "弾丸の種類";
    labels = {
      "1": "ストレート",
      "2": "ワイド",
      "3": "デュアル"
    };
    this.typeParam = new TipParameter(column, 1, 1, 3, 1);
    this.typeParam.id = "type";
    this.addParameter(this.typeParam);
    this.tipInfo.addParameter(this.typeParam.id, column, labels, 1);
    column = "保有弾数";
    labels = [0, 1, 2, 3, 4, 5];
    this.sizeParam = new TipParameter(column, 0, 0, 5, 1);
    this.sizeParam.id = "size";
    this.addParameter(this.sizeParam);
    this.tipInfo.addParameter(this.sizeParam.id, column, labels, 0);
    this.icon = new Icon(Game.instance.assets[R.TIP.REST_BULLET], 32, 32);
  }

  HoldBulletBranchInstruction.prototype.action = function() {
    var bltQueue;
    switch (this.typeParam.value) {
      case BulletType.NORMAL:
        bltQueue = this.robot.bulletQueue.normal;
        break;
      case BulletType.WIDE:
        bltQueue = this.robot.bulletQueue.wide;
        break;
      case BulletType.DUAL:
        bltQueue = this.robot.bulletQueue.dual;
    }
    if (bltQueue.size() >= this.sizeParam.value) {
      return true;
    } else {
      return false;
    }
  };

  HoldBulletBranchInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new HoldBulletBranchInstruction(this.robot));
    obj.typeParam.value = this.typeParam.value;
    obj.sizeParam.value = this.sizeParam.value;
    return obj;
  };

  HoldBulletBranchInstruction.prototype.onParameterChanged = function(parameter) {
    if (parameter.id === this.typeParam.id) {
      this.typeParam = parameter;
    } else if (parameter.id === this.sizeParam.id) {
      this.sizeParam = parameter;
    }
    return this.tipInfo.changeLabel(parameter.id, parameter.value);
  };

  HoldBulletBranchInstruction.prototype.mkDescription = function() {
    return this.tipInfo.getDescription();
  };

  HoldBulletBranchInstruction.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  HoldBulletBranchInstruction.prototype.getIcon = function() {
    return this.icon;
  };

  return HoldBulletBranchInstruction;

})(BranchInstruction);