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
			if(model.commands.length === model.targetCommandPos) {
				model.targetCommandPos--;
			}
			model.commands.pop();
		}
	};


	p.highlightLayer = function(layer) {
		this.model.highlightLayer = layer;
	};


	p.getSaveObj = function() {
	};


	p.setSaveObj = function() {
	};


	p.undo = function() {
		if(this.model.targetCommandPos > 0) {
			this.model.targetCommandPos--;
		}
	};


	p.redo = function() {
		if(this.model.targetCommandPos < this.model.commands.length) {
			this.model.targetCommandPos++;
		}
	};


	p.remove = function() {
		this.commandDispatcher.remove();
		this.commandDispatcher = null;

		this.layerManager.remove();
		this.layerManager = null;
	};


	bigRender.CompositionController = CompositionController;

}());