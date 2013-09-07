/* global describe, it, expect, beforeEach, bigRender */

(function() {
	'use strict';

	describe('CommandInflator', function() {
		var inflator;

		beforeEach(function() {
			inflator = new bigRender.CommandInflator({name:'Sally', age:59});
		});


		it('should fill in commands with defaults', function() {
			var command = {job:'Queen'};
			inflator.inflateCommand(command);
			expect(command.name).toBe('Sally');
			expect(command.job).toBe('Queen');
		});


		it('should remove redundant data with deflate', function() {
			var command = {name:'Sally', hair:'curly', mustache:false};
			inflator.deflateCommand(command);
			expect(command.name).toBeUndefined();
			expect(command.hair).toBe('curly');
		});


		it('should revert to initial defaults when cleared', function() {
			var command = {name:'Peaches'};

			inflator.inflateCommand(command);
			expect(inflator.saved.name).toBe('Peaches');

			inflator.clear();
			expect(inflator.saved.name).toBe('Sally');
		});
	});

}());