/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var ImageCache = function() {
		this.images = new bigRender.CappedStorage(100);
		this.tintedImages = new bigRender.CappedStorage(5);
	};

	var p = ImageCache.prototype;


	p.add = function(img) {
		var src = img.getAttribute('src');
		this.images.store(src, img);
	};


	p.makeImg = function(src) {
		var img = this.images.retrieve(src);
		if(!img) {
			img = document.createElement('img');
			img.setAttribute('src', src);
			this.add(img);
		}
		return(img);
	};


	p.makeTintedImg = function(src, color, perc) {
		if(perc === 0) {
			return(this.makeImg(src));
		}
		else {
			var key = src + '-' + color + '-' + perc;
			var tintedCanvas = this.tintedImages.retrieve(key);
			if(!tintedCanvas) {
				var img = this.makeImg(src);
				tintedCanvas = bigRender.ImageTinter.tint(img, color, perc);
				if(tintedCanvas) {
					this.tintedImages.store(key, tintedCanvas);
				}
				else {
					tintedCanvas = img;
				}
			}
			return(tintedCanvas);
		}
	};


	p.makeBitmap = function(src) {
		var img = this.makeImg(src);
		var bitmap = new createjs.Bitmap(img);
		return(bitmap);
	};


	p.remove = function() {
		this.images.clear();
		this.images = null;

		this.tintedImages.clear();
		this.tintedImages = null;
	};


	bigRender.ImageCache = new ImageCache();

}());