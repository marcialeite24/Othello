"use strict";

const http = require('http');
const url = require('url');
const headers = require('./headers.js').headers;
const req = require('./aboutRequests.js');

const port = 8151;

const server = http.createServer(function(request, response) { 
	request.method = "POST";
	switch(request.method) {
		case "GET":
			console.log("get");
			req.doGetRequest(request, response);
			break;
		case "POST":
			//console.log("post");
			req.doPostRequest(request, response);
			break;
		default:
			console.log("default");
			response.writeHead(404, headers['plain']); // 404 Pedido desconhecido
			response.end();
			break;
	}
});

server.listen(port);
