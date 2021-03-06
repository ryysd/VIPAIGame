// Generated by CoffeeScript 1.6.3
var ShotInstruction,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ShotInstruction = (function(_super) {
  __extends(ShotInstruction, _super);

  /*
    Shot Instruction
  */


  function ShotInstruction(robot) {
    this.robot = robot;
    ShotInstruction.__super__.constructor.apply(this, arguments);
    this.icon = new Icon(Game.instance.assets[R.TIP.SHOT_BULLET], 32, 32);
    this.setAsynchronous(true);
  }

  ShotInstruction.prototype.action = function() {
    var ret,
      _this = this;
    ret = this.robot.shot(function() {
      return _this.onComplete();
    });
    return this.setAsynchronous(ret !== false);
  };

  ShotInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new ShotInstruction(this.robot));
    return obj;
  };

  ShotInstruction.prototype.mkDescription = function() {
    return "弾を撃ちます。<br>射程距離:前方方向に距離5<br>(消費エネルギー " + Config.Energy.SHOT + " 消費フレーム " + Config.Frame.BULLET + "フレーム)";
  };

  ShotInstruction.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  ShotInstruction.prototype.getIcon = function() {
    return this.icon;
  };

  return ShotInstruction;

})(ActionInstruction);
