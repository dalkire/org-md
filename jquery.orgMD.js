(function($) {
  var ENTER = 13;
  var LEFT  = 37;
  var UP    = 38;
  var RIGHT = 39;
  var DOWN  = 40;

  function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }
  
  function setCaretToPos (input, pos) {
    setSelectionRange(input, pos, pos);
  }

  function orgMDkeydown(e) {
    var $target = $(e.currentTarget);
    var selection = $target.getSelection();
    var keyArr = [
      LEFT,
      RIGHT,
      UP,
      DOWN,
      ENTER
    ];

    if (!e.altKey || $.inArray(e.keyCode, keyArr) == -1) {
      return;
    }

    var currentAndNext = getCurrentAndNext($target, selection);

    if (e.keyCode == RIGHT) {
      hierDown(e, $target, currentAndNext);
    }
    else if (e.keyCode == LEFT) {
      hierUp(e, $target, currentAndNext);
    }
    else if (e.keyCode == ENTER) {
      hierNext(e, $target, currentAndNext);
    }

    e.stopPropagation();
    e.preventDefault();
  }

  // If appropriate, move line down in the Markdown hierarchy
  function hierDown(e, $target, currentAndNext) {
    var currentLine = currentAndNext.contentArr[currentAndNext.current];
    var nextLine    = currentAndNext.contentArr[currentAndNext.next];
    var atMax = currentLine.match(/^#{6,}/);

    if (!atMax && currentLine.match(/^#/)) {
      currentAndNext.contentArr[currentAndNext.current] = '#' + currentLine;

      $target.val(currentAndNext.contentArr.join('\n'));
      setCaretToPos(e.currentTarget, currentAndNext.selection.start + 1);
    }
  }

  // If appropriate, move line up in the Markdown hierarchy
  function hierUp(e, $target, currentAndNext) {
    var currentLine = currentAndNext.contentArr[currentAndNext.current];
    var nextLine    = currentAndNext.contentArr[currentAndNext.next];
    var notMin = currentLine.match(/^#{2,}/);

    if (notMin) {
      currentAndNext.contentArr[currentAndNext.current] = currentLine.substr(1);

      $target.val(currentAndNext.contentArr.join('\n'));
      setCaretToPos(e.currentTarget, currentAndNext.selection.start - 1);
    }
  }

  function hierNext(e, $target, currentAndNext) {
    var currentLine = currentAndNext.contentArr[currentAndNext.current];
    var nextLine    = currentAndNext.contentArr[currentAndNext.next];
    var hasHier = !currentLine.match(/^#{7,}/) && currentLine.match(/^#{1,6}/);

    if (hasHier) {
      var diff = currentAndNext.next - currentAndNext.current;
      currentAndNext.contentArr.splice(currentAndNext.next, 0, hasHier[0] + ' ');

      $target.val(currentAndNext.contentArr.join('\n'));
      setCaretToPos(e.currentTarget, currentAndNext.selection.start + hasHier[0].length + 1 + diff);
    }
  }

  function getCurrentAndNext($target, selection) {
    var content = $target.val();
    var contentArr = content.split('\n');
    var pos = 0;
    var current = 0;
    var next = 0;
    var point = selection.start;

    for (var i = 0; i < contentArr.length; i++) {
      if (pos <= point && point <= (pos + contentArr[i].length)) {
        current = i;
        break;
      }

      pos = pos + contentArr[i].length + 1;
    }

    next = current + 1;

    return {
      current: current,
      next: next,
      contentArr: contentArr,
      selection: selection
    };
  }

  $.fn.orgMD = function(options) {
    // Create some defaults, extending them with any options that were provided
    var settings = $.extend({
      'meta': [
        // MAC_OPTION,
        // MAC_LEFT_COMMAND,
        // MAC_RIGHT_COMMAND
      ]
    }, options);

    return this.each(function() {
      var $this = $(this);

      $this.keydown(orgMDkeydown);
    });
  };
})(jQuery);
