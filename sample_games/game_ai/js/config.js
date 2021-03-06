var Config, IS_MOBILE, RobotAIGame;

if (typeof IS_MOBILE === "undefined" || IS_MOBILE === null) {
  IS_MOBILE = false;
} else {
  Environment.Mobile = true;
}

(function() {
  var classes, cls, _i, _len, _results;
  classes = [enchant.model.SpriteModel, enchant.model.GroupModel];
  _results = [];
  for (_i = 0, _len = classes.length; _i < _len; _i++) {
    cls = classes[_i];
    cls.prototype.__constructor = cls.prototype.constructor;
    _results.push(cls.prototype.constructor = function() {
      if (this.properties == null) {
        this.properties = {};
      }
      Object.defineProperties(this, this.properties);
      return this.__constructor.apply(this, arguments);
    });
  }
  return _results;
})();

RobotAIGame = (function() {
  function RobotAIGame() {}

  RobotAIGame.END = {
    KILL: 1,
    TIMERT: 2
  };

  return RobotAIGame;

})();

Config = (function() {
  function Config() {}

  Config.GAME_WIDTH = 640;

  Config.GAME_HEIGHT = 640;

  Config.GAME_OFFSET_X = 0;

  Config.GAME_OFFSET_Y = 0;

  Config.IS_MOBILE = IS_MOBILE;

  Config.EDITOR_MOBILE_SCALE_X = 0.2;

  Config.EDITOR_MOBILE_SCALE_Y = 0.2;

  Config.EDITOR_MOBILE_OFFSET_X = 640 - 128;

  Config.EDITOR_MOBILE_OFFSET_Y = 640 - 128;

  Config.OCTAGRAM_DIR = (typeof UserConfig !== "undefined" && UserConfig !== null) ? UserConfig.OCTAGRAM_DIR : "./js/octagram";

  return Config;

})();

Config.R = (function() {
  function R() {}

  R.RESOURCE_DIR = (typeof UserConfig !== "undefined" && UserConfig !== null) && (UserConfig.R != null) ? UserConfig.R.RESOURCE_DIR : "resources";

  R.CHAR = {
    PLAYER: "" + R.RESOURCE_DIR + "/robot/player.png",
    ENEMY: "" + R.RESOURCE_DIR + "/robot/enemy.png"
  };

  R.BACKGROUND_IMAGE = {
    SPACE: "" + R.RESOURCE_DIR + "/background/background_space.png",
    HEADER: "" + R.RESOURCE_DIR + "/background/header.png",
    HP_RED: "" + R.RESOURCE_DIR + "/background/hp_red.png",
    HP_GREEN: "" + R.RESOURCE_DIR + "/background/hp_green.png",
    TIMER: "" + R.RESOURCE_DIR + "/background/timer.png",
    HP_ENCLOSE: "" + R.RESOURCE_DIR + "/background/hpenclose.png",
    ENERGY: "" + R.RESOURCE_DIR + "/background/energy.png",
    PLATE: "" + R.RESOURCE_DIR + "/background/plate.png",
    PLATE_OVERLAY: "" + R.RESOURCE_DIR + "/background/plate_overlay.png",
    PLATE_ENERGY: "" + R.RESOURCE_DIR + "/background/plate_energy.png",
    MSGBOX: "" + R.RESOURCE_DIR + "/background/msgbox.png"
  };

  R.UI = {
    FONT0: "" + R.RESOURCE_DIR + "/ui/font0.png",
    ICON0: "" + R.RESOURCE_DIR + "/ui/icon0.png",
    PAD: "" + R.RESOURCE_DIR + "/ui/pad.png",
    APAD: "" + R.RESOURCE_DIR + "/ui/apad.png"
  };

  R.EFFECT = {
    EXPLOSION: "" + R.RESOURCE_DIR + "/effect/explosion_64x64.png",
    SHOT: "" + R.RESOURCE_DIR + "/effect/shot_player.png",
    SPOT_NORMAL: "" + R.RESOURCE_DIR + "/effect/spot_normal.png",
    SPOT_WIDE: "" + R.RESOURCE_DIR + "/effect/spot_wide.png",
    SPOT_DUAL: "" + R.RESOURCE_DIR + "/effect/spot_dual.png",
    ENPOWER_NORMAL: "" + R.RESOURCE_DIR + "/effect/enpower_normal.png",
    ENPOWER_WIDE: "" + R.RESOURCE_DIR + "/effect/enpower_wide.png",
    ENPOWER_DUAL: "" + R.RESOURCE_DIR + "/effect/enpower_dual.png"
  };

  R.BULLET = {
    ENEMY: "" + R.RESOURCE_DIR + "/bullet/bullet1.png",
    NORMAL: "" + R.RESOURCE_DIR + "/bullet/normal.png",
    WIDE: "" + R.RESOURCE_DIR + "/bullet/wide.png",
    DUAL: "" + R.RESOURCE_DIR + "/bullet/dual.png"
  };

  R.ITEM = {
    NORMAL_BULLET: "" + R.RESOURCE_DIR + "/item/normal_bullet_item.png",
    WIDE_BULLET: "" + R.RESOURCE_DIR + "/item/wide_bullet_item.png",
    DUAL_BULLET: "" + R.RESOURCE_DIR + "/item/dual_bullet_item.png",
    STATUS_BULLET: "" + R.RESOURCE_DIR + "/item/status_bullet.png"
  };

  R.TIP = {
    ARROW: "" + R.RESOURCE_DIR + "/tip/arrow.png",
    LIFE: "" + R.RESOURCE_DIR + "/tip/life.png",
    PICKUP_BULLET: "" + R.RESOURCE_DIR + "/tip/plus_bullet.png",
    SHOT_BULLET: "" + R.RESOURCE_DIR + "/tip/shot_bullet.png",
    SEARCH_BARRIER: "" + R.RESOURCE_DIR + "/tip/search_barrier.png",
    SEARCH_ENEMY: "" + R.RESOURCE_DIR + "/tip/search_enemy.png",
    CURRENT_DIRECT: "" + R.RESOURCE_DIR + "/tip/arrow.png",
    REST_BULLET: "" + R.RESOURCE_DIR + "/tip/rest_bullet.png",
    RANDOM_MOVE: "" + R.RESOURCE_DIR + "/tip/random_move.png",
    MOVE_TO_ENEMY: "" + R.RESOURCE_DIR + "/tip/move_to_enemy.png",
    MOVE_FROM_ENEMY: "" + R.RESOURCE_DIR + "/tip/move_from_enemy.png",
    ENERGY: "" + R.RESOURCE_DIR + "/tip/energy.png",
    REST_ENERGY_PLAYER: "" + R.RESOURCE_DIR + "/tip/rest_energy_player.png",
    REST_ENERGY_ENEMY: "" + R.RESOURCE_DIR + "/tip/rest_energy_enemy.png",
    DISTANCE: "" + R.RESOURCE_DIR + "/tip/distance.png"
  };

  return R;

})();

Config.Frame = (function() {
  var setAllFrame;

  function Frame() {}

  Frame.DIAMETER = 1;

  setAllFrame = function() {
    Frame.ROBOT_MOVE = 12 / Frame.DIAMETER;
    Frame.ROBOT_HIGH_SEEPD_MOVE = 8 / Frame.DIAMETER;
    Frame.ROBOT_WAIT = 8 / Frame.DIAMETER;
    Frame.ROBOT_TURN = 8 / Frame.DIAMETER;
    Frame.ROBOT_SUPPLY = 80 / Frame.DIAMETER;
    Frame.BULLET = 20 / Frame.DIAMETER;
    Frame.NATURAL_MAP_ENERGY_RECAVERY = 100 / Frame.DIAMETER;
    Frame.NATURAL_ROBOT_ENERGY_RECAVERY = 192 / Frame.DIAMETER;
    return Frame.GAME_TIMER_CLOCK = 28 / Frame.DIAMETER;
  };

  setAllFrame();

  Frame.setGameSpeed = function(diameter) {
    if (diameter == null) {
      diameter = 1;
    }
    if ((0 < diameter && diameter <= 4) && diameter % 2 === 0) {
      Config.Frame.DIAMETER = diameter;
    }
    if (diameter === 1) {
      Config.Frame.DIAMETER = 1;
    }
    setAllFrame();
    return diameter;
  };

  return Frame;

})();

Config.Energy = (function() {
  function Energy() {}

  Energy.MOVE = 8;

  Energy.HIGH_SEEPD_MOVE = 14;

  Energy.APPROACH = 10;

  Energy.LEAVE = 10;

  Energy.SHOT = 50;

  Energy.TURN = 8;

  return Energy;

})();

Config.R.String = (function() {
  function String() {}

  String.PLAYER = "プレイヤー";

  String.ENEMY = "エネミー";

  String.CANNOTMOVE = "移動できません。";

  String.CANNOTSHOT = "弾切れです。";

  String.CANNOTPICKUP = "弾を補充できません。";

  String.pickup = function(s) {
    return "" + s + "は弾を一つ補充しました。";
  };

  String.shot = function(s) {
    return "" + s + "は攻撃しました。";
  };

  String.turn = function(s) {
    return "" + s + "は敵をサーチしています。";
  };

  String.move = function(s, x, y) {
    return "" + s + "は(" + x + "," + y + ")に移動しました。";
  };

  String.supply = function(s, e) {
    return "" + s + "は" + e + "エネルギー補給しました。";
  };

  String.state = function(h, e) {
    return "(HP: " + h + ", エネルギー: " + e + ")";
  };

  String.die = function(s) {
    return "" + s + "はHPが0になりました。";
  };

  String.timelimit = function(s) {
    return "タイムアップで" + s + "は判定負けとなります。";
  };

  String.win = function(s) {
    return "" + s + "の勝利になります。";
  };

  return String;

})();
