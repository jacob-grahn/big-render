bigRender = bigRender || {};

bigRender.event = {
	TARGET_LAYER_CHANGED: 'targetLayerChanged',
	HIGHLIGHT_LAYER_CHANGED: 'highlightLayerChanged',
	LAYER_ADDED: 'layerAdded',
	LAYER_REMOVED: 'layerRemoved',
	LAYER_CHANGED: 'layerChanged',
	TARGET_CHANGED: 'targetChanged',
	SCROLL_CHANGED: 'scrollChanged'
};


bigRender.command = {
	CREATE_LAYER: 'createLayer',
	DELETE_LAYER: 'deleteLayer',
	EDIT_LAYER: 'editLayer',

	ADD_OBJECT: 'addObject',
	MOVE_OBJECT: 'moveObject',
	REMOVE_OBJECT: 'removeObject',

	MOVE_RECT: 'moveRect',
	ERASE_RECT: 'eraseRect',
	DRAW_LINE: 'drawLine',
	DRAW_SHAPE: 'drawShape',
	DRAW_IMAGE: 'drawImage'
};


bigRender.option = {
	LAYER_DEPTH: 'layerDepth',
	LAYER_OPACITY: 'layerOpacity',
	LAYER_SCALE: 'layerScale',
	LAYER_NAME: 'layerName',

	BRUSH: 'brush',
	BLEND_MODE: 'blendMode',
	PATH: 'path',
	SHAPE: 'shape',
	ROTATION: 'rotation',

	LINE_OPACITY: 'lineOpacity',
	LINE_COLOR: 'lineColor',
	LINE_THICKNESS: 'lineThickness',

	FILL_OPACITY: 'fillOpacity',
	FILL_COLOR: 'fillColor'
};

bigRender.brush = {
	SMOOTH: 'smooth',
	PIXEL: 'pixel'
};

bigRender.blendMode = {
	NORMAL: 'normal',
	ERASE: 'erase'
};

bigRender.shape = {
	RECTANGLE: 'rectangle',
	ELLIPSE: 'ellipse',
	TRIANGLE: 'triangle',
	STAR: 'star'
};