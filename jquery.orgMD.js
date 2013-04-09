(function($) {
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
    console.log('keypress: ', e);

    if (!e.altKey || (e.keyCode != LEFT && e.keyCode != RIGHT && e.keyCode != UP && e.keyCode != DOWN)) {
      return;
    }

    // var currLine = getCurrLine($target, selection);
    // var nextLine = getNextLine($target, selection);
    var currAndNext = getCurrentAndNext($target, selection);
    if (e.keyCode == RIGHT) {
      var currentLine = currAndNext.contentArr[currAndNext.current];

      currAndNext.contentArr[currAndNext.current] = '#' + currentLine;
    }

    $target.val(currAndNext.contentArr.join('\n'));
    setCaretToPos(e.currentTarget, selection.start);
    e.stopPropagation();
    e.preventDefault();
    // console.log('currLine: ', currLine);
    // console.log('nextLine: ', nextLine);
  }

  function getCurrentAndNext($target, selection) {
    var content = $target.val();
    var contentArr = content.split('\n');
    var pos = 0;
    var current = 0;
    var next = 0;

    for (var i = 0; i < contentArr.length; i++) {
      if (pos <= selection.start && selection.start < (pos + contentArr[i].length)) {
        current = i;
        break;
      }

      pos = pos + contentArr[i].length;
    }

    next = contentArr[current + 1] ? current + 1 : current;

    return {
      current: current,
      next: next,
      contentArr: contentArr
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
