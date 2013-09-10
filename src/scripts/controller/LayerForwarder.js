var bigRender = bigRender || {};

(function(){
	'use strict';

	var LayerForwarder = function(compositionModel, commandDispatcher) {
		this.compositionModel = compositionModel;
		this.commandDispatcher = commandDispatcher;
		this.layerCommands = [
			bigRender.command.ADD_OBJECT,
			bigRender.command.DRAW_IMAGE,
			bigRender.command.DRAW_LINE,
			bigRender.command.DRAW_SHAPE,
			bigRender.command.ERASE_RECT,
			bigRender.command.MOVE_OBJECT,
			bigRender.command.MOVE_RECT,
			bigRender.command.REMOVE_OBJECT
		];
		_.bindAll(this, '_doPassForward', '_undoPassForward');
		this._addListeners();
	};

	var p = LayerForwarder.prototype;


	p._addListeners = function() {
		for(var i = 0; i < this.layerCommands.length; i++) {
			var command = this.layerCommands[i];
			this.commandDispatcher.addEventListener(command + 'Do', this._doPassForward);
			this.commandDispatcher.addEventListener(command + 'Undo', this._undoPassForward);
		}
	};


	p._removeListeners = function() {
		for(var i = 0; i < this.layerCommands.length; i++) {
			var command = this.layerCommands[i];
			this.commandDispatcher.removeEventListener(command + 'Do', this._doPassForward);
			this.commandDispatcher.removeEventListener(command + 'Undo', this._undoPassForward);
		}
	};


	p._doPassForward = function(e) {
		if(this.compositionModel.layers.length > 0) {
			e.command.layerId = e.command.layerId || this.compositionModel.targetLayer.layerId;
			var layerModel = this.compositionModel.getLayerById(e.command.layerId);
			layerModel.commands.push(e.command);
			layerModel.setTargetCommandPos(layerModel.commands.length);
		}
	};


	p._undoPassForward = function(e) {
		var layerModel = this.compositionModel.getLayerById(e.command.layerId);
		if(layerModel) {
			layerModel.setTargetCommandPos(layerModel.commands.length-1);
			layerModel.commands.pop();
		}
	};


	p.remove = function(){
		this._removeListeners();
		this.commandDispatcher = null;
	};


	bigRender.LayerForwarder = LayerForwarder;

}());