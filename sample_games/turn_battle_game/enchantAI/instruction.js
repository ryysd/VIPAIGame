// Generated by CoffeeScript 1.6.2
var HoldBulletBranchInstruction, HoldBulletStr, HpBranchInstruction, HpStr, MoveInstruction, MoveStr, PickupInstruction, PickupStr, R, RobotInstruction, SearchingDirectBranchInstruction, SearchingDirectStr, ShotInstruction, ShotStr,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

R = Config.R;

MoveStr = R.String.INSTRUCTION.Move;

ShotStr = R.String.INSTRUCTION.Shot;

PickupStr = R.String.INSTRUCTION.Pickup;

HpStr = R.String.INSTRUCTION.Hp;

HoldBulletStr = R.String.INSTRUCTION.HoldBulleft;

SearchingDirectStr = R.String.INSTRUCTION.SearchingDirect;

RobotInstruction = (function() {
  function RobotInstruction() {}

  RobotInstruction.MOVE = "move";

  RobotInstruction.SHOT = "shot";

  RobotInstruction.PICKUP = "pickup";

  RobotInstruction.SEARCH = "search";

  RobotInstruction.GET_HP = "getHp";

  RobotInstruction.GET_BULLET_QUEUE_SIZE = "getBulletQueueSize";

  return RobotInstruction;

})();

MoveInstruction = (function(_super) {
  __extends(MoveInstruction, _super);

  MoveInstruction.direct = [Direct.RIGHT, Direct.RIGHT | Direct.UP, Direct.RIGHT | Direct.DOWN, Direct.LEFT, Direct.LEFT | Direct.UP, Direct.LEFT | Direct.DOWN];

  MoveInstruction.frame = [0, 4, 5, 2, 6, 7];

  function MoveInstruction(robot) {
    var parameter;

    this.robot = robot;
    MoveInstruction.__super__.constructor.apply(this, arguments);
    this._id = 0;
    this.setAsynchronous(true);
    parameter = new TipParameter(MoveStr.colnum(), 0, 0, 5, 1);
    this.addParameter(parameter);
    this.icon = new Icon(Game.instance.assets[R.TIP.ARROW], 32, 32);
  }

  MoveInstruction.prototype.action = function() {
    var plate, ret;

    ret = true;
    this.robot.frame = MoveInstruction.frame[this._id];
    plate = this.robot.map.getTargetPoision(this.robot.currentPlate, MoveInstruction.direct[this._id]);
    ret = this._move(plate);
    this.setAsynchronous(ret !== false);
    return this.robot.onCmdComplete(RobotInstruction.MOVE, ret);
  };

  MoveInstruction.prototype._move = function(plate) {
    var pos, ret,
      _this = this;

    ret = false;
    this.robot.prevPlate = this.robot.currentPlate;
    if ((plate != null) && plate.lock === false) {
      pos = plate.getAbsolutePos();
      this.robot.tl.moveTo(pos.x, pos.y, PlayerRobot.UPDATE_FRAME).then(function() {
        return _this.onComplete();
      });
      this.robot.currentPlate = plate;
      ret = new Point(plate.ix, plate.iy);
    } else {
      ret = false;
    }
    return ret;
  };

  MoveInstruction.prototype.onComplete = function() {
    this.robot.onAnimateComplete();
    return MoveInstruction.__super__.onComplete.apply(this, arguments);
  };

  MoveInstruction.prototype.clone = function() {
    var obj;

    obj = this.copy(new MoveInstruction(this.robot));
    obj._id = this._id;
    return obj;
  };

  MoveInstruction.prototype.onParameterChanged = function(parameter) {
    return this._id = parameter.value;
  };

  MoveInstruction.prototype.mkDescription = function() {
    return MoveStr.description[this._id](1);
  };

  MoveInstruction.prototype.mkLabel = function() {
    return MoveStr.label[this._id]();
  };

  MoveInstruction.prototype.getIcon = function() {
    this.icon.frame = this._id;
    return this.icon;
  };

  return MoveInstruction;

})(ActionInstruction);

ShotInstruction = (function(_super) {
  var bltQueue;

  __extends(ShotInstruction, _super);

  bltQueue = null;

  function ShotInstruction(robot) {
    var parameter;

    this.robot = robot;
    ShotInstruction.__super__.constructor.apply(this, arguments);
    if (bltQueue === null) {
      bltQueue = [this.robot.bltQueue, this.robot.wideBltQueue, this.robot.dualBltQueue];
    }
    parameter = new TipParameter(ShotStr.colnum(), 0, 0, 2, 1);
    this._id = 0;
    this.addParameter(parameter);
    this.setAsynchronous(true);
  }

  ShotInstruction.prototype.action = function() {
    var b, queue, ret, _i, _len, _ref,
      _this = this;

    ret = false;
    queue = bltQueue[this._id];
    if (!queue.empty()) {
      _ref = queue.dequeue();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        b.shot(this.robot.x, this.robot.y, this.robot.getDirect());
        this.robot.scene.world.bullets.push(b);
        this.robot.scene.world.insertBefore(b, this.robot);
        b.setOnDestoryEvent(function() {
          return _this.onComplete();
        });
        ret = b;
      }
    }
    this.setAsynchronous(ret !== false);
    return this.robot.onCmdComplete(RobotInstruction.SHOT, ret);
  };

  ShotInstruction.prototype.onComplete = function() {
    this.robot.onAnimateComplete();
    return ShotInstruction.__super__.onComplete.apply(this, arguments);
  };

  ShotInstruction.prototype.onParameterChanged = function(parameter) {
    return this._id = parameter.value;
  };

  ShotInstruction.prototype.clone = function() {
    var obj;

    obj = this.copy(new ShotInstruction(this.robot));
    obj._id = this._id;
    return obj;
  };

  ShotInstruction.prototype.mkLabel = function() {
    return ShotStr.label[this._id]();
  };

  ShotInstruction.prototype.mkDescription = function() {
    return ShotStr.description[this._id]();
  };

  return ShotInstruction;

})(ActionInstruction);

PickupInstruction = (function(_super) {
  var bltQueue, itemClass, type;

  __extends(PickupInstruction, _super);

  type = [BulletType.NORMAL, BulletType.WIDE, BulletType.DUAL];

  itemClass = [NormalBulletItem, WideBulletItem, DualBulletItem];

  bltQueue = null;

  function PickupInstruction(robot) {
    var parameter;

    this.robot = robot;
    PickupInstruction.__super__.constructor.apply(this, arguments);
    if (bltQueue === null) {
      bltQueue = [this.robot.bltQueue, this.robot.wideBltQueue, this.robot.dualBltQueue];
    }
    this.setAsynchronous(true);
    parameter = new TipParameter(PickupStr.colnum(), 0, 0, 2, 1);
    this._id = 0;
    this.addParameter(parameter);
  }

  PickupInstruction.prototype.action = function() {
    var blt, item, ret,
      _this = this;

    blt = BulletFactory.create(type[this._id], this.robot);
    ret = bltQueue[this._id].enqueue(blt);
    if (ret !== false) {
      item = new itemClass[this._id](this.robot.x, this.robot.y);
      this.robot.scene.world.addChild(item);
      this.robot.scene.world.items.push(item);
      item.setOnCompleteEvent(function() {
        return _this.onComplete();
      });
      ret = blt;
    }
    this.setAsynchronous(ret !== false);
    return this.robot.onCmdComplete(RobotInstruction.PICKUP, ret);
  };

  PickupInstruction.prototype.onComplete = function() {
    this.robot.onAnimateComplete();
    return PickupInstruction.__super__.onComplete.call(this);
  };

  PickupInstruction.prototype.onParameterChanged = function(parameter) {
    return this._id = parameter.value;
  };

  PickupInstruction.prototype.clone = function() {
    var obj;

    obj = this.copy(new PickupInstruction(this.robot));
    obj._id = this._id;
    return obj;
  };

  PickupInstruction.prototype.mkLabel = function() {
    return PickupStr.label[this._id]();
  };

  PickupInstruction.prototype.mkDescription = function() {
    return PickupStr.description[this._id]();
  };

  return PickupInstruction;

})(ActionInstruction);

HpBranchInstruction = (function(_super) {
  __extends(HpBranchInstruction, _super);

  function HpBranchInstruction(robot) {
    var parameter;

    this.robot = robot;
    HpBranchInstruction.__super__.constructor.call(this);
    parameter = new TipParameter(HpStr.colnum(), 1, 1, 4, 1);
    this.hp = 1;
    this.addParameter(parameter);
  }

  HpBranchInstruction.prototype.action = function() {
    return this.hp <= this.robot.hp;
  };

  HpBranchInstruction.prototype.clone = function() {
    var obj;

    obj = this.copy(new HpBranchInstruction(this.robot));
    obj.hp = this.hp;
    return obj;
  };

  HpBranchInstruction.prototype.onParameterChanged = function(parameter) {
    return this.hp = parameter.value;
  };

  HpBranchInstruction.prototype.mkDescription = function() {
    return HpStr.description(this.hp);
  };

  return HpBranchInstruction;

})(BranchInstruction);

HoldBulletBranchInstruction = (function(_super) {
  var bltQueue;

  __extends(HoldBulletBranchInstruction, _super);

  bltQueue = null;

  function HoldBulletBranchInstruction(robot) {
    var parameter;

    this.robot = robot;
    HoldBulletBranchInstruction.__super__.constructor.apply(this, arguments);
    if (bltQueue === null) {
      bltQueue = [this.robot.bltQueue, this.robot.wideBltQueue, this.robot.dualBltQueue];
    }
    this._id = 0;
    this.bulletSize = 0;
    parameter = new TipParameter(HoldBulletStr.colnum(HoldBulletStr.id.kind), 0, 0, 3, 1);
    parameter.id = HoldBulletStr.id.kind;
    this.addParameter(parameter);
    parameter = new TipParameter(HoldBulletStr.colnum(HoldBulletStr.id.size), 0, 0, 5, 1);
    parameter.id = HoldBulletStr.id.size;
    this.addParameter(parameter);
  }

  HoldBulletBranchInstruction.prototype.action = function() {
    return this.bulletSize <= bltQueue[this._id].size();
  };

  HoldBulletBranchInstruction.prototype.clone = function() {
    var obj;

    obj = this.copy(new HoldBulletBranchInstruction(this.robot));
    obj._id = this._id;
    obj.bulletSize = this.bulletSize;
    return obj;
  };

  HoldBulletBranchInstruction.prototype.onParameterChanged = function(parameter) {
    if (parameter.id === HoldBulletStr.id.kind) {
      return this._id = parameter.value;
    } else if (parameter.id === HoldBulletStr.id.size) {
      return this.bulletSize = parameter.value;
    }
  };

  HoldBulletBranchInstruction.prototype.mkLabel = function(parameter) {
    if (parameter.id === HoldBulletStr.id.kind) {
      return HoldBulletStr.label[this._id]();
    } else if (parameter.id === HoldBulletStr.id.size) {
      return parameter.value;
    }
  };

  HoldBulletBranchInstruction.prototype.mkDescription = function() {
    return HoldBulletStr.description[this._id](this.bulletSize);
  };

  return HoldBulletBranchInstruction;

})(BranchInstruction);

SearchingDirectBranchInstruction = (function(_super) {
  var direct;

  __extends(SearchingDirectBranchInstruction, _super);

  direct = [Direct.RIGHT, Direct.RIGHT | Direct.UP, Direct.RIGHT | Direct.DOWN, Direct.LEFT, Direct.LEFT | Direct.UP, Direct.LEFT | Direct.DOWN];

  function SearchingDirectBranchInstruction(robot) {
    var parameter;

    this.robot = robot;
    SearchingDirectBranchInstruction.__super__.constructor.apply(this, arguments);
    this._id = 0;
    this.lenght = 1;
    parameter = new TipParameter(SearchingDirectStr.colnum(SearchingDirectStr.id.direct), 0, 0, 5, 1);
    parameter.id = SearchingDirectStr.id.direct;
    this.addParameter(parameter);
    parameter = new TipParameter(SearchingDirectStr.colnum(SearchingDirectStr.id.lenght), 1, 1, 4, 1);
    parameter.id = SearchingDirectStr.id.lenght;
    this.addParameter(parameter);
  }

  SearchingDirectBranchInstruction.prototype.action = function() {
    return Map.instance.isExistObject(this.robot.currentPlate, direct[this._id], this.lenght);
  };

  SearchingDirectBranchInstruction.prototype.clone = function() {
    var obj;

    obj = this.copy(new SearchingDirectBranchInstruction(this.robot));
    obj._id = this._id;
    obj.lenght = this.lenght;
    return obj;
  };

  SearchingDirectBranchInstruction.prototype.onParameterChanged = function(parameter) {
    if (parameter.id === SearchingDirectStr.id.direct) {
      return this._id = parameter.value;
    } else if (parameter.id === SearchingDirectStr.id.lenght) {
      return this.lenght = parameter.value;
    }
  };

  SearchingDirectBranchInstruction.prototype.mkLabel = function(parameter) {
    if (parameter.id === SearchingDirectStr.id.direct) {
      return SearchingDirectStr.label[this._id]();
    } else if (parameter.id === SearchingDirectStr.id.lenght) {
      return parameter.value;
    }
  };

  SearchingDirectBranchInstruction.prototype.mkDescription = function() {
    return SearchingDirectStr.description[this._id](this.lenght);
  };

  return SearchingDirectBranchInstruction;

})(BranchInstruction);
