var bigRender = bigRender || {};

(function() {
	'use strict';


	var CompositionController = function(compositionModel) {
		this.model = compositionModel;
		this.commandDispatcher = new bigRender.CommandDispatcher(compositionModel, null);
		this.layerManager = new bigRender.LayerManager(compositionModel, this.commandDispatcher);
	};

	var p = CompositionController.prototype;


	p.addCommand = function(command) {
		var model = this.model;
		if(model.commands.length > model.targetCommandPos) {
			model.commands.slice(0, model.targetCommandPos);
		}
		if(model.commands.length === model.targetCommandPos) {
			model.targetCommandPos++;
		}
		model.commands.push(command);
		this.commandDispatcher.start();
	};


	p.replaceLastCommand = function(command) {
		this.clearLastCommand();
		this.addCommand(command);
	};


	p.clearLastCommand = function() {
		var model = this.model;
		if(model.commands.length > 0) {
			model.targetCommandPos--;
			this.commandDispatcher.start();
			model.commands.pop();
		}
	};


	p.highlightLayer = function(layer) {
		this.model.highlightLayer = layer;
	};


	p.getSaveObj = function() {
		var model = this.model;

		var saveObj = {};
		saveObj.v = 5;
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


	p.clear = function() {
		this.commandDispatcher.clear();
		this.model.restoreDefaults();
	};


	p.remove = function() {
		this.commandDispatcher.remove();
		this.commandDispatcher = null;

		this.layerManager.remove();
		this.layerManager = null;
	};


	bigRender.CompositionController = CompositionController;

}());