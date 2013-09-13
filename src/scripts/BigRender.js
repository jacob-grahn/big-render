/* global _ */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var BigRender = function(canvas) {
		this.queue = new bigRender.Queue();
		this.model = new bigRender.CompositionModel();
		this.controller = new bigRender.CompositionController(this.model);
		this.view = new bigRender.CompositionView(canvas, this.model, this.queue);

		var c = this.controller;
		this.addCommand = _.bind(c.addCommand, c);
		this.replaceLastCommand = _.bind(c.replaceLastCommand, c);
		this.clearLastCommand = _.bind(c.clearLastCommand, c);
		this.highlightLayer = _.bind(c.highlightLayer, c);
		this.getSaveObj = _.bind(c.getSaveObj, c);
		this.setSaveObj = _.bind(c.setSaveObj, c);
		this.undo = _.bind(c.undo, c);
		this.redo = _.bind(c.redo, c);
	};

	var p = BigRender.prototype;


	p.setDimensions = function(w, h) {
		this.view.canvas.width = w;
		this.view.canvas.height = h;
	};


	p.clear = function() {
		this.model.clear();
		this.view.clear();
		this.controller.clear();
	}


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


	bigRender.BigRender = BigRender;

}());