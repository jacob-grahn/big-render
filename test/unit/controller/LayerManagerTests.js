/* global describe, it, expect, beforeEach, bigRender */

(function() {
	'use strict';

	describe('CompositionController', function() {
		describe('LayerManager', function() {

			var cc;
			var cm;

			beforeEach(function() {
				cm = new bigRender.CompositionModel();
				cc = new bigRender.CompositionController(cm);
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


			it('should respond to deleteLayer commands', function() {
				cc.addCommand({type:bigRender.command.CREATE_LAYER, layerId:5});
				cc.addCommand({type:bigRender.command.DELETE_LAYER, layerId:5});
				expect(cm.layers.length).toBe(0);

				cc.undo();
				expect(cm.layers.length).toBe(1);
				expect(cm.layers[0].layerId).toBe(5);

				cc.redo();
				expect(cm.layers.length).toBe(0);
			});


			it('should respond to editLayer commands', function() {
				cc.addCommand({type:bigRender.command.CREATE_LAYER, layerId:9});
				cc.addCommand({type:bigRender.command.EDIT_LAYER, layerId:9, opacity:0.33});
				expect(cm.layers[0].opacity).toBe(0.33);

				cc.undo();
				expect(cm.layers[0].opacity).toBe(1);

				cc.redo();
				expect(cm.layers[0].opacity).toBe(0.33);
			});
		});
	});

}());