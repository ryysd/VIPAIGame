// Generated by CoffeeScript 1.6.3
var ActionInstruction, BranchInstruction, Instruction,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Instruction = (function(_super) {
  __extends(Instruction, _super);

  function Instruction() {
    Instruction.__super__.constructor.call(this);
    this.isAsynchronous = false;
    this.parameters = [];
  }

  Instruction.prototype.onComplete = function(result) {
    if (result == null) {
      result = null;
    }
    return this.dispatchEvent(new InstructionEvent('completeExecution', {
      tip: this,
      result: result
    }));
  };

  Instruction.prototype.action = function() {};

  Instruction.prototype.execute = function() {
    return this.action();
  };

  Instruction.prototype.setAsynchronous = function(async) {
    if (async == null) {
      async = true;
    }
    return this.isAsynchronous = async;
  };

  Instruction.prototype.addParameter = function(param) {
    var _this = this;
    param.onParameterComplete = function() {
      return _this.onParameterComplete(param);
    };
    param.onValueChanged = function() {
      return _this.onParameterChanged(param);
    };
    param.mkLabel = function() {
      return _this.mkLabel(param);
    };
    return this.parameters.push(param);
  };

  Instruction.prototype.mkDescription = function() {};

  Instruction.prototype.mkLabel = function(value) {
    return value;
  };

  Instruction.prototype.getIcon = function() {};

  Instruction.prototype.setConstructorArgs = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.constructorArgs = args;
  };

  Instruction.prototype.onParameterChanged = function(parameter) {};

  Instruction.prototype.onParameterComplete = function(parameter) {};

  Instruction.prototype.copy = function(obj) {
    var param, _i, _len, _ref;
    obj.isAsynchronous = this.isAsynchronous;
    obj.parameters = [];
    _ref = this.parameters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      param = _ref[_i];
      obj.addParameter(param.clone());
    }
    return obj;
  };

  Instruction.prototype.clone = function() {
    return this.copy(new Instruction());
  };

  Instruction.prototype.serialize = function() {
    var param;
    return {
      name: this.constructor.name,
      parameters: (function() {
        var _i, _len, _ref, _results;
        _ref = this.parameters;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          param = _ref[_i];
          _results.push(param.serialize());
        }
        return _results;
      }).call(this)
    };
  };

  Instruction.prototype.deserialize = function(serializedVal) {
    var param, target, _i, _len, _ref, _results;
    _ref = serializedVal.parameters;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      param = _ref[_i];
      _results.push(((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = this.parameters;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          target = _ref1[_j];
          if (target.valueName === param.valueName) {
            _results1.push(target);
          }
        }
        return _results1;
      }).call(this))[0].deserialize(param));
    }
    return _results;
  };

  return Instruction;

})(EventTarget);

ActionInstruction = (function(_super) {
  __extends(ActionInstruction, _super);

  function ActionInstruction() {
    ActionInstruction.__super__.constructor.call(this);
  }

  ActionInstruction.prototype.clone = function() {
    return this.copy(new ActionInstruction());
  };

  return ActionInstruction;

})(Instruction);

BranchInstruction = (function(_super) {
  __extends(BranchInstruction, _super);

  function BranchInstruction() {
    BranchInstruction.__super__.constructor.call(this);
  }

  BranchInstruction.prototype.action = function() {
    return false;
  };

  BranchInstruction.prototype.clone = function() {
    return this.copy(new BranchInstruction());
  };

  return BranchInstruction;

})(Instruction);

octagram.Instruction = Instruction;

octagram.ActionInstruction = ActionInstruction;

octagram.BranchInstruction = BranchInstruction;
