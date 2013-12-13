// Generated by CoffeeScript 1.6.3
var MazeResultViewer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MazeResultViewer = (function() {
  function MazeResultViewer() {
    this.retry = __bind(this.retry, this);
    this.frontend = new Frontend();
    this.$result = null;
  }

  MazeResultViewer.prototype.end = function(result) {
    this.disableInput();
    return this.showResult();
  };

  MazeResultViewer.prototype.createResultView = function() {
    var $enemyResult, $label, $playerResult, $result, _createResultView;
    $result = $('<div></div>').attr('id', 'battle-result');
    $playerResult = $('<div></div>').attr('id', 'player-result');
    $enemyResult = $('<div></div>').attr('id', 'enemy-result');
    _createResultView = function($parent) {
      var $text;
      $text = $('<div></div>').attr('class', 'result-text clear text-success').text('クリア！');
      return $parent.append($text);
    };
    _createResultView($result);
    $label = $('<div></div>').attr('class', 'result-label');
    $result.append(this.createResultButton());
    return $result;
  };

  MazeResultViewer.prototype.retry = function() {
    var _this = this;
    return $('#battle-result').fadeOut('fast', function() {
      $('#battle-result').remove();
      return $('#enchant-stage').fadeIn('fast', function() {
        $('#filter').remove();
        _this.frontend.resetProgram();
        _this.hideResult();
        return $('#stop').click();
      });
    });
  };

  MazeResultViewer.prototype.createResultButton = function() {
    var $backButton, $buttons, $nextButton, $retryButton, page,
      _this = this;
    page = window.location.hash != null ? parseInt(window.location.hash.replace('#', '')) : 1;
    $backButton = $('<a></a>').attr({
      id: 'back-btn',
      "class": 'btn btn-lg btn-danger result-btn'
    }).text('Back');
    $retryButton = $('<div></div>').attr({
      id: 'retry-btn',
      "class": 'btn btn-lg btn-primary result-btn'
    }).text('Retry').click(this.retry);
    $nextButton = $('<a></a>').attr({
      id: 'next-btn',
      "class": 'btn btn-lg btn-success result-btn'
    }).text('Next');
    $backButton.click(function() {
      window.location.href = window.location.pathname + '#' + (page - 1);
      return _this.retry();
    });
    $nextButton.click(function() {
      window.location.href = window.location.pathname + '#' + (page + 1);
      return _this.retry();
    });
    $buttons = $('<div></div>').attr('class', 'result-btns');
    if (page > 1) {
      $buttons.append($backButton);
    }
    $buttons.append($retryButton);
    if (page < 5) {
      $buttons.append($nextButton);
    }
    return $buttons;
  };

  MazeResultViewer.prototype.showResult = function() {
    var _this = this;
    this.$result = this.createResultView();
    return $('#enchant-stage').fadeOut('fast', function() {
      $(_this).remove();
      return $('#program-container').append(_this.$result);
    });
  };

  MazeResultViewer.prototype.hideResult = function() {
    if (this.$result != null) {
      this.$result.remove();
      return this.$result = null;
    }
  };

  MazeResultViewer.prototype.disableInput = function() {
    var $filter;
    $filter = $('<div></div>').attr('id', 'filter');
    return $('#program-container').append($filter);
  };

  return MazeResultViewer;

})();
