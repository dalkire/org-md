(function($) {
  $(function() {
    $('#my-editor').orgMD();
    $('a#preview').click(function() {
      $.post('cgi-bin/Markdown.pl', $('#my-editor').val(), function(res) {
        $('#my-editor-preview').html(res);
      });
    });
  });
})(jQuery);
