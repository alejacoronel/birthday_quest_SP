const world = document.getElementById('world');
const titleScreen = document.getElementById('titleScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const startBtn = document.getElementById('startBtn');
const replayBtn = document.getElementById('replayBtn');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const musicToggle = document.getElementById('musicToggle');
const musicBadge = document.getElementById('musicBadge');

let playing = false;
let x = 10, y = 58, score = 0;
const speed = 2.9;

const pineappleSpots = [[18,31],[71,25],[48,57],[83,54],[64,76]];
const messages = [
  'BUENAAAA 🍍',
  'OY! YOU FOUND ONE!',
  'PINEAPPLE ACQUIRED.',
  'THE QUEST GETS JUICIER.',
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
  startMusic();
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
      blip(score);
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
  playMelody([523,659,784,1047],.12);
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

/* Tiny synthesized chiptune: no external audio file needed. */
let audioCtx=null, musicTimer=null, musicOn=true, noteIndex=0;
const melody=[659,784,988,784,659,523,587,659,784,988,1175,988,784,659,587,523];
function getAudio(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended')audioCtx.resume();
  return audioCtx;
}
function tone(freq,dur=.12,vol=.035){
  const ctx=getAudio(), osc=ctx.createOscillator(), gain=ctx.createGain();
  osc.type='square'; osc.frequency.value=freq;
  gain.gain.setValueAtTime(vol,ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+dur);
  osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+dur);
}
function startMusic(){
  if(!musicOn || musicTimer)return;
  getAudio();
  musicTimer=setInterval(()=>{
    tone(melody[noteIndex%melody.length],.11,.022);
    noteIndex++;
  },180);
  musicBadge.classList.remove('hidden');
}
function stopMusic(){
  clearInterval(musicTimer); musicTimer=null;
  musicBadge.classList.add('hidden');
}
function blip(n){ tone(330+n*90,.08,.045); }
function playMelody(notes,dur){
  notes.forEach((n,i)=>setTimeout(()=>tone(n,dur,.05),i*dur*1000));
}
musicToggle.addEventListener('click',()=>{
  musicOn=!musicOn;
  if(musicOn){musicToggle.textContent='Ⅱ';startMusic();}
  else{musicToggle.textContent='▶';stopMusic();}
});
document.getElementById('prevBtn').addEventListener('click',()=>tone(392,.1,.04));
document.getElementById('nextBtn').addEventListener('click',()=>tone(784,.1,.04));
