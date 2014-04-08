module.exports = (function() {
	"use strict";
	var LoginModule = function() {
	};
	return function(request, response) {
		response.render('user/login', {'title': 'GiftMeUp - Pattern Ltd.'});
	}
})();