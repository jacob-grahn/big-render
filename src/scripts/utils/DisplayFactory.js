/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var DisplayFactory = function() {
		this.images = {};
	};

	var p = DisplayFactory.prototype;


	p.make = function(src) {
		var img = this.images[src];
		if(!img) {
			img = document.createElement('img');
			img.setAttribute('src', src);
			this.images[src] = img;
		}

		var bitmap = new createjs.Bitmap(img);
		return(bitmap);
	};


	p.remove = function() {
		this.images = null;
	};


	bigRender.DisplayFactory = new DisplayFactory();
}());