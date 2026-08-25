const world = document.getElementById("world");
const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

let playing = false;
let x = 12, y = 55;
let score = 0;
const speed = 2.2;
const pineapples = [
  [18, 25], [70, 20], [48, 52], [82, 48], [62, 76]
];

function startGame() {
  playing = true;
  score = 0;
  x = 12; y = 55;
  scoreEl.textContent = score;
  titleScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  buildWorld();
  draw();
}

function buildWorld() {
  world.innerHTML = "";
  const actor = document.createElement("div");
  actor.id = "actor";
  actor.className = "actor";
  actor.textContent = "👽";
  world.appendChild(actor);

  pineapples.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "pineapple";
    el.textContent = "🍍";
    el.dataset.i = i;
    el.style.left = p[0] + "%";
    el.style.top = p[1] + "%";
    world.appendChild(el);
  });
}

function draw() {
  const actor = document.getElementById("actor");
  if (!actor) return;
  actor.style.left = x + "%";
  actor.style.top = y + "%";
}

function move(dx, dy) {
  if (!playing) return;
  x = Math.max(3, Math.min(90, x + dx));
  y = Math.max(10, Math.min(82, y + dy));
  draw();
  checkCollisions();
}

function checkCollisions() {
  const actor = document.getElementById("actor");
  const ax = x, ay = y;
  document.querySelectorAll(".pineapple").forEach(el => {
    if (el.classList.contains("collected")) return;
    const px = parseFloat(el.style.left);
    const py = parseFloat(el.style.top);
    if (Math.hypot(ax - px, ay - py) < 8) {
      el.classList.add("collected");
      el.style.visibility = "hidden";
      score++;
      scoreEl.textContent = score;
      if (score === pineapples.length) finish();
    }
  });
}

function finish() {
  playing = false;
  setTimeout(() => {
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
  }, 500);
}

document.addEventListener("keydown", e => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Enter"].includes(e.key)) e.preventDefault();
  if (!playing && (e.key === " " || e.key === "Enter")) startGame();
  const k = e.key.toLowerCase();
  if (k === "arrowup" || k === "w") move(0, -2.5);
  if (k === "arrowdown" || k === "s") move(0, 2.5);
  if (k === "arrowleft" || k === "a") move(-2.5, 0);
  if (k === "arrowright" || k === "d") move(2.5, 0);
});

document.querySelectorAll("[data-key]").forEach(btn => {
  const key = btn.dataset.key;
  const dir = {up:[0,-2.5], down:[0,2.5], left:[-2.5,0], right:[2.5,0]}[key];
  btn.addEventListener("pointerdown", e => { e.preventDefault(); move(...dir); });
});
startBtn.addEventListener("click", startGame);
document.getElementById("screen").addEventListener("click", e => {
  if (!playing && e.target.closest("#titleScreen")) startGame();
});
