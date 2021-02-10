"use strict";

var fs = require("fs");
var headers = require("./headers.js").headers;

var games = [];
var board = [];
module.exports.remember = function(group, nick, rows, columns, gameid){
	for(var i=0; i< rows; i++){
		board[i]=[];
		for(var j=0; j< columns; j++)
		board[i][j]=-1;
	}
	let timeout = setTimeout(function() {
		waitIsOver(gameid);
	}, 120000);

	games.push({group: group, size: {rows: rows, columns: columns}, nick1: nick, nick2: null, gameid: gameid, timeout: timeout, responses: {response1: null, response2: null}, board: board, turn: null, active: false});
}

module.exports.joinGame = function(group, nick, rows, columns){
	for(let i=0; i<games.length; i++){
		if(games[i].group == group && games[i].size.rows == rows && games[i].size.columns == columns && games[i].active == false){
			games[i].nick2 = nick;
			return games[i].gameid;
		}
	}
	return null;
}

function waitIsOver(gameid){
	for(var i=0; i<games.length; i++){
		if(games[i].gameid == gameid){
			if(games[i].nick2 == null)
			update(JSON.stringify({winner: null}), games[i].responses.response1, games[i].responses.response2);
			else if(games[i].turn == games[i].nick1)
			update(JSON.stringify({winner: games[i].nick2}), games[i].responses.response1, games[i].responses.response2);
			else
			update(JSON.stringify({winner: games[i].nick1}), games[i].responses.response1, games[i].responses.response2);

			if(games[i].responses.response1!=null)
			games[i].responses.response1.end();
			if(games[i].responses.response2!=null)
			games[i].responses.response2.end();
			games.splice(i, 1);
			break;
		}
	}
}

function insertScore(winner, looser, rows, columns){
	try{
		var fileData = fs.readFileSync("../info.json");
		fileData = JSON.parse(fileData.toString())["users"];
	}
	catch(err){
		console.log(err);
		return 1;
	}

	for(var i=0; i<fileData.length; i++){
		if(fileData[i]["nick"]==winner){
			if(fileData[i]["games"][rows+","+columns] == null){
				fileData[i]["games"][rows+","+columns] = {};
				fileData[i]["games"][rows+","+columns]["games"] = 1;
				fileData[i]["games"][rows+","+columns]["victories"] = 1;
			}
			else{
				fileData[i]["games"][rows+","+columns]["games"]++;
				fileData[i]["games"][rows+","+columns]["victories"]++;
			}
		}
		else if(fileData[i]["nick"]==looser){
			if(fileData[i]["games"][rows+","+columns] == null){
				fileData[i]["games"][rows+","+columns] = {};
				fileData[i]["games"][rows+","+columns]["games"] = 1;
				fileData[i]["games"][rows+","+columns]["victories"] = 0;
			}
			else
			fileData[i]["games"][rows+","+columns]["games"]++;
		}
	}

	fileData = {users: fileData};
	try{
		fs.writeFileSync("../info.json", JSON.stringify(fileData));
	}
	catch(err){
		console.log("Error writing to file 'info.json'.");
		console.log(err);
		return 2;
	}

	return 0;
}

module.exports.nickSizeAlreadyWaiting = function(group, nick, rows, columns){
	for(let i=0; i<games.length; i++){
		if(games[i].group == group && games[i].nick1 == nick && games[i].size.rows == rows && games[i].size.columns == columns && games[i].active==false){
			return true;
		}
	}

	return false;
}

module.exports.groupSizeAlreadyWaiting = function(group, rows, columns){
	for(let i=0; i<games.length; i++){
		if(games[i].group == group && games[i].size.rows == rows && games[i].size.columns == columns && games[i].active==false)
		return true;
	}

	return false;
}


module.exports.leaveGame = function(nick, gameid){
	var winner;
	var looser;
	for(let i=0; i<games.length; i++){
		if(games[i].gameid == gameid){
			if(games[i].nick1!=nick && games[i].nick2!=nick)
			return 1;
			clearTimeout(games[i].timeout);
			if(games[i].nick2==null){
				winner = null;
			}
			else{
				if(games[i].nick1==nick){
					winner = games[i].nick2;
					looser = games[i].nick1;
				}
				else{
					winner = games[i].nick1;
					looser = games[i].nick2;
				}
				insertScore(winner, looser, games[i].size.rows, games[i].size.columns);
			}
			update(JSON.stringify({winner: winner}), games[i].responses.response1, games[i].responses.response2);
			if(games[i].responses.response1 != null)
			games[i].responses.response1.end();
			if(games[i].responses.response2 != null)
			games[i].responses.response2.end();
			games.splice(i, 1);
			return 0;
		}
	}
	return 1; //n e encontrado jogo
}

module.exports.play = function(nick, gameid, column){
	for(var i=0; i<games.length; i++){
		if(games[i].gameid == gameid && games[i].active == true){
			clearTimeout(games[i].timeout);
			if(games[i].turn != nick){
				return 1;
			}
			else{
				for(var j=0;true;j++){
					if(games[i].board[column][j] == -1){
						games[i].board[column][j]=nick;
						break;
					}
				}
				if(checkEndGame(games[i].board) == true){
					update(JSON.stringify({winner: nick, board: games[i].board, column: column}), games[i].responses.response1, games[i].responses.response2);
					games[i].responses.response1.end();
					games[i].responses.response2.end();
					if(games[i].nick1 == nick)
					insertScore(nick	, games[i].nick2, games[i].size.rows, games[i].size.columns);
					else
					insertScore(nick, games[i].nick1, games[i].size.rows, games[i].size.columns);
					games.splice(i,1);
				}
				else{
					if(games[i].turn == games[i].nick1)
					games[i].turn = games[i].nick2;
					else
					games[i].turn = games[i].nick1;
					let timeout = setTimeout(function() {
						waitIsOver(gameid);
					}, 120000);
					games[i].timeout = timeout;
					update(JSON.stringify({turn: games[i].turn, board: games[i].board, column: column}), games[i].responses.response1, games[i].responses.response2);
				}
				return 0;
			}
		}
	}
	return 4;
}

function startGame(i){
	games[i].active = true;
	games[i].turn = games[i].nick1;
	update(JSON.stringify({turn: games[i].turn, board: games[i].board}), games[i].responses.response1, games[i].responses.response2);
}

function checkEndGame(board){
	for (var col = 0; col <=3; col++) {
		for (var row = 0; row <=5; row++) {
			if(board[row][col]!=-1 && board[row][col]!=null) {
				if ((board[row][col] == board[row][col+1]) && (board[row][col] == board[row][col+2]) && (board[row][col] == board[row][col+3])) {
					return true;
				}
			}
		}
	}

	for (var col = 0; col <=6; col++) {
		for (var row = 0; row <=2; row++) {
			if(board[row][col]!=-1 && board[row][col]!=null) {
				if ((board[row][col] == board[row+1][col]) && (board[row][col] == board[row+2][col]) && (board[row][col] == board[row+3][col])) {
					return true;
				}
			}
		}
	}

	for (var col = 0; col <=3; col++) {
		for (var row = 0; row <=2; row++) {
			if(board[row][col]!=-1 && board[row][col]!=null) {
				if ((board[row][col]== board[row+1][col+1]) && (board[row][col] == board[row+2][col+2]) && (board[row][col] == board[row+3][col+3])) {
					return true;
				}
			}
		}
	}

	for (var col = 0; col <=3; col++) {
		for (var row = 3; row <=5; row++) {
			if(board[row][col]!=-1 && board[row][col]!=null) {
				if ((board[row][col] == board[row-1][col+1]) && (board[row][col] == board[row-2][col+2]) && (board[row][col] == board[row-3][col+3])) {
					return true;
				}
			}
		}
	}
	return false;
}

module.exports.insertConnection = function(gameid, nick, response){
	for(var i=0; i<games.length; i++){
		if(games[i].gameid == gameid){
			if(games[i].nick1 == nick && games[i].responses.response1 == null){
				games[i].responses.response1 = response;
				response.writeHead(200, {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Access-Control-Allow-Origin': '*',
					'Connection': 'keep-alive'
				});
				return 0;
			}
			else if(games[i].nick2 == nick && games[i].responses.response2 == null){
				games[i].responses.response2 = response;
				response.writeHead(200, {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Access-Control-Allow-Origin': '*',
					'Connection': 'keep-alive'
				});
				games[i].active = true;
				startGame(i);
				return 0;
			}
			break;
		}
	}

	return 1; //return 1 mas o ficheiro n funciona
}

function update(message, response1, response2){
	if(response1!=null){
		response1.write("data: " + message + "\n\n");
	}
	if(response2!=null){
		response2.write("data: " + message + "\n\n");
	}
}
