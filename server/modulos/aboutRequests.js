"use strict";

const url = require('url');
const headers = require('./headers.js').headers;
const updater = require('./updater.js');
const counter = require('./model.js');

let pathname;

module.exports.doGetRequest = function(request, response) {
	const parsedUrl = url.parse(request.url, true);
	pathname = parsedUrl.pathname;
	const query = parsedUrl.query;
	let body = "";

	request.on('data', function(chunk) {
		body += chunk;
	});

	request.on('end', function() {
		switch(pathname) {
			case '/update':
				if(query['nick'] == null) {
					response.writeHead(400, headers['plain']); // 400 Erro no pedido
					response.write(JSON.stringify({error : "Nome do utilizador indefinido!"}));
					response.end();
					break;
				}
				else if(query['game'] == null) {
					response.writeHead(400, headers['plain']); // 400 Erro no pedido
					response.write(JSON.stringify({error : "Jogo indefinido!"}));
					response.end();
					break;
				}

				const flag = updater.insertConnection(query['nick'], query['game'], response);
				
				if(flag == 1) {
					response.writeHead(400, headers['plain']); // 400 Erro no pedido
					response.write(JSON.stringify({error: "Referência do jogo inválida!"}));
					response.end();
				}
				break;
			default:
				response.writeHead(404, headers['plain']); // 404 Pedido desconhecido
				response.end();
				break;
		}
	});
	request.on('close', function(err) {
		response.end();
	});
	request.on('error', function(err) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.end();
	});
}

module.exports.doPostRequest = function(request, response) {
	const parsedUrl = url.parse(request.url, true);
	pathname = parsedUrl.pathname;
	let body = "";

	request.on('data', function(chunk) {
		body += chunk;
	});

	request.on('end', function() {
		const query = JSON.parse(body);
		//console.log(query);
		switch(pathname) {
			case '/register':
				counter.register(query['nick'], query['pass'], response);
				// updater.update(counter.get());
				break;
			case '/ranking':
				counter.ranking(response);
				// updater.update(counter.get());
				break;
			case '/join':
				counter.join(query['nick'], query['pass'], query['group'], response);
				// updater.update(counter.get());
				break;
			case '/leave':
				counter.leave(query['nick'], query['pass'], query['game'], response);
				// updater.update(counter.get());
				break;
			case '/notify':
				counter.notify(query['nick'], query['pass'], query['game'], response);
				// updater.update(counter.get());
				break;
			default:
				response.writeHead(404, headers['plain']); // 404 Pedido desconhecido
				response.end();
				break;
		}
	});
	request.on('close', function(err) {
		response.end();
	});
	request.on('error', function(err) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.end();
	});
}