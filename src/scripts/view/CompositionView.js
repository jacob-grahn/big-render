/* global createjs */
var bigRender = bigRender || {};

(function(){
	'use strict';


	var CompositionView = function(elm, model, queue) {
		this.model = model;
		this.queue = queue;
		this.canvas = document.createElement('canvas');
		this.stage = new createjs.Stage(this.canvas);
		this.layers = [];

		if(elm) {
			elm.appendChild(this.canvas);
		}

		this._addListeners();
	};

	var p = CompositionView.prototype;


	p._addListeners = function() {
		var m = this.model;
		m.addEventListener(bigRender.event.TARGET_LAYER_CHANGED, this._targetLayerChangedHandler);
		m.addEventListener(bigRender.event.HIGHLIGHT_LAYER_CHANGED, this._highlightLayerChangedHandler);
		m.addEventListener(bigRender.event.LAYER_ADDED, this._layerAddedHandler);
		m.addEventListener(bigRender.event.LAYER_REMOVED, this._layerRemovedHandler);
		m.addEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
		m.addEventListener(bigRender.event.COMMAND_POS_CHANGED, this._commandPosChangedHandler);
		m.addEventListener(bigRender.event.SCROLL_CHANGED, this._scrollChangedHandler);
	};


	p._removeListeners = function() {
		var m = this.model;
		m.removeEventListener(bigRender.event.TARGET_LAYER_CHANGED, this._targetLayerChangedHandler);
		m.removeEventListener(bigRender.event.HIGHLIGHT_LAYER_CHANGED, this._highlightLayerChangedHandler);
		m.removeEventListener(bigRender.event.LAYER_ADDED, this._layerAddedHandler);
		m.removeEventListener(bigRender.event.LAYER_REMOVED, this._layerRemovedHandler);
		m.removeEventListener(bigRender.event.LAYER_CHANGED, this._layerChangedHandler);
		m.removeEventListener(bigRender.event.COMMAND_POS_CHANGED, this._commandPosChangedHandler);
		m.removeEventListener(bigRender.event.SCROLL_CHANGED, this._scrollChangedHandler);
	};


	p._targetLayerChangedHandler = function(e) {
		@targetLayer = layer
	};


	p._highlightLayerChangedHandler = function(e) {};


	p._layerAddedHandler = function(e) {
		layerId = parseInt( layerId )
		layer = new LayerGroup( layerId, @nestArr.slice( 0 ), this )
		if( @infinite )
			layer.setPosition( @layerX, @layerY )
		@container.addChild( layer.container )
		@layers.push( layer )
		@targetLayer = layer
		@sortLayers()
		return( layer )
	};


	p._layerRemovedHandler = function(e) {
		if( @layers.length > 1 )
			layerId = parseInt( layerId )
		layer = @getLayer( layerId )
		Data.removeFromArray( @layers, layer )
		@container.removeChild( layer.container )
		@deletedLayers.push( layer )
		if( @targetLayer == layer )
			@targetLayer = @layers[ 0 ]
		@sortLayers()
	};



	p._layerChangedHandler = function(e) {};
	p._commandPosChangedHandler = function(e) {};



	p._scrollChangedHandler = function(e) {
		if( @infinite )
			super( x, y )
		else
			super( x + @layerX, y + @layerY )
		@x = x
		@y = y
	};


	p.remove = function() {
		this._removeListeners();
	};


	bigRender.CompositionView = CompositionView;
}());