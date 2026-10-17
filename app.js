'use strict';
const root = document.documentElement;
const media = matchMedia('(prefers-reduced-motion: reduce)');
const track = document.querySelector('.story-track');
const stage = document.querySelector('.stage');
const scenes = [...document.querySelectorAll('.scene')];
const copies = scenes.map(scene => scene.querySelector('.copy'));
const nav = [...document.querySelectorAll('.scene-nav a')];
const button = document.querySelector('#motion-toggle');
const arts = scenes.map(scene => scene.querySelector('.art'));
const maxScene = scenes.length - 1;
const maxScroll = maxScene + 2;
const cityButtons = [...document.querySelectorAll('[data-city]')];
const cityDetails = [...document.querySelectorAll('[data-chapter]')];
const mapStops = [...document.querySelectorAll('[data-stop]')];
const mapRings = [...document.querySelectorAll('[data-ring]')];
const mapLegs = [...document.querySelectorAll('[data-leg]')];
const mapInset = document.querySelector('[data-inset]');
const rawAt = index => index <= 2 ? index : index + 2;
const sceneAt = raw => raw < 2 ? raw : raw <= 4 ? 2 : raw - 2;
let shownCity = -1, cityWasStatic = null;
function showCity(index) {
  if (shownCity === index && cityWasStatic === off) return;
  shownCity = index; cityWasStatic = off;
  cityButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i === index)));
  cityDetails.forEach((d,i)=>d.hidden = !off && i !== index);
  mapStops.forEach(s=>s.style.opacity=String(off || Number(s.dataset.stop)<=index ? 1 : 0));
  mapRings.forEach(s=>s.style.opacity=String(!off && Number(s.dataset.ring)===index ? 1 : 0));
  mapLegs.forEach(s=>s.style.opacity=String(off || Number(s.dataset.leg)<=index ? 1 : 0));
  mapInset.style.opacity=String(off || index>=4 ? 1 : 0);
}
function render(raw) {
  paint(sceneAt(raw));
  showCity(Math.round(clamp((raw-2)/2)*5));
}
const count = document.querySelector('#scene-count');
const hint = document.querySelector('#scroll-hint');
const progressBar = document.querySelector('#progress');
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, n) => {const t = clamp((n - a) / (b - a));return t * t * (3 - 2 * t);};
let off = media.matches, span = 1, width = innerWidth, height = innerHeight;
let current = 0, target = 0, active = -1, frame = 0, last = 0;
let destination = null;
function paint(p) {
  const phone = width < 701;
  let next = 0, strongest = -1;
  scenes.forEach((scene, i) => {
    const d = p - i;
    const enter = smooth(-.65, -.14, d), exit = smooth(.22, .58, d);
    const alpha = enter * (1 - exit);
    if (alpha > strongest) {strongest = alpha;next = i;}
    const drawn = alpha > .002;
    scene.classList.toggle('drawn', drawn);
    if (!drawn) return;
    const incoming = 1 - enter;
    const x = phone ? exit * width * .09 : exit * width * .32 - incoming * width * .05;
    const y = incoming * height * .13 - exit * height * .12;
    const z = -incoming * 420 - exit * 760;
    copies[i].style.transform = `translate3d(${x}px,${y}px,${z}px) scale(${mix(.84,1,enter) * mix(1,.54,exit)}) rotateX(${incoming * -8 + exit * 14}deg)`;
    copies[i].style.opacity = String(alpha);
    scene.style.setProperty('--alpha', String(smooth(.86,.99,alpha)));
    const artEnter = smooth(-.68, -.06, d), artExit = smooth(.2,.66,d);
    const artAlpha = artEnter * (1-artExit);
    if (arts[i]) {
      arts[i].style.opacity = String(artAlpha);
      arts[i].style.transform = `translate3d(${(1-artEnter)*width*.11-artExit*width*.08}px,${(1-artEnter)*height*.12-artExit*height*.08}px,${-(1-artEnter)*350-artExit*450}px) scale(${mix(.76,1,artEnter)*mix(1,.78,artExit)}) rotate(${(1-artEnter)*5-artExit*4}deg)`;
    }
  });
  if (next !== active) {
    active = next;
    scenes.forEach((scene, i) => {scene.inert = i !== active;scene.setAttribute('aria-hidden',String(i !== active));scene.classList.toggle('active',i === active);});
    nav.forEach((link,i) => {if (i === active) link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
    count.textContent = `0${active + 1} / ${String(scenes.length).padStart(2,'0')}`;
    hint.textContent = active === maxScene ? 'What’s next?' : active === 2 ? 'Scroll through the places' : 'Scroll to explore';
  }
  progressBar.style.transform = `scaleX(${p/maxScene})`;
}
function sample(time) {
  frame = 0;if(off) return;
  target = clamp(scrollY/span,0,maxScroll);
  const elapsed = last ? Math.min(64,time-last) : 16.67;last = time;
  current += (target-current)*(1-Math.exp(-elapsed/64));
  if(Math.abs(target-current)<.00025) current=target;
  render(current);
  if(destination && Math.abs(scrollY/span-destination.raw)<.002 && Math.abs(current-destination.raw)<.002){
    const scene=destination.scene;destination=null;
    scene?.focus({preventScroll:true});
  }
  if(current!==target) frame=requestAnimationFrame(sample);else last=0;
}
function schedule(){if(!off&&!frame) frame=requestAnimationFrame(sample);}
function measure(preserve=true){
  if(off)return;
  const prior=clamp(scrollY/span,0,maxScroll), w=stage.clientWidth,h=stage.clientHeight;
  if(preserve&&w===width&&h===height)return;
  const visual=current;
  destination=null;
  width=w;height=h;span=h*(w<701?1.28:1.38);
  track.style.height=`${h+span*maxScroll}px`;
  if(preserve)scrollTo({top:prior*span,behavior:'instant'});
  target=clamp(scrollY/span,0,maxScroll);
  current=preserve?visual:target;render(current);schedule();
}
function staticIndex(){let best=0,distance=Infinity;scenes.forEach((s,i)=>{const d=Math.abs(s.getBoundingClientRect().top-height*.2);if(d<distance){best=i;distance=d;}});return best;}
function setMode(value,initial=false){
  const index=initial?0:off?staticIndex():active;
  off=value;cancelAnimationFrame(frame);frame=0;last=0;root.classList.toggle('cinematic',!off);
  destination=null;
  button.hidden=false;button.textContent=off?'Static view':'Motion on';button.setAttribute('aria-pressed',String(off));button.setAttribute('aria-label',off?'Enable immersive scrolling':'Use static page view');
  if(off){track.style.height='';scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden');s.classList.remove('active','drawn');s.style.removeProperty('--alpha');});[...copies,...arts].filter(Boolean).forEach(c=>{c.style.transform='';c.style.opacity='';});showCity(Math.max(0,shownCity));if(!initial)scenes[Math.max(0,index)].scrollIntoView({behavior:'instant'});}
  else{measure(false);if(!initial){current=target=rawAt(Math.max(0,index));scrollTo({top:current*span,behavior:'instant'});render(current);}}
}
function moveTo(raw,scene=null,animate=true){
  if(animate){
    destination={raw,scene};
    scrollTo({top:raw*span,behavior:'smooth'});schedule();
  }else{
    cancelAnimationFrame(frame);frame=0;last=0;destination=null;
    current=target=raw;scrollTo({top:raw*span,behavior:'instant'});render(current);
    scene?.focus({preventScroll:true});
  }
}
function navigate(hash,push=false,animate=true){
  const scene=document.getElementById(hash.slice(1));if(!scene)return;
  const index=scenes.indexOf(scene);if(index<0)return;
  if(push)history.pushState(null,'',hash);
  scene.tabIndex=-1;
  if(off){scene.scrollIntoView({behavior:'instant'});scene.focus({preventScroll:true});}
  else moveTo(rawAt(index),scene,animate);
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(a.getAttribute('href'),true);}));
cityButtons.forEach((button,index)=>button.addEventListener('click',()=>{
  if(off){showCity(index);return;}
  moveTo(2+index/5*2);
}));
function interrupt(){
  if(!destination)return;
  destination=null;
  scrollTo({top:scrollY,behavior:'instant'});
}
addEventListener('wheel',interrupt,{passive:true});
addEventListener('touchstart',interrupt,{passive:true});
addEventListener('pointerdown',interrupt,{passive:true});
addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Tab','Escape'].includes(e.key))interrupt();});
button.addEventListener('click',()=>setMode(!off));
media.addEventListener('change',e=>setMode(e.matches));
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>measure(),{passive:true});
addEventListener('popstate',()=>navigate(location.hash||'#intro'));
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else schedule();});
setMode(off,true);if(location.hash)requestAnimationFrame(()=>navigate(location.hash,false,false));
