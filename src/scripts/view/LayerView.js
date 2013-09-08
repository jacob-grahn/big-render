/* global createjs */
var bigRender = bigRender || {};

(function() {
	'use strict';


	// @extends createjs.Container
	var LayerView = function(layer, queue, width, height) {
		createjs.Container.call(this); //super

		this.layer = layer;
		this.commandDispatcher = new bigRender.CommandDispatcher(layer, queue);

		this.bitmap = new bigRender.LayerBitmapView(this.commandDispatcher, width, height);
		this.objectHolder = new bigRender.LayerObjectView(this.commandDispatcher);

		this.addChild(this.bitmap);
		this.addChild(this.objectHolder);
	};

	var p = LayerView.prototype = new createjs.Container();



	p._addListeners = function() {
	};


	p._removeListeners = function() {
	};


	p.getObjectsUnderPoint = function(x, y) {
		return(this.objectHolder.getObjectsUnderPoint(x, y));
	};


	p.getObjectsUnderRect = function(rect) {
		return(this.objectHolder.getObjectsUnderRect(rect));
	};


	p.copy = function() {

	};


	p.clear = function() {

	};


	bigRender.LayerView = LayerView;

}());