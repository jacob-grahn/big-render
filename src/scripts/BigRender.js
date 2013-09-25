/* global _ */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var BigRender = function(canvas) {
		this.queue = new bigRender.Queue();
		this.model = new bigRender.CompositionModel();
		this.controller = new bigRender.CompositionController(this.model);
		this.view = new bigRender.CompositionView(canvas, this.model, this.queue);
		this._setupFunctionForwarding();
		this.setDimensions(canvas.width, canvas.height);
	};

	var p = BigRender.prototype;


	p.getSaveState = function() {
		var saveState = {};
		saveState.settings = this.controller.getSaveState();
		saveState.graphics = this.view.getSaveState();
		return(saveState);
	};


	p.setSaveState = function(saveState) {
		this.clear();
		this.controller.setSaveState(saveState.settings);
		this.view.setSaveState(saveState.graphics);
	};


	p.setDimensions = function(w, h) {
		this.width = w;
		this.height = h;
		this.controller.setDimensions(w, h);
	};


	p.clear = function() {
		this.model.clear();
		this.view.clear();
		this.controller.clear();
	};


	p.remove = function() {
		this.queue.remove();
		this.model.remove();
		this.controller.remove();
		this.view.remove();

		this.queue = null;
		this.model = null;
		this.controller = null;
		this.view = null;
	};


	p._setupFunctionForwarding = function() {
		var c = this.controller;
		this.addCommand = _.bind(c.addCommand, c);
		this.replaceLastCommand = _.bind(c.replaceLastCommand, c);
		this.clearLastCommand = _.bind(c.clearLastCommand, c);
		this.highlightLayer = _.bind(c.highlightLayer, c);
		this.undo = _.bind(c.undo, c);
		this.redo = _.bind(c.redo, c);
		this.setTargetLayer = _.bind(c.setTargetLayer, c);
		this.scroll = _.bind(c.scroll, c);
		this.update = _.bind(this.view.update, this.view);
		this.getSnapshot = _.bind(this.view.getSnapshot, this.view);
	};


	bigRender.BigRender = BigRender;

}());