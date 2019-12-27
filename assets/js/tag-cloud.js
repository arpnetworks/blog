(function ($) {
  $.fn.tagcloud.defaults = {
    size: {start: 14, end: 18, unit: 'px'},
    color: {start: '#759eab', end: '#378096'}
  };

  $(function () {
    $('.tag-cloud a').tagcloud();
  });
})(jQuery);
