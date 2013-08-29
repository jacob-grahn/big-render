var bigRender = bigRender || {};

(function() {
	'use strict';

	var CompositionModelEvent = {
		TARGET_LAYER_CHANGED: 'targetLayerChanged',
		HIGHLIGHT_LAYER_CHANGED: 'highlightLayerChanged',
		LAYER_ADDED: 'layerAdded',
		LAYER_REMOVED: 'layerRemoved',
		LAYER_CHANGED: 'layerChanged',
		TARGET_COMMAND_POS_CHANGED: 'targetCommandPosChanged',

	};

	bigRender.CompositionModelEvent = CompositionModelEvent;
}());