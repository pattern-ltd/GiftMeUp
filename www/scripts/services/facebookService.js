define(["facebook", "services/module"], function (FB, services) {
    services.service("FacebookService", ["$q", "$http", FacebookService]);

    function FacebookService($q, $http) {
        this.$q = $q;
        this.$http = $http;

        FB.init({
            //appId: '663501057037367',
            appId: '706842222680086',
            status: true,
            cookie: true
        });

        FB.Event.subscribe('auth.authResponseChange', this.authResponseChangeHandler);
    };
    FacebookService.prototype = {
        authResponseChangeHandler: function (response) {
            // Here we specify what we do with the response anytime this event occurs. 
            if (response.status === 'connected') {
                // The response object is returned with a status field that lets the app know the current
                // login status of the person. In this case, we're handling the situation where they 
                // have logged in to the app.
            } else if (response.status === 'not_authorized') {
                // In this case, the person is logged into Facebook, but not into the app, so we call
                // FB.login() to prompt them to do so. 
                // In real-life usage, you wouldn't want to immediately prompt someone to login 
                // like this, for two reasons:
                // (1) JavaScript created popup windows are blocked by most browsers unless they 
                // result from direct interaction from people using the app (such as a mouse click)
                // (2) it is a bad experience to be continually prompted to login upon page load.
                //FB.login();
            } else {
                // In this case, the person is not logged into Facebook, so we call the login() 
                // function to prompt them to do so. Note that at this stage there is no indication
                // of whether they are logged into the app. If they aren't then they'll see the Login
                // dialog right after they log in to Facebook. 
                // The same caveats as above apply to the FB.login() call here.
                //FB.login();
            }
        },

        login: function () {
            var delay = this.$q.defer();

            FB.login(function (response) {
                if (response.authResponse) {
                    // The person logged into your app
                    delay.resolve(response);
                } else {
                    // The person cancelled the login dialog
                    delay.reject(response);
                }
            }, { scope: 'user_friends,friends_likes,user_likes' });

            return delay.promise;
        },

        logout: function () {
            FB.logout(function (response) {
                // Person is now logged out
            });
        },

        getFriends: function () {
            var self = this;
            var delay = this.$q.defer();

            this.getAccessToken()
            .then(function (token) {
                self.$http({ method: "get",
                    url: "api/facebook/friends",
                    params: {
                        token: token
                    }
                })
                .success(function (data, status, headers, config) {
                    delay.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    delay.reject(data);
                });
            });

            return delay.promise;
        },

        search: function (query, type) {
            var self = this;
            var delay = this.$q.defer();

            this.getAccessToken()
            .then(function (token) {
                self.$http({ method: "get",
                    url: "api/facebook/search",
                    params: {
                        query: query,
                        type: type,
                        token: token
                    }
                })
                .success(function (data, status, headers, config) {
                    delay.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    delay.reject(data);
                });
            });

            return delay.promise;
        },

        suggest: function (userId, interests) {
            var self = this;
            var delay = this.$q.defer();

            this.getAccessToken()
            .then(function (token) {
                self.$http({ method: "get",
                    url: "/api/suggest",
                    params: {
                        userId: userId,
                        interests: interests,
                        token: token
                    }
                })
                .success(function (data, status, headers, config) {
                    delay.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    delay.reject(data);
                });
            });

            return delay.promise;
        },

        similar: function (itemId) {
            var delay = this.$q.defer();

            this.$http({ method: "get",
                url: "/api/amazon/similar",
                params: {
                    itemId: itemId
                }
            })
                .success(function (data, status, headers, config) {
                    delay.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    delay.reject(data);
                });

            return delay.promise;
        },

        getLoginStatus: function () {
            var delay = this.$q.defer();

            FB.getLoginStatus(function (result) {
                delay.resolve(result);
            });

            return delay.promise;
        },

        getAccessToken: function () {
            return this.getLoginStatus().then(function (result) {
                return result.authResponse.accessToken;
            });
        }
    };
});