const world = document.getElementById("world");
const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

let playing = false;
let x = 10, y = 58;
let score = 0;
const speed = 2.7;

const pineappleSpots = [
  [19, 29],
  [72, 23],
  [47, 55],
  [83, 51],
  [63, 76]
];

const messages = [
  "Buenaaaa 🍍",
  "ΩY! 🍍",
  "Olee 💃🏻🕺",
  "El que no apoya...",
  "PINEAPPLE MASTER 👑"
];

const palms = [
  [5, 27], [86, 28], [27, 67], [74, 70]
];

function startGame() {
  playing = true;
  score = 0;
  x = 10;
  y = 58;
  scoreEl.textContent = score;
  titleScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  message.classList.add("hidden");
  buildWorld();
  draw();
}

function buildWorld() {
  world.innerHTML = "";

  palms.forEach(([px, py]) => {
    const palm = document.createElement("div");
    palm.className = "palm";
    palm.textContent = "🌴";
    palm.style.left = px + "%";
    palm.style.top = py + "%";
    world.appendChild(palm);
  });

  const actor = document.createElement("div");
  actor.id = "actor";
  actor.className = "actor";
  actor.textContent = "👽";
  world.appendChild(actor);

  pineappleSpots.forEach((p, i) => {
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

  x = Math.max(3, Math.min(91, x + dx));
  y = Math.max(10, Math.min(82, y + dy));

  draw();
  checkCollisions();
}

function checkCollisions() {
  const ax = x;
  const ay = y;

  document.querySelectorAll(".pineapple").forEach(el => {
    if (el.classList.contains("collected")) return;

    const px = parseFloat(el.style.left);
    const py = parseFloat(el.style.top);

    if (Math.hypot(ax - px, ay - py) < 9) {
      el.classList.add("collected");
      el.style.visibility = "hidden";

      score++;
      scoreEl.textContent = score;
      showMessage(messages[score - 1]);

      if (score === pineappleSpots.length) finish();
    }
  });
}

function showMessage(text) {
  message.textContent = text;
  message.classList.remove("hidden");

  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(() => {
    message.classList.add("hidden");
  }, 1300);
}

function finish() {
  playing = false;

  setTimeout(() => {
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
  }, 1100);
}

function handleKey(e) {
  const key = e.key.toLowerCase();

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "enter"].includes(key)) {
    e.preventDefault();
  }

  if (!playing && (key === " " || key === "enter")) {
    startGame();
    return;
  }

  if (key === "arrowup" || key === "w") move(0, -speed);
  if (key === "arrowdown" || key === "s") move(0, speed);
  if (key === "arrowleft" || key === "a") move(-speed, 0);
  if (key === "arrowright" || key === "d") move(speed, 0);
}

document.addEventListener("keydown", handleKey);

document.querySelectorAll("[data-key]").forEach(btn => {
  const key = btn.dataset.key;
  const dir = {
    up: [0, -speed],
    down: [0, speed],
    left: [-speed, 0],
    right: [speed, 0]
  }[key];

  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    move(...dir);
  });
});

startBtn.addEventListener("click", startGame);

document.getElementById("screen").addEventListener("click", e => {
  if (!playing && e.target.closest("#titleScreen")) startGame();
});
