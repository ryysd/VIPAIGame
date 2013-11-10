// Generated by CoffeeScript 1.6.3
var TurnEnemyScanInstruction,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TurnEnemyScanInstruction = (function(_super) {
  __extends(TurnEnemyScanInstruction, _super);

  /*
    Turn Enemy Scan Instruction
  */


  function TurnEnemyScanInstruction(robot, opponent) {
    var column, labels;
    this.robot = robot;
    this.opponent = opponent;
    TurnEnemyScanInstruction.__super__.constructor.apply(this, arguments);
    this.setAsynchronous(true);
    this.tipInfo = new TipInfo(function(labels) {
      return "" + labels[0] + "に" + labels[1] + "回ターンします。<br>その途中に射程圏内に入っていれば、<br>青い矢印に進みます。<br>そうでなければ赤い矢印に進みます。<br>(消費エネルギー 1ターン当たり" + Config.Energy.TURN + " 消費フレーム 1ターン当たり" + Config.Frame.ROBOT_TURN + "フレーム)      ";
    });
    column = "回転方向";
    labels = ["時計回り", "反時計回り"];
    this.rotateParam = new TipParameter(column, 0, 0, 1, 1);
    this.rotateParam.id = "rotate";
    this.addParameter(this.rotateParam);
    this.tipInfo.addParameter(this.rotateParam.id, column, labels, 1);
    column = "回転回数";
    labels = [0, 1, 2, 3, 4, 5];
    this.lengthParam = new TipParameter(column, 0, 0, 5, 1);
    this.lengthParam.id = "length";
    this.addParameter(this.lengthParam);
    this.tipInfo.addParameter(this.lengthParam.id, column, labels, 0);
    this.icon = new Icon(Game.instance.assets[R.TIP.SEARCH_ENEMY], 32, 32);
  }

  TurnEnemyScanInstruction.prototype.action = function() {
    var count, i, turnOnComplete,
      _this = this;
    count = this.lengthParam.value;
    i = 0;
    turnOnComplete = function(robot) {
      var bullet;
      bullet = BulletFactory.create(BulletType.NORMAL, _this.robot);
      if (bullet.withinRange(_this.robot, _this.opponent, _this.robot.direct)) {
        _this.onComplete(true);
        return;
      }
      if (i < count) {
        i += 1;
        return _this.robot.turn(_this.rotateParam.value + 1, turnOnComplete);
      } else {
        return _this.onComplete(false);
      }
    };
    return this.robot.tl.delay(Config.Frame.ROBOT_TURN).then(function() {
      return turnOnComplete(_this.robot);
    });
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
