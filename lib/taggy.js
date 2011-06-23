(function($) {
  $.fn.taggy = function taggy(options) {
    if(options == 'tags') {
      if (arguments[1]){
        this.val(arguments[1].join(','));
        return this;
      }
      else {
      return $.grep(this.val().split(','), function(string){
        return string.length;
      });
      }
    };
    if(options) {
      this.val(options.tags.join(','));
    }
    return this.hide();
  };
})(jQuery);

