/* global describe, it, expect, beforeEach, bigRender */

(function() {
	'use strict';

	describe('LayerBitmapView', function() {

		var commandDispatcher;
		var bitmapView;
		var layerModel;

		beforeEach(function() {
			layerModel = new bigRender.LayerModel();
			commandDispatcher = new bigRender.CommandDispatcher(layerModel, null);
			bitmapView = new bigRender.LayerBitmapView(commandDispatcher, 25, 25);
		});


		it('should create a bitmap', function() {
			var canvas = document.createElement('canvas');
			canvas.width = canvas.height = 25;

			expect(bitmapView.canvas.toDataURL()).toBe(canvas.toDataURL());
		});


		it('should draw a line', function() {
			var canvas = document.createElement('canvas');
			canvas.width = canvas.height = 25;

			var ctx = canvas.getContext('2d');
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#123456';
			ctx.beginPath();
			ctx.moveTo(1, 2);
			ctx.lineTo(24, 25);
			ctx.stroke();

			var command = {type: bigRender.command.DRAW_LINE, lineWidth:5, strokeStyle:'#123456', path:[1,2,24,25]};
			commandDispatcher.dispatchCommand(command, 'Do');

			expect(bitmapView.canvas.toDataURL()).toBe(canvas.toDataURL());
		});

	});
}());