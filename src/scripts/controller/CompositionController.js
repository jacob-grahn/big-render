/* CompositionController extends CommandChainController */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var CompositionController = function(compositionModel) {
		//super
		bigRender.CommandChainController.call(this, compositionModel);

		this.model = compositionModel;
		this.layerManager = new bigRender.LayerManager(compositionModel, this.commandDispatcher);
	};

	var p = CompositionController.prototype = bigRender.CommandChainController.prototype;


	p.highlightLayer = function(layer) {
		this.model.highlightLayer = layer;
	};


	p.getSaveObj = function() {
		var model = this.model;

		var saveObj = {};
		saveObj.version = 5;
		saveObj.data = model.data;
		saveObj.layers = [];
		saveObj.width = model.width;
		saveObj.height = model.height;

		for(var i=0; i<model.layers.length; i++) {
			var layer = model.layers[i];
			saveObj.layers.push(layer.getSaveObj());
		}

		return(saveObj);
	};


	p.setSaveObj = function(saveObj) {
		this.clear();

		var model = this.model;
		model.setData(saveObj.data);
		model.setDimensions(saveObj.width, saveObj.height);

		for(var i=0; i<saveObj.layers.length; i++) {
			var layerSaveObj = saveObj.layers[i];
			var layer = this.layerManager.createLayer();
			layer.setSaveObj(layerSaveObj);
		}
	};


	p.undo = function() {
		if(this.model.targetCommandPos > 0) {
			this.model.targetCommandPos--;
			this.commandDispatcher.start();
		}
	};


	p.redo = function() {
		if(this.model.targetCommandPos < this.model.commands.length) {
			this.model.targetCommandPos++;
			this.commandDispatcher.start();
		}
	};


	p.CommandChainControllerClear = p.clear;
	p.clear = function() {
		this.CommandChainControllerClear();
		this.commandDispatcher.clear();
		this.model.restoreDefaults();
	};


	p.CommandChainControllerRemove = p.remove;
	p.remove = function() {
		this.CommandChainControllerRemove();
		this.layerManager.remove();
		this.layerManager = null;
	};


	bigRender.CompositionController = CompositionController;

}());