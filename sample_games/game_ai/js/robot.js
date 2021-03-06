var EnemyRobot, ItemQueue, PlayerRobot, R, Robot,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

R = Config.R;

/*
  store bullet objects
*/


ItemQueue = (function() {
  function ItemQueue(collection, max) {
    this.collection = collection != null ? collection : [];
    this.max = max != null ? max : -1;
  }

  ItemQueue.prototype.enqueue = function(item) {
    if (this.max !== -1 && this.max <= this.collection.length) {
      return false;
    } else {
      this.collection.push(item);
      return true;
    }
  };

  ItemQueue.prototype.dequeue = function(count) {
    var i, ret, _i;
    if (count == null) {
      count = 1;
    }
    ret = [];
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      ret.push(this.collection.shift());
    }
    return ret;
  };

  ItemQueue.prototype.empty = function() {
    return this.collection.length === 0;
  };

  ItemQueue.prototype.index = function(i) {
    return this.collection[i];
  };

  ItemQueue.prototype.size = function() {
    return this.collection.length;
  };

  return ItemQueue;

})();

Robot = (function(_super) {
  var DIRECT_FRAME, FRAME_DIRECT;

  __extends(Robot, _super);

  Robot.MAX_HP = 6;

  Robot.MAX_ENERGY = 240;

  Robot.STEAL_ENERGY_UNIT = 80;

  Robot.MAX_STEAL_ENERGY = 80;

  Robot.TURN_CLOCKWISE = 1;

  Robot.TURN_COUNTERCLOCKWISE = 2;

  DIRECT_FRAME = {};

  DIRECT_FRAME[Direct.NONE] = 0;

  DIRECT_FRAME[Direct.RIGHT] = 0;

  DIRECT_FRAME[Direct.RIGHT | Direct.DOWN] = 5;

  DIRECT_FRAME[Direct.LEFT | Direct.DOWN] = 7;

  DIRECT_FRAME[Direct.LEFT] = 2;

  DIRECT_FRAME[Direct.LEFT | Direct.UP] = 6;

  DIRECT_FRAME[Direct.RIGHT | Direct.UP] = 4;

  FRAME_DIRECT = {};

  FRAME_DIRECT[0] = Direct.RIGHT;

  FRAME_DIRECT[5] = Direct.RIGHT | Direct.DOWN;

  FRAME_DIRECT[7] = Direct.LEFT | Direct.DOWN;

  FRAME_DIRECT[2] = Direct.LEFT;

  FRAME_DIRECT[6] = Direct.LEFT | Direct.UP;

  FRAME_DIRECT[4] = Direct.RIGHT | Direct.UP;

  function Robot(width, height) {
    var plate, pos;
    Robot.__super__.constructor.call(this, width, height);
    this.name = "robot";
    this.setup("hp", Robot.MAX_HP);
    this.setup("energy", Robot.MAX_ENERGY);
    this.plateState = 0;
    this._consumptionEnergy = 0;
    plate = Map.instance.getPlate(0, 0);
    this.prevPlate = this.currentPlate = plate;
    this._animated = false;
    RobotWorld.instance.addChild(this);
    pos = plate.getAbsolutePos();
    this.moveTo(pos.x, pos.y);
  }

  Robot.prototype.properties = {
    direct: {
      get: function() {
        if (FRAME_DIRECT[this.frame] != null) {
          return FRAME_DIRECT[this.frame];
        } else {
          return FRAME_DIRECT[Direct.RIGHT];
        }
      },
      set: function(direct) {
        if (DIRECT_FRAME[direct] != null) {
          return this.frame = DIRECT_FRAME[direct];
        }
      }
    },
    animated: {
      get: function() {
        return this._animated;
      },
      set: function(value) {
        return this._animated = value;
      }
    },
    pos: {
      get: function() {
        return this.currentPlate.pos;
      }
    },
    currentPlateEnergy: {
      get: function() {
        return this.currentPlate.energy;
      }
    },
    consumptionEnergy: {
      get: function() {
        return this._consumptionEnergy;
      }
    }
  };

  Robot.prototype._moveDirect = function(direct, onComplete) {
    var plate, ret,
      _this = this;
    if (onComplete == null) {
      onComplete = function() {};
    }
    plate = Map.instance.getTargetPoision(this.currentPlate, direct);
    this.direct = direct;
    ret = this._move(plate, function() {
      var pos;
      pos = plate.getAbsolutePos();
      _this.prevPlate.dispatchEvent(new RobotEvent('away', {
        robot: _this
      }));
      _this.currentPlate.dispatchEvent(new RobotEvent('ride', {
        robot: _this
      }));
      return _this.tl.moveTo(pos.x, pos.y, Config.Frame.ROBOT_MOVE).then(function() {
        _this.dispatchEvent(new RobotEvent('move', ret));
        return onComplete();
      });
    });
    return ret;
  };

  Robot.prototype._move = function(plate, closure) {
    var pos, ret;
    ret = false;
    this.prevPlate = this.currentPlate;
    if ((plate != null) && plate.lock === false) {
      pos = plate.getAbsolutePos();
      this.currentPlate = plate;
      closure();
      ret = new Point(plate.ix, plate.iy);
    } else {
      ret = false;
    }
    return ret;
  };

  Robot.prototype.directFrame = function(direct) {
    return DIRECT_FRAME[direct];
  };

  Robot.prototype.consumeEnergy = function(value) {
    if (this.energy - value >= 0) {
      this.energy -= value;
      this._consumptionEnergy += value;
      return true;
    } else {
      return false;
    }
  };

  Robot.prototype.supplyEnergy = function(value) {
    if (this.energy + value <= Robot.MAX_ENERGY) {
      this.energy += value;
      return value;
    } else {
      value = Robot.MAX_ENERGY - this.energy;
      this.energy = Robot.MAX_ENERGY;
    }
    return value;
  };

  Robot.prototype.enoughEnergy = function(value) {
    return (this.energy - value) >= 0;
  };

  Robot.prototype.damege = function() {
    this.hp -= 1;
    if (this.hp <= 0) {
      return this.dispatchEvent(new RobotEvent("die", {}));
    }
  };

  Robot.prototype.update = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.onKeyInput(Game.instance.input);
    if (Robot.MAX_ENERGY > this.energy && this.age % Config.Frame.NATURAL_ROBOT_ENERGY_RECAVERY === 0) {
      this.supplyEnergy(Robot.MAX_ENERGY / 12);
    }
    return true;
  };

  Robot.prototype.onKeyInput = function(input) {};

  Robot.prototype.reset = function(x, y) {
    var plate;
    this.hp = Robot.MAX_HP;
    this.energy = Robot.MAX_ENERGY;
    plate = Map.instance.getPlate(x, y);
    return this.moveImmediately(plate);
  };

  Robot.prototype.move = function(direct, onComplete) {
    var ret;
    if (onComplete == null) {
      onComplete = function() {};
    }
    ret = false;
    if (this.enoughEnergy(Config.Energy.MOVE)) {
      ret = this._moveDirect(direct, onComplete);
      if (ret) {
        this.consumeEnergy(Config.Energy.MOVE);
      }
    }
    return ret;
  };

  Robot.prototype.approach = function(robot, onComplete) {
    var direct, enemyPos, ret, robotPos;
    if (onComplete == null) {
      onComplete = function() {};
    }
    ret = false;
    if (!this.enoughEnergy(Config.Energy.APPROACH)) {
      return ret;
    }
    enemyPos = robot.pos;
    robotPos = this.pos;
    robotPos.sub(enemyPos);
    direct = Direct.NONE;
    if (robotPos.x > 0) {
      direct |= Direct.LEFT;
    } else if (robotPos.x < 0) {
      direct |= Direct.RIGHT;
    }
    if (robotPos.y > 0) {
      direct |= Direct.UP;
      if (robotPos.x === 0) {
        direct |= Direct.RIGHT;
      }
    } else if (robotPos.y < 0) {
      direct |= Direct.DOWN;
      if (robotPos.x === 0) {
        direct |= Direct.LEFT;
      }
    }
    if (direct !== Direct.NONE && direct !== Direct.UP && direct !== Direct.DOWN) {
      ret = this._moveDirect(direct, onComplete);
      if (ret) {
        this.consumeEnergy(Config.Energy.APPROACH);
      }
    }
    return ret;
  };

  Robot.prototype.leave = function(robot, onComplete) {
    var direct, enemyPos, plate, ret, robotPos;
    if (onComplete == null) {
      onComplete = function() {};
    }
    ret = false;
    if (!this.enoughEnergy(Config.Energy.LEAVE)) {
      return ret;
    }
    enemyPos = robot.pos;
    robotPos = this.pos;
    robotPos.sub(enemyPos);
    direct = Direct.NONE;
    if (robotPos.x >= 0) {
      direct |= Direct.RIGHT;
    } else if (robotPos.x < 0) {
      direct |= Direct.LEFT;
    }
    if (robotPos.y >= 0) {
      direct |= Direct.DOWN;
      if (robotPos.x === 0) {
        direct |= Direct.LEFT;
      }
    } else if (robotPos.y < 0) {
      direct |= Direct.UP;
      if (robotPos.x === 0) {
        direct |= Direct.RIGHT;
      }
    }
    if (direct !== Direct.NONE && direct !== Direct.UP && direct !== Direct.DOWN) {
      plate = Map.instance.getTargetPoision(this.currentPlate, direct);
      if (!plate) {
        direct &= ~(Direct.DOWN | Direct.UP);
      }
      ret = this._moveDirect(direct, onComplete);
      if (ret) {
        this.consumeEnergy(Config.Energy.LEAVE);
      }
    }
    return ret;
  };

  Robot.prototype.moveImmediately = function(plate) {
    var ret,
      _this = this;
    ret = this._move(plate, function() {
      var pos;
      pos = plate.getAbsolutePos();
      _this.moveTo(pos.x, pos.y);
      _this.prevPlate.dispatchEvent(new RobotEvent('away', {
        robot: _this
      }));
      return _this.currentPlate.dispatchEvent(new RobotEvent('ride', {
        robot: _this
      }));
    });
    return ret;
  };

  Robot.prototype.shot = function(onComplete) {
    var blt, ret;
    if (onComplete == null) {
      onComplete = function() {};
    }
    ret = false;
    if (this.enoughEnergy(Config.Energy.SHOT)) {
      blt = BulletFactory.create(BulletType.NORMAL, this);
      blt.shot(this.x, this.y, this.direct);
      this.tl.delay(blt.maxFrame).then(onComplete);
      ret = {
        type: BulletType.NORMAL
      };
      this.dispatchEvent(new RobotEvent('shot', ret));
      this.consumeEnergy(Config.Energy.SHOT);
    }
    return ret;
  };

  Robot.prototype.turn = function(rotation, onComplete) {
    var _this = this;
    if (onComplete == null) {
      onComplete = function() {};
    }
    return this.tl.delay(Config.Frame.ROBOT_TURN).then(function() {
      if (rotation === Robot.TURN_CLOCKWISE) {
        _this.direct = Direct.next(_this.direct);
      } else {
        _this.direct = Direct.prev(_this.direct);
      }
      onComplete(_this);
      _this.consumeEnergy(Config.Energy.TURN);
      return _this.dispatchEvent(new RobotEvent('turn', {}));
    });
  };

  Robot.prototype.supply = function(energy, onComplete) {
    var ret,
      _this = this;
    if (onComplete == null) {
      onComplete = function() {};
    }
    if ((0 < energy && energy <= Robot.MAX_STEAL_ENERGY)) {
      this.parentNode.addChild(new NormalEnpowerEffect(this.x, this.y));
      ret = this.supplyEnergy(this.currentPlate.stealEnergy(energy));
      this.dispatchEvent(new RobotEvent('supply', {
        energy: ret
      }));
      return this.tl.delay(Robot.supplyFrame(energy)).then(function() {
        return onComplete(_this);
      });
    }
  };

  Robot.supplyFrame = function(energy) {
    return energy - parseInt((energy - 1) / 10);
  };

  return Robot;

})(SpriteModel);

PlayerRobot = (function(_super) {
  __extends(PlayerRobot, _super);

  PlayerRobot.WIDTH = 64;

  PlayerRobot.HEIGHT = 74;

  PlayerRobot.UPDATE_FRAME = 10;

  function PlayerRobot(parentNode) {
    this.onDebugComplete = __bind(this.onDebugComplete, this);
    PlayerRobot.__super__.constructor.call(this, PlayerRobot.WIDTH, PlayerRobot.HEIGHT, parentNode);
    this.name = R.String.PLAYER;
    this.image = Game.instance.assets[R.CHAR.PLAYER];
    this.plateState = Plate.STATE_PLAYER;
  }

  PlayerRobot.prototype.onKeyInput = function(input) {
    var ret;
    if (this.animated === true) {
      return;
    }
    ret = true;
    if (input.w === true && input.p === true) {
      this.animated = true;
      ret = this.move(Direct.LEFT | Direct.UP, this.onDebugComplete);
    } else if (input.a === true && input.p === true) {
      this.animated = true;
      ret = this.move(Direct.LEFT, this.onDebugComplete);
    } else if (input.x === true && input.p === true) {
      this.animated = true;
      ret = this.move(Direct.LEFT | Direct.DOWN, this.onDebugComplete);
    } else if (input.d === true && input.p === true) {
      this.animated = true;
      ret = this.move(Direct.RIGHT, this.onDebugComplete);
    } else if (input.e === true && input.p === true) {
      this.animated = true;
      ret = this.move(Direct.RIGHT | Direct.UP, this.onDebugComplete);
    } else if (input.c === true && input.p === true) {
      this.animated = true;
      ret = this.move(Direct.RIGHT | Direct.DOWN, this.onDebugComplete);
    } else if (input.q === true && input.n === true) {
      this.animated = true;
      ret = this.shot(this.onDebugComplete);
    }
    if (ret === false) {
      return this.onDebugComplete();
    }
  };

  PlayerRobot.prototype.onDebugComplete = function() {
    return this.animated = false;
  };

  return PlayerRobot;

})(Robot);

EnemyRobot = (function(_super) {
  __extends(EnemyRobot, _super);

  EnemyRobot.WIDTH = 64;

  EnemyRobot.HEIGHT = 74;

  EnemyRobot.UPDATE_FRAME = 10;

  function EnemyRobot(parentNode) {
    this.onDebugComplete = __bind(this.onDebugComplete, this);
    EnemyRobot.__super__.constructor.call(this, EnemyRobot.WIDTH, EnemyRobot.HEIGHT, parentNode);
    this.name = R.String.ENEMY;
    this.image = Game.instance.assets[R.CHAR.ENEMY];
    this.plateState = Plate.STATE_ENEMY;
  }

  EnemyRobot.prototype.onKeyInput = function(input) {
    var ret;
    if (this.animated === true) {
      return;
    }
    ret = true;
    if (input.w === true && input.o === true) {
      this.animated = true;
      ret = this.move(Direct.LEFT | Direct.UP, this.onDebugComplete);
    } else if (input.a === true && input.o === true) {
      this.animated = true;
      ret = this.move(Direct.LEFT, this.onDebugComplete);
    } else if (input.x === true && input.o === true) {
      this.animated = true;
      ret = this.move(Direct.LEFT | Direct.DOWN, this.onDebugComplete);
    } else if (input.d === true && input.o === true) {
      this.animated = true;
      ret = this.move(Direct.RIGHT, this.onDebugComplete);
    } else if (input.e === true && input.o === true) {
      this.animated = true;
      ret = this.move(Direct.RIGHT | Direct.UP, this.onDebugComplete);
    } else if (input.c === true && input.o === true) {
      this.animated = true;
      ret = this.move(Direct.RIGHT | Direct.DOWN, this.onDebugComplete);
    }
    if (ret === false) {
      return this.onDebugComplete();
    }
  };

  EnemyRobot.prototype.onDebugComplete = function() {
    return this.animated = false;
  };

  return EnemyRobot;

})(Robot);
