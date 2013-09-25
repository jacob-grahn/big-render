var bigRender = bigRender || {};

(function() {
	'use strict';

	bigRender.ContextTools = {


		applyStyle: function(ctx, style) {
			style = style || {};

			ctx.setTransform(1, 0, 0, 1, 0, 0);

			var rotation = style.rotation || 0;
			var scaleX = style.scaleX || 1;
			var scaleY = style.scaleY || 1;
			var translateX = style.translateX || 0;
			var translateY = style.translateY || 0;

			ctx.translate(translateX, translateY);
			ctx.rotate(rotation * bigRender.Maths.DEG_RAD);
			ctx.scale(scaleX, scaleY);

			ctx.lineCap = style.lineCap || 'round';
			ctx.lineJoin = style.lineJoin || 'round';
			ctx.lineWidth = style.lineWidth || 3;
			ctx.globalAlpha = style.globalAlpha || 1;
			ctx.strokeStyle = style.strokeStyle || '#000000';
			ctx.fillStyle = style.fillStyle || '#000000';
			ctx.globalCompositeOperation = style.globalCompositeOperation || 'source-over';
		},


		appendStyle: function(ctx, style) {
			style = style || {};

			if(style.translateX || style.translateY) {
				ctx.translate(style.translateX, style.translateY);
			}
			if(style.rotation) {
				ctx.rotate(style.rotation * bigRender.Maths.DEG_RAD);
			}
			if(style.scaleX || style.scaleY) {
				ctx.scale(style.scaleX, style.scaleY);
			}

			ctx.lineCap = style.lineCap || ctx.lineCap;
			ctx.lineJoin = style.lineJoin || ctx.lineJoin;
			ctx.lineWidth = style.lineWidth || ctx.lineWidth;
			ctx.globalAlpha = style.globalAlpha || ctx.globalAlpha;
			ctx.strokeStyle = style.strokeStyle || ctx.strokeStyle;
			ctx.fillStyle = style.fillStyle || ctx.fillStyle;
			ctx.globalCompositeOperation = style.globalCompositeOperation || ctx.globalCompositeOperation;
		}
	}

}());