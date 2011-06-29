(function($) {
  $.fn.taggy = function taggy(opts) {
    var self = this;

    if(this.data('taggy-methods')) {
      if(this.data('taggy-methods')[opts]) return this.data('taggy-methods')[opts].apply(this, [arguments[1]]);
    }

    var options = opts || {}

    var elements = {
      visibleInput     : $('<input class="taggy-new-tag"/>'),
      focusHolderInput : $('<input class="taggy-focus-holder" style="width:0;height:0;position:absolute;left:-10000em;" tabindex="-1"/>'),
      container        : $('<div class=taggy/>'),
      ul               : $('<ul/>'),
      hiddenInput      : this,
      commandKeys      : options.additionalKeyCodes ?  $.merge(options.additionalKeyCodes, [$.ui.keyCode.ENTER]) : [$.ui.keyCode.ENTER]
    };

    elements.container
  .append(elements.ul.append(elements.focusHolderInput).append(elements.visibleInput))

  this.after(elements.container);


    this.data('taggy-methods', new taggyMethods(elements));
    createEventHandlers(elements, options);
    addAutocomplete(elements, options);

    if (options.tags) {
      this.taggy('tags', options.tags);
    }

    return this.hide();
  };

  function addAutocomplete(elements, options){

    // Sorry:  Not testing this.
    var autocompleteSource = function filteredtags(request, response) {
      response($.ui.autocomplete.filter($.grep(options.availableTags(), function(tag) {
        return $.inArray(tag, elements.hiddenInput.taggy('tags')) == -1;
      }), request.term));
    };

    elements.visibleInput.data('autocompleteSource', autocompleteSource); //for test
    var autocompleteOptions = {
      source : autocompleteSource,
      position : {
        of : elements.container
      },

      open : function open(e, ui) {
               // Sorry:  Untested hack to make sure autocomplete box scrolls with the story
               // If the autcomplete appendTo accepted callbacks, this wouldn't be needed.
               if (elements.visibleInput.autocomplete('option', 'appendTo') == "body") {
                 elements.visibleInput.autocomplete('option', 'appendTo', elements.container.parent())
      .autocomplete("search");
               }
             }
    };
    if (options.autocompleteOptions) {
      $.extend(autocompleteOptions, options.autocompleteOptions);
    }
    elements.visibleInput.autocomplete(autocompleteOptions);
  }

  function createEventHandlers(elements, options){
    var container = elements.container;
    var visibleInput = elements.visibleInput;
    var hiddenInput = elements.hiddenInput;
    var ul = elements.ul;
    var commandKeys = elements.commandKeys;
    var backspacePressed = false;

    elements.container.bind('keydown', function arrowKeys(event){
      if (visibleInput.val() == "") {
        if (event.keyCode == $.ui.keyCode.LEFT) {
          hiddenInput.taggy('selectPrev');
        }
        if (event.keyCode == $.ui.keyCode.RIGHT) {
          hiddenInput.taggy('selectNext');
        }
        if (event.keyCode == $.ui.keyCode.BACKSPACE) {
          if (!backspacePressed) {
            var selected = hiddenInput.taggy('selection');

            hiddenInput.taggy('selectPrev');
            if (selected == hiddenInput.taggy('selection')){
              hiddenInput.taggy('selectNext');
            }

            if(selected) hiddenInput.taggy('removeTag', selected);
          }
          backspacePressed = true;
          event.preventDefault();
        }
      }
    })
    .bind('keyup', function clearBackspace(event){
      if (event.keyCode == $.ui.keyCode.BACKSPACE) {
        backspacePressed = false;
      }
    })
    .bind('autocompleteselect', function tagChosen(event, ui){
      hiddenInput.taggy('addTag', ui.item.value);
      event.preventDefault();
    })
    .delegate('input.taggy-new-tag', 'keydown', function inputKeydowns(event){
      if (event.keyCode == $.ui.keyCode.TAB) {
        if (visibleInput.val() != "") {
          event.preventDefault();
        }
      }
      if ($.inArray(event.keyCode, commandKeys) != -1 && ! event.shiftKey) {
        hiddenInput.taggy('addTag', visibleInput.val());
        if (event.keyCode != $.ui.keyCode.TAB) { event.preventDefault(); }
        visibleInput.val('');
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

    var autocompleteOpen = false;
    visibleInput.bind('keydown', function escapeHandling(event){
      if (event.keyCode == $.ui.keyCode.ESCAPE) {
        if (!autocompleteOpen) {
          visibleInput.data('autocomplete').term = '';
        }
      }
    });

    container.delegate('input.taggy-new-tag', 'autocompleteclose', function onAutocompleteClose(event){
      autocompleteOpen = false;
    })
    .delegate('input.taggy-new-tag', 'autocompleteopen', function onAutocompleteOpen(event){
      autocompleteOpen = true;
    });
  };

  function taggyMethods(elements) {
    var container = elements.container;
    var visibleInput = elements.visibleInput;
    var hiddenInput = elements.hiddenInput;
    var ul = elements.ul;
    var self = this

      $.extend(self, {
        tags : function tags(array){
                 if ( array ){
                   container.find('li').remove();
                   $.each(array, function createLi(index, tag){
                     var li = $('<li/>').data('tag', tag).text(tag).append('<a class="taggy-remove-tag">x</a>');
                     visibleInput.before(li);
                   });
                   this.val(array.join(','));
                   self.highlightSelected.apply(this);
                   return this;
                 }
                 else {
                   var currentTags = $.grep(this.val().split(','), function(string){
                     return string && string.length;
                   });
                   return currentTags;
                 }
               },

        addTag : function addTag(value){
                   var toAdd = $.trim(value);
                   if (
                     ($.inArray(toAdd, this.taggy('tags')) != -1 )
                       || !toAdd
                       || toAdd == "" ) {
                     return this;
                   }
                   var currentTags = this.taggy('tags');
                   var newTags = $.merge(currentTags, [toAdd]);
                   visibleInput.val('');
                   return this.taggy('tags', newTags);
                 },

        removeTag : function removeTag(toRemove){
                      return this.taggy('tags', $.grep(this.taggy('tags'),
                            function everythingBut(string){
                              return string != toRemove;
                            }
                            ));
                    },


        selection : function selection(toSelect){
                      if (typeof(toSelect) != "undefined") {
                        if (toSelect == null) {
                          this.selection = null;
                        }
                        else if ($.inArray(toSelect, this.taggy('tags')) != -1 )
                        {
                          this.selection = toSelect;
                        }
                        self.highlightSelected.apply(this);
                        return this;
                      }
                      else {
                        return this.selection;
                      }
                    },

        highlightSelected : function highlightSelected(){
                              var selection = this.selection;
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
                            },

        selectNext : function selectNext(){
                       var selected = this.selection;
                       var selectedIndex = $.inArray(selected, this.taggy('tags'));
                       if (selectedIndex == -1){
                         return this;
                       }
                       var wantToSelect = this.taggy('tags')[selectedIndex + 1];

                       return this.taggy('selection', wantToSelect || null );
                     },

        selectPrev : function selectPrev(){
                       var selected = this.selection;
                       if (selected) {
                         var selectedIndex = $.inArray(selected, this.taggy('tags'));
                         var wantToSelect = this.taggy('tags')[selectedIndex - 1];
                       }
                       else {
                         wantToSelect = this.taggy('tags')[this.taggy('tags').length - 1];
                       }
                       return this.taggy('selection', wantToSelect || selectedIndex );
                     }

      });
  }

})(jQuery);

