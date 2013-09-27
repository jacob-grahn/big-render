# BigRender

BigRender is a drawing engine built for multi-user apps. Most everything is done by passing in commands, which are simple objects. This has the benefit of making it simple to sync commands from multiple users at once.

## Setup
//Include underscore, easeljs, Color.js, and BigRender in your project. All of these files are available in the scripts folder for easy testing.

//create a bigRender instance
var big = new bigRender.BigRender('demo-canvas');

//start adding commands
big.addCommand({...});


## Quick Docs

**addCommand(object)**
Add a new drawing command to the stack. The command may not be drawn immediately if there is a backlog of undrawn commands.

**replaceLastCommand(object)**
Replace the most recent command with a new one. If there are no previous commands, this is the same as addCommand()

**clearLastCommand()**
Remove the most recent command from the stack.

**undo()**
Un-draw the last command, but leave it in the stack. The command can be re-drawn by calling redo()

**redo()**
Re-draw a command that was previously un-drawn using undo()

**setTargetLayer(number)**
Target a layer based on its layerId. Drawing commands that do not specify a layerId will default to this layer.

**scroll(x, y)**
Move all layers to the x, y coordinates. If a layer has scrollPercX or scrollPercY defined, the coordinates will be multiplied by those.

**update()**
Force the stage to be redrawn immediately. Can be handy if you intend to call getSnapshot() afterwards.

**getSnapshot()**
Return a canvas containing a flattened copy of BigRender's state.

**getSaveState():object**
Returns an object containing BigRender's current state.

**setSaveState(object)**
Sets BigRender to display this new state.

**setDimensions(w, h)**
Sets BigRender's display width and height. Maybe be different than the canvas width and height.

**clear()**
Remove all images and clear the command stack.

**remove()**
De-reference everything to try to free up memory.


## Commands

Commands are simply an object with a type parameter. You can add in or omit other values as you see fit. Here are a few example commands. You can see a lot more on [https://jiggmin.com/projects/big-render/build/index.html](the BigRender demo page.)

//draw a star
big.addCommand({
    type: 'drawShape',
    shape: 'star',
    x: 100,
    y: 100,
    radius: 100
});

//draw a vector line
big.addCommand({
    type: 'drawLine',
    path: [10,50, 75,5, 100,45, 190,75],
    lineWidth: 5,
    strokeStyle: 'blue'
});

//draw a line using an image
big.addCommand({
    type: 'drawLine',
    brush: 'image',
    path: [10,115, 75,70, 100,110, 190,140],
    stepDist: 0.1,
    image: {
        src: 'img/brush.png',
        scaleX: 0.5,
        scaleY: 0.5,
        globalAlpha: 0.07,
        tintColor: 'blue',
        tintPerc: 1,
        rotation: 45
    }
});



## Support
* See working examples at [https://jiggmin.com/projects/big-render/build/index.html](the BigRender demo page).
* Contact me here on github or at [http://jiggmin.com](jiggmin.com).

BigRender was built by [Jacob Grahn](https://jiggmin.com), and is released for free under the MIT license. Attribution is welcome, but not required.