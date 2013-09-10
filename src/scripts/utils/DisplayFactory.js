/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var DisplayFactory = function() {
		this.images = {};
	};

	var p = DisplayFactory.prototype;


	p.make = function(imgUrl) {
		var img = this.images[imgUrl];
		if(!img) {
			img = document.createElement('image');
			img.src = imgUrl;
			this.images[imgUrl] = img;
		}

		var bitmap = new createjs.Bitmap(img);
		return(bitmap);
	};


	p.remove = function() {
		this.images = null;
	};


	bigRender.DisplayFactory = DisplayFactory;
}());