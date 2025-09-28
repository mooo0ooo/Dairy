let emotions = [
	{en: "Relaxed", ja: "リラックス", P: 0.7, A: -0.6, D: 0.2},
	{en: "Contented", ja: "満足", P: 0.6, A: -0.3, D: 0.1},
	{en: "Calm", ja: "落ち着いた", P: 0.65, A: -0.5, D: 0.0},
	{en: "Sleepy", ja: "眠い", P: 0.0, A: -0.9, D: -0.3},
	{en: "Bored", ja: "退屈", P: -0.5, A: -0.6, D: -0.4},
	{en: "Miserable", ja: "惨め", P: -0.85, A: -0.4, D: -0.6},
	{en: "Unhappy", ja: "不幸", P: -0.7, A: -0.5, D:-0.4},
	{en: "Annoyed", ja: "いらいら", P: 0.4, A: 0.2, D: -0.1},
	{en: "Angry", ja: "怒り", P: -0.8, A: 0.6, D: 0.6},
	{en: "Excited", ja: "興奮", P: 0.8, A: 0.9, D: 0.4},
	{en: "Aroused", ja: "覚醒", P: 0.5, A: 0.8, D: 0.3},
	{en: "Wide-awake", ja: "目が覚める", P: 0.1, A: 0.9, D: 0.0},
	{en: "Frenzied", ja: "狂乱", P: -0.2, A: 0.95, D: -0.1},
	{en: "Jittery", ja: "神経質", P: -0.5, A: 0.8, D: -0.2},
	{en: "Fearful", ja: "恐れ", P: -0.9, A: 0.8, D: -0.6},
	{en: "Anxious", ja: "不安", P: -0.7, A: 0.65, D: -0.5},
	{en: "Dependent", ja: "依存", P: 0.2, A: -0.1, D: -0.6},
	{en: "Controlled", ja: "支配されている", P: -0.3, A: -0.1, D: -0.8},
	{en: "Influenced", ja: "影響される", P: -0.1, A: 0.0, D: -0.5},
	{en: "Dominant", ja: "支配的", P: 0.1, A: 0.2, D: 0.8}
];

let padValues = [
	{P: 0.2, A: 0.7, D: 0.5},
	{P: 0.8, A: 0.3, D: 0.9},
	{P: 0.5, A: 0.5, D: 0.2},
	{P: 0.7, A: 0.8, D: 0.6},
	{P: 0.3, A: 0.2, D: 0.7}
];

let points = [];
let drawLines = false;
let selectedLabel = null;
let okButton;
let fontRegular;

function preload() {
	fontRegular = loadFont('KaiseiHarunoUmi-Regular.ttf');
}

function findClosestEmotion(p, a, d){
	let best = null, minDist = Infinity;
	for (let e of emotions) {
		let dx = p - e.P;
		let dy = a - e.A;
		let dz = d - e.D;
		let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
		if (dist < minDist) {
			minDist = dist;
			best = e;
		}
	}
	return best;
 }

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	textFont(fontRegular);

	okButton = createButton('OK');
	okButton.position(10, 10);
	okButton.style('position', 'absolute');
	okButton.mousePressed(() => {
		drawLines = true;
	});
	
	for (let v of padValues) {
		let emo = findClosestEmotion(v.P, v.A, v.D);
		let x = map(v.P, 0, 1, -100, 100);
		let y = map(v.A, 0, 1, -100, 100);
		let z = map(v.D, 0, 1, -100, 100);
		points.push({pos:createVector(x,y,z), emo:emo});
	}
	
}

function draw() {
	background(10, 10, 30);
	orbitControl();
	
	stroke(100, 100);
	noFill();
	box(200);
	
	for (let p of points) {
		push();
		translate(p.pos.x, p.pos.y, p.pos.z);
		noStroke();
		fill(255, 255, 180);
		sphere(5);
		pop();
	}
	
	if(selectedLabel) {
		push();
		resetMatrix();
		fill(255);
		textSize(20);
		textAlign(CENTER, CENTER);
		textFont('sans-serif');
		text(selectedLabel, 0, -height/2 + 30);
		pop();
	}
	
	if(drawLines) {
		stroke(255, 200, 100);
		noFill();
		beginShape();
		for (let p of points) {
			vertex(p.pos.x, p.pos.y, p.pos.z);
		}
		endShape();
	}
}

function mousePressed() {
	let minDist = 50;
	let nearest = null;
	
	for(let p of points) {
		let d = dist(mouseX - width/2, mouseY - height/2, p.pos.x, p.pos.y);
		if(d < minDist) {
			minDist = d;
			nearest = p;
		}
	}
	if(nearest) {
		selectedLabel = nearest.emo.en + "(" + nearest.emo.ja + ")";
	}
}