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

    var currNxt = getCurrNxt($target, selection);
    var currLn = currNxt.contentArr[currNxt.current];
    var hier = !currLn.match(/^#{7,}/) && currLn.match(/^#{1,6}/);

    if (hier) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (e.keyCode == RIGHT) {
      hierRight(e, $target, currNxt);
    }
    else if (e.keyCode == LEFT) {
      hierLeft(e, $target, currNxt);
    }
    else if (e.keyCode == UP) {
      hierUp(e, $target, currNxt);
    }
    else if (e.keyCode == DOWN) {
      hierDown(e, $target, currNxt);
    }
    else if (e.keyCode == ENTER) {
      hierEnter(e, $target, currNxt);
    }

  }

  // If appropriate, move line down in the Markdown hierarchy
  function hierRight(e, $target, currNxt) {
    var currLn = currNxt.contentArr[currNxt.current];
    var nextLine    = currNxt.contentArr[currNxt.next];
    var atMax = currLn.match(/^#{6,}/);

    if (!atMax && currLn.match(/^#/)) {
      currNxt.contentArr[currNxt.current] = '#' + currLn;

      $target.val(currNxt.contentArr.join('\n'));
      setCaretToPos(e.currentTarget, currNxt.selection.start + 1);
    }
  }

  // If appropriate, move line up in the Markdown hierarchy
  function hierLeft(e, $target, currNxt) {
    var currLn = currNxt.contentArr[currNxt.current];
    var nextLine = currNxt.contentArr[currNxt.next];
    var hier = !currLn.match(/^#{7,}/) && currLn.match(/^#{1,6}/);
    var notMin = currLn.match(/^#{2,}/);

    if (notMin) {
      currNxt.contentArr[currNxt.current] = currLn.substr(1);

      $target.val(currNxt.contentArr.join('\n'));
      setCaretToPos(e.currentTarget, currNxt.selection.start - 1);
    }

  }

  function getPrevIndexAtLvl(contentArr, currIndex) {
    var currLn = contentArr[currIndex];
    var hier = !currLn.match(/^#{7,}/) && currLn.match(/^#{1,6}/);

    if (hier) {
      for (var i = currIndex - 1; i >= 0; i--) {
        var ln = contentArr[i];
        var lnHier = !ln.match(/^#{7,}/) && ln.match(/^#{1,6}/);

        if (lnHier[0] == hier[0]) {
          return i;
        }
      }
    }

    return null;
  }

  function getNxtIndexAtLvl(contentArr, currIndex) {
    var currLn = contentArr[currIndex];
    var hier = !currLn.match(/^#{7,}/) && currLn.match(/^#{1,6}/);

    if (hier) {
      for (var i = currIndex + 1; i < contentArr.length; i++) {
        var ln = contentArr[i];
        var lnHier = !ln.match(/^#{7,}/) && ln.match(/^#{1,6}/);

        if (lnHier == hier) {
          return i;
        }
      }
    }

    return contentArr.length;
  }

  // If appropriate, move line up in the Markdown hierarchy
  function hierUp(e, $target, currNxt) {
    var currLn = currNxt.contentArr[currNxt.current];
    var nextLine = currNxt.contentArr[currNxt.next];
    var hier = !currLn.match(/^#{7,}/) && currLn.match(/^#{1,6}/);
    var prevIndexAtLvl = getPrevIndexAtLvl(currNxt.contentArr, currNxt.current);
    var nxtIndexAtLvl = getNxtIndexAtLvl(currNxt.contentArr, currNxt.current);

    if (prevIndexAtLvl !== null) {
      var newContentArr = currNxt.contentArr;
      var currBlock = newContentArr.splice(currNxt.current, nxtIndexAtLvl - currNxt.current - 1);

      newContentArr.splice(prevIndexAtLvl, 0, currBlock.join(','));
console.log('newContentArr; ', newContentArr);
      $target.val(newContentArr.join('\n'));
      setCaretToPos(e.currentTarget, currNxt.selection.start - 1);
    }
  }

  // If appropriate, move line up in the Markdown hierarchy
  function hierDown(e, $target, currNxt) {
    var currLn = currNxt.contentArr[currNxt.current];
    var nextLine = currNxt.contentArr[currNxt.next];
    var hier = !currLn.match(/^#{7,}/) && currLn.match(/^#{1,6}/);
    var notMin = currLn.match(/^#{2,}/);

    if (notMin) {
      currNxt.contentArr[currNxt.current] = currLn.substr(1);

      $target.val(currNxt.contentArr.join('\n'));
      setCaretToPos(e.currentTarget, currNxt.selection.start - 1);
    }
  }

  function hierEnter(e, $target, currNxt) {
    var currLn = currNxt.contentArr[currNxt.current];
    var nextLine = currNxt.contentArr[currNxt.next];
    var hier = !currLn.match(/^#{7,}/) && currLn.match(/^#{1,6}/);

    if (hier) {
      var diff = currNxt.next - currNxt.current;
      currNxt.contentArr.splice(currNxt.next, 0, hier[0] + ' ');

      $target.val(currNxt.contentArr.join('\n'));
      setCaretToPos(e.currentTarget, currNxt.selection.start + hier[0].length + 1 + diff);
    }
  }

  function getCurrNxt($target, selection) {
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
