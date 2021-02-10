"use strict";

const crypto = require('crypto');
const fs = require('fs');
const headers = require('./headers.js').headers;

let contas = [];
let ref = []

module.exports.get = function() {
	// ...
}

if (fs.existsSync("info.json")) {
	const info = fs.readFileSync("info.json");
	const parserInfo = JSON.parse(info.toString());
	for(let i=0; i<parserInfo.length; i++) {
		contas.push(parserInfo[i]);
	}
}

module.exports.register = function(nick, pass, response) {
	if(nick === undefined || nick === null) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.write(JSON.stringify({error : "Nome do utilizador inexistente!"}));
		response.end();
		return;
	}
	else if(pass === undefined || pass === null) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.write(JSON.stringify({error : "Password inexistente!"}));
		response.end();
		return;
	}
	else if(nick == "") {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Nome do utilizador inválido!"}));
		response.end();
		return;
	}
	else if(pass == "") {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Password inválido!"}));
		response.end();
		return;
	}
	
	const hash = crypto.createHash('md5').update(pass).digest('hex'); // encriptar a password
	for(let i=0; i<contas.length; i++) {
		if(contas[i].nick === nick && contas[i].pass === hash) {
			response.writeHead(200, headers['plain']); 
			response.write(JSON.stringify({}));
			response.end();
			return;
		}
		else if(contas[i].nick === nick && contas[i].pass !== hash) {
			response.writeHead(401, headers['plain']); 
			response.write(JSON.stringify({error:"Conta inválida!"}));
			response.end();
			return;
		}
	}
	let novaconta = {
		nick: nick,
		pass: hash,
		victories: 0,
		games: 0
	};
	contas.push(novaconta);
	fs.writeFileSync("info.json", JSON.stringify(contas));
	response.writeHead(200, headers['plain']); 
	response.write(JSON.stringify({}));
	response.end();
}

module.exports.ranking = function(response) {
	let rankings = [];
	for(let i=0; i<contas.length; i++) {
	    for(let j=i+1; j<contas.length; j++) {
	    	if(contas[j].victories > contas[i].victories) {
	        	let temp = contas[i];
	        	contas[i] = contas[j];
	        	contas[j] = temp;
	      	}
	    }
	}

	for(let i=0; i<contas.length; i++) {
		rankings.push({
			nick: contas[i].nick,
			victories: contas[i].victories,
			games: contas[i].games
		});
	}
	response.writeHead(200, headers['plain']); // 200 Pedido bem sucedido
	response.write(JSON.stringify({ranking : rankings}));
	response.end();
}

class Game{
	constructor(gameID) {
		this.game = gameID;
		this.player1 = "";
		this.player2 = "";
		this.board =[[0,0,0,0,0,0,0,0],
				     [0,0,0,0,0,0,0,0],
				     [0,0,0,0,0,0,0,0],
				     [0,0,0,1,2,0,0,0],
				     [0,0,0,2,1,0,0,0],
				     [0,0,0,0,0,0,0,0],
				     [0,0,0,0,0,0,0,0],
				     [0,0,0,0,0,0,0,0]]
	}
	getplayer1() {
		return this.player1;
	}
	setplayer1(player1) {
		this.player1 = player1;
	}
	getplayer2() {
		return this.player2;
	}
	setplayer2(player2) {
		this.player2 = player2;
	}
	getgameID() {
		return this.gameID;
	}
}

module.exports.join = function(nick, pass, group, response) {
	let foundRoom = [];
	if(nick === null || nick === undefined) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.write(JSON.stringify({error : "Nome do utilizador inexistente!"}));
		response.end();
		return;
	}
	else if(pass === null || pass === undefined) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.write(JSON.stringify({error : "Password inexistente!"}));
		response.end();
		return;
	}
	else if(nick == "" || pass === "") {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Nome do utilizador ou password inválido!"}));
		response.end();
		return;
	}
	else if(group === null || group === undefined) {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Jogo inexistente!"}));
		response.end();
		return;
	}
	else if(group == "") {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Jogo inválido!"}));
		response.end();
		return;
	}
	
	
	let join;
	if(foundRoom.length === 0) {
		const hash = crypto.createHash('md5').update(group).digest('hex');
		var games = new Game(hash);
		games.setplayer1(nick);
		console.log("game:" + hash)
		join = {
			game : hash,
			color : "dark"
		};
	}
	else {
		games.setplayer2(nick);
		console.log("game:" + hash)
		join = {
			game : hash,
			color : "light"
		};
	}
	response.writeHead(200, headers['plain']); // 200 Pedido bem sucedido
	response.write(JSON.stringify(join));
	response.end();
	return;
}

/*module.exports.leave = function(nick, pass, game, response) {
	if(nick === null || nick === undefined) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.write(JSON.stringify({error : "Nome do utilizador inexistente!"}));
		response.end();
		return;
	}
	else if(pass === null || pass === undefined) {
		response.writeHead(400, headers['plain']); // 400 Erro no pedido
		response.write(JSON.stringify({error : "Password inexistente!"}));
		response.end();
		return;
	}
	else if(nick == "" || pass === "") {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Nome do utilizador ou password inválido!"}));
		response.end();
		return;
	}
	else if(game === null || game === undefined) {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Jogo inexistente!"}));
		response.end();
		return;
	}
	else if(game == "") {
		response.writeHead(401, headers['plain']); // 401 Pedido não autorizado
		response.write(JSON.stringify({error : "Jogo inválido!"}));
		response.end();
		return;
	}

	for(let i=0; i < ref.length; i++) {
		if(game === ref[i].game) {
			//if(sala em jogo) {
				//dar vitoria ao outro jogador;
				//atualiza ranks;
				//remove sala; ref.splice(i,1);
			//}
			//else {
				//remove sala; ref.splice(i,1);
			//}
		}
	}

	response.writeHead(200, headers['plain']); // 200 Pedido bem sucedido
	response.write(JSON.stringify({ranking : rankings}));
	response.end();
}

module.exports.notify = function(nick, pass, game, side, piece, skip, response) {
	// ...
}*/