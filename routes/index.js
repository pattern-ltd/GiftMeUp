module.exports = (function() {
	"use strict";
	return function(request, response) {
		response.render('index', {'title': 'GiftMeUp - Pattern Ltd.'});
	}
})();