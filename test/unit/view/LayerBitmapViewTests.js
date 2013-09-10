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


		it('should draw a circle', function() {
			var canvas = document.createElement('canvas');
			canvas.width = canvas.height = 25;
			var ctx = canvas.getContext('2d');

			ctx.fillStyle = 'green';
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#003300';

			var x = 5;
			var y = 5;
			var width = 10;
			var height = 10;
			var hB = ( width / 2 ) * 0.5522848;
			var vB = ( height / 2 ) * 0.5522848;
			var eX = x + width;
			var eY = x + height;
			var mX = x + width / 2;
			var mY = x + height / 2;
			ctx.moveTo( x, mY );
			ctx.bezierCurveTo( x, mY - vB, mX - hB, y, mX, y );
			ctx.bezierCurveTo( mX + hB, y, eX, mY - vB, eX, mY );
			ctx.bezierCurveTo( eX, mY + vB, mX + hB, eY, mX, eY );
			ctx.bezierCurveTo( mX - hB, eY, x, mY + vB, x, mY );
			ctx.closePath();

			var command = {type: bigRender.command.DRAW_SHAPE, fillStyle: 'green', lineWidth: 5, strokeStyle: '#003300', x: 5, y: 5, width: 10, height: 10};
			commandDispatcher.dispatchCommand(command, 'Do');

			expect(bitmapView.canvas.toDataURL()).toBe(canvas.toDataURL());
		});

	});
}());