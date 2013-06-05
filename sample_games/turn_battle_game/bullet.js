// Generated by CoffeeScript 1.6.2
var Bullet, BulletFactory, BulletGroup, BulletType, DualBullet, DualBulletPart, NormalBullet, SpritePool, WideBullet, WideBulletPart,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SpritePool = (function() {
  function SpritePool(createFunc, maxAllocSize, maxPoolSize) {
    this.createFunc = createFunc;
    this.maxAllocSize = maxAllocSize;
    this.maxPoolSize = maxPoolSize;
    this.sprites = [];
    this.count = 0;
    this.freeCallback = null;
  }

  SpritePool.prototype.setDestructor = function(destructor) {
    this.destructor = destructor;
  };

  SpritePool.prototype.alloc = function() {
    var sprite;

    if (this.count > this.maxAllocSize) {
      return null;
    }
    if (this.sprites.length === 0) {
      sprite = this.createFunc();
    } else {
      sprite = this.sprites.pop();
    }
    this.count++;
    return sprite;
  };

  SpritePool.prototype.free = function(sprite) {
    if (this.sprites.length < this.maxPoolSize) {
      this.sprites[this.sprites.length] = sprite;
    }
    this.count--;
    if (this.destructor != null) {
      return this.destructor(sprite);
    }
  };

  return SpritePool;

})();

BulletFactory = (function() {
  function BulletFactory() {}

  BulletFactory.create = function(type, robot) {
    var bullet;

    bullet = null;
    switch (type) {
      case BulletType.NORMAL:
        bullet = new NormalBullet();
        break;
      case BulletType.WIDE:
        bullet = new WideBullet();
        break;
      case BulletType.DUAL:
        bullet = new DualBullet();
        break;
      default:
        return false;
    }
    bullet.holder = robot;
    return bullet;
  };

  return BulletFactory;

})();

BulletType = (function() {
  function BulletType() {}

  BulletType.NORMAL = 1;

  BulletType.WIDE = 2;

  BulletType.DUAL = 3;

  return BulletType;

})();

Bullet = (function(_super) {
  __extends(Bullet, _super);

  Bullet.MAX_FRAME = 15;

  function Bullet(w, h, type) {
    this.type = type;
    this.onDestroy = __bind(this.onDestroy, this);
    Bullet.__super__.constructor.call(this, w, h);
    this.rotate(90);
  }

  Bullet.prototype.shot = function(x, y, direct) {
    this.x = x;
    this.y = y;
    this.direct = direct != null ? direct : Direct.RIGHT;
  };

  Bullet.prototype.hit = function(robot) {
    var effect, explosion;

    if (robot.barrierMap.isset(this.type)) {
      effect = robot.barrierMap.get(this.type);
      effect.show(robot.x, robot.y, this.scene);
    } else {
      robot.damege();
      explosion = new Explosion(robot.x, robot.y);
      this.scene.addChild(explosion);
    }
    return this.onDestroy();
  };

  Bullet.prototype.onDestroy = function() {
    if (this.animated) {
      this.animated = false;
      return this.parentNode.removeChild(this);
    }
  };

  return Bullet;

})(Sprite);

/*
    grouping Bullet Class
    behave like Bullet Class
*/


BulletGroup = (function(_super) {
  __extends(BulletGroup, _super);

  function BulletGroup(type) {
    var _this = this;

    this.type = type;
    this.onDestroy = __bind(this.onDestroy, this);
    BulletGroup.__super__.constructor.apply(this, arguments);
    this.bullets = [];
    Object.defineProperty(this, "animated", {
      get: function() {
        var animated, i, _i, _len, _ref;

        animated = true;
        _ref = _this.bullets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          animated = animated && i.animated;
        }
        return animated;
      }
    });
  }

  BulletGroup.prototype.shot = function(x, y, direct) {
    var i, _i, _len, _ref, _results;

    if (direct == null) {
      direct = Direct.RIGHT;
    }
    _ref = this.bullets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push(i.shot(x, y, direct));
    }
    return _results;
  };

  BulletGroup.prototype.hit = function(robot) {
    var effect, explosion, i, _i, _len, _ref, _results;

    if (robot.barrierMap.isset(this.type)) {
      effect = robot.barrierMap.get(this.type);
      effect.show(robot.x, robot.y, this.scene);
    } else {
      robot.damege();
      explosion = new Explosion(robot.x, robot.y);
      this.scene.addChild(explosion);
    }
    _ref = this.bullets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push(i.onDestroy());
    }
    return _results;
  };

  BulletGroup.prototype.within = function(s, value) {
    var animated, i, _i, _len, _ref;

    _ref = this.bullets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      animated = i.within(s, value);
      if (animated === true) {
        return true;
      }
    }
    return false;
  };

  BulletGroup.prototype.onDestroy = function() {
    var i, _i, _len, _ref, _results;

    _ref = this.bullets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push(i.onDestroy(robot));
    }
    return _results;
  };

  return BulletGroup;

})(Group);

/*
    straight forward 2 plates
*/


NormalBullet = (function(_super) {
  var MAX_FRAME;

  __extends(NormalBullet, _super);

  NormalBullet.WIDTH = 64;

  NormalBullet.HEIGHT = 64;

  MAX_FRAME = 15;

  function NormalBullet() {
    NormalBullet.__super__.constructor.call(this, NormalBullet.WIDTH, NormalBullet.HEIGHT, BulletType.NORMAL);
    this.image = Game.instance.assets[R.BULLET.NORMAL];
  }

  NormalBullet.prototype.shot = function(x, y, direct) {
    var point, rotate;

    this.x = x;
    this.y = y;
    this.direct = direct != null ? direct : Direct.RIGHT;
    this.animated = true;
    if (this._rorateDeg != null) {
      this.rotate(-this._rorateDeg);
    }
    rotate = 0;
    if ((this.direct & Direct.LEFT) !== 0) {
      rotate += 180;
    }
    if ((this.direct & Direct.UP) !== 0) {
      if ((this.direct & Direct.LEFT) !== 0) {
        rotate += 60;
      } else {
        rotate -= 60;
      }
    } else if ((this.direct & Direct.DOWN) !== 0) {
      if ((this.direct & Direct.LEFT) !== 0) {
        rotate -= 60;
      } else {
        rotate += 60;
      }
    }
    this.rotate(rotate);
    this._rorateDeg = rotate;
    point = Util.toCartesianCoordinates(70 * 2, Util.toRad(rotate));
    return this.tl.fadeOut(MAX_FRAME).and().moveBy(toi(point.x), toi(point.y), MAX_FRAME).then(function() {
      return this.onDestroy();
    });
  };

  return NormalBullet;

})(Bullet);

/*
    spread in 2 directions`
*/


WideBulletPart = (function(_super) {
  var MAX_FRAME;

  __extends(WideBulletPart, _super);

  WideBulletPart.WIDTH = 64;

  WideBulletPart.HEIGHT = 64;

  MAX_FRAME = 10;

  function WideBulletPart(left) {
    this.left = left != null ? left : true;
    WideBulletPart.__super__.constructor.call(this, WideBulletPart.WIDTH, WideBulletPart.HEIGHT, BulletType.WIDE);
    this.image = Game.instance.assets[R.BULLET.WIDE];
    this.frame = 1;
  }

  WideBulletPart.prototype.shot = function(x, y, direct) {
    var point, rotate;

    this.x = x;
    this.y = y;
    this.direct = direct != null ? direct : Direct.RIGHT;
    this.animated = true;
    if (this._rorateDeg != null) {
      this.rotate(-this._rorateDeg);
    }
    rotate = 0;
    if ((this.direct & Direct.LEFT) !== 0) {
      rotate += 180;
    }
    if ((this.direct & Direct.UP) !== 0) {
      if ((this.direct & Direct.LEFT) !== 0) {
        rotate += 60;
      } else {
        rotate -= 60;
      }
    } else if ((this.direct & Direct.DOWN) !== 0) {
      if ((this.direct & Direct.LEFT) !== 0) {
        rotate -= 60;
      } else {
        rotate += 60;
      }
    }
    if (this.left === true) {
      rotate -= 60;
    } else {
      rotate += 60;
    }
    this.rotate(rotate);
    this._rorateDeg = rotate;
    point = Util.toCartesianCoordinates(70, Util.toRad(rotate));
    return this.tl.fadeOut(MAX_FRAME).and().moveBy(toi(point.x), toi(point.y), MAX_FRAME).then(function() {
      return this.onDestroy();
    });
  };

  return WideBulletPart;

})(Bullet);

WideBullet = (function(_super) {
  __extends(WideBullet, _super);

  function WideBullet() {
    var i, _i, _len, _ref;

    WideBullet.__super__.constructor.call(this, BulletType.WIDE);
    this.bullets.push(new WideBulletPart(true));
    this.bullets.push(new WideBulletPart(false));
    _ref = this.bullets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      this.addChild(i);
    }
  }

  return WideBullet;

})(BulletGroup);

DualBulletPart = (function(_super) {
  var MAX_FRAME;

  __extends(DualBulletPart, _super);

  DualBulletPart.WIDTH = 64;

  DualBulletPart.HEIGHT = 64;

  MAX_FRAME = 10;

  function DualBulletPart(back) {
    this.back = back != null ? back : true;
    DualBulletPart.__super__.constructor.call(this, DualBulletPart.WIDTH, DualBulletPart.HEIGHT, BulletType.DUAL);
    this.image = Game.instance.assets[R.BULLET.DUAL];
    this.frame = 1;
  }

  DualBulletPart.prototype.shot = function(x, y, direct) {
    var point, rotate;

    this.x = x;
    this.y = y;
    this.direct = direct != null ? direct : Direct.RIGHT;
    this.animated = true;
    if (this._rorateDeg != null) {
      this.rotate(-this._rorateDeg);
    }
    rotate = 0;
    if ((this.direct & Direct.LEFT) !== 0) {
      rotate += 180;
    }
    if ((this.direct & Direct.UP) !== 0) {
      if ((this.direct & Direct.LEFT) !== 0) {
        rotate += 60;
      } else {
        rotate -= 60;
      }
    } else if ((this.direct & Direct.DOWN) !== 0) {
      if ((this.direct & Direct.LEFT) !== 0) {
        rotate -= 60;
      } else {
        rotate += 60;
      }
    }
    if (this.back === true) {
      rotate += 180;
    }
    this.rotate(rotate);
    this._rorateDeg = rotate;
    point = Util.toCartesianCoordinates(70, Util.toRad(rotate));
    return this.tl.moveBy(toi(point.x), toi(point.y), MAX_FRAME).then(function() {
      return this.onDestroy();
    });
  };

  return DualBulletPart;

})(Bullet);

DualBullet = (function(_super) {
  __extends(DualBullet, _super);

  function DualBullet() {
    var i, _i, _len, _ref;

    DualBullet.__super__.constructor.call(this, BulletType.DUAL);
    this.bullets.push(new DualBulletPart(true));
    this.bullets.push(new DualBulletPart(false));
    _ref = this.bullets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      this.addChild(i);
    }
  }

  return DualBullet;

})(BulletGroup);
