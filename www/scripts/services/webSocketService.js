define(["io", "services/module"], function (io, services) {
    services.service("WebSocketService", ["$location", WebSocketService]);

    function WebSocketService($location) {
        var protocol = $location.protocol();
        var host = $location.host();
        var port = $location.port();
        this.socket = io.connect(protocol + '://' + host + ':' + port);
    };
    WebSocketService.prototype = {
        send: function (event, data) {
            this.socket.emit(event, data);
        },

        on: function (event, callback) {
            this.socket.on(event, function (data) {
                callback(data);
            });
        }
    };
});

