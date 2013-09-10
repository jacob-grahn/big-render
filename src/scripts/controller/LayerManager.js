/* */
/* global _ */

var bigRender = bigRender || {};

(function(){
	'use strict';


	var LayerManager = function(compositionModel, commandDispatcher) {
		this.model = compositionModel;
		this.commandDispatcher = commandDispatcher;
		_.bindAll(this, '_doCreateLayer', '_undoCreateLayer', '_doDeleteLayer', '_undoDeleteLayer', '_doEditLayer', '_undoEditLayer');
		this._createListeners();
	};

	var p = LayerManager.prototype;


	p.createLayer = function(layerId) {
		var layer = new bigRender.LayerModel();
		layer.layerId = layerId || this.model.nextLayerId++;
		this.model.addLayer(layer);
		if(!this.model.targetLayer) {
			this.model.setTargetLayer(layer);
		}
		return(layer);
	};


	p.remove = function() {
		this._removeListeners();
		this.model = null;
		this.commandDispatcher = null;
	};


	p._createListeners = function() {
		var c = this.commandDispatcher;
		c.addEventListener(bigRender.command.CREATE_LAYER + 'Do', this._doCreateLayer);
		c.addEventListener(bigRender.command.CREATE_LAYER + 'Undo', this._undoCreateLayer);

		c.addEventListener(bigRender.command.DELETE_LAYER + 'Do', this._doDeleteLayer);
		c.addEventListener(bigRender.command.DELETE_LAYER + 'Undo', this._undoDeleteLayer);

		c.addEventListener(bigRender.command.EDIT_LAYER + 'Do', this._doEditLayer);
		c.addEventListener(bigRender.command.EDIT_LAYER + 'Undo', this._undoEditLayer);


	};




	p._removeListeners = function() {
		var c = this.commandDispatcher;
		c.removeEventListener(bigRender.command.CREATE_LAYER + 'Do', this._doCreateLayer);
		c.removeEventListener(bigRender.command.CREATE_LAYER + 'Undo', this._undoCreateLayer);
		c.removeEventListener(bigRender.command.DELETE_LAYER + 'Do', this._doDeleteLayer);
		c.removeEventListener(bigRender.command.DELETE_LAYER + 'Undo', this._undoDeleteLayer);
		c.removeEventListener(bigRender.command.EDIT_LAYER + 'Do', this._doEditLayer);
		c.removeEventListener(bigRender.command.EDIT_LAYER + 'Undo', this._undoEditLayer);
	};


	p._doCreateLayer = function(e) {
		var command = e.command;
		command.layerId = command.layerId || this.model.nextLayerId++;
		this.createLayer(command.layerId);
	};


	p._undoCreateLayer = function(e) {
		var layer = this.model.getLayerById(e.command.layerId);
		if(layer) {
			this.model.removeLayer(layer);
			this._pickDefaultTargetLayer(layer);
		}
	};


	p._doDeleteLayer = function(e) {
		var layer = this.model.getLayerById(e.command.layerId);
		if(layer) {
			e.command.deletedLayer = layer;
			this.model.removeLayer(layer);
			this._pickDefaultTargetLayer(layer);
		}
	};


	p._undoDeleteLayer = function(e) {
		var layer = e.command.deletedLayer;
		this.model.addLayer(layer);
	};


	p._doEditLayer = function(e) {
		var layer = this.model.getLayerById(e.command.layerId);
		if(layer) {
			e.command.oldOptions = layer.copyOptions();
			layer.setOptions(e.command);
		}
	};


	p._undoEditLayer = function(e) {
		var layer = this.model.getLayerById(e.command.layerId);
		if(layer) {
			layer.setOptions(e.command.oldOptions);
		}
	};


	p._pickDefaultTargetLayer = function(layer) {
		var model = this.model;
		if(!model.targetLayer || model.targetLayer === layer) {
			if(model.layers.length > 0) {
				model.setTargetLayer(model.layers[0]);
			}
		}
	};


	bigRender.LayerManager = LayerManager;

}());