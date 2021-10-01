/*globals document, clearInterval, setInterval */
// DOM de la page HTML
var dom_jeu, dom_console, dom_aide, dom_controle, timer;
// Le jeu
var taquinPiece, taquinNumero, liVide, coVide, melangeEnCours, horsJeu, score;

//============= Console d'information =============
function afficherSurConsole(html, style) {
	if (style) {
		dom_console.className = style;
	} else {
		dom_console.className = null;
	}
	dom_console.innerHTML = html;
}

//================== actualiserPieces ==================
function actualiserPieces() {
	var li, co;
	for (li = 0; li < 4; li += 1) {
		for (co = 0; co < 4; co += 1) {
			taquinPiece[li][co].innerHTML = String(taquinNumero[li][co]);
			taquinPiece[li][co].className = "piece" + (taquinNumero[li][co] === 0 ? " non" : " oui");
		}
	}
}

//============= ajouterTDcaseA =============
function ajouterTDcaseA(noeud, li, co) {
	var element, bouton;
	element = document.createElement("td");
	bouton = document.createElement("button");
	bouton.setAttribute("onclick", 'clicPiece(' + li + ',' + co + ')');
	element.appendChild(bouton);
	noeud.appendChild(element);
	taquinPiece[li][co] = bouton;
}

//================== initJeu ==================
function initJeu() {
	var li, co, dom_table, dom_tody, dom_tr;
	dom_table = document.createElement("table");
	dom_table.setAttribute("align", "center");
	dom_table.setAttribute("cellspacing", "0");
	dom_table.setAttribute("border", "0");
	dom_table.setAttribute("cellpadding", "0");
	dom_jeu.appendChild(dom_table);
	dom_tody = document.createElement("tbody");
	dom_table.appendChild(dom_tody);
	taquinPiece = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
	taquinNumero = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
	liVide = 3;
	coVide = 3;
	melangeEnCours = false;
	horsJeu = true;
	for (li = 0; li < 4; li += 1) {
		dom_tr = document.createElement("tr");
		dom_tody.appendChild(dom_tr);
		for (co = 0; co < 4; co += 1) {
			ajouterTDcaseA(dom_tr, li, co);
		}
	}
	actualiserPieces();
}

//================== verifierSolution ==================
function verifierSolution() {
	var li, co, n;
	n = 0;
	for (li = 0; li < 4; li += 1) {
		for (co = 0; co < 4; co += 1) {
			if (taquinNumero[li][co] === (4 * li + co + 1)) {
				n += 1;
			}
		}
	}
	if (n === 15) {
		afficherSurConsole("• &nbsp; • &nbsp; • &nbsp; Bravo ! &nbsp; Solution en " + score + " Clics  &nbsp; • &nbsp; • &nbsp; •", "fini");
		document.body.className = "vert";
	} else {
		afficherSurConsole("Clic n° " + score + " &nbsp; " + n + (n > 1 ? " pièces bien placés" : " pièce bien placée"));
		document.body.className = null;
	}
}

//================== bougerPiecesPour ==================
function bougerPiecesPour(li, co) {	
	var k, s, dk;
	if ((li === liVide) && (co === coVide)) {
		return;
	} else if (li === liVide) {
		dk = co - coVide;
		s = dk < 0 ? -1 : 1;
		for (k = 0; k < s * dk; k += 1) {
			taquinNumero[li][coVide + s * k] = taquinNumero[li][coVide + s * (k + 1)];
		}
		taquinNumero[li][coVide + dk] = 0;
		coVide = co;
	} else if (co === coVide) {
		dk = li - liVide;
		s = dk < 0 ? -1 : 1;
		for (k = 0; k < s * dk; k += 1) {
			taquinNumero[liVide + s * k][co] = taquinNumero[liVide + s * (k + 1)][co];
		}
		taquinNumero[liVide + dk][co] = 0;
		liVide = li;
	} else {
		return;
	}
}

//================== CONTROLES ==================
//================== clicPiece ==================
function clicPiece(li, co) {
	if (melangeEnCours || horsJeu) {
		return;
	}
	score += 1;
	bougerPiecesPour(li, co);
	actualiserPieces();
	verifierSolution();
}

//================== clicOuvrirAide ==================
function clicOuvrirAide() {
	if (melangeEnCours) {
		return;
	}
	dom_aide.innerHTML = '<button type="button" onclick="clicFermerAide()">Cacher le mode d\'emploi</button> <fieldset onclick="clicFermerAide()"><legend>Mode d\'emploi</legend><br />Mélangez d\'abord les pièces du Taquin.<br /><br />Quand le mélange vous semble suffisant, arrêtez !<br /><br />Cliquez sur les pièces pour replacer les numéros dans le bon ordre...<br /></fieldset>';
}

//================== clicFermerAide ==================
function clicFermerAide() {
	if (melangeEnCours) {
		return;
	}
	dom_aide.innerHTML = '<button type="button" onclick="clicOuvrirAide()">Mode d\'emploi</button>';
}

//================== melanger ==================
function melanger() {
	bougerPiecesPour(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
	actualiserPieces();
}

//================== clicMelanger ==================
function clicMelanger() {
	horsJeu = false;
	melangeEnCours = true;
	document.body.className = null;
	dom_controle.innerHTML = '<button onclick="clicStopMelange()" class="melange">Arrêter de mélanger</button>';
	afficherSurConsole("Mélange en cours...");
	timer = setInterval(melanger, 5);
}

//================== clicStopMelange ==================
function clicStopMelange() {
	document.body.className = null;
	dom_controle.innerHTML = '<button onclick="clicMelanger()" class="melange">Mélanger</button>';
	clearInterval(timer);
	afficherSurConsole("À vous de jouer ...");
	melangeEnCours = false;
	score = 0;
}


//================== init ==================
function init() {
	// zone d'affichage de l'aide (bouton aide au départ)
	dom_aide = document.getElementById("aide");
	// zone d'affichage des informations (* au départ)
	dom_console = document.getElementById("console");
	// zone de contrôle du jeu (bouton de validation ou nouveau au départ)
	dom_controle = document.getElementById("controle");
	// zone de définition du jeu (vide au départ)
	dom_jeu = document.getElementById("jeu");
	initJeu();
}
