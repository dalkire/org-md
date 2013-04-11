(function($) {
  $(function() {
    $('#my-editor').orgMD();
    $('#my-editor').keyup(function(e) {
      var html = markdown.toHTML($('#my-editor').val());

      $('#my-editor-preview').html(html);
    });
  });
})(jQuery);
