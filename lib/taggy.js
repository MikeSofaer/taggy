(function($) {
  $.fn.taggy = function taggy(options) {
    if(options == 'tags') {
      if (arguments[1]){
        return this.val(arguments[1].join(','));
      }
      else {
      return $.grep(this.val().split(','), function(string){
        return string.length;
      });
      }
    };
    if(options == 'addTag'){
      if ($.inArray(arguments[1], this.taggy('tags')) != -1 ) {
        return this;
      }
      return this.taggy('tags', $.merge(this.taggy('tags'), [arguments[1]]));
    };
    if(options == 'removeTag'){
      var toRemove = arguments[1];
      return this.taggy('tags', $.grep(this.taggy('tags'),
          function everythingBut(string){
            return string != toRemove;
          }
      ));
    };
    if(options) {
      this.val(options.tags.join(','));
    }
    return this.hide();
  };
})(jQuery);

