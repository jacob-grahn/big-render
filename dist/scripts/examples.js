/* global bigRender */

'use strict';

var big;

//
function init() {
	big = new bigRender.BigRender('demo-canvas');
}


//
function setupTest(divId) {
	endRandomScrolling();

	//clear out any shenanigans from previous tests
	big.clear();

	//
	setAllInvisible();

	//
	document.getElementById(divId).style.display = 'block';
}


//
function setAllInvisible() {
	var examples = ['setup', 'lines', 'shapes', 'flood-fill', 'objects', 'long-draw', 'layers'];
	for(var i=0; i<examples.length; i++) {
		document.getElementById(examples[i]).style.display = 'none';
	}
}


//setup test
function drawLogo() {
	setupTest('setup');

	//create the layer we will draw on
	big.addCommand({type: 'createLayer'});

	//draw a star
	big.addCommand({
		type: 'drawShape',
		shape: 'star',
		x: 100,
		y: 100,
		radius: 100
	});
}


//draw test
function lineTest() {
	setupTest('lines');

	//create the layer we will draw on
	big.addCommand({type: 'createLayer'});

	//draw a vector line
	big.addCommand({
		type: 'drawLine',
		path: [10,50, 75,5, 100,45, 190,75],
		lineWidth: 5,
		strokeStyle: 'blue'
	});

	//draw a pixel line
	big.addCommand({
		type: 'drawLine',
		brush: 'pixel',
		path: [10,80, 75,35, 100,75, 190,105],
		fillStyle: 'blue'
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

	//draw a line using a shape
	big.addCommand({
		type: 'drawLine',
		brush: 'shape',
		path: [10,165, 75,120, 100,160, 190,190],
		stepDist: 10,
		shape: {
			shape: 'circle',
			globalAlpha: 0.2,
			stroke: true,
			fill: true,
			strokeStyle: 'blue',
			fillStyle: 'blue'
		}
	});
}

//shape test
function shapeTest() {
	setupTest('shapes');

	//create the layer we will draw on
	big.addCommand({type: 'createLayer'});

	//draw a diamond
	big.addCommand({
		type: 'drawShape',
		shape: 'rectangle',
		translateX: 30,
		translateY: 30,
		width: 20,
		height: 20,
		stroke: true,
		fill: false,
		strokeStyle: '#123456',
		rotation: 45
	});

	//draw a triangle
	big.addCommand({
		type: 'drawShape',
		shape: 'polygon',
		sides: 3,
		translateX: 50,
		translateY: 125,
		rotation: 30,
		radius: 40,
		stroke: false,
		fill: true,
		fillStyle: 'blue'
	});

	//draw a circle
	big.addCommand({
		type: 'drawShape',
		shape: 'circle',
		translateX: 100,
		translateY: 70,
		radius: 25,
		strokeStyle: 'green',
		fillStyle: 'purple'
	});

	//draw a star
	big.addCommand({
		type: 'drawShape',
		shape: 'star',
		translateX: 150,
		translateY: 20,
		radius: 15,
		stroke:true,
		fill:true,
		fillStyle: 'yellow',
		strokeStyle: 'orange',
		lineWidth: 1
	});

	//draw a hexagon
	big.addCommand({
		type: 'drawShape',
		shape: 'polygon',
		sides: 6,
		translateX: 150,
		translateY: 150,
		radius: 20,
		stroke:true,
		fill:true,
		fillStyle: 'red',
		strokeStyle: 'darkred',
		lineWidth: 10
	});
}


//flood fill test
function fillTest() {
	setupTest('flood-fill');

	//create the layer we will draw on
	big.addCommand({type: 'createLayer'});

	//draw a diamond
	big.addCommand({
		type: 'drawShape',
		shape: 'rectangle',
		translateX: 100,
		translateY: 80,
		width: 20,
		height: 20,
		stroke: true,
		fill: false,
		strokeStyle: '#123456',
		rotation: 45
	});

	//flood fill around the diamond
	big.addCommand({
		type: 'floodFill',
		x: 100,
		y: 100,
		width: 100,
		height: 100,
		fillStyle: 'purple'
	});
}


//object test
function objTest() {
	setupTest('objects');

	//create the layer we will draw on
	big.addCommand({type: 'createLayer'});

	//tree #1
	big.addCommand({
		type: 'addObject',
		src: 'img/tree.jpeg',
		objectId: 1,
		x: 50,
		y: 100,
		scaleX: 0.25,
		scaleY: 0.25
	});

	//tree #2
	big.addCommand({
		type: 'addObject',
		src: 'img/tree.jpeg',
		objectId: 2,
		x: 100,
		y: 100,
		scaleX: 0.25,
		scaleY: 0.25
	});

	//tree #3
	big.addCommand({
		type: 'addObject',
		src: 'img/tree.jpeg',
		objectId: 3,
		x: 150,
		y: 100,
		scaleX: 0.25,
		scaleY: 0.25
	});

	//flip tree #2 upside down
	big.addCommand({
		type: 'moveObject',
		objectId: 2,
		rotation: 180
	});
}


//long draw test
function longDrawTest() {
	setupTest('long-draw');

	//create the layer we will draw on
	big.addCommand({type: 'createLayer'});

	//draw 10,000 lines
	for(var i=0; i<10000; i++) {
		var x1 = Math.random() * big.width;
		var y1 = Math.random() * big.height;
		var x2 = Math.random() * big.width;
		var y2 = Math.random() * big.height;
		big.addCommand({
			type: 'drawLine',
			path: [x1, y1, x2, y2],
			lineWidth: 1,
			strokeStyle: '#123456',
			globalAlpha: 0.25
		});
	}
}


//layer test
function layerTest() {
	setupTest('layers');

	//create layer #1
	big.addCommand({
		type: 'createLayer',
		layerId: 1,
		scrollPerc: 0,
		alpha: 0.75
	});

	//create layer #2
	big.addCommand({
		type: 'createLayer',
		layerId: 2,
		scrollPerc: 0.33,
		alpha: 0.66
	});

	//create layer #3
	big.addCommand({
		type: 'createLayer',
		layerId: 3,
		scrollPerc: 0.66,
		alpha: 0.33
	});

	//draw a circle on layer #1
	big.addCommand({
		type: 'drawShape',
		shape: 'circle',
		layerId: 1,
		x: 100,
		y: 100,
		radius: 50,
		strokeStyle: 'green',
		fillStyle: 'purple'
	});

	//draw a circle on layer #2
	big.addCommand({
		type: 'drawShape',
		shape: 'circle',
		layerId: 2,
		x: 100,
		y: 100,
		radius: 50,
		strokeStyle: 'green',
		fillStyle: 'purple'
	});

	//draw a circle on layer #3
	big.addCommand({
		type: 'drawShape',
		shape: 'circle',
		layerId: 3,
		x: 100,
		y: 100,
		radius: 50,
		strokeStyle: 'green',
		fillStyle: 'purple'
	});

	//start animating
	beginRandomScrolling();
}

var callbackId;
var scrollX = 0;
var scrollY = 0;
function beginRandomScrolling() {
	endRandomScrolling();
	animationHandler();
}
function endRandomScrolling() {
	window.cancelAnimationFrame(callbackId);
}
function animationHandler() {
	scrollX += 0.5;
	scrollY += 0.5;
	if(scrollX > 100) {
		scrollX = -100;
	}
	if(scrollY > 100) {
		scrollY = -100;
	}
	big.scroll(scrollX, scrollY);
	callbackId = window.requestAnimationFrame(animationHandler);
}