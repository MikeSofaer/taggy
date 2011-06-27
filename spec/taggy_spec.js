describe("Taggy", function() {
  function assertHidden(element){
    expect(element[0].style.display).toBe('none');
  }
  function assertVisible(element){
    expect(element[0].style.display).toBeUndefined;
  }

  var wrapperDiv;
  var startingInput;
  beforeEach(function setupDom(){
    wrapperDiv = $('<div/>');
    startingInput = $('<input/>');
    wrapperDiv.append(startingInput);
  });

  describe("initialization", function() {
    it("hides the input field", function() {
      assertVisible(startingInput);
      assertHidden(startingInput.taggy());
    });

    describe("when the field is empty", function() {
      it("sets field to initial tags if passed", function() {
        expect(startingInput.taggy({tags : ["a", "b"]}).val()).toBe("a,b");
      });

      it("leaves the field empty if no initial tags are passed", function() {
        expect(startingInput.taggy().val()).toBe("");
      });
    });

    describe("when the field is not empty", function() {
      beforeEach(function() {
        startingInput.val("c,d");
      });

      it("maintains the value of the field if no tags are passed", function() {
        expect(startingInput.taggy().val()).toBe("c,d");
      });

      it("stomps the value of the field if tags are passed", function() {
        expect(startingInput.taggy({tags : ["a", "b"]}).val()).toBe("a,b");
      });
    });
  });

  describe("tags", function(){
    it("should return the empty array in no tags are given", function(){
      expect(startingInput.taggy().taggy('tags')).toEqual([]);
    });
    it("should return the tags passed", function(){
      expect(startingInput.taggy({tags : ["a", "b"]}).taggy('tags')).toEqual(["a", "b"]);
    });
    it("should set the tags if tags are passed", function(){
      startingInput.taggy({tags : ["a", "b"]}).taggy('tags', ["c", "d"])
      expect(startingInput.taggy('tags')).toEqual(["c", "d"]);
    expect(startingInput.val()).toEqual("c,d");
    });
  });
  describe("addTag", function(){
    it("should add the new tag if a value is passed", function(){
      startingInput.taggy({tags : ["a", "b"]}).taggy('addTag', "c");
      expect(startingInput.taggy('tags')).toEqual(["a", "b", "c"]);
    });
    it("shouldn't screw up if no value is passed", function(){
      startingInput.taggy({tags : ["a", "b", "c"]}).taggy('addTag');
      expect(startingInput.taggy('tags')).toEqual(["a", "b", "c"]);
    });
    it("shouldn't add a duplicate", function(){
      startingInput.taggy({tags : ["a", "b"]}).taggy('addTag', "b");
      expect(startingInput.taggy('tags')).toEqual(["a", "b"]);
    });
  });

  describe("removeTag", function(){
    it("should remove the new tag if a value is passed", function(){
      startingInput.taggy({tags : ["a", "b", "c"]}).taggy('removeTag', "c");
      expect(startingInput.taggy('tags')).toEqual(["a", "b"]);
    });
    it("shouldn't screw up if no value is passed", function(){
      startingInput.taggy({tags : ["a", "b", "c"]}).taggy('removeTag');
      expect(startingInput.taggy('tags')).toEqual(["a", "b", "c"]);
    });
    it("shouldn't screw up if non-present value is passed", function(){
      startingInput.taggy({tags : ["a", "b", "c"]}).taggy('removeTag', "d");
      expect(startingInput.taggy('tags')).toEqual(["a", "b", "c"]);
    });
  });

  describe("selection", function(){
    beforeEach(function(){
      startingInput.taggy({tags : ["a", "b", "c"]});
    });
    it("should select the desired tag", function(){
      expect(startingInput.taggy('selection', "a").taggy('selection')).toBe("a");
    });
    it("should not let you select a tag that's not there", function(){
      expect(startingInput.taggy('selection', "missing").taggy('selection')).toBeUndefined();
    });
    it("should let you clear the selection", function(){
      expect(startingInput.taggy('selection', "a").taggy('selection', null).taggy('selection')).toBeNull();
    });
  });

  describe("selectNext", function(){
    beforeEach(function(){
      startingInput.taggy({tags : ["a", "b", "c"]});
    });
    it("should select the next tag", function(){
      expect(startingInput.taggy('selection', "a").taggy('selectNext').taggy('selection')).toBe("b");
    });
    it("should not let you select a tag that's not there", function(){
      expect(startingInput.taggy('selection', "c").taggy('selectNext').taggy('selection')).toBeNull();
    });
  });

  describe("selectPrev", function(){
    beforeEach(function(){
      startingInput.taggy({tags : ["a", "b", "c"]});
    });
    it("should select the previous tag", function(){
      expect(startingInput.taggy('selection', "b").taggy('selectPrev').taggy('selection')).toBe("a");
    });
    it("should stick on the first tag", function(){
      expect(startingInput.taggy('selection', "a").taggy('selectPrev').taggy('selection')).toBe("a");
    });
    it("should select the last tag when nothing is selected", function(){
      expect(startingInput.taggy('selectPrev').taggy('selection')).toBe("c");
    });
  });

  describe("visible elements", function(){
    it("should create a div for the visible elements", function(){
      startingInput.taggy();
      expect(startingInput.siblings('div.taggy').length).toBe(1);
    });
    describe("tag list", function() {
      beforeEach(function(){
        startingInput.taggy({tags : ["a", "b"]});
      });
      it("should create a ul for the tags", function(){
        expect(startingInput.siblings('div.taggy').find('ul').length).toBe(1);
      });
      it("should create an li for each tag", function(){
        var lis = startingInput.siblings('div.taggy').find('ul li');
        expect(lis.length).toBe(2);
        expect($.map(lis, function(li){return $(li).data('tag')})).toEqual(["a", "b"]);
      });
      it("should create an a tag for each li", function(){
        var removeLinks = startingInput.siblings('div.taggy').find('ul li a.taggy-remove-tag');
        expect(removeLinks.length).toBe(2);
      });
    });
    describe("visible input", function(){
      it("should create a visible input field", function(){
        assertVisible(startingInput.taggy().siblings('div.taggy').find('input.taggy-new-tag'));
      });
    });
  });

  describe("Adding tags", function(){
    var visibleInput;
    beforeEach(function(){
      startingInput.taggy({tags : ["a", "b"]});
      visibleInput = startingInput.siblings('div.taggy').find('input.taggy-new-tag');
    });
    it("should add a tag on Enter", function(){
      visibleInput.val('c');
      var event = $.Event('keydown');
      event.keyCode = $.ui.keyCode.ENTER;
      visibleInput.trigger(event);
      expect(startingInput.taggy('tags')).toEqual(["a","b","c"]);
    });
    it("should clear the field on Enter", function(){
      visibleInput.val('c');
      var event = $.Event('keydown');
      event.keyCode = $.ui.keyCode.ENTER;
      visibleInput.trigger(event);
      expect(visibleInput.val()).toBe('');
    });
  });
  describe("Removing tags", function(){
    beforeEach(function(){
      startingInput.taggy({tags : ["to remove", "to leave"]});
    });
    it("should remove the tag on click", function(){
      var ul = startingInput.siblings('div.taggy').find('ul');
      ul.find('li:contains("to remove") a.taggy-remove-tag').click();
      expect(startingInput.taggy('tags')).toEqual(["to leave"]);
    });
    it("should remove the selected tag on backspace", function(){
      startingInput.taggy('selection', 'to remove');
      var event = $.Event('keydown');
      event.keyCode = $.ui.keyCode.BACKSPACE;
      startingInput.siblings('div.taggy').find('ul').trigger(event);
      expect(startingInput.taggy('tags')).toEqual(["to leave"]);
    });
    it("should select the previous tag on backspace", function(){
      startingInput.taggy('tags', ['before', 'to remove', 'after']);
      startingInput.taggy('selection', 'to remove');
      var event = $.Event('keydown');
      event.keyCode = $.ui.keyCode.BACKSPACE;
      startingInput.siblings('div.taggy').find('ul').trigger(event);
      expect(startingInput.taggy('selection')).toBe("before");
      expect(startingInput.taggy('tags')).toEqual(["before", "after"]);
    });
    it("should select the next tag on backspace on the first tag", function(){
      startingInput.taggy('tags', ['to remove', 'after']);
      startingInput.taggy('selection', 'to remove');
      var event = $.Event('keydown');
      event.keyCode = $.ui.keyCode.BACKSPACE;
      startingInput.siblings('div.taggy').find('ul').trigger(event);
      expect(startingInput.taggy('selection')).toBe("after");
    });
  });

  describe("selecting UI", function(){
    var visibleInput;
    var selectedLi;
    beforeEach(function(){
      startingInput.taggy({tags : ["first", "middle", "last"]});
      visibleInput = startingInput.siblings('div.taggy').find('input.taggy-new-tag');
    });
    describe("while a tag is selected", function(){
      beforeEach(function(){
        startingInput.taggy('selection', "middle");
        selectedLi = startingInput.siblings('div.taggy').find('li:contains("middle")');
      });
      it("should select next when you hit the right arrow key", function(){
        var event = $.Event('keydown');
        event.keyCode = $.ui.keyCode.RIGHT;
        selectedLi.trigger(event);
        expect(startingInput.taggy('selection')).toBe("last");
      });
      it("should select previous when you hit the left arrow key", function(){
        var event = $.Event('keydown');
        event.keyCode = $.ui.keyCode.LEFT;
        selectedLi.trigger(event);
        expect(startingInput.taggy('selection')).toBe("first");
      });
    });
    describe("left arrow on input", function(){
      it("should select the last tag if the input field is empty", function(){
        var event = $.Event('keydown');
        event.keyCode = $.ui.keyCode.LEFT;
        visibleInput.trigger(event);
        expect(startingInput.taggy('selection')).toBe("last");

      });
      it("should not select any tag if the input field has text", function(){
        var event = $.Event('keydown');
        event.keyCode = $.ui.keyCode.LEFT;
        visibleInput.val("tag witt a typo");
        visibleInput.trigger(event);
        expect(startingInput.taggy('selection')).toBeUndefined();

      });
    });
  });
});

