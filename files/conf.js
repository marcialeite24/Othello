/* ONLINE */
// Aparece a área de login numa janela sobreposta à página quando carregamos no botão online
var modal_on = document.getElementById("show_online");

// Quando o utilizador carrega no botão, abre a janela
document.getElementById("online").addEventListener("click", btnon);
function btnon() {
	modal_on.style.display = "block";
}
// Quando o utilizador carrega no <span> x, fecha a janela
document.getElementsByClassName("close_on")[0].addEventListener("click", function span0(){
	spanon();
});
function spanon() {
	modal_on.style.display = "none";
}

/* OFFLINE */
// Aparece a área de login numa janela sobreposta à página quando carregamos no botão offline
var modal_off = document.getElementById("show_offline");

// Quando o utilizador carrega no botão, abre a janela
document.getElementById("offline").addEventListener("click", btnoff);
function btnoff() {
	modal_off.style.display = "block";
}
// Quando o utilizador carrega no <span> x, fecha a janela
document.getElementsByClassName("close_off")[0].addEventListener("click", function span0(){
	spanoff();
});
function spanoff() {
	modal_off.style.display = "none";
}

/* REGRAS INICIAL */
// Aparece a área de login numa janela sobreposta à página quando carregamos no botão offline
var modal_regras_inicial = document.getElementById("show_regras_inicial");

// Quando o utilizador carrega no botão, abre a janela
document.getElementById("regras_inicial").addEventListener("click", btnregras_inicial);
function btnregras_inicial() {
	modal_regras_inicial.style.display = "block";
}
// Quando o utilizador carrega no <span> x, fecha a janela
document.getElementsByClassName("close_regras_inicial")[0].addEventListener("click", function span0(){
	spanregras_inicial();
});
function spanregras_inicial() {
	modal_regras_inicial.style.display = "none";
}

/* PÁGINA DE JOGO */
var turn_vs1 = document.getElementById("turn_vs1");
var desistir = document.getElementById("desistir");
var desistir2 = document.getElementById("desistirON");
var flag=0;

/* REGRAS PAG VS1 */
// Aparece a área de login numa janela sobreposta à página quando carregamos no botão offline
var modal_regras_vs1 = document.getElementById("show_regras_vs1");

// Quando o utilizador carrega no botão, abre a janela
document.getElementById("regras_vs1").addEventListener("click", btnregras_vs1);
function btnregras_vs1() {
	modal_regras_vs1.style.display = "block";
}
// Quando o utilizador carrega no <span> x, fecha a janela
document.getElementsByClassName("close_regras_vs1")[0].addEventListener("click", function span0(){
	spanregras_vs1();
});
function spanregras_vs1() {
	modal_regras_vs1.style.display = "none";
}

// Botão para voltar à página inicial
document.getElementById("voltar_pagInic").addEventListener("click", pagina_inic);
function pagina_inic() {
	document.getElementById("pagina_inicial").style.display = "block";
	document.getElementById("pagina_jogo_vs1").style.display = "none";
	modal_off.style.display = "none";
	document.getElementById("pontuacao").style.display = "none";
	desistir.style.display = "none";	
	if(submit_vs1.disabled == true)
		clearTab();
	desistir.disabled = true;
	flag = 0;
}

// **********************************************************************
document.getElementById("botao_passar").addEventListener("click", passarON);
function passarON(){
	notify(null);
	document.getElementById("botao_passar").disabled = true;
	flag=1;
}

document.getElementById("login").addEventListener("click",function logp(){
	flag=1;
	document.getElementById("botao_passar").style.display = "block";
	document.getElementById("voltar_pagInic").style.display = "none";
	logReg();
});

document.getElementById("vs1").addEventListener("click", function formoff() {
	game_tab();
	vs1.checked = false;
	desistir.disabled = true;
	desistir2.disabled = true;
});
function game_tab() {
	document.getElementById("pagina_inicial").style.display = "none";
	document.getElementById("pagina_jogo_vs1").style.display = "block";	
	document.getElementById("pontuacao").style.display = "block";
	document.getElementById("voltar_pagInic").style.display = "block";
	desistir.style.display = "block";	
	turn_vs1.style.display = "none";
}

document.getElementById("submit_vs1").addEventListener("click", function confvs1() {
	if(flag == 0)
		player_vs1();
	else {
		player_vs2();
		pageON();
		document.getElementById("pontos_vs1").style.display = "block";
	}
});

function player_vs2() {
	makeTab2(8,8);
	turn_vs1.style.display = "block";
}

// Criação do tabuleiro
var tab2 = document.getElementById("tab2");
// Cria matriz para verificar se tem peça(0-não tem peça,1-peça branca,2-peça preta)
var matrix = [[0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0]];

function makeTab2(rows,cols) {
	submit.disabled = true;
	desistir.disabled = false;
	desistir2.disabled = false;
	tab2.style.setProperty('grid_rows', rows);
	tab2.style.setProperty('grid_cols', cols);
	let img;
	let cell;
	for(let i=0; i<rows; i++) {
		for(let j=0; j<cols; j++) {
			cell = document.createElement("div");
			// Escreve a linha, a coluna
			cell.id = "c" + i + j;
			cell.className = "grid_item";
			tab2.appendChild(cell);
			cell.onclick = function() {
				verify(this);
			};
		}
	}
}

// Server Conection
var link = "http://localhost:8151/";
//var link = "http://twserver.alunos.dcc.fc.up.pt:8151/";
var nameGlobal = "";
var passGlobal = "";
var groupGlobal = "groupMS";
var gameIdGlobal = "";
var colorId;
var turn;
var board;
var skip = false;
var light = 0;
var dark = 0;
var empty = 0;

// REGISTER
function logReg(){
	var name = document.getElementById("user").value;
	var pass = document.getElementById("pass").value;

	nameGlobal = name;
	passGlobal = pass;
	conta = {
		nick : name,
		pass : pass
	}
	fetch(link + "register",{
		method : "POST",
		body : JSON.stringify(conta)
	})
	.then(function (resposta){
		return resposta.text();
	})
	.then(function (texto){
		if(texto != "{}") {
			console.log(texto);
			window.alert("Registo falhado por erro na password");
		}
		else if(name === "" || pass === "")
			window.alert("Preencha os campos");
		else {
			show_pageON();
		}
	})
	.catch(function() {
        console.log("error");
        return;
    });
}

// JOIN
function pageON() {
	info_jogo = {
		group : groupGlobal,
		nick : nameGlobal,
		pass : passGlobal
	}
	fetch(link + "join", {
		method : "POST",
		body : JSON.stringify(info_jogo)
	})
	.then(function (resposta){
		return resposta.json();
	})
	.then(function (texto){
		gameIdGlobal = texto.game;
		colorId = texto.color;
		//console.log(texto);
		//update();
	})
	.catch(function() {
        console.log("error");
        return;
    });
}

var paginainicial2 = document.getElementById('pagina_inicial');

function show_pageON() {
	document.body.style.backgroundImage = "url(background.jpeg)";
	paginainicial2.style.display = 'none';
	document.getElementById('pagina_jogo_vs1').style.display = 'block';
	if(flag==1) {
		user_name.value = nameGlobal;
		user_name.readOnly = true; 
		document.getElementById("pontuacaoON").style.display = "block";
		document.getElementById("botao_passar").style.display = "block";
		desistir2.style.display = "block";
		desistir2.disabled = true;
		playerB.disabled = true;
		playerW.disabled = true;
		easy.disabled = true;
		medium.disabled = true;
		hard.disabled = true;
	}	
	else {
		document.getElementById("pontuacao").style.display = "block";
		document.getElementById("voltar_pagInic").style.display = "block";
		desistir.style.display = "block";
	}
}

// RANKING
function score() {
	fetch(link + "ranking", {
		method : "POST",
		body : JSON.stringify("")
	})
	.then(function (resposta){
		return resposta.json();
	})
	.then(function (texto){
		printRanks(texto.ranking);
	})
	.catch(function() {
        console.log("error");
        return;
    });	
}

var modal_pontON = document.getElementById("table_pont");
// Quando o utilizador carrega no botão, abre a janela 
document.getElementById("pontuacaoON").addEventListener("click", btnpontON);
function btnpontON() {
	modal_pontON.style.display = "block";
	score();
}
// Quando o utilizador carrega no <span> x, fecha a janela
document.getElementsByClassName("close_pontON")[0].addEventListener("click", function spanpontON(){
	span_pontON();
});
function span_pontON() {
	modal_pontON.style.display = "none";
}

function printRanks(arr){
	var tab = document.getElementById("tab_raking");

	while(tab.firstChild){
		tab.removeChild(tab.firstChild);
	}
	var trM = document.createElement("tr");
	var th1 = document.createElement("th");
	var th2 = document.createElement("th");
	var th3 = document.createElement("th");
	th1.innerHTML = "Nome utilizador";
	th2.innerHTML = "Vitorias";
	th3.innerHTML = "Jogos";
	trM.appendChild(th1);
	trM.appendChild(th2);
	trM.appendChild(th3);
	tab.appendChild(trM);

	for(var i=0; i<arr.length; i++) {
		var trI = document.createElement("tr");
		var thI1 = document.createElement("th");
		var thI2 = document.createElement("th");
		var thI3 = document.createElement("th");
		thI1.innerHTML = arr[i].nick;
		thI2.innerHTML = arr[i].victories;
		thI3.innerHTML = arr[i].games;
		trI.appendChild(thI1);
		trI.appendChild(thI2);
		trI.appendChild(thI3);
		tab.appendChild(trI);
	}
}

// LEAVE
function leave() {
	desistir = {
		nick : nameGlobal,
		pass : passGlobal,
		game : gameIdGlobal
	}
	fetch(link + "leave", {
		method : "POST",
		body : JSON.stringify(desistir)
	})
	.then(function (resposta){
		return resposta.text();
	})
	.then(function (texto){
		console.log(texto);
		console.log("logout");
	})
	.catch(function() {
        console.log("error");
        return;
    });
}
desistir2.addEventListener("click", leave);

// NOTIFY
function notify(moveId) {
	notificaçao = {
		nick : nameGlobal,
		pass : passGlobal,
		game : gameIdGlobal,
		move : moveId
	}
	fetch(link + "notify", {
		method : "POST",
		body : JSON.stringify(notificaçao)
	})
	.then(function (resposta){
		return resposta.json();
	})
	.then(function (texto){
		return texto;	
	})
	.catch(function() {
        console.log("error");
        return;
    });
}

// UPDATE
function update(){
	var event_source = new EventSource(encodeURI("http://twserver.alunos.dcc.fc.up.pt:8151/" + "update?game=" + gameIdGlobal + "&nick=" + nameGlobal));
	event_source.onmessage=function(event){
		const data = JSON.parse(event.data);
		board = data.board;
		if(board != undefined){
			atualizar(board);
		}
		if(data.winner!==undefined){
			if(data.winner !== null)
				window.alert("O vencedor é: " + data.winner);
			refresh();
			event_source.close();
			return;
		}
		var count = data.count;

		dark = count.dark;
		light = count.light;
		empty = count.empty;

		skip = data.skip;
		if(skip)
			document.getElementById("botao_passar").disabled = false;
		else
			document.getElementById("botao_passar").disabled = true;

		turn = data.turn;
		turn_vs1.innerHTML = turn + ": " + "Your turn";
		document.getElementById("pontosP").innerHTML = "Pretas: " + dark;
		document.getElementById("pontosB").innerHTML = "Brancas: " + light;
	}
}

function color() {
	if(colorId === "light")
		return 2;
	else if(colorId === "dark")
		return 1;
}	
	
function verify(cell) {
	atualizar(board);
	if(turn !== nameGlobal) {
		//console.log("Não é tua vez!")
		return;
	}

	//console.log("É tua vez");
	var cor = color();
	var x = parseInt(cell.id[1]);
	var y = parseInt(cell.id[2]);

	if(x == 0) {		
		if((matrix[x][y-1] == cor) || (matrix[x][y+1] == cor) || (matrix[x+1][y-1] == cor) || (matrix[x+1][y] == cor) || (matrix[x+1][y+1] == cor)) {
			
			var move = { 
							row: x,
							column: y 
						};
			notify(move);
		}
	}
	else {
		if((matrix[x-1][y-1] == cor) || (matrix[x-1][y] == cor) || (matrix[x-1][y+1] == cor) || (matrix[x][y-1] == cor) ||
		   (matrix[x][y+1] == cor) || (matrix[x+1][y-1] == cor) || (matrix[x+1][y] == cor) || (matrix[x+1][y+1] == cor)) {
			
			var move = { 
							row: x,
							column: y 
						};
			notify(move);
		}		
	}	
}

//atualiza as imagens do tabuleiro
function atualizar(board) {
	let img;
	for(let i=0; i<8; i++) {
		var row = board[i];
		for(let j=0; j<8; j++) {
			if(row[j] == "empty") {
				matrix[i][j]=0;
			}
			else if(row[j] == "dark") {
				matrix[i][j]=2;
				img = document.createElement("img");
				img.setAttribute("src","disco_preto.png");
				img.setAttribute("alt","Imagem não disponível");
				img.className = "grid_img";
				document.getElementById("c"+i+j).appendChild(img);
			}
			else {
				matrix[i][j]=1;
				img = document.createElement("img");
				img.setAttribute("src","disco_branco.png");
				img.setAttribute("alt","Imagem não disponível");
				img.className = "grid_img";
				document.getElementById("c"+i+j).appendChild(img);
			}
		}

	}
}

//quando o jogo termina, da refresh ao tabuleiro e volta a pag inicial
function refresh() {
	modal_on.style.display = "none";
	document.getElementById("user").value = "";
	document.getElementById("pass").value = "";	
	playerB.disabled = false;
	playerW.disabled = false;
	easy.disabled = false;
	medium.disabled = false;
	hard.disabled = false;
	desistir2.disabled = true;
	submit_vs1.disabled = false;
	turn_vs1.innerHTML = "";
	for(let i=0; i<8; i++) {
		for(let j=0; j<8; j++) {
			matrix[i][j] = 0;
			tab2.removeChild(document.getElementById("c"+i+j));
		}
	}
	document.getElementById("turn_vs1").style.display = "none";
	document.getElementById("pontos_vs1").style.display = "none";
	document.getElementById("pagina_inicial").style.display = "block";
	document.getElementById("pagina_jogo_vs1").style.display = "none";	
}