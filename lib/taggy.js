(function($) {
  $.fn.taggy = function taggy(options) {
    var self = this;
    if(options == 'tags') return tags.apply(this, [arguments[1]]);
    if(options == 'addTag') return addTag.apply(this, [arguments[1]]);
    if(options == 'removeTag') return removeTag.apply(this, [arguments[1]]);
    if(options == 'selection') return selection.apply(this, [arguments[1]]);
    if(options == 'selectNext') return selectNext.apply(this);
    if(options == 'selectPrev') return selectPrev.apply(this);

    var visibleInput = $('<input class="taggy-new-tag"/>');
    var focusHolderInput = $('<input class="taggy-focus-holder" style="width:0;height:0;position:absolute;left:-10000em;" tabindex="-1"/>');
    var container = $('<div class=taggy/>');
    var ul = $('<ul/>');
    var hiddenInput = this;

    this.after(container.append(ul.append(focusHolderInput).append(visibleInput)));

    if(options) {
      this.taggy('tags', options.tags);

      var autocompleteSource = function filteredtags(request, response) {
        console.log(request, response);
        response($.ui.autocomplete.filter($.grep(options.availableTags(), function(tag) {
          return $.inArray(tag, self.taggy('tags')) == -1;
        }), request.term));
      };

      visibleInput.data('autocompleteSource', autocompleteSource); //for test
      visibleInput.autocomplete({
        source : autocompleteSource,
        position : {
          of : container
        },

        open : function open(e, ui) {
          // Sorry:  Untested hack to make sure autocomplete box scrolls with the story
          // If the autcomplete appendTo accepted callbacks, this wouldn't be needed.
          if (visibleInput.autocomplete('option', 'appendTo') == "body") {
            visibleInput.autocomplete('option', 'appendTo', visibleInput.closest('div.taggy').parent())
            .autocomplete("search");
          }
        }

      });
    }

    container.bind('keydown', function arrowKeys(event){
      if (visibleInput.val() == "") {
        if (event.keyCode == $.ui.keyCode.LEFT) {
          hiddenInput.taggy('selectPrev');
        }
        if (event.keyCode == $.ui.keyCode.RIGHT) {
          hiddenInput.taggy('selectNext');
        }
        if (event.keyCode == $.ui.keyCode.BACKSPACE) {
          var selected = hiddenInput.taggy('selection');

          hiddenInput.taggy('selectPrev');
          if (selected == hiddenInput.taggy('selection')){
            hiddenInput.taggy('selectNext');
          }

          if(selected) hiddenInput.taggy('removeTag', selected);
        }
      }
    })
    .delegate('input.taggy-new-tag', 'keydown', function inputKeydowns(event){
      if (event.keyCode == $.ui.keyCode.ENTER) {
        hiddenInput.taggy('addTag', visibleInput.val());
        visibleInput.val('');
      }
      if (event.keyCode == $.ui.keyCode.TAB) {
        if (visibleInput.val() != "") {
          event.preventDefault();
        }
      }
    })
    .delegate('a.taggy-remove-tag', 'click', function removeLinkClicked(event){
      var li = $(this).closest('li');
      hiddenInput.taggy('removeTag', li.data('tag'));
      event.stopPropagation();
    })
    .delegate('ul li', 'click', function callClickHandler(event){
      if(options.click) options.click($(this).data('tag'));
    })
    .delegate('ul input.taggy-focus-holder', 'focusout', function clearSelection(event){
      hiddenInput.taggy('selection', null);
    });


    return this.hide();
  };

  function tags(array){
    if ( array ){
      var container = this.siblings('div.taggy');
      var visibleInput = container.find('input.taggy-new-tag');
      container.find('li').remove();
      $.each(array, function createLi(index, tag){
        visibleInput.before($('<li data-tag="'+tag+'">' + tag + '<a class="taggy-remove-tag">x</a></li>'));
      });
      this.val(array.join(','));
      highlightSelected.apply(this);
      return this;
    }
    else {
      var currentTags = $.grep(this.val().split(','), function(string){
        return string && string.length;
      });
      return currentTags;
    }
  };

  function addTag(toAdd){
    if (($.inArray(toAdd, this.taggy('tags')) != -1 ) || !toAdd) {
      return this;
    }
    var currentTags = this.taggy('tags');
    var newTags = $.merge(currentTags, [toAdd]);
    return this.taggy('tags', newTags);
  };

  function removeTag(toRemove){
    return this.taggy('tags', $.grep(this.taggy('tags'),
          function everythingBut(string){
            return string != toRemove;
          }
          ));
  };


  function selection(toSelect){
    if (typeof(toSelect) != "undefined") {
      if (toSelect == null) {
        this.selection = null;
      }
      else if ($.inArray(toSelect, this.taggy('tags')) != -1 )
      {
        this.selection = toSelect;
      }
      highlightSelected.apply(this);
      return this;
    }
    else {
      return this.selection;
    }
  };

  function highlightSelected(){
    var selection = this.selection;
    var ul = this.siblings('div.taggy').find('ul');
    ul.find('li').removeClass('active');
    var li = $.grep(ul.find('li'), function(li){
      return $(li).data('tag') == selection;
    });
    if (li.length) {
      $(li).addClass('active');
      ul.find('input.taggy-focus-holder').focus();
    }
    else {
      ul.find('input.taggy-new-tag').focus();
    }
  }

  function selectNext(){
    var selected = this.selection;
    var selectedIndex = $.inArray(selected, this.taggy('tags'));
    if (selectedIndex == -1){
      return this;
    }
    var wantToSelect = this.taggy('tags')[selectedIndex + 1];

    return this.taggy('selection', wantToSelect || null );
  };

  function selectPrev(){
    var selected = this.selection;
    if (selected) {
      var selectedIndex = $.inArray(selected, this.taggy('tags'));
      var wantToSelect = this.taggy('tags')[selectedIndex - 1];
    }
    else {
      wantToSelect = this.taggy('tags')[this.taggy('tags').length - 1];
    }
    return this.taggy('selection', wantToSelect || selectedIndex );
  };



})(jQuery);

