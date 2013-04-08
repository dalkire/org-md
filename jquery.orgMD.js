(function($) {
  var LEFT  = 37;
  var UP    = 38;
  var RIGHT = 39;
  var DOWN  = 40;

  function orgMDkeyup(e) {
    var $target = $(e.currentTarget);
    var selection = $target.getSelection();
    // console.log('keyup: ', $target);

    var currLine = getCurrLine($target, selection);
    var nextLine = getNextLine($target, selection);

    console.log('currLine: ', currLine);
    console.log('nextLine: ', nextLine);
  }

  function getCurrLine($target, selection) {
    var content = $target.val();
    var start = 0;
    var end = content.length;

    for (var i = selection.start - 1; i > 0; i--) {
      if (content[i] == '\n') {
        start = i + 1;
        break;
      }
    }

    for (i = start; i < content.length; i++) {
      if (content[i] == '\n') {
        end = i - 1;
        break;
      }
    }

    return {
      start: start,
      end: end,
      text: content.substring(start, end)
    };
  }

  function getNextLine($target, selection) {
    var content = $target.val();
    var start = content.length;
    var end = content.length;
    
    for (var i = selection.start; i < content.length; i++) {
      if (content[i] == '\n') {
        start = i + 1;
        break;
      }
    }

    for (i = start; i < content.length; i++) {
      if (content[i] == '\n') {
        end = i - 1;
        break;
      }
    }

    return {
      start: start,
      end: end,
      text: content.substring(start, end)
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

      $this.keyup(orgMDkeyup);
    });
  };
})(jQuery);
