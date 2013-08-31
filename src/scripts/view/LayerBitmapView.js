var bigRender = bigRender || {};

(function() {
	'use strict';


	var LayerBitmapView = function(canvas, commandDispatcher) {
		createjs.Bitmap.call(this, canvas);
		this.commandDispatcher = commandDispatcher;
		this._restoreDefaults();
		this._addListeners();
	};

	var p = LayerBitmapView.prototype = new createjs.Bitmap();


	p.remove = function() {
		this._removeListeners();
	};


	p._restoreDefaults = function() {
		this.brush = bigRender.brush.SMOOTH;
		this.blendMode = bigRender.blendMode.NORMAL;

		this.lineThickness = 3;
		this.lineColor = '#121212';
		this.lineOpacity = 100;

		this.fillColor = '#343434';
		this.fillOpacity = 100;

		this.lineColor = '#123456';
		this.lineOpacity = 100;
		this.lineThickness = 3;

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


	p._doDrawImage = function() {};


	p._doDrawLine = function() {};


	p._doDrawShape = function() {};


	p._doEraseRect = function() {};


	p._doMoveRect = function() {};


	p._redraw = function() {};


	bigRender.LayerBitmapView = LayerBitmapView;

}());