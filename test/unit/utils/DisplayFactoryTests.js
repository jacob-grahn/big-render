/* global describe, it, expect, beforeEach, bigRender, createjs */

(function() {
	'use strict';


	describe('DisplayFactory', function() {
		var df = bigRender.DisplayFactory;


		it('should create a DisplayObject', function() {
			var d = df.make('fake/url.jpg');
			expect(d instanceof createjs.DisplayObject).toBe(true);
		});


		it('should not create the same image twice', function() {
			var d1 = df.make('poop.png');
			var d2 = df.make('poop.png');
			expect(d1.image).toBe(d2.image);
		});

	});

}());