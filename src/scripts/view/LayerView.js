/* global createjs, _ */
var bigRender = bigRender || {};

(function() {
	'use strict';


	// @extends createjs.Container
	var LayerView = function(layerModel, queue, width, height) {
		createjs.Container.call(this); //super

		this.displayAlpha = 1;

		this.layerModel = layerModel;
		this.commandDispatcher = new bigRender.CommandDispatcher(layerModel, queue);

		this.bitmap = new bigRender.LayerBitmapView(this.commandDispatcher, width, height);
		this.objectHolder = new bigRender.LayerObjectView(this.commandDispatcher);

		this.addChild(this.bitmap);
		this.addChild(this.objectHolder);

		_.bindAll(this, '_layerChangedHandler');
		this._addListeners();
	};

	var p = LayerView.prototype = new createjs.Container();


	p.getSaveState = function() {
		var saveObj = {};
		saveObj.image = this.bitmap.getSaveState();
		saveObj.objects = this.objectHolder.getSaveState();
		saveObj.layerId = this.layerModel.layerId;
		return(saveObj);
	};


	p.setSaveState = function(saveObj) {
		this.bitmap.setSaveState(saveObj.image);
		this.objectHolder.setSaveState(saveObj.objects);
	};


	p.updateDisplay = function() {
		var m = this.layerModel;
		this.x = m.scrollX * m.scrollPerc;
		this.y = m.scrollY * m.scrollPerc;
		this.alpha = m.alpha * this.displayAlpha;
		this.visible = m.visible;
	};


	p.setDisplayAlpha = function(num) {
		this.displayAlpha = num;
		this.updateDisplay();
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


	p.remove = function() {
		this._removeListeners();
		this.clear();
	};


	p._addListeners = function() {
		this.layerModel.addEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
		this.layerModel.addEventListener(bigRender.event.LAYER_RESIZED, this._layerResizedHandler);
	};


	p._removeListeners = function() {
		this.layerModel.removeEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
		this.layerModel.removeEventListener(bigRender.event.LAYER_RESIZED, this._layerResizedHandler);
	};


	p._layerChangedHandler = function(e) {
		this.updateDisplay();
	};


	p._layerResizedHandler = function(e) {
		this.bitmap.setDimensions(e.width, e.height);
	};


	bigRender.LayerView = LayerView;

}());