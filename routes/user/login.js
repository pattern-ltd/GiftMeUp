module.exports = (function() {
	"use strict";
	var LoginModule = function() {
	};
	var graph = require('fbgraph');
	return function(request, response) {
		response.render('user/login');
	}
})();