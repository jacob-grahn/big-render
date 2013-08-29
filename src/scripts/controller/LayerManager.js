var bigRender = bigRender || {};

(function(){
	'use strict';


	var LayerManager = function(model, commandDispatcher) {
		this.model = model;
		this.commandDispatcher = commandDispatcher;
		this._createListeners();
	};

	var p = LayerManager.prototype;


	p.remove = function() {
		this._removeListeners();
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
		var c = e.command;
		c.layerId = c.layerId || this.model.nextLayerId++;

		var layer = new LayerModel();
		layer.layerId = e.command.layerId;
	};


	p._undoCreateLayer = function(e) {
	};


	p._doDeleteLayer = function(e) {
	};


	p._undoDeleteLayer = function(e) {
	};


	p._doEditLayer = function(e) {
	};


	p._undoEditLayer = function(e) {
	};



	doCreateLayer: ( layerId ) =>
	layerId = parseInt( layerId )
	layer = new LayerGroup( layerId, @nestArr.slice( 0 ), this )
	if( @infinite )
		layer.setPosition( @layerX, @layerY )
	@container.addChild( layer.container )
	@layers.push( layer )
	@targetLayer = layer
	@sortLayers()
	return( layer )


	undoCreateLayer: ( layerId ) =>
	layer = @getLayer( layerId )
	Data.removeFromArray( @layers, layer )
	@container.removeChild( layer.container )
	layer.remove()
	if( @targetLayer == layer )
		@targetLayer = @layers[ 0 ]
	@sortLayers()


	doDeleteLayer: ( layerId ) =>
	if( @layers.length > 1 )
		layerId = parseInt( layerId )
	layer = @getLayer( layerId )
	Data.removeFromArray( @layers, layer )
	@container.removeChild( layer.container )
	@deletedLayers.push( layer )
	if( @targetLayer == layer )
		@targetLayer = @layers[ 0 ]
	@sortLayers()


	undoDeleteLayer: ( layerId ) =>
	layer = @deletedLayers.pop()
	@container.addChild( layer.container )
	@layers.push( layer )
	@sortLayers()


	bigRender.LayerManager = LayerManager;

}());