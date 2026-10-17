'use strict';
const root = document.documentElement;
const media = matchMedia('(prefers-reduced-motion: reduce)');
const track = document.querySelector('.story-track');
const stage = document.querySelector('.stage');
const scenes = [...document.querySelectorAll('.scene')];
const copies = scenes.map(scene => scene.querySelector('.copy'));
const nav = [...document.querySelectorAll('.scene-nav a')];
const button = document.querySelector('#motion-toggle');
const camera = document.querySelector('.type-camera');
const words = [...document.querySelectorAll('.word')];
const count = document.querySelector('#scene-count');
const hint = document.querySelector('#scroll-hint');
const progressBar = document.querySelector('#progress');
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, n) => {const t = clamp((n - a) / (b - a));return t * t * (3 - 2 * t);};
let off = media.matches, span = 1, width = innerWidth, height = innerHeight;
let current = 0, target = 0, active = -1, frame = 0, last = 0;
const desktop = [[76,74,.84,-30,-16,50],[78,68,1.03,28,10,42],[76,71,.88,-24,-12,38],[76,69,1.05,-22,-12,30]];
const mobile = [[57,67,.45,-28,-15,52],[60,68,.48,25,10,48],[58,66,.46,-25,-14,45],[74,77,.47,-24,-14,32]];
words.forEach(word => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 15; i++) {
    const face = document.createElement('span');face.className = 'depth';face.textContent = word.dataset.word;
    face.style.transform = `translateZ(${i * 2}px)`;fragment.append(face);
  }
  word.append(fragment);
});
function paint(p) {
  const phone = width < 701;
  let next = 0, strongest = -1;
  scenes.forEach((scene, i) => {
    const d = p - i;
    const enter = smooth(-.73, -.06, d), exit = smooth(.22, .85, d);
    const alpha = enter * (1 - exit);
    if (alpha > strongest) {strongest = alpha;next = i;}
    const drawn = alpha > .002;
    scene.classList.toggle('drawn', drawn);
    if (!drawn) return;
    const incoming = 1 - enter;
    const x = phone ? exit * width * .14 : exit * width * .28 - incoming * width * .07;
    const y = incoming * height * .13 - exit * height * .12;
    const z = -incoming * 600 - exit * 1050;
    copies[i].style.transform = `translate3d(${x}px,${y}px,${z}px) scale(${mix(.75,1,enter) * mix(1,.45,exit)}) rotateX(${incoming * -8 + exit * 14}deg)`;
    copies[i].style.opacity = String(alpha);
    scene.style.setProperty('--alpha', String(alpha));
  });
  if (next !== active) {
    active = next;
    scenes.forEach((scene, i) => {scene.inert = i !== active;scene.setAttribute('aria-hidden',String(i !== active));scene.classList.toggle('active',i === active);});
    nav.forEach((link,i) => {if (i === active) link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
    count.textContent = `0${active + 1} / 04`;
    hint.textContent = active === 3 ? 'Keep asking why' : 'Scroll to explore';
  }
  const cams = phone ? mobile : desktop;
  const i = Math.min(2, Math.floor(p)), t = smooth(0,1,p-i);
  const c = cams[i].map((n,k) => mix(n,cams[i+1][k],t));
  camera.style.transform = `translate3d(${width*c[0]/100-300}px,${height*c[1]/100-115}px,0) scale(${c[2]}) rotateX(${c[5]}deg) rotateY(${c[3]}deg) rotateZ(${c[4]}deg)`;
  words.forEach((word,j) => {
    const distance = p-j;
    const fadeIn = smooth(-.7,-.05,distance), fadeOut = smooth(.18,.83,distance);
    const alpha = fadeIn*(1-fadeOut);
    word.style.visibility = alpha > .002 ? 'visible' : 'hidden';
    word.style.opacity = String(alpha);
    word.style.transform = `translate3d(${(1-fadeIn)*-110+fadeOut*100}px,${(1-fadeIn)*140-fadeOut*130}px,${-(1-fadeIn)*350-fadeOut*400}px) rotateY(${(1-fadeIn)*-22+fadeOut*30}deg)`;
  });
  progressBar.style.transform = `scaleX(${p/3})`;
}
function sample(time) {
  frame = 0;if(off) return;
  target = clamp(scrollY/span,0,3);
  const elapsed = last ? Math.min(64,time-last) : 16.67;last = time;
  current += (target-current)*(1-Math.exp(-elapsed/64));
  if(Math.abs(target-current)<.00025) current=target;
  paint(current);
  if(current!==target) frame=requestAnimationFrame(sample);else last=0;
}
function schedule(){if(!off&&!frame) frame=requestAnimationFrame(sample);}
function measure(preserve=true){
  if(off)return;
  const prior=clamp(scrollY/span,0,3), w=stage.clientWidth,h=stage.clientHeight;
  if(preserve&&w===width&&h===height)return;
  width=w;height=h;span=h*(w<701?1.15:1.24);
  track.style.height=`${h+span*3}px`;
  if(preserve)scrollTo({top:prior*span,behavior:'instant'});
  current=target=clamp(scrollY/span,0,3);paint(current);
}
function staticIndex(){let best=0,distance=Infinity;scenes.forEach((s,i)=>{const d=Math.abs(s.getBoundingClientRect().top-height*.2);if(d<distance){best=i;distance=d;}});return best;}
function setMode(value,initial=false){
  const index=initial?0:off?staticIndex():active;
  off=value;cancelAnimationFrame(frame);frame=0;last=0;root.classList.toggle('cinematic',!off);
  button.hidden=false;button.textContent=off?'Static view':'Motion on';button.setAttribute('aria-pressed',String(off));button.setAttribute('aria-label',off?'Enable immersive scrolling':'Use static page view');
  if(off){track.style.height='';scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden');s.classList.remove('active','drawn');s.style.removeProperty('--alpha');});copies.forEach(c=>{c.style.transform='';c.style.opacity='';});if(!initial)scenes[Math.max(0,index)].scrollIntoView({behavior:'instant'});}
  else{measure(false);if(!initial){current=target=Math.max(0,index);scrollTo({top:current*span,behavior:'instant'});paint(current);}}
}
function navigate(hash,push=false){
  const scene=document.getElementById(hash.slice(1));if(!scene)return;
  const index=scenes.indexOf(scene);if(index<0)return;
  if(push)history.pushState(null,'',hash);
  if(off)scene.scrollIntoView({behavior:'instant'});
  else{cancelAnimationFrame(frame);frame=0;last=0;current=target=index;scrollTo({top:index*span,behavior:'instant'});paint(index);}
  scene.tabIndex=-1;scene.focus({preventScroll:true});
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(a.getAttribute('href'),true);}));
button.addEventListener('click',()=>setMode(!off));
media.addEventListener('change',e=>setMode(e.matches));
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>measure(),{passive:true});
addEventListener('popstate',()=>navigate(location.hash||'#intro'));
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else schedule();});
setMode(off,true);if(location.hash)requestAnimationFrame(()=>navigate(location.hash));
