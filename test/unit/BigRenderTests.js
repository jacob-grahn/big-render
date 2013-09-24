/* global describe, it, expect, beforeEach, bigRender */

(function() {
	'use strict';

	describe('BigRender', function() {

		var br, canvas;

		beforeEach(function() {
			canvas = document.createElement('canvas');
			canvas.width = canvas.height = 25;

			br = new bigRender.BigRender(canvas);
		});


		it('should save and load', function() {
			br.addCommand({type: bigRender.command.CREATE_LAYER, layerId: 1});
			br.addCommand({type: bigRender.command.DRAW_SHAPE, layerId: 1, shape: bigRender.shape.RECTANGLE, fillStyle: 'green', lineWidth: 5, strokeStyle: '#003300', x: 5, y: 5, width: 10, height: 10});

			br.addCommand({type: bigRender.command.CREATE_LAYER, layerId: 2});
			br.addCommand({type: bigRender.command.DRAW_SHAPE, layerId: 2, shape: bigRender.shape.CIRCLE});

			// get the original image
			br.update();
			var canvas1 = br.getSnapshot();

			//save, then load that save
			var state = br.getSaveState();
			br.clear();
			br.setSaveState(state);

			//get the new image
			br.update();
			var canvas2 = br.getSnapshot();

			//the original and new image should be the same
			expect(canvas1.toDataURL()).toBe(canvas2.toDataURL());
		});

	});
}());