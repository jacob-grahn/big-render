/* LayerModel extends CommandChainModel */
/* global createjs */

var bigRender = bigRender || {};

(function(){
	'use strict';


	var LayerModel = function() {
		//super
		bigRender.CommandChainModel.call(this);
		//
		this.layerId = null;
		this.name = 'Layer';
		this.zIndex = 0;
		this.alpha = 1;
		this.scrollPerc = 1;
		this.scrollX = 0;
		this.scrollY = 0;
		this.visible = true;
		this.active = true;
	};

	var p = LayerModel.prototype = bigRender.CommandChainModel.prototype;


	p.setOptions = function(obj) {
		var first = bigRender.firstWithValue;
		this.name = first(obj.name, this.name);
		this.zIndex = first(obj.zIndex, this.zIndex);
		this.alpha = first(obj.alpha, this.alpha);
		this.scrollPerc = first(obj.scrollPerc, this.scrollPerc);
		this.visible = first(obj.visible, this.visible);
		this.active = first(obj.active, this.active);
		this.dispatchEvent(bigRender.event.LAYER_CHANGED);
	};


	p.setScroll = function(x, y) {
		if(this.scrollX !== x || this.scrollY !== y) {
			this.scrollX = x;
			this.scrollY = y;
			this.dispatchEvent(bigRender.event.LAYER_CHANGED);
		}
	};


	p.copyOptions = function() {
		var copy = JSON.parse(JSON.stringify(this));
		return(copy);
	};


	bigRender.LayerModel = LayerModel;

}());
