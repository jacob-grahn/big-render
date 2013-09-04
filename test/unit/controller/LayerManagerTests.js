/* global describe, it, expect, beforeEach, bigRender */

(function() {
	'use strict';

	describe('CompositionController', function() {
		describe('LayerManager', function() {

			var cc;
			var cm;

			beforeEach(function() {
				cm = new bigRender.CompositionModel();
				cc = new bigRender.CompositionController();
			});


			it('should respond to createLayer commands', function() {
				cc.addCommand({type:bigRender.command.CREATE_LAYER, layerId:7});
				expect(cm.layers.length).toBe(1);

				cc.undo();
				expect(cm.layers.length).toBe(0);

				cc.redo();
				expect(cm.layers.length).toBe(1);
				expect(cm.layers[0].layerId).toBe(7);
			});
		});
	});

}());