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


	p.getGraphics = function() {
		var saveObj = {};
		saveObj.images = this.bitmap.getImages();
		saveObj.objects = this.objectHolder.getObjects();
		saveObj.layerId = this.layerModel.layerId;
		return(saveObj);
	};


	p.setGraphics = function(saveObj) {
		this.bitmap.setImages(saveObj.images);
		this.objectHolder.setObjects(saveObj.objects);
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
	};


	p._removeListeners = function() {
		this.layerModel.removeEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
	};


	p._layerChangedHandler = function() {
		this.updateDisplay();
	};


	bigRender.LayerView = LayerView;

}());