var bigRender = bigRender || {};

(function() {


	// @extends createjs.Container
	var LayerView = function(layer) {
		createjs.Container.call(this); //super

		this.layer = layer;

		this.canvas = document.createElement('canvas');
		this.canvas.width = layer.width;
		this.canvas.height = layer.height;

		this.bitmap = new createjs.Bitmap(this.canvas);
		this.objectHolder = new createjs.Container();

		this.addChild(this.bitmap);
		this.addChild(this.objectHolder);

		this._restoreDefaults();
	};


	var p = LayerView.prototype = new createjs.Container();




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
	}



	p._copyRegion = function(rect) {

	};


	p._eraseRegion = function(rect) {

	};


	p._drawLine = function(pointArray) {

	};


	p._drawShape = function(shape, x, y, transform) {

	};


	p._drawCanvas = function(canvas, x, y, transform) {

	};


	p._addObject = function(object, x, y, transform) {

	};


	p._moveObject = function(object, x, y, transform) {

	};


	p._removeObject = function(object) {

	};


	p._getObjectsUnderPoint = function(x, y) {

	};


	p._getObjectsUnderRect = function(rect) {

	};


	p._copy = function() {

	};


	p._clear = function() {

	};


	bigRender.LayerView = LayerView;

}());