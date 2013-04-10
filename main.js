(function($) {
  $(function() {
    $('#my-editor').orgMD();
    $('a#preview').click(function() {
      $('#my-editor-preview').html(markdown.toHTML($('#my-editor').val()));
      return false;
    });
  });
})(jQuery);
