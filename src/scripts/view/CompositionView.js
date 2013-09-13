/* global createjs, _*/

var bigRender = bigRender || {};

(function(){
	'use strict';


	var CompositionView = function(canvas, model, queue) {
		this.model = model;
		this.width = model.width;
		this.height = model.height;
		this.queue = queue;
		this.canvas = canvas;
		this.stage = new createjs.Stage(this.canvas);
		this.stage.autoClear = true;
		this.layers = [];

		_.bindAll(this, '_tickHandler', '_targetLayerChangedHandler', '_highlightLayerChangedHandler', '_layerAddedHandler', '_layerRemovedHandler', '_layerChangedHandler', '_commandPosChangedHandler', '_scrollChangedHandler');
		this._addListeners();
	};

	var p = CompositionView.prototype;


	p._addListeners = function() {
		var m = this.model;
		createjs.Ticker.addEventListener('tick', this._tickHandler);
		m.addEventListener(bigRender.event.TARGET_LAYER_CHANGED, this._targetLayerChangedHandler);
		m.addEventListener(bigRender.event.HIGHLIGHT_LAYER_CHANGED, this._highlightLayerChangedHandler);
		m.addEventListener(bigRender.event.LAYER_ADDED, this._layerAddedHandler);
		m.addEventListener(bigRender.event.LAYER_REMOVED, this._layerRemovedHandler);
		m.addEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
		m.addEventListener(bigRender.event.COMMAND_POS_CHANGED, this._commandPosChangedHandler);
		m.addEventListener(bigRender.event.SCROLL_CHANGED, this._scrollChangedHandler);
	};


	p._removeListeners = function() {
		var m = this.model;
		createjs.Ticker.removeEventListener('tick', this._tickHandler);
		m.removeEventListener(bigRender.event.TARGET_LAYER_CHANGED, this._targetLayerChangedHandler);
		m.removeEventListener(bigRender.event.HIGHLIGHT_LAYER_CHANGED, this._highlightLayerChangedHandler);
		m.removeEventListener(bigRender.event.LAYER_ADDED, this._layerAddedHandler);
		m.removeEventListener(bigRender.event.LAYER_REMOVED, this._layerRemovedHandler);
		m.removeEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
		m.removeEventListener(bigRender.event.COMMAND_POS_CHANGED, this._commandPosChangedHandler);
		m.removeEventListener(bigRender.event.SCROLL_CHANGED, this._scrollChangedHandler);
	};


	p._tickHandler = function(e) {
		this.stage.update();
	};


	p._targetLayerChangedHandler = function(e) {
		//do nothing
	};


	p._highlightLayerChangedHandler = function(e) {
		var hLayer = e.command.layer;

		//highlight the selected layer by fading all other layers out
		if(hLayer) {
			_.each(this.layers, function(layerView){
				if(layerView.layerModel === hLayer) {
					layerView.setDisplayOpacity(1);
				}
				else {
					layerView.setDisplayOpacity(0.5);
				}
			});
		}

		//otherwise return all opacity to normal
		else {
			_.each(this.layers, function(layerView) {
				layerView.setDisplayOpacity(1);
			});
		}
	};


	p._layerAddedHandler = function(e) {
		var layerView = new bigRender.LayerView(e.layer, this.queue, this.width, this.height);
		this.stage.addChild(layerView);
		this.layers.push(layerView);
		this._sortLayers();
	};


	p._layerRemovedHandler = function(e) {
		var layerView = _.find(this.layers, function(lv) { return(lv.layerId === e.command.layerId); });
		if(layerView) {
			layerView.remove();
			this.layers = _.without(this.layers, layerView);
		}
		this._sortLayers();
	};



	p._layerChangedHandler = function(e) {

	};


	p._commandPosChangedHandler = function(e) {

	};


	p._scrollChangedHandler = function(e) {
		for(var i=0; i<this.layers.length; i++) {
			var layerView = this.layers[i];
			layerView.setScroll(e.command.x, e.command.y);
		}
	};


	p._sortLayers = function() {
		this.layers.sort( function(a,b) {
			return(a.z - b.z);
		});
		for(var i=0; i<this.layers.length; i++) {
			var layerView = this.layers[i];
			this.stage.addChild(layerView);
		}
	};


	p.clear = function()  {
		this.stage.removeAllChildren();
		this.layers = [];
	};


	p.remove = function() {
		this._removeListeners();
	};


	bigRender.CompositionView = CompositionView;
}());