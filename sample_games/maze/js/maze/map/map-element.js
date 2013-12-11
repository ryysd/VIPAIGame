// Generated by CoffeeScript 1.6.3
var BlockElement, ElementFactory, GateElement, GoalElement, MapElement, StartElement, TreasureElement,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MapElement = (function(_super) {
  __extends(MapElement, _super);

  MapElement.WIDTH = 48;

  MapElement.HEIGHT = 48;

  function MapElement(id) {
    this.id = id != null ? id : 0;
    MapElement.__super__.constructor.call(this, MapElement.WIDTH, MapElement.HEIGHT);
    this.image = Game.instance.assets[R.MAP.SRC];
    this.frame = this.id;
    this.item = null;
  }

  MapElement.prototype.isImpassable = 1;

  MapElement.prototype.isThrough = function() {
    return true;
  };

  MapElement.prototype.setItem = function(item) {
    this.item = item;
    this.parentNode.addChild(this.item);
    this.item.x = this.x;
    return this.item.y = this.y;
  };

  MapElement.prototype.onride = function(player) {
    if (this.item) {
      player.addItem(this.item);
      this.item.parentNode.removeChild(this.item);
      return this.item = null;
    }
  };

  MapElement.prototype.requiredItems = function() {
    return [];
  };

  MapElement.prototype.checkRequiredItems = function(player) {
    var checkAllRequiredItem, item, items, _i, _len;
    checkAllRequiredItem = true;
    if (this.isImpassable) {
      items = this.requiredItems();
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        checkAllRequiredItem = checkAllRequiredItem && player.hasItem(item);
      }
    }
    return checkAllRequiredItem;
  };

  MapElement.prototype.changePassable = function(player) {
    var item, items, _i, _len;
    items = this.requiredItems();
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      player.getItem(item);
    }
    return this.isImpassable = 0;
  };

  return MapElement;

})(Sprite);

BlockElement = (function(_super) {
  __extends(BlockElement, _super);

  BlockElement.ID = 4;

  function BlockElement() {
    BlockElement.__super__.constructor.call(this, BlockElement.ID);
  }

  BlockElement.prototype.isImpassable = 1;

  BlockElement.prototype.isThrough = function() {
    return false;
  };

  return BlockElement;

})(MapElement);

StartElement = (function(_super) {
  __extends(StartElement, _super);

  StartElement.ID = 14;

  function StartElement() {
    StartElement.__super__.constructor.call(this, StartElement.ID);
  }

  StartElement.prototype.isImpassable = 0;

  StartElement.prototype.isThrough = function() {
    return true;
  };

  return StartElement;

})(MapElement);

GoalElement = (function(_super) {
  __extends(GoalElement, _super);

  GoalElement.ID = 13;

  function GoalElement() {
    GoalElement.__super__.constructor.call(this, GoalElement.ID);
  }

  GoalElement.prototype.isImpassable = 0;

  GoalElement.prototype.isThrough = function() {
    return true;
  };

  GoalElement.prototype.onride = function(player) {
    GoalElement.__super__.onride.apply(this, arguments);
    return player.dispatchEvent(new MazeEvent('goal'));
  };

  return GoalElement;

})(MapElement);

TreasureElement = (function(_super) {
  __extends(TreasureElement, _super);

  TreasureElement.ID = 25;

  function TreasureElement() {
    TreasureElement.__super__.constructor.call(this, TreasureElement.ID);
  }

  TreasureElement.prototype.isImpassable = 0;

  TreasureElement.prototype.isThrough = function() {
    return true;
  };

  TreasureElement.prototype.onride = function(player) {
    return player.addItem(new Key);
  };

  TreasureElement.prototype.requiredItems = function() {
    return [new Key, new Key];
  };

  return TreasureElement;

})(MapElement);

GateElement = (function(_super) {
  __extends(GateElement, _super);

  GateElement.ID = 17;

  function GateElement() {
    GateElement.__super__.constructor.call(this, GateElement.ID);
  }

  GateElement.prototype.isImpassable = 1;

  GateElement.prototype.isThrough = function() {
    return true;
  };

  GateElement.prototype.requiredItems = function() {
    return [new Key];
  };

  return GateElement;

})(MapElement);

ElementFactory = (function() {
  function ElementFactory() {}

  ElementFactory.create = function(id) {
    var ret;
    switch (id) {
      case BlockElement.ID:
        ret = new BlockElement();
        break;
      case StartElement.ID:
        ret = new StartElement();
        break;
      case GoalElement.ID:
        ret = new GoalElement();
        break;
      case TreasureElement.ID:
        ret = new TreasureElement();
        break;
      case GateElement.ID:
        ret = new GateElement();
    }
    return ret;
  };

  return ElementFactory;

})();
