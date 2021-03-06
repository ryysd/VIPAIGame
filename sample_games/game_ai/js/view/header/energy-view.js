// Generated by CoffeeScript 1.6.3
var EnemyEnergy, PlayerEnergy,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlayerEnergy = (function(_super) {
  var COUNT, PART_WIDTH;

  __extends(PlayerEnergy, _super);

  PART_WIDTH = 48;

  COUNT = 5;

  function PlayerEnergy(x, y) {
    PlayerEnergy.__super__.constructor.call(this, {
      x: x,
      y: y,
      partWidth: PART_WIDTH,
      count: COUNT,
      height: 16,
      foregroundImage: R.BACKGROUND_IMAGE.ENERGY,
      backgroundImage: R.BACKGROUND_IMAGE.HP_ENCLOSE
    });
  }

  PlayerEnergy.prototype.initEvent = function(world) {
    var _this = this;
    return world.player.addObserver("energy", function(energy) {
      if (energy < world.player.energy) {
        return _this.decreaseForce(world.player.energy - energy);
      } else {
        return _this.increaseForce(energy - world.player.energy);
      }
    });
  };

  return PlayerEnergy;

})(MeterView);

EnemyEnergy = (function(_super) {
  var COUNT, PART_WIDTH;

  __extends(EnemyEnergy, _super);

  PART_WIDTH = 48;

  COUNT = 5;

  function EnemyEnergy(x, y) {
    EnemyEnergy.__super__.constructor.call(this, {
      x: x,
      y: y,
      partWidth: PART_WIDTH,
      count: COUNT,
      height: 16,
      foregroundImage: R.BACKGROUND_IMAGE.ENERGY,
      backgroundImage: R.BACKGROUND_IMAGE.HP_ENCLOSE
    });
  }

  EnemyEnergy.prototype.initEvent = function(world) {
    var _this = this;
    return world.enemy.addObserver("energy", function(energy) {
      if (energy < world.enemy.energy) {
        return _this.decreaseForce(world.enemy.energy - energy);
      } else {
        return _this.increaseForce(energy - world.enemy.energy);
      }
    });
  };

  return EnemyEnergy;

})(MeterView);
