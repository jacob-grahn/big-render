/* global createjs */

var bigRender = bigRender || {};

(function(){
	'use strict';


	var LayerModel = function() {
		this.commands = [];
		this.commandPos = 0;
		this.layerId = null;
		this.name = 'Layer';
		this.zIndex = 0;
		this.opacity = 1;
		this.scrollPerc = 1;
		this.visible = true;
		this.active = true;
	};

	var p = LayerModel.prototype;
	createjs.EventDispatcher.initialize(p);


	p.setOptions = function(obj) {
		this.name = obj.name || this.name;
		this.zIndex = obj.zIndex || this.zIndex;
		this.opacity = obj.opacity || this.opacity;
		this.scrollPerc = obj.scrollPerc || this.scrollPerc;
		this.visible = obj.visible || this.visible;
		this.active = obj.active || this.active;
		this.dispatchEvent(bigRender.event.LAYER_CHANGED);
	};


	p.copyOptions = function() {
		var copy = JSON.parse(JSON.stringify(this));
		return(copy);
	};


	bigRender.LayerModel = LayerModel;

}());
