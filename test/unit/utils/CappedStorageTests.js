/* global describe, it, expect, beforeEach, bigRender */

(function() {
	'use strict';

	describe('CappedStorage', function() {

		var storage = bigRender.CappedStorage;


		it('should store things for later', function() {
			storage.store('test', 'lala');
			expect(storage.retrieve('test')).toBe('lala');
		});


		it('should forget old things to make room for new', function() {
			storage.maxItems = 2;
			storage.store('test1', 1);
			storage.store('test2', 2);
			storage.store('test3', 3);
			expect(storage.retrieve('test1')).toBeUndefined();
			expect(storage.retrieve('test2')).toBe(2);
			expect(storage.retrieve('test3')).toBe(3);
		});

	});

}());