// Generated by CoffeeScript 1.6.3
var Direction, MazeEvent, Point, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Point = (function() {
  function Point(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Point.prototype.sub = function(point) {
    var x, y;
    x = this.x - point.x;
    y = this.y - point.y;
    return new Point(x, y);
  };

  Point.prototype.add = function(point) {
    var x, y;
    x = this.x + point.x;
    y = this.y + point.y;
    return new Point(x, y);
  };

  return Point;

})();

Direction = (function() {
  var _direct_len, _directs;

  function Direction() {}

  Direction.LEFT = new Point(-1, 0);

  Direction.RIGHT = new Point(1, 0);

  Direction.UP = new Point(0, -1);

  Direction.DOWN = new Point(0, 1);

  _directs = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];

  _direct_len = _directs.length;

  Direction.next = function(direct) {
    var i, v, _i, _len;
    for (i = _i = 0, _len = _directs.length; _i < _len; i = ++_i) {
      v = _directs[i];
      if (v === direct) {
        return _directs[(i + 1) % _direct_len];
      }
    }
    return direct;
  };

  Direction.prev = function(direct) {
    var i, v, _i, _len;
    for (i = _i = 0, _len = _directs.length; _i < _len; i = ++_i) {
      v = _directs[i];
      if (v === direct) {
        return _directs[(i + _direct_len - 1) % _direct_len];
      }
    }
    return direct;
  };

  return Direction;

})();

MazeEvent = (function(_super) {
  __extends(MazeEvent, _super);

  function MazeEvent() {
    _ref = MazeEvent.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return MazeEvent;

})(Event);
