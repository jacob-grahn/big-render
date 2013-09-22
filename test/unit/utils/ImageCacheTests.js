/* global describe, it, expect, beforeEach, bigRender, createjs */

(function() {
	'use strict';


	describe('ImageCache', function() {
		var df = bigRender.ImageCache;


		it('should create a DisplayObject', function() {
			var d = df.makeBitmap('fake/url.jpg');
			expect(d instanceof createjs.DisplayObject).toBe(true);
		});


		it('should not create the same image twice', function() {
			var d1 = df.makeBitmap('poop.png');
			var d2 = df.makeBitmap('poop.png');
			expect(d1.image).toBe(d2.image);
		});

	});

}());