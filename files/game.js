// Submissão da área de configuração vs1
var user_name = document.getElementById("user_vs1");
var playerB = document.getElementById("black_vs1");
var playerW = document.getElementById("white_vs1");
var easy = document.getElementById("easy_vs1");
var medium = document.getElementById("medium_vs1");
var hard = document.getElementById("hard_vs1");
var turno_vs1 = document.getElementById("turno_vs1");
var submit = document.getElementById("submit_vs1");
var pontosP = document.getElementById("pontosP");
var pontosB = document.getElementById("pontosB");
var pontos_vs1 = document.getElementById("pontos_vs1");

function player_vs1() {
	if(user_name.value === "") {
		alert("Insira um nome de utilizador!");

	}
	else if(playerB.checked === false  && playerW.checked === false) {
		alert("Tem de selecionar uma cor!");

	}
	else if(easy.checked === false && medium.checked === false && hard.checked === false) {
		alert("Tem de selecionar um nível!");
	}
	else {
		turn_vs1.style.display = "block";
		// Avisa quem é o jogador a começar
		if(playerB.checked) {
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
		}
		else {
			turno_vs1.innerHTML = "Computador: Your turn";
		}
		makeTab(8,8); // Chama a função para criar o tabuleiro
		pontos_vs1.style.display = "block";
		pontos(8,8); // Chama a função para contar o nº de peças de cada cor
	}
}

class Piece {
	constructor(l,c) {
		this.l = l;
		this.c = c;
	}
}

var user = 0;

// Criação do tabuleiro
var tab = document.getElementById("tab");
// Cria matriz para verificar se tem peça(0-não tem peça,1-peça branca,2-peça preta)
var matrix = [[0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0],
			  [0,0,0,0,0,0,0,0]];

function makeTab(rows,cols) {
	submit.disabled = true;
	desistir.disabled = false;
	tab.style.setProperty('grid_rows', rows);
	tab.style.setProperty('grid_cols', cols);
	let img;
	let cell;
	for(let i=0; i<rows; i++) {
		for(let j=0; j<cols; j++) {
			cell = document.createElement("div");

			// Coloca as 2 peças pretas iniciais no meio do tabuleiro
			if((i==3 && j==4) || (i==4 && j==3)) {
				img = document.createElement("img");
				img.setAttribute("src","disco_preto.png");
				img.setAttribute("alt","Imagem não disponível");
				img.className = "grid_img";
				cell.appendChild(img);
				cell.id = "c" + i + j;
				matrix[i][j] = 2;
			}
			// Coloca as 2 peças brancas iniciais no meio do tabuleiro
			if((i==3 && j==3) || (i==4 && j==4)){
				verify = 1;
				img = document.createElement("img");
				img.setAttribute("src","disco_branco.png");
				img.setAttribute("alt","Imagem não disponível");
				img.className = "grid_img";
				cell.appendChild(img);
				cell.id = "c" + i + j;
				matrix[i][j] = 1;
			}
			// Escreve a linha, a coluna
			cell.id = "c" + i + j;


			cell.className = "grid_item";
			tab.appendChild(cell);

			if(playerB.checked) {
				user = 1;
				cell.onclick = function() {
					play(this,matrix,img,user);
				};
			}
			else {
				user = 0;
				play_pc(matrix,img,user);
			}

		}
	}
}

/* DESISTIR */
document.getElementById("desistir").addEventListener("click", function des_vs1() {
	clearTab();
});
function clearTab() {
	for(let i=0; i<8; i++) {
		for(let j=0; j<8; j++) {
			matrix[i][j] = 0;
			tab.removeChild(document.getElementById("c"+i+j));
		}
	}
	alert("Venceu computador!");
	user_vs1.value = "";
	playerB.checked = false;
	playerW.checked = false;
	easy.checked = false;
	medium.checked = false;
	hard.checked = false;
	submit.disabled = false;
	pontos(8,8);
}

function play(cell,matrix,img,user) {


	console.log("user: " + user);
	// if(turno !== jogador)
	if(user !== 1)
		return;

	let count = 0;
	for(let i=0; i<8; i++) {
		for(let j=0; j<8; j++) {
			if(matrix[i][j] === 0)
				count++;
		}
	}

	while(count > 0) {
		if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] === 0) {
			console.log(matrix);
			// Peça Preta
			if(parseInt(cell.id[1]) === 0 || parseInt(cell.id[2]) === 0 || parseInt(cell.id[1]) === 7 || parseInt(cell.id[2]) === 7) {
					// Linha = 0 e Coluna = 0
					if(parseInt(cell.id[1]) === 0 && parseInt(cell.id[2]) === 0) {
						if((matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 0) && (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 0) &&
							 (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na vertical inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 1) {
								if(inferior_vertical(cell,matrix,img) !== -1) {
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal direita
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 1) {
								if(direita_horizontal(cell,matrix,img) !== -1) {
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal direita inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 1) {
								if(direita_inferior(cell,matrix,img) !== -1) {
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
					// Linha = 7 e Coluna = 0
					else if(parseInt(cell.id[1]) === 7 && parseInt(cell.id[2]) === 0) {
						if((matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 0) && (matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 0) &&
							 (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na vertical superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 1) {
								if(superior_vertical(cell,matrix,img) !== -1) {
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal direita
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 1) {
								if(direita_horizontal(cell,matrix,img) !== -1) {
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal direita superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 1) {
								if(direita_superior(cell,matrix,img) !== -1) {
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
					// Linha = 0 e Coluna = 7
					else if(parseInt(cell.id[1]) === 0 && parseInt(cell.id[2]) === 7) {
						if((matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 0) &&
							 (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na vertical inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 1) {
								if(inferior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal esquerda
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal esquerda inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_inferior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
					// Linha = 7 e Coluna = 7
					else if(parseInt(cell.id[1]) === 7 && parseInt(cell.id[2]) === 7) {
						if((matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 0) &&
							 (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na verticalsuperior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 1) {
								if(superior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal esquerda
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal esquerda superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_superior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
					// Linha = 0
					else if(parseInt(cell.id[1]) === 0 && parseInt(cell.id[2]) !== 0 && parseInt(cell.id[2]) !== 7) {
						if((matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 0) &&
							 (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 0) &&
							 (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na vertical inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 1) {
								if(inferior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal esquerda
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal direita
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 1) {
								if(direita_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal esquerda inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_inferior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal direita inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 1) {
								if(direita_inferior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
					// Coluna = 0
					else if(parseInt(cell.id[2]) === 0 && parseInt(cell.id[1]) !== 0 && parseInt(cell.id[1]) !== 7) {
						if((matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 0) && (matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 0) &&
							 (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 0) && (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 0) &&
							 (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na vertical inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 1) {
								if(inferior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na vertical superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 1) {
								if(superior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal direita
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 1) {
								if(direita_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal direita superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 1) {
								if(direita_superior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal direita inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 1) {
								if(direita_inferior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
					// Coluna = 7
					else if(parseInt(cell.id[2]) === 7 && parseInt(cell.id[1]) !== 0 && parseInt(cell.id[1]) !== 7) {
						if((matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 0) &&
							 (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 0) &&
							 (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na vertical inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 1) {
								if(inferior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na vertical superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 1) {
								if(superior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal esquerda
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal esquerda superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_superior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal esquerda inferior
							if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_inferior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
					// Linha = 7
					else if(parseInt(cell.id[1]) === 7 && parseInt(cell.id[2]) !== 0 && parseInt(cell.id[2]) !== 7) {
						if((matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 0) &&
							(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 0) && (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 0) &&
							(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 0)) {

							console.log("Impossível");
						}
						else {
							// Verifica na vertical superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 1) {
								if(superior_vertical(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal esquerda
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na horizontal direita
							if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 1) {
								if(direita_horizontal(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal esquerda superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 1) {
								if(esquerda_superior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
							// Verifica na diagonal direita superior
							if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 1) {
								if(direita_superior(cell,matrix,img) !== -1){
									play_pc(matrix,img,user);
									return;
								}
							}
						}
					}
			}
			else {
					// Verifica na vertical superior
					if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 1) {
						if(superior_vertical(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					// Verifica na vertical inferior
					if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 1) {
						if(inferior_vertical(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					// Verifica na horizontal esquerda
					if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 1) {
						if(esquerda_horizontal(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					// Verifica na horizontal direita
					if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 1) {
						if(direita_horizontal(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					// Verifica na diagonal esquerda superior
					if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 1) {
						if(esquerda_superior(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					// Verifica na diagonal direita superior
					if(matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 1) {
						if(direita_superior(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					// Verifica na diagonal esquerda inferior
					if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 1) {
						if(esquerda_inferior(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					// Verifica na diagonal direita inferior
					if(matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 1) {
						if(direita_inferior(cell,matrix,img) !== -1){
							play_pc(matrix,img,user);
							return;
						}
					}
					else if((matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])-1] === 0) && (matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])] === 0) &&
						 (matrix[parseInt(cell.id[1])-1][parseInt(cell.id[2])+1] === 0) && (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])-1] === 0) &&
						 (matrix[parseInt(cell.id[1])][parseInt(cell.id[2])+1] === 0) && (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])-1] === 0) &&
						 (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])] === 0) && (matrix[parseInt(cell.id[1])+1][parseInt(cell.id[2])+1] === 0)) {

						console.log("Impossível");
					}
			}
		}
		count--;
	}

	pontos(8, 8);

	if(count === 64) {
		isWinner();

	}

}

function play_pc(matrix,img,user) {
	turno_vs1.innerHTML = "Computador: Your turn";
	// trocar turno para pc
	user = 0;

	var array = [];
	for(let i=0; i<8; i++) {
		for(let j=0; j<8; j++) {
			if(matrix[i][j] === 0) {
				let t = new Piece(i,j);
				array.push(t);
			}
		}
	}
	console.log(array);


	while(array.length > 0) {
		var random = Math.floor(Math.random() * array.length);
		if(matrix[(array[random].l)][(array[random].c)] === 0) {
			if((array[random].l) === 0 || (array[random].c) === 0 || (array[random].l) === 7 || (array[random].c) === 7) {
				// Linha = 0 e Coluna = 0
				if((array[random].l) === 0 && array[random].c === 0) {
					if((matrix[(array[random].l)][(array[random].c)+1] === 0) && (matrix[(array[random].l)+1][(array[random].c)] === 0) &&
						 (matrix[(array[random].l)+1][(array[random].c)+1] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical inferior
						if(matrix[(array[random].l)+1][(array[random].c)] === 2) {
							if(inferior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal direita
						if(matrix[(array[random].l)][(array[random].c)+1] === 2) {
							if(direita_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal direita inferior
						if(matrix[(array[random].l)+1][(array[random].c)+1] === 2) {
							if(direita_inferior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
				// Linha = 7 e Coluna = 7
				if((array[random].l) === 7 && (array[random].c) === 7) {
					if((matrix[(array[random].l)-1][(array[random].c)-1] === 0) && (matrix[(array[random].l)-1][(array[random].c)] === 0) &&
						 (matrix[(array[random].l)][(array[random].c)-1] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical superior
						if(matrix[(array[random].l)-1][(array[random].c)] === 2) {
							if(superior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal esquerda
						if(matrix[(array[random].l)][(array[random].c)-1] === 2) {
							if(esquerda_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal esquerda superior
						if(matrix[(array[random].l)-1][(array[random].c)-1] === 2) {
							if(esquerda_superior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
				// Linha = 7 e Coluna = 0
				if((array[random].l) === 7 && (array[random].c) === 0) {
					if((matrix[(array[random].l)-1][(array[random].c)] === 0) && (matrix[(array[random].l)-1][(array[random].c)+1] === 0) &&
						 (matrix[(array[random].l)][(array[random].c)+1] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical superior
						if(matrix[(array[random].l)-1][(array[random].c)] === 2) {
							if(superior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal direita
						if(matrix[(array[random].l)][(array[random].c)+1] === 2) {
							if(direita_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal direita superior
						if(matrix[(array[random].l)-1][(array[random].c)+1] === 2) {
							if(direita_superior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
				// Linha = 0 e Coluna = 7
				if((array[random].l) === 0 && (array[random].c) === 7) {
					if((matrix[(array[random].l)][(array[random].c)-1] === 0) && (matrix[(array[random].l)+1][(array[random].c)-1] === 0) &&
						 (matrix[(array[random].l)+1][(array[random].c)] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical inferior
						if(matrix[(array[random].l)+1][(array[random].c)] === 2) {
							if(inferior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal esquerda
						if(matrix[(array[random].l)][(array[random].c)-1] === 2) {
							if(esquerda_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal esquerda inferior
						if(matrix[(array[random].l)+1][(array[random].c)-1] === 2) {
							if(esquerda_inferior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
				// Linha = 0
				if((array[random].l) === 0 && (array[random].c) !== 0 && (array[random].c) !== 7) {
					if((matrix[(array[random].l)][(array[random].c)-1] === 0) && (matrix[(array[random].l)][(array[random].c)+1] === 0) &&
						 (matrix[(array[random].l)+1][(array[random].c)-1] === 0) && (matrix[(array[random].l)+1][(array[random].c)] === 0) &&
						 (matrix[(array[random].l)+1][(array[random].c)+1] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical inferior
						if(matrix[(array[random].l)+1][(array[random].c)] === 2) {
							if(inferior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal esquerda
						if(matrix[(array[random].l)][(array[random].c)-1] === 2) {
							if(esquerda_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal direita
						if(matrix[(array[random].l)][(array[random].c)+1] === 2) {
							if(direita_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal esquerda inferior
						if(matrix[(array[random].l)+1][(array[random].c)-1] === 2) {
							if(esquerda_inferior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal direita inferior
						if(matrix[(array[random].l)+1][(array[random].c)+1] === 2) {
							if(direita_inferior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
				// Coluna = 0
				if((array[random].c) === 0 && (array[random].l) !== 0 && (array[random].l) !== 7) {
					if((matrix[(array[random].l)-1][(array[random].c)] === 0) && (matrix[(array[random].l)-1][(array[random].c)+1] === 0) &&
						 (matrix[(array[random].l)][(array[random].c)+1] === 0) && (matrix[(array[random].l)+1][(array[random].c)] === 0) &&
						 (matrix[(array[random].l)+1][(array[random].c)+1] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical inferior
						if(matrix[(array[random].l)+1][(array[random].c)] === 2) {
							if(inferior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na vertical superior
						if(matrix[(array[random].l)-1][(array[random].c)] === 2) {
							if(superior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal direita
						if(matrix[(array[random].l)][(array[random].c)+1] === 2) {
							if(direita_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal direita superior
						if(matrix[(array[random].l)-1][(array[random].c)+1] === 2) {
							if(direita_superior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal direita inferior
						if(matrix[(array[random].l)+1][(array[random].c)+1] === 2) {
							if(direita_inferior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
				// Coluna = 7
				if((array[random].c) === 7 && (array[random].l) !== 0 && (array[random].l) !== 7) {
					if((matrix[(array[random].l)-1][(array[random].c)-1] === 0) && (matrix[(array[random].l)-1][(array[random].c)] === 0) &&
						 (matrix[(array[random].l)][(array[random].c)-1] === 0) && (matrix[(array[random].l)+1][(array[random].c)-1] === 0) &&
						 (matrix[(array[random].l)+1][(array[random].c)] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical superior
						if(matrix[(array[random].l)-1][(array[random].c)] === 2) {
							if(superior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na vertical inferior
						if(matrix[(array[random].l)+1][(array[random].c)] === 2) {
							if(inferior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal esquerda
						if(matrix[(array[random].l)][(array[random].c)-1] === 2) {
							if(esquerda_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal esquerda superior
						if(matrix[(array[random].l)-1][(array[random].c)-1] === 2) {
							if(esquerda_superior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal esquerda inferior
						if(matrix[(array[random].l)+1][(array[random].c)-1] === 2) {
							if(esquerda_inferior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
				// Linha = 7
				if((array[random].l) === 7 && (array[random].c) !== 0 && (array[random].c) !== 7) {
					if((matrix[(array[random].l)-1][(array[random].c)-1] === 0) && (matrix[(array[random].l)-1][(array[random].c)] === 0) &&
						 (matrix[(array[random].l)-1][(array[random].c)+1] === 0) && (matrix[(array[random].l)][(array[random].c)-1] === 0) &&
						 (matrix[(array[random].l)][(array[random].c)+1] === 0)) {

						array.splice(random,1);
						continue;
					}
					else {
						// Verifica na vertical superior
						if(matrix[(array[random].l)-1][(array[random].c)] === 2) {
							if(superior_vertical_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal esquerda
						if(matrix[(array[random].l)][(array[random].c)-1] === 2) {
							if(esquerda_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na horizontal direita
						if(matrix[(array[random].l)][(array[random].c)+1] === 2) {
							if(direita_horizontal_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal esquerda superior
						if(matrix[(array[random].l)-1][(array[random].c)-1] === 2) {
							if(esquerda_superior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
						// Verifica na diagonal direita superior
						if(matrix[(array[random].l)-1][(array[random].c)+1] === 2) {
							if(direita_superior_W(matrix,img,array,random) === -1) {
								array.splice(random,1);
								continue;
							}
							else {
								user = 1;
								turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
									pontos(8, 8);
								return;
							}
						}
					}
				}
			}
			else {
				// Verifica na vertical superior
				if(matrix[(array[random].l)-1][(array[random].c)] === 2) {
					if(superior_vertical_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				// Verifica na vertical inferior
				if(matrix[(array[random].l)+1][(array[random].c)] === 2) {
					if(inferior_vertical_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				// Verifica na horizontal esquerda
				if(matrix[(array[random].l)][(array[random].c)-1] === 2) {
					if(esquerda_horizontal_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				// Verifica na horizontal direita
				if(matrix[(array[random].l)][(array[random].c)+1] === 2) {
					if(direita_horizontal_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				// Verifica na diagonal esquerda superior
				if(matrix[(array[random].l)-1][(array[random].c)-1] === 2) {
					if(esquerda_superior_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				// Verifica na diagonal direita superior
				if(matrix[(array[random].l)-1][(array[random].c)+1] === 2) {
					if(direita_superior_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				// Verifica na diagonal esquerda inferior
				if(matrix[(array[random].l)+1][(array[random].c)-1] === 2) {
					if(esquerda_inferior_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				// Verifica na diagonal direita inferior
				if(matrix[(array[random].l)+1][(array[random].c)+1] === 2) {
					if(direita_inferior_W(matrix,img,array,random) === -1) {
						array.splice(random,1);
						continue;
					}
					else {
						user = 1;
						turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
							pontos(8, 8);
						return;
					}
				}
				else if((matrix[(array[random].l)-1][(array[random].c)-1] === 0) && (matrix[(array[random].l)-1][(array[random].c)] === 0) &&
					 (matrix[(array[random].l)-1][(array[random].c)+1] === 0) && (matrix[(array[random].l)][(array[random].c)-1] === 0) &&
					 (matrix[(array[random].l)][(array[random].c)+1] === 0) && (matrix[(array[random].l)+1][(array[random].c)-1] === 0) &&
					 (matrix[(array[random].l)+1][(array[random].c)] === 0) && (matrix[(array[random].l)+1][(array[random].c)+1] === 0)) {

					array.splice(random,1);
					continue;
				}

			}
		}
	}



	let count = 0;
	for(let i=0; i<8; i++) {
		for(let j=0; j<8; j++) {
			if(matrix[i][j] === 0)
				count++;
		}
	}

	if(count === 64) {
		isWinner();

	}
}


// Verifica na vertical superior para a peça preta
function superior_vertical(cell,matrix,img) {
	let linha = parseInt(cell.id[1])-1;
	img = document.createElement("img");
	while(linha >= 0) {
		if(matrix[linha][parseInt(cell.id[2])] === 0) {
			linha = -1;
		}
		else if(matrix[linha][parseInt(cell.id[2])] === 1) {
			console.log("Impossível");
		}
		else if(matrix[linha][parseInt(cell.id[2])] === 2) {
			for(let i=parseInt(cell.id[1])-1; i>=linha; i--) {
				matrix[i][parseInt(cell.id[2])] = 2;
				document.getElementById("c" + i + parseInt(cell.id[2])).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;

			linha = -1;
		}

		linha--;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}

// Verifica na vertical inferior para a peça preta
function inferior_vertical(cell,matrix,img) {
	let linha = parseInt(cell.id[1])+1;
	img = document.createElement("img");
	while(linha < 8) {
		if(matrix[linha][parseInt(cell.id[2])] === 0) {
			linha = 8;
		}
		else if(matrix[linha][parseInt(cell.id[2])] === 1) {
			console.log("Impossível");
		}
		else if(matrix[linha][parseInt(cell.id[2])] === 2) {
			for(let i=parseInt(cell.id[1])+1; i<=linha; i++) {
				matrix[i][parseInt(cell.id[2])] = 2;
				document.getElementById("c" + i + parseInt(cell.id[2])).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;
			turno_vs1.innerHTML = "Computador: Your turn";
			linha = 8;
		}

		linha++;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}

// Verifica na horizontal esquerda para a peça preta
function esquerda_horizontal(cell,matrix,img) {
	let coluna = parseInt(cell.id[2])-1;
	img = document.createElement("img");
	while(coluna >= 0) {
		if(matrix[parseInt(cell.id[1])][coluna] === 0) {
			coluna = -1;
		}
		else if(matrix[parseInt(cell.id[1])][coluna] === 1) {
			console.log("Impossível");
		}
	    else if(matrix[parseInt(cell.id[1])][coluna] === 2) {
			for(let i=parseInt(cell.id[2])-1; i>=coluna; i--) {
				matrix[parseInt(cell.id[1])][i] = 2;
				document.getElementById("c" + parseInt(cell.id[1]) + i).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;
			turno_vs1.innerHTML = "Computador: Your turn";
			coluna = -1;
		}
		coluna--;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}

// Verifica na horizontal direita para a peça preta
function direita_horizontal(cell,matrix,img) {
	let coluna = parseInt(cell.id[2])+1;
	img = document.createElement("img");
	while(coluna < 8) {
		if(matrix[parseInt(cell.id[1])][coluna] === 0) {
			coluna = 8;
		}
		else if(matrix[parseInt(cell.id[1])][coluna] === 1) {
			console.log("Impossível");
		}
		else if(matrix[parseInt(cell.id[1])][coluna] === 2) {
			for(let i=parseInt(cell.id[2])+1; i<=coluna; i++) {
				matrix[parseInt(cell.id[1])][i] = 2;
				document.getElementById("c" + parseInt(cell.id[1]) + i).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;
			turno_vs1.innerHTML = "Computador: Your turn";
			coluna = 8;
		}
		coluna++;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}

// Verifica na diagonal esquerda superior para a peça preta
function esquerda_superior(cell,matrix,img) {
	let linha = parseInt(cell.id[1])-1;
	let coluna = parseInt(cell.id[2])-1;
	img = document.createElement("img");
	while(linha >= 0 && coluna >= 0) {
		if(matrix[linha][coluna] === 0) {
			coluna = -1;
		}
		else if(matrix[linha][coluna] === 1) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 2) {
			for(let i=parseInt(cell.id[1])-1,j=parseInt(cell.id[2])-1; i>=linha,j>=coluna; i--,j--) {
				matrix[i][j] = 2;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;
			turno_vs1.innerHTML = "Computador: Your turn";
			linha = -1;
		}

		linha--;
		coluna--;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}

// Verifica na diagonal direita superior para a peça preta
function direita_superior(cell,matrix,img) {
	let linha = parseInt(cell.id[1])-1;
	let coluna = parseInt(cell.id[2])+1;
	img = document.createElement("img");
	while(linha >= 0 && coluna < 8) {
		if(matrix[linha][coluna] === 0) {
			linha = -1;
		}
		else if(matrix[linha][coluna] === 1) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 2) {
			for(let i=parseInt(cell.id[1])-1,j=parseInt(cell.id[2])+1; i>=linha,j<=coluna; i--,j++) {
				matrix[i][j] = 2;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;
			turno_vs1.innerHTML = "Computador: Your turn";
			linha = -1;
		}

		linha--;
		coluna++;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}

// Verifica na diagonal esquerda inferior para a peça preta
function esquerda_inferior(cell,matrix,img) {
	let linha = parseInt(cell.id[1])+1;
	let coluna = parseInt(cell.id[2])-1;
	img = document.createElement("img");
	while(linha < 8 && coluna >= 0) {
		if(matrix[linha][coluna] === 0) {
			linha = 8;
		}
		else if(matrix[linha][coluna] === 1) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 2) {
			for(let i=parseInt(cell.id[1])+1,j=parseInt(cell.id[2])-1; i<=linha,j>=coluna; i++,j--) {
				matrix[i][j] = 2;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;
			turno_vs1.innerHTML = "Computador: Your turn";
			linha = 8;
		}

		linha++;
		coluna--;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}

// Verifica na diagonal direita inferior para a peça preta
function direita_inferior(cell,matrix,img) {
	let linha = parseInt(cell.id[1])+1;
	let coluna = parseInt(cell.id[2])+1;
	img = document.createElement("img");
	while(linha < 8 && coluna < 8) {
		if(matrix[linha][coluna] === 0) {
			linha = 8;
		}
		else if(matrix[linha][coluna] === 1) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 2) {
			for(let i=parseInt(cell.id[1])+1,j=parseInt(cell.id[2])+1; i<=linha,j<=coluna; i++,j++) {
				matrix[i][j] = 2;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_preto.png");
			}
			img.setAttribute("src","disco_preto.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			cell.appendChild(img);
			matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] = 2;
			turno_vs1.innerHTML = "Computador: Your turn";
			linha = 8;
		}

		linha++;
		coluna++;
	}
	if(matrix[parseInt(cell.id[1])][parseInt(cell.id[2])] !== 2) {
		return -1;
	}
}


/* ***************************************************************** */
/* ***************************************************************** */
// Verifica na vertical superior para a peça branca
function superior_vertical_W(matrix,img,array,random) {
	let linha = (array[random].l)-1;
	img = document.createElement("img");
	while(linha >= 0) {
		if(matrix[linha][(array[random].c)] === 0) {
			linha = -1;
		}
		else if(matrix[linha][(array[random].c)] === 2) {
			console.log("Impossível");
		}
		else if(matrix[linha][(array[random].c)] === 1) {
			for(let i=(array[random].l)-1; i>=linha; i--) {
				matrix[i][(array[random].c)] = 1;
				document.getElementById("c" + i + (array[random].c)).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;

			linha = -1;
		}

		linha--;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Verifica na vertical inferior para a peça branca
function inferior_vertical_W(matrix,img,array,random) {
	let linha = (array[random].l)+1;
	img = document.createElement("img");
	while(linha < 8) {
		if(matrix[linha][(array[random].c)] === 0) {
			linha = 8;
		}
		else if(matrix[linha][(array[random].c)] === 2) {
			console.log("Impossível");
		}
		else if(matrix[linha][(array[random].c)] === 1) {
			for(let i=(array[random].l)+1; i<=linha; i++) {
				matrix[i][(array[random].c)] = 1;
				document.getElementById("c" + i + (array[random].c)).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
			linha = 8;
		}

		linha++;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Verifica na horizontal esquerda para a peça branca
function esquerda_horizontal_W(matrix,img,array,random) {
	let coluna = (array[random].c)-1;
	img = document.createElement("img");
	while(coluna >= 0) {
		if(matrix[(array[random].l)][coluna] === 0) {
			coluna = -1;
		}
		else if(matrix[(array[random].l)][coluna] === 2) {
			console.log("Impossível");
		}
	    else if(matrix[(array[random].l)][coluna] === 1) {
			for(let i=(array[random].c)-1; i>=coluna; i--) {
				matrix[(array[random].l)][i] = 1;
				document.getElementById("c" + (array[random].l) + i).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
			coluna = -1;
		}
		coluna--;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Verifica na horizontal direita para a peça branca
function direita_horizontal_W(matrix,img,array,random) {
	let coluna = (array[random].c)+1;
	img = document.createElement("img");
	while(coluna < 8) {
		if(matrix[(array[random].l)][coluna] === 0) {
			coluna = 8;
		}
		else if(matrix[(array[random].l)][coluna] === 2) {
			console.log("Impossível");
		}
		else if(matrix[(array[random].l)][coluna] === 1) {
			for(let i=(array[random].c)+1; i<=coluna; i++) {
				matrix[(array[random].l)][i] = 1;
				document.getElementById("c" + (array[random].l) + i).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
			coluna = 8;
		}
		coluna++;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Verifica na diagonal esquerda superior para a peça branca
function esquerda_superior_W(matrix,img,array,random) {
	let linha = (array[random].l)-1;
	let coluna = (array[random].c)-1;
	img = document.createElement("img");
	while(linha >= 0 && coluna >= 0) {
		if(matrix[linha][coluna] === 0) {
			linha = -1;
		}
		else if(matrix[linha][coluna] === 2) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 1) {
			for(let i=(array[random].l)-1,j=(array[random].c)-1; i>=linha,j>=coluna; i--,j--) {
				matrix[i][j] = 1;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
			linha = -1;
		}

		linha--;
		coluna--;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Verifica na diagonal direita superior para a peça branca
function direita_superior_W(matrix,img,array,random) {
	let linha = (array[random].l)-1;
	let coluna = (array[random].c)+1;
	img = document.createElement("img");
	while(linha >= 0 && coluna < 8) {
		if(matrix[linha][coluna] === 0) {
			linha = -1;
		}
		else if(matrix[linha][coluna] === 2) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 1) {
			for(let i=(array[random].l)-1,j=(array[random].c)+1; i>=linha,j<=coluna; i--,j++) {
				matrix[i][j] = 1;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
			linha = -1;
		}

		linha--;
		coluna++;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Verifica na diagonal esquerda inferior para a peça branca
function esquerda_inferior_W(matrix,img,array,random) {
	let linha = (array[random].l)+1;
	let coluna = (array[random].c)-1;
	img = document.createElement("img");
	while(linha < 8 && coluna >= 0) {
		if(matrix[linha][coluna] === 0) {
			linha = 8;
		}
		else if(matrix[linha][coluna] === 2) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 1) {
			for(let i=(array[random].l)+1,j=(array[random].c)-1; i<=linha,j>=coluna; i++,j--) {
				matrix[i][j] = 1;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
			linha = 8;
		}
		linha++;
		coluna--;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Verifica na diagonal direita inferior para a peça branca
function direita_inferior_W(matrix,img,array,random) {
	let linha = (array[random].l)+1;
	let coluna = (array[random].c)+1;
	img = document.createElement("img");
	while(linha < 8 && coluna < 8) {
		if(matrix[linha][coluna] === 0) {
			linha = 8;
		}
		else if(matrix[linha][coluna] === 2) {
			console.log("Impossível");
		}
		else if(matrix[linha][coluna] === 1) {
			for(let i=(array[random].l)+1,j=(array[random].c)+1; i<=linha,j<=coluna; i++,j++) {
				matrix[i][j] = 1;
				document.getElementById("c" + i + j).firstChild.setAttribute("src","disco_branco.png");
			}
			img.setAttribute("src","disco_branco.png");
			img.setAttribute("alt","Imagem não disponível");
			img.className = "grid_img";
			document.getElementById("c" + (array[random].l) + (array[random].c)).appendChild(img);
			matrix[(array[random].l)][(array[random].c)] = 1;
			turno_vs1.innerHTML = user_name.value + ": " + "Your turn";
			linha = 8;
		}
		linha++;
		coluna++;
	}
	if(matrix[(array[random].l)][(array[random].c)] !== 1) {
		return -1;
	}
}

// Conta os pontos dos jogadores
function pontos(rows, cols) {
	let countB = 0;
	let countW = 0;

	for(let i=0; i<rows; i++) {
		for(let j=0; j<cols; j++) {
			if(matrix[i][j] === 1)
				countW++;
			if(matrix[i][j] === 2)
				countB++;
		}
	}
	pontosP.innerHTML = "Preto:" + countB;
	pontosB.innerHTML = "Branco:" + countW;
	var winner;
	if(countB < countW)
		winner = "Branco";
	else
		winner = "Preto";
}

// Verifica quem ganhou o jogo
function isWinner() {
	if(pontos(8,8) === "Branco") {
		alert("Venceu Branco!");
		clearTab();
		user_vs1.value = "";
		playerB.checked = false;
		playerW.checked = false;
		easy.checked = false;
		medium.checked = false;
		hard.checked = false;
	}
	else {
		alert("Venceu Preto!");
		clearTab();
		user_vs1.value = "";
		playerB.checked = false;
		playerW.checked = false;
		easy.checked = false;
		medium.checked = false;
		hard.checked = false;
	}
}
