(function() {
	"use strict";
	window.fbAsyncInit = function() {
		FB.init({
			'appId': '261448040593671',
			'status': true
		});
		document.getElementById('fb-login-button').addEventListener('click', _requestFBLogin);
	}
	document.addEventListener('DOMContentLoaded', function() {
		var script = document.createElement('script');
		script.id = 'facebook-jssdk';
		script.src = '//connect.facebook.net/bg_BG/all.js';
		document.head.appendChild(script);
	});
	var _requestFBLogin = function() {
		FB.login(function(response) {
			console.log(response);
		});
	}
})();