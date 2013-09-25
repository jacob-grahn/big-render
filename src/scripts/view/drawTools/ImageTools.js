var bigRender = bigRender || {};

(function() {
	'use strict';

	bigRender.ImageTools = {


		drawImage: function(ctx, command) {
			var tintColor = command.color || command.tintColor || '#FFFFFF';
			var tintPerc = command.tintPerc || 0;
			var image = bigRender.ImageCache.makeTintedImg(command.src, tintColor, tintPerc);
			var srcX = command.srcX || 0;
			var srcY = command.srcY || 0;
			var srcWidth = command.srcWidth || image.width;
			var srcHeight = command.srcHeight || image.height;
			var destX = command.destX || command.x || 0;
			var destY = command.destY || command.y || 0;
			var destWidth = command.destWidth || image.width;
			var destHeight = command.destHeight || image.width;

			destX -= (image.width/2);
			destY -= (image.height/2);

			if(image.width === 0 && image.height === 0) {
				return(false);
			}
			else {
				ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
				return(true);
			}
		},


		moveRect: function(ctx, command) {
			var src = command.src;
			var dest = command.dest;

			var tempImg = this.copyRect(src);
			this.drawRect(tempImg, dest.x, dest.y, dest.width, dest.height, dest.rotation, dest.scaleX, dest.scaleY);
			ctx.clearRect(src.x, src.y, src.width, src.height);
		},


		copyRect: function(canvas, rect) {
			var x = rect.x;
			var y = rect.y;
			var width = rect.width;
			var height = rect.height;
			var Maths = bigRender.Maths;

			/*if( x > this.width || y > this.height || x + width < 0 || y + height < 0) {
			 throw new Error('ArtLayer::copyRect - invalid area');
			 }*/

			x = Maths.limit(x, 0, this.width);
			y = Maths.limit(y, 0, this.height);
			width = Maths.limit(width, 1, this.width - x);
			height = Maths.limit(height, 1, this.height - y);

			var destCanvas = bigRender.CanvasCache.pop();
			destCanvas.width = width;
			destCanvas.height = height;

			var destCtx = destCanvas.getContext('2d');
			destCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
		},


		deleteRect: function(ctx, command) {
			var rect = command.rect;
			ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
		}

	}
}());