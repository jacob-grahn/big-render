/* globals createjs, _, jigg */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var LayerBitmapView = function(commandDispatcher, width, height) {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.commandDispatcher = commandDispatcher;

		createjs.Bitmap.call(this, this.canvas); //super

		_.bindAll(this, '_doDrawImage', '_doDrawLine', '_doDrawShape', '_doEraseRect', '_doMoveRect', '_redraw');
		this._addListeners();
		this._restoreDefaults();
		this.setDimensions(width, height);
	};

	var p = LayerBitmapView.prototype = new createjs.Bitmap();


	p.setDimensions = function(width, height) {
		if(width !== this.canvas.width || height !== this.canvas.height) {
			this.canvas.width = width;
			this.canvas.height = height;
			this._redraw(null);
		}
	};


	p.clear = function() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.commandDispatcher.clear();
	};


	p.remove = function() {
		this.clear();
		this._removeListeners();
		this.canvas = null;
		this.ctx = null;
		this.commandDispatcher = null;
	};


	p._restoreDefaults = function() {
		this.brush = bigRender.brush.SMOOTH;
		this.blendMode = bigRender.blendMode.NORMAL;

		this.fillColor = '#343434';
		this.fillOpacity = 100;

		this.lineColor = '#123456';
		this.lineOpacity = 100;
		this.lineWidth = 3;

		this.shape = bigRender.shape.RECTANGLE;
		this.rotation = 0;
	};


	p._addListeners = function() {
		var c = this.commandDispatcher;
		c.addEventListener(bigRender.command.DRAW_IMAGE + 'Do', this._doDrawImage);
		c.addEventListener(bigRender.command.DRAW_IMAGE + 'Undo', this._redraw);
		c.addEventListener(bigRender.command.DRAW_LINE + 'Do', this._doDrawLine);
		c.addEventListener(bigRender.command.DRAW_LINE + 'Undo', this._redraw);
		c.addEventListener(bigRender.command.DRAW_SHAPE + 'Do', this._doDrawShape);
		c.addEventListener(bigRender.command.DRAW_SHAPE + 'Undo',this._redraw);
		c.addEventListener(bigRender.command.ERASE_RECT + 'Do', this._doEraseRect);
		c.addEventListener(bigRender.command.ERASE_RECT + 'Undo', this._redraw);
		c.addEventListener(bigRender.command.MOVE_RECT + 'Do', this._doMoveRect);
		c.addEventListener(bigRender.command.MOVE_RECT + 'Undo', this._redraw);
	};


	p._removeListeners = function() {
		var c = this.commandDispatcher;
		c.removeEventListener(bigRender.command.DRAW_IMAGE + 'Do', this._doDrawImage);
		c.removeEventListener(bigRender.command.DRAW_IMAGE + 'Undo', this._redraw);
		c.removeEventListener(bigRender.command.DRAW_LINE + 'Do', this._doDrawLine);
		c.removeEventListener(bigRender.command.DRAW_LINE + 'Undo', this._redraw);
		c.removeEventListener(bigRender.command.DRAW_SHAPE + 'Do', this._doDrawShape);
		c.removeEventListener(bigRender.command.DRAW_SHAPE + 'Undo',this._redraw);
		c.removeEventListener(bigRender.command.ERASE_RECT + 'Do', this._doEraseRect);
		c.removeEventListener(bigRender.command.ERASE_RECT + 'Undo', this._redraw);
		c.removeEventListener(bigRender.command.MOVE_RECT + 'Do', this._doMoveRect);
		c.removeEventListener(bigRender.command.MOVE_RECT + 'Undo', this._redraw);
	};


	p._doDrawImage = function(e) {
		var c = e.command;

		var srcX = c.srcX || 0;
		var srcY = c.srcY || 0;
		var srcWidth = c.srcWidth || c.image.width;
		var srcHeight = c.srcHeight || c.image.height;
		var destX = c.destX || 0;
		var destY = c.destY || 0;
		var destWidth = c.destWidth || c.image.width;
		var destHeight = c.destHeight || c.image.width;
		var rotation = c.rotation || 0;
		var scaleX = c.scaleX || 1;
		var scaleY = c.scaleY || 1;
		var opacity = c.opacity || 1;

		var hWidth = srcWidth / 2;
		var hHeight = srcHeight / 2;
		var centerX = destX + hWidth;
		var centerY = destY + hHeight;

		destX -= hWidth;
		destY -= hHeight;

		this.ctx.save();
		this.ctx.globalAlpha = opacity;
		this.ctx.translate( centerX, centerY );
		this.ctx.rotate( rotation * jigg.maths.DEG_RAD );
		this.ctx.scale( scaleX, scaleY );

		this.ctx.drawImage( c.image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight );

		this.ctx.restore();
	};


	p._doDrawLine = function(e) {
		var c = e.command;
		var path = c.path;

		this.lineColor = c.lineColor || this.lineColor;
		this.lineOpacity = c.lineOpacity || this.lineOpacity;
		this.lineThickness = c.lineThickness || this.lineThickness;

		if(this.lineTool === Commands.TOOL_PENCIL) {
			x -= 0.5;
			y -= 0.5;
			this.ctx.mozImageSmoothingEnabled = false;
		}

		this.ctx.beginPath();
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.lineWidth = this.encoder.lineThickness;
		this.ctx.moveTo(x, y);

		if(this.encoder.lineTool === Commands.TOOL_ERASER) {
			this.ctx.globalCompositeOperation = "destination-out";
			this.ctx.globalAlpha = this.encoder.lineOpacity / 100;
			this.ctx.strokeStyle = "rgba( 0,0,0,1.0 )";
		}
		else {
			this.ctx.globalAlpha = this.encoder.lineOpacity / 100;
			this.ctx.strokeStyle = this.encoder.lineColor;
		}

		path = this.encoder.pathArr;

		if(path.length > 0) {
			i = 0;
			len = path.length;
			while(i < len) {
				x += parseInt( path[ i ] );
				y += parseInt( path[ i+1 ] );
				this.ctx.lineTo( x, y );
				i += 2;
			}
		}
		else {
			this.ctx.lineTo( x+.1, y );
			this.ctx.stroke();
		}

		this.ctx.globalCompositeOperation = "source-over";
		this.ctx.mozImageSmoothingEnabled = true;
		this.ctx.globalAlpha = 1;
	};


	p._doDrawShape = function(e) {};


	p._doEraseRect = function(e) {};


	p._doMoveRect = function(e) {};


	p._redraw = function(e) {};


	bigRender.LayerBitmapView = LayerBitmapView;

}());