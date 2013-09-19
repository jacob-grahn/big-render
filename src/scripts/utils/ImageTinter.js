var bigRender = bigRender || {};

(function() {
	'use strict';

	bigRender.ImageTinter = {


		tint: function(src, color, perc) {

			if(src.width === 0 || src.height === 0) {
				return(false);
			}
			else {
				var dest = bigRender.CanvasCache.pop(src.width, src.height);
				var ctx = dest.getContext('2d');

				ctx.fillStyle = color;
				ctx.fillRect(0, 0, dest.width, dest.height);

				if(perc < 1) {
					ctx.drawImage(src, 0, 0);
				}
				ctx.globalAlpha = perc;
				ctx.globalCompositeOperation = 'destination-atop';
				ctx.drawImage(src, 0, 0);

				ctx.globalAlpha = 1;
				ctx.globalCompositeOperation = 'source-over';

				return(dest);
			}
		}


	};

}());