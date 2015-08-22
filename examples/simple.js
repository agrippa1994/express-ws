var express = require('express');
var expressWs = require('..');

var expressWs = expressWs(express());
var app = expressWs.app;

app.get('/', function(req, res) {
	console.log('http route');
	res.end();
});

app.ws('/', function(ws, req) {

	ws.on('message', function(msg) {
		console.log("message '/': " + msg);
	});

	ws.on("close", function() {
		console.log("ws '/' closed");
	});
});

app.ws('/test', function(ws, req) {

	ws.on('message', function(msg) {
		console.log("message '/test': " + msg);

		expressWs.clientsForRoute("/test").forEach(function(client) {
			client.send('hello');
		});
	});

	ws.on("close", function() {
		console.log("ws '/test' closed");
	});
});

app.listen(3000);
