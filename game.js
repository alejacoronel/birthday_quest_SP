const world = document.getElementById('world');
const titleScreen = document.getElementById('titleScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const startBtn = document.getElementById('startBtn');
const replayBtn = document.getElementById('replayBtn');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');

let playing = false;
let x = 10, y = 58, score = 0;
const speed = 2.9;

const pineappleSpots = [[18,31],[71,25],[48,57],[83,54],[64,76]];
const messages = [
  'Buenaaaa 🍍',
  'ΩY! 🍍',
  'Olee 💃🏻🕺',
  'El que no apoya...',
  'PINEAPPLE MASTER 👑'
];
const palms = [[5,29],[86,29],[28,69],[74,72]];

function startGame(){
  playing = true; score = 0; x = 10; y = 58;
  scoreEl.textContent = score;
  titleScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  message.classList.add('hidden');
  buildWorld();
  draw();
}

function buildWorld(){
  world.innerHTML = '';
  palms.forEach(([px,py])=>{
    const p=document.createElement('div');
    p.className='palm'; p.textContent='🌴';
    p.style.left=px+'%'; p.style.top=py+'%';
    world.appendChild(p);
  });

  const actor=document.createElement('div');
  actor.id='actor'; actor.className='actor'; actor.textContent='👽';
  world.appendChild(actor);

  pineappleSpots.forEach((pos,i)=>{
    const p=document.createElement('div');
    p.className='pineapple'; p.textContent='🍍'; p.dataset.i=i;
    p.style.left=pos[0]+'%'; p.style.top=pos[1]+'%';
    world.appendChild(p);
  });
}

function draw(){
  const a=document.getElementById('actor');
  if(a){a.style.left=x+'%';a.style.top=y+'%';}
}

function move(dx,dy){
  if(!playing)return;
  x=Math.max(3,Math.min(91,x+dx));
  y=Math.max(10,Math.min(82,y+dy));
  draw();
  checkCollisions();
}

function checkCollisions(){
  document.querySelectorAll('.pineapple').forEach(el=>{
    if(el.classList.contains('collected'))return;
    const px=parseFloat(el.style.left), py=parseFloat(el.style.top);
    if(Math.hypot(x-px,y-py)<9){
      el.classList.add('collected');
      el.style.visibility='hidden';
      score++;
      scoreEl.textContent=score;
      showMessage(messages[score-1]);
      if(score===pineappleSpots.length)finish();
    }
  });
}

function showMessage(t){
  message.textContent=t;
  message.classList.remove('hidden');
  clearTimeout(showMessage.timer);
  showMessage.timer=setTimeout(()=>message.classList.add('hidden'),1400);
}

function finish(){
  playing=false;
  setTimeout(()=>{
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
  },900);
}

document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault();
  if(!playing&&(k===' '||k==='enter')){startGame();return;}
  if(k==='arrowup'||k==='w')move(0,-speed);
  if(k==='arrowdown'||k==='s')move(0,speed);
  if(k==='arrowleft'||k==='a')move(-speed,0);
  if(k==='arrowright'||k==='d')move(speed,0);
});

document.querySelectorAll('[data-key]').forEach(btn=>{
  const d={up:[0,-speed],down:[0,speed],left:[-speed,0],right:[speed,0]}[btn.dataset.key];
  const press=e=>{e.preventDefault();move(...d)};
  btn.addEventListener('pointerdown',press);
});

startBtn.addEventListener('click',startGame);
replayBtn.addEventListener('click',startGame);
document.getElementById('screen').addEventListener('click',e=>{
  if(!playing&&e.target.closest('#titleScreen'))startGame();
});
