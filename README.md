#Taggy
Taggy is a jquery-ui extension for decorating input fields as tag bubble collections

Taggy depends on jquery-ui, in particular position and autocomplete.
#Usage

    <input id="to_decorate" name="your input"/>

    $('#to_decorate').taggy();

results in:

    <input id="to_decorate" name="your input" style="display:none;"/>
    <div class="taggy">
      <ul/>
      <input class="taggy-create"/>
    </div>

You can prepopulate your input field if you want:

    <input id="to_decorate" name="your input">
    $('#to_decorate').val("hi").taggy().taggy('tags')  -> ["hi"]

Or use the initializer:

    <input id="to_decorate" name="your input">
    $('#to_decorate').taggy({tags : ["hi"]}).taggy('tags')  -> ["hi"]
    $('#to_decorate').taggy({tags : ["hi"]}).val()          -> "hi"

You can set the labels at any time:

    <input id="to_decorate" name="your input">
    $('#to_decorate').taggy({tags : ["hi"]}).taggy('tags', ["bye"])
    $('#to_decorate').val()          -> "bye"

You can add and remove tags:

    $('#to_decorate').taggy('addTag', "new tag");
    $('#to_decorate').taggy('removeTag', "old tag");

You can select tags:

    $('#to_decorate').taggy('selection', value);
    $('#to_decorate').taggy('selectNext');
    $('#to_decorate').taggy('selectPrev');

Selections roll off the end, and stick at the front
