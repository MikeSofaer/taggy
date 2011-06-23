#Taggy
Taggy is a jquery-ui extension for decorating input fields as tag bubble collections

#Usage

    <input id="to_decorate" name="your input"/>

    $('#to_decorate').taggy();

results in:

    <input id="to_decorate" name="your input" style="display:none;"/>
    <div class="taggy">
      ... visible tagging content
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
