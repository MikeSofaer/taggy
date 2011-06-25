(function($) {
  $.fn.taggy = function taggy(options) {
    var self = this;
    if(options == 'tags') {
      if (arguments[1]){
        var ul = this.siblings('div.taggy').find('ul');
        ul.empty();
        $.each(arguments[1], function createLi(index, tag){
          ul.append($('<li data-tag="'+tag+'">' + tag + '<a class="taggy-remove-tag">x</a></li>'));
        });
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
    if(options == 'selection'){
      var toSelect = arguments[1];
      if (typeof(toSelect) != "undefined") {
        if (toSelect == null) {
          self.selection = null;
        }
        else if ($.inArray(toSelect, self.taggy('tags')) != -1 )
        {
          self.selection = toSelect;
        }
        return self;
      }
      else {
        return self.selection;
      }
    };

    if(options == 'selectNext'){
      var selected = self.selection;
      var selectedIndex = $.inArray(selected, self.taggy('tags'));
      var wantToSelect = self.taggy('tags')[selectedIndex + 1];

      return self.taggy('selection', wantToSelect || null );
    };

    if(options == 'selectPrev'){
      var selected = self.selection;
      if (selected) {
        var selectedIndex = $.inArray(selected, self.taggy('tags'));
        var wantToSelect = self.taggy('tags')[selectedIndex - 1];
      }
      else {
        wantToSelect = self.taggy('tags')[self.taggy('tags').length - 1];
      }
      return self.taggy('selection', wantToSelect || selectedIndex );
    };

    var visibleInput = $('<input class="taggy-new-tag"/>');
    var container = $('<div class=taggy/>');
    var hiddenInput = this;

    this.after(container.append(visibleInput).append('<ul/>'));

    if(options) {
      this.taggy('tags', options.tags);
    }

    container.delegate('input.taggy-new-tag', 'keydown', function inputKeydowns(event){
      if (event.keyCode == $.ui.keyCode.ENTER) {
        hiddenInput.taggy('addTag', visibleInput.val());
        visibleInput.val('');
      }
      if (event.keyCode == $.ui.keyCode.LEFT) {
        if (visibleInput.val() == "") {
          hiddenInput.taggy('selectPrev');
        }
      }
    });

    container.delegate('a.taggy-remove-tag', 'click', function removeLinkClicked(event){
      var li = $(this).closest('li');
      hiddenInput.taggy('removeTag', li.data('tag'));
    });

    container.delegate('ul', 'keydown', function keydowns(event){
      if (event.keyCode == $.ui.keyCode.RIGHT) {
        hiddenInput.taggy('selectNext');
      }
      else if (event.keyCode == $.ui.keyCode.LEFT) {
        hiddenInput.taggy('selectPrev');
      }
      else if (event.keyCode == $.ui.keyCode.BACKSPACE) {
        hiddenInput.taggy('removeTag', hiddenInput.taggy('selection'));
      }
    });

    return this.hide();
  };
})(jQuery);

