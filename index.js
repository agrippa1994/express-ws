var url = require('url');
var http = require('http');
var WebSocketServer = require('ws').Server;

/**
 * @param {express.Application} app
 * @param {http.Server} [server]
 */
module.exports = function(app, server) {
	if (!server) {
		server = http.createServer(app);

		app.listen = function() {
			return server.listen.apply(server, arguments)
		}
	}

	var wsServer = new WebSocketServer({
		server: server
	});

	var middlewares = {};
	wsServer.on("connection", function(ws) {
		var path = url.parse(ws.upgradeReq.url, true).pathname;
		var callback = middlewares[path];

		if (typeof callback !== "function")
			return ws.close();

		callback(ws);
	});


	function addSocketRoute(route, middleware) {
		middlewares[route] = middleware;
		return app;
	};

	app.ws = addSocketRoute;

	return {
		app: app,
		wss: wsServer,

		allClients: function() {
			return wsServer.clients;
		},

		clientsForRoute: function(route) {
			return wsServer.clients.filter(function(client) {
				return url.parse(client.upgradeReq.url, true).pathname == route;
			});
		}

	};
};
