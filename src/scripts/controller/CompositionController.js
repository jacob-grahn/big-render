/* CompositionController extends CommandChainController */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var CompositionController = function(compositionModel) {
		//super
		bigRender.CommandChainController.call(this, compositionModel);
		//
		this.model = compositionModel;
		this.layerManager = new bigRender.LayerManager(compositionModel, this.commandDispatcher);
		this.layerForwarder = new bigRender.LayerForwarder(compositionModel, this.commandDispatcher);
	};

	var p = CompositionController.prototype = bigRender.CommandChainController.prototype;


	p.scroll = function(x, y) {
		this.model.setScroll(x, y);
		for(var i=0; i<this.model.layers.length; i++) {
			var layerModel = this.model.layers[i];
			layerModel.setScroll(x, y);
		}
	};


	p.highlightLayer = function(layer) {
		this.model.highlightLayer = layer;
	};


	p.getSaveState = function() {
		var model = this.model;

		var saveState = {};
		saveState.version = 5;
		saveState.layers = [];
		saveState.width = model.width;
		saveState.height = model.height;

		for(var i=0; i<model.layers.length; i++) {
			var layer = model.layers[i];
			saveState.layers.push(layer.copyOptions());
		}

		return(saveState);
	};


	p.setSaveState = function(saveState) {
		this.clear();

		var model = this.model;
		model.setDimensions(saveState.width, saveState.height);

		for(var i=0; i<saveState.layers.length; i++) {
			var layerSaveObj = saveState.layers[i];
			var layer = this.layerManager.createLayer();
			layer.setOptions(layerSaveObj);
		}
	};


	p.undo = function() {
		if(this.model.targetCommandPos > 0) {
			this.model.setTargetCommandPos(this.model.targetCommandPos - 1);
		}
	};


	p.redo = function() {
		if(this.model.targetCommandPos < this.model.commands.length) {
			this.model.setTargetCommandPos(this.model.targetCommandPos + 1);
		}
	};


	p.setTargetLayer = function(layerId) {
		var layer = this.model.getLayerById(layerId);
		this.model.setTargetLayer(layer);
	};


	p.CommandChainControllerClear = p.clear;
	p.clear = function() {
		this.CommandChainControllerClear();
		this.commandDispatcher.clear();
		this.model.clear();
	};


	p.CommandChainControllerRemove = p.remove;
	p.remove = function() {
		this.CommandChainControllerRemove();

		this.layerManager.remove();
		this.layerManager = null;

		this.layerForwarder.remove();
		this.layerForwarder = null;
	};


	bigRender.CompositionController = CompositionController;

}());