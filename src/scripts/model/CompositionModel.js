var bigRender = bigRender || {};

(function() {
	'use strict';


	var CompositionModel = function() {
		this.layers = [];
		this.targetLayer = null;
		this.highlightLayer = null;
		this.nextLayerId = 1;
		this.commands = [];
		this.targetCommandPos = 0;
		this.data = {};
		this.x = 0;
		this.y = 0;
		this.width = 200;
		this.height = 200;
		this.multiImage = false;
	};

	var p = CompositionModel.prototype;



	p.setTargetLayer = function(layer) {
		this.targetLayer = layer;
		this.dispatchEvent({type: bigRender.CompositionModelEvent.TARGET_LAYER_CHANGED, targetLayer: layer});
	};


	p.addLayer = function(layer) {
		this.layers.push(layer);
		this.dispatchEvent({type: bigRender.CompositionModelEvent.LAYER_ADDED, layer: layer});
	};

	bigRender.CompositionModel = CompositionModel;
}());