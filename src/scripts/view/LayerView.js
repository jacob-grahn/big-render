/* global createjs */
var bigRender = bigRender || {};

(function() {
	'use strict';


	// @extends createjs.Container
	var LayerView = function(layerModel, queue, width, height) {
		createjs.Container.call(this); //super

		this.layerModel = layerModel;
		this.commandDispatcher = new bigRender.CommandDispatcher(layerModel, queue);

		this.bitmap = new bigRender.LayerBitmapView(this.commandDispatcher, width, height);
		this.objectHolder = new bigRender.LayerObjectView(this.commandDispatcher);

		this.addChild(this.bitmap);
		this.addChild(this.objectHolder);
	};

	var p = LayerView.prototype = new createjs.Container();


	p.setDisplayOpacity = function(num) {
		this.opacity = num * this.layerModel.opacity;
	};


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