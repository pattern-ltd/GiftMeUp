(function() {
	"use strict";
	window.fbAsyncInit = function() {
		FB.init({
			'appId': '261448040593671',
			'status': true,
			'xfbml': true
		});
	}
	document.addEventListener('DOMContentLoaded', function() {
		var script = document.createElement('script');
		script.id = 'facebook-jssdk';
		script.src = '//connect.facebook.net/bg_BG/all.js';
		document.head.appendChild(script);
		script.addEventListener('load', function() {
			console.log('facebook-loaded');
		});
	});
})();