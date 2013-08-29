var bigRender = bigRender || {};

(function(){

	var LayerModel = function() {
		this.commands = [];
		this.commandPos = 0;
		this.name = 'Layer';
		this.zIndex = 0;
		this.opacity = 1;
		this.scrollPerc = 1;
		this.layerId = null;
	};

	bigRender.LayerModel = LayerModel;
}());
