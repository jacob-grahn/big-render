var bigRender = bigRender || {};

(function() {
	'use strict';


	var BigRender = function(elm) {
		this.queue = new bigRender.Queue();
		this.model = new bigRender.CompositionModel();
		this.controller = new bigRender.CompositionController(this.model);
		this.view = new bigRender.CompositionView(elm, this.model, this.queue);

		this.addCommand = this.controller.addCommand;
		this.replaceLastCommand = this.controller.replaceLastCommand;
		this.clearLastCommand = this.controller.clearLastCommand;
		this.highlightLayer = this.controller.highlightLayer;
		this.getSaveObj = this.controller.getSaveObj;
		this.setSaveObj = this.controller.setSaveObj;
		this.undo = this.controller.undo;
		this.redo = this.controller.redo;
	};

	var p = BigRender.prototype;


	p.setDimensions = function(w, h) {
		this.view.canvas.width = w;
		this.view.canvas.height = h;
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


	bigRender.BigRender = BigRender;

}());