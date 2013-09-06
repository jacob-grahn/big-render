/* global createjs */
var bigRender = bigRender || {};

(function(){
	'use strict';


	var CompositionView = function(elm, model, queue) {
		this.model = model;
		this.queue = queue;
		this.canvas = document.createElement('canvas');
		this.stage = new createjs.Stage(this.canvas);
		this.layers = [];

		if(elm) {
			elm.appendChild(this.canvas);
		}

		this._addListeners();
	};

	var p = CompositionView.prototype;


	p._addListeners = function() {
		var m = this.model;
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
		m.removeEventListener(bigRender.event.TARGET_LAYER_CHANGED, this._targetLayerChangedHandler);
		m.removeEventListener(bigRender.event.HIGHLIGHT_LAYER_CHANGED, this._highlightLayerChangedHandler);
		m.removeEventListener(bigRender.event.LAYER_ADDED, this._layerAddedHandler);
		m.removeEventListener(bigRender.event.LAYER_REMOVED, this._layerRemovedHandler);
		m.removeEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
		m.removeEventListener(bigRender.event.COMMAND_POS_CHANGED, this._commandPosChangedHandler);
		m.removeEventListener(bigRender.event.SCROLL_CHANGED, this._scrollChangedHandler);
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
					layerView.setModOpacity(1);
				}
				else {
					layerView.setModOpacity(.5);
				}
			});
		}

		//otherwise return all opacity to normal
		else {
			_.each(this.layers, function(layerView) {
				layerView.setModOpacity(1);
			});
		}
	};


	p._layerAddedHandler = function(e) {
		var layerView = new LayerView(this.model, e.command.layerId);
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



	p._layerChangedHandler = function(e) {};
	p._commandPosChangedHandler = function(e) {};



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
			layerView.setDepth(i);
		}
	};


	p.remove = function() {
		this._removeListeners();
	};


	bigRender.CompositionView = CompositionView;
}());