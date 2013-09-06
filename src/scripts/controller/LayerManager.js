/* global $ */

var bigRender = bigRender || {};

(function(){
	'use strict';


	var LayerManager = function(model, commandDispatcher) {
		this.model = model;
		this.commandDispatcher = commandDispatcher;

		var self = this;

		self._doCreateLayer = function(e) {
			var command = e.command;
			command.layerId = command.layerId || self.model.nextLayerId++;
			self.createLayer(command.layerId);
		};

		self._undoCreateLayer = function(e) {
			var layer = self.model.getLayerById(e.command.layerId);
			if(layer) {
				self.model.removeLayer(layer);
				self._pickDefaultTargetLayer(layer);
			}
		};

		self._doDeleteLayer = function(e) {
			var layer = self.model.getLayerById(e.command.layerId);
			if(layer) {
				e.command.deletedLayer = layer;
				self.model.removeLayer(layer);
				self._pickDefaultTargetLayer(layer);
			}
		};

		self._undoDeleteLayer = function(e) {
			var layer = e.command.deletedLayer;
			self.model.addLayer(layer);
		};

		self._doEditLayer = function(e) {
			var layer = self.model.getLayerById(e.command.layerId);
			if(layer) {
				e.command.oldOptions = layer.copyOptions();
				layer.setOptions(e.command);
			}
		};

		self._undoEditLayer = function(e) {
			var layer = self.model.getLayerById(e.command.layerId);
			if(layer) {
				layer.setOptions(e.command.oldOptions);
			}
		};

		this._createListeners();
	};

	var p = LayerManager.prototype;


	p.createLayer = function(layerId) {
		var layer = new bigRender.LayerModel();
		layer.layerId = layerId || this.model.nextLayerId++;
		this.model.addLayer(layer);
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