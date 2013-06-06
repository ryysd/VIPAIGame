// Generated by CoffeeScript 1.6.2
var BranchTransitionCodeTip, CodeTip, Direction, Icon, JumpTransitionCodeTip, SingleTransitionCodeTip, TipParameter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Direction = (function() {
  function Direction() {}

  Direction.left = new Point(-1, 0);

  Direction.right = new Point(1, 0);

  Direction.up = new Point(0, -1);

  Direction.down = new Point(0, 1);

  Direction.leftUp = new Point(-1, -1);

  Direction.leftDown = new Point(-1, 1);

  Direction.rightUp = new Point(1, -1);

  Direction.rightDown = new Point(1, 1);

  Direction.toDirection = function(x, y) {
    if (x === -1 && y === 0) {
      return Direction.left;
    } else if (x === 1 && y === 0) {
      return Direction.right;
    } else if (x === 0 && y === -1) {
      return Direction.up;
    } else if (x === 0 && y === 1) {
      return Direction.down;
    } else if (x === -1 && y === -1) {
      return Direction.leftUp;
    } else if (x === -1 && y === 1) {
      return Direction.leftDown;
    } else if (x === 1 && y === -1) {
      return Direction.rightUp;
    } else if (x === 1 && y === 1) {
      return Direction.rightDown;
    }
  };

  return Direction;

})();

CodeTip = (function(_super) {
  __extends(CodeTip, _super);

  CodeTip.selectedEffect = null;

  CodeTip.selectedInstance = null;

  CodeTip.clonedTip = null;

  function CodeTip(code) {
    var image,
      _this = this;

    this.code = code;
    this.select = __bind(this.select, this);
    this.immutable = this.code instanceof WallTip || this.code instanceof StartTip;
    this.description = this.code.mkDescription();
    image = TipUtil.tipToImage(this.code);
    CodeTip.__super__.constructor.call(this, image.width, image.height);
    this.image = image;
    this.icon = null;
    this.dragMode = false;
    CodeTip.clonedTip = null;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.parameters = this.code.instruction != null ? this.code.instruction.parameters : void 0;
    this.addEventListener('touchstart', function(e) {
      _this.dragMode = false;
      return _this.select();
    });
    this.addEventListener('touchmove', function(e) {
      if (!_this.dragMode && !_this.immutable) {
        _this.dragMode = true;
        _this.dragStart(e);
      }
      return _this.dragged(e);
    });
    this.addEventListener('touchend', function(e) {
      if (!_this.immutable) {
        if (!_this.dragMode && _this.isSelected()) {
          _this.doubleClicked();
        } else {
          _this.dragEnd(e);
        }
      }
      return CodeTip.selectedInstance = _this;
    });
    this.executionEffect = new ExecutionEffect(this);
    if (CodeTip.selectedEffect == null) {
      CodeTip.selectedEffect = new SelectedEffect();
    }
    LayerUtil.setOrder(this, LayerOrder.tip);
  }

  CodeTip.prototype.select = function() {
    GlobalUI.help.setText(this.description);
    return this.showSelectedEffect();
  };

  CodeTip.prototype.unselect = function() {
    GlobalUI.help.setText("");
    return this.hideSelectedEffect();
  };

  CodeTip.prototype.execute = function() {
    if (this.code != null) {
      return this.code.execute();
    } else {
      return null;
    }
  };

  CodeTip.prototype.doubleClicked = function() {
    return this.showConfigWindow();
  };

  CodeTip.prototype.createGhost = function() {
    var tip;

    if (CodeTip.clonedTip != null) {
      CodeTip.clonedTip.hide();
    }
    tip = this.clone();
    tip.opacity = 0.5;
    if (tip.icon != null) {
      tip.icon.opacity = 0.5;
    }
    tip.moveTo(this.x, this.y);
    tip.clearEventListener();
    return tip;
  };

  CodeTip.prototype.dragStart = function(e) {
    CodeTip.clonedTip = this.createGhost();
    CodeTip.clonedTip.show();
    this.dragStartX = e.x;
    return this.dragStartY = e.y;
  };

  CodeTip.prototype.dragged = function(e) {
    var dx, dy;

    dx = e.x - this.dragStartX;
    dy = e.y - this.dragStartY;
    return CodeTip.clonedTip.moveTo(this.x + dx, this.y + dy);
  };

  CodeTip.prototype.dragEnd = function(e) {
    var evt;

    if (CodeTip.clonedTip != null) {
      CodeTip.clonedTip.hide();
      evt = document.createEvent('UIEvent', false);
      evt.initUIEvent('copyTip', true, true);
      evt.tip = CodeTip.clonedTip;
      return document.dispatchEvent(evt);
    }
  };

  CodeTip.prototype.showConfigWindow = function() {
    var backup, i, param, _i, _len, _ref,
      _this = this;

    if (this.parameters != null) {
      backup = {};
      GlobalUI.configPanel.content.clear();
      _ref = this.parameters;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        param = _ref[i];
        backup[i] = param.getValue();
        GlobalUI.configPanel.content.addParameter(param);
      }
      GlobalUI.configPanel.show(this);
      return GlobalUI.configPanel.onClosed = function(closedWithOK) {
        var _j, _len1, _ref1, _results;

        if (closedWithOK) {
          _this.updateIcon();
          return _this.setDescription(_this.code.mkDescription());
        } else {
          _ref1 = _this.parameters;
          _results = [];
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            param = _ref1[i];
            _results.push(param.setValue(backup[i]));
          }
          return _results;
        }
      };
    }
  };

  CodeTip.prototype.isSelected = function() {
    return CodeTip.selectedInstance === this;
  };

  CodeTip.prototype.showExecutionEffect = function() {
    return this.executionEffect.show();
  };

  CodeTip.prototype.hideExecutionEffect = function() {
    return this.executionEffect.hide();
  };

  CodeTip.prototype.showSelectedEffect = function() {
    return CodeTip.selectedEffect.show(this);
  };

  CodeTip.prototype.hideSelectedEffect = function() {
    return CodeTip.selectedEffect.hide();
  };

  CodeTip.prototype.isAsynchronous = function() {
    return (this.code.isAsynchronous != null) && this.code.isAsynchronous();
  };

  CodeTip.prototype.updateIcon = function() {
    var icon;

    if (this.icon != null) {
      this.icon.hide();
    }
    this.icon = this.code.getIcon != null ? this.code.getIcon() : (icon = TipUtil.tipToIcon(this.code), icon != null ? new Icon(icon) : null);
    if (this.icon != null) {
      return this.icon.show(this);
    }
  };

  CodeTip.prototype.setDescription = function(desc) {
    this.description = desc;
    return this.onDescriptionChanged();
  };

  CodeTip.prototype.setIcon = function(icon) {
    this.icon = icon;
    return this.icon.fitPosition();
  };

  CodeTip.prototype.getIcon = function(icon) {
    return this.icon;
  };

  CodeTip.prototype.onDescriptionChanged = function() {
    if (this.isSelected()) {
      return GlobalUI.help.setText(this.description);
    }
  };

  CodeTip.prototype.setIndex = function(idxX, idxY) {
    return this.code.index = {
      x: idxX,
      y: idxY
    };
  };

  CodeTip.prototype.getIndex = function() {
    return this.code.index;
  };

  CodeTip.prototype.moveTo = function(x, y) {
    CodeTip.__super__.moveTo.call(this, x, y);
    if (this.icon != null) {
      return this.icon.fitPosition();
    }
  };

  CodeTip.prototype.moveBy = function(x, y) {
    CodeTip.__super__.moveBy.call(this, x, y);
    if (this.icon != null) {
      return this.icon.fitPosition();
    }
  };

  CodeTip.prototype.show = function() {
    Game.instance.currentScene.addChild(this);
    return this.updateIcon();
  };

  CodeTip.prototype.hide = function() {
    Game.instance.currentScene.removeChild(this);
    if (this.icon != null) {
      return this.icon.hide();
    }
  };

  CodeTip.prototype.clone = function() {
    return new CodeTip(this.code.clone());
  };

  CodeTip.prototype.copy = function(obj) {
    obj.description = this.description;
    if (this.icon != null) {
      obj.icon = this.icon.clone();
    }
    return obj;
  };

  return CodeTip;

})(Sprite);

SingleTransitionCodeTip = (function(_super) {
  __extends(SingleTransitionCodeTip, _super);

  function SingleTransitionCodeTip(code) {
    SingleTransitionCodeTip.__super__.constructor.call(this, code);
    this.trans = null;
  }

  SingleTransitionCodeTip.prototype.setNext = function(x, y, dst) {
    if (this.trans != null) {
      this.trans.hide();
    }
    this.trans = new NormalTransition(this, dst);
    this.trans.show();
    return this.code.setNext({
      x: x,
      y: y
    });
  };

  SingleTransitionCodeTip.prototype.getNextDir = function() {
    var next;

    next = this.code.getNext();
    if (next == null) {
      return null;
    } else {
      return Direction.toDirection(next.x - this.code.index.x, next.y - this.code.index.y);
    }
  };

  SingleTransitionCodeTip.prototype.hide = function() {
    SingleTransitionCodeTip.__super__.hide.call(this);
    if (this.trans != null) {
      return this.trans.hide();
    }
  };

  SingleTransitionCodeTip.prototype.clone = function() {
    return this.copy(new SingleTransitionCodeTip(this.code.clone()));
  };

  return SingleTransitionCodeTip;

})(CodeTip);

BranchTransitionCodeTip = (function(_super) {
  __extends(BranchTransitionCodeTip, _super);

  function BranchTransitionCodeTip(code) {
    BranchTransitionCodeTip.__super__.constructor.call(this, code);
    this.conseqTrans = null;
    this.alterTrans = null;
  }

  BranchTransitionCodeTip.prototype.setConseq = function(x, y, dst) {
    if (this.conseqTrans != null) {
      this.conseqTrans.hide();
    }
    this.conseqTrans = new NormalTransition(this, dst);
    this.conseqTrans.show();
    return this.code.setConseq({
      x: x,
      y: y
    });
  };

  BranchTransitionCodeTip.prototype.setAlter = function(x, y, dst) {
    if (this.alterTrans != null) {
      this.alterTrans.hide();
    }
    this.alterTrans = new AlterTransition(this, dst);
    this.alterTrans.show();
    return this.code.setAlter({
      x: x,
      y: y
    });
  };

  BranchTransitionCodeTip.prototype.getConseqDir = function() {
    var next;

    next = this.code.getConseq();
    if (next == null) {
      return null;
    } else {
      return Direction.toDirection(next.x - this.code.index.x, next.y - this.code.index.y);
    }
  };

  BranchTransitionCodeTip.prototype.getAlterDir = function() {
    var next;

    next = this.code.getAlter();
    if (next == null) {
      return null;
    } else {
      return Direction.toDirection(next.x - this.code.index.x, next.y - this.code.index.y);
    }
  };

  BranchTransitionCodeTip.prototype.hide = function() {
    BranchTransitionCodeTip.__super__.hide.call(this);
    if (this.conseqTrans != null) {
      this.conseqTrans.hide();
    }
    if (this.alterTrans != null) {
      return this.alterTrans.hide();
    }
  };

  BranchTransitionCodeTip.prototype.clone = function() {
    return this.copy(new BranchTransitionCodeTip(this.code.clone()));
  };

  return BranchTransitionCodeTip;

})(CodeTip);

JumpTransitionCodeTip = (function(_super) {
  __extends(JumpTransitionCodeTip, _super);

  function JumpTransitionCodeTip(code) {
    JumpTransitionCodeTip.__super__.constructor.call(this, code);
  }

  JumpTransitionCodeTip.prototype.setNext = function(x, y) {
    return this.code.setNext({
      x: x,
      y: y
    });
  };

  JumpTransitionCodeTip.prototype.clone = function() {
    return this.copy(new JumpTransitionCodeTip(this.code.clone()));
  };

  return JumpTransitionCodeTip;

})(CodeTip);

Icon = (function(_super) {
  __extends(Icon, _super);

  function Icon(icon, width, height) {
    var h, w;

    w = width != null ? width : icon.width;
    h = height != null ? height : icon.height;
    Icon.__super__.constructor.call(this, w, h);
    this.image = icon;
    this.parent = null;
    this.hidden = true;
    LayerUtil.setOrder(this, LayerOrder.tipIcon);
    this.addEventListener('touchstart', function(e) {
      return this.parent.dispatchEvent(e);
    });
    this.addEventListener('touchmove', function(e) {
      return this.parent.dispatchEvent(e);
    });
    this.addEventListener('touchend', function(e) {
      return this.parent.dispatchEvent(e);
    });
  }

  Icon.prototype.fitPosition = function() {
    if (this.parent != null) {
      return this.moveTo(this.parent.x + this.parent.width / 2 - this.width / 2, this.parent.y + this.parent.height / 2 - this.height / 2);
    }
  };

  Icon.prototype.show = function(parent) {
    if (this.hidden) {
      this.hidden = false;
      if (parent != null) {
        this.parent = parent;
      }
      this.fitPosition();
      return Game.instance.currentScene.addChild(this);
    }
  };

  Icon.prototype.hide = function() {
    if (!this.hidden) {
      this.hidden = true;
      return Game.instance.currentScene.removeChild(this);
    }
  };

  Icon.prototype.clone = function() {
    var obj;

    obj = new Icon(this.image, this.width, this.height);
    obj.frame = this.frame;
    return obj;
  };

  return Icon;

})(Sprite);

TipParameter = (function() {
  function TipParameter(valueName, value, min, max, step, id) {
    this.valueName = valueName;
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
    this.id = id;
    this.text = "";
  }

  TipParameter.prototype.setValue = function(value) {
    this.value = value;
    this.text = toString();
    return this.onValueChanged();
  };

  TipParameter.prototype.getValue = function() {
    return this.value;
  };

  TipParameter.prototype.onValueChanged = function() {};

  TipParameter.prototype.mkLabel = function() {};

  TipParameter.prototype.clone = function() {
    return this.copy(new TipParameter(this.valueName, this.value, this.min, this.max, this.step));
  };

  TipParameter.prototype.copy = function(obj) {
    obj.valueName = this.valueName;
    obj.value = this.value;
    obj.min = this.min;
    obj.max = this.max;
    obj.step = this.step;
    obj.id = this.id;
    return obj;
  };

  TipParameter.prototype.toString = function() {
    return this.value.toString();
  };

  return TipParameter;

})();
