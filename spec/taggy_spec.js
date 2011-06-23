describe("Taggy", function() {
  function assertHidden(element){
    expect(element[0].style.display).toBe('none');
  }
  function assertVisible(element){
    expect(element[0].style.display).toBeUndefined;
  }

  var startingInput;
  beforeEach(function setupDom(){
    startingInput = $('<input/>');
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
});

