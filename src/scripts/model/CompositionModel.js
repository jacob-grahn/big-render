/* CompositionModel extends CommandChainModel */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var CompositionModel = function() {
		//super
		bigRender.CommandChainModel.call(this);
		//
		this.clear();
	};

	var p = CompositionModel.prototype = bigRender.CommandChainModel.prototype;


	p.CommandChainModelClear = p.clear;
	p.clear = function() {
		this.CommandChainModelClear();
		this.layers = [];
		this.targetLayer = null;
		this.highlightLayer = null;
		this.nextLayerId = 1;
		this.nextObjectId = 1;
		this.scrollX = 0;
		this.scrollY = 0;
		this.width = 200;
		this.height = 200;
	};


	p.setDimensions = function(w, h) {
		this.width = w;
		this.height = h;
		this.dispatchEvent({type: bigRender.event.DIMENSIONS_CHANGED, width:w, height:h});
	};


	p.setTargetLayer = function(layer) {
		this.targetLayer = layer;
		this.dispatchEvent({type: bigRender.event.TARGET_LAYER_CHANGED, targetLayer: layer});
	};


	p.addLayer = function(layer) {
		this.layers.push(layer);
		this.dispatchEvent({type: bigRender.event.LAYER_ADDED, layer: layer});
	};


	p.removeLayer = function(layer) {
		var index = this.layers.indexOf(layer);
		if(index !== -1) {
			this.layers.splice(index, 1);
			this.dispatchEvent({type: bigRender.event.LAYER_REMOVED, layer: layer});
		}
	};


	p.setScroll = function(x, y) {
		this.scrollX = x;
		this.scrollY = y;
		this.dispatchEvent({type: bigRender.event.SCROLL_CHANGED, scrollX: x, scrollY: y});
	};


	p.getLayerById = function(id) {
		for(var i=0; i<this.layers.length; i++) {
			var layer = this.layers[i];
			if(layer.layerId === id) {
				return(layer);
			}
		}
	};


	bigRender.CompositionModel = CompositionModel;

}());