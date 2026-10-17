'use strict';
const media = matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = media.matches;
const motionButton = document.querySelector('#motion-toggle');
const sculpture = document.querySelector('.sculpture');
const group = document.querySelector('#ribbon-lines');
const ellipses = [];
for (let i = 0; i < 36; i++) {
  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ellipse.setAttribute('cx', '250'); ellipse.setAttribute('cy', '250');
  ellipse.setAttribute('rx', String(60 + i * 3.15)); ellipse.setAttribute('ry', '185');
  group.append(ellipse); ellipses.push(ellipse);
}
let pointer = 0, current = 0, frame = 0;
function paint() {
  current += (pointer - current) * .045;
  ellipses.forEach((ellipse, i) => ellipse.setAttribute('transform', `rotate(${i * 5 + current} 250 250)`));
  frame = Math.abs(pointer - current) > .01 && !motionOff ? requestAnimationFrame(paint) : 0;
}
paint();
sculpture.addEventListener('pointermove', event => {
  if (motionOff || event.pointerType === 'touch') return;
  const bounds = sculpture.getBoundingClientRect();
  pointer = ((event.clientX - bounds.left) / bounds.width - .5) * 35;
  if (!frame) frame = requestAnimationFrame(paint);
});
sculpture.addEventListener('pointerleave', () => { pointer = 0; if (!frame && !motionOff) frame = requestAnimationFrame(paint); });
const wave = document.querySelector('.wave');
for (let i = 0; i < 39; i++) {
  const bar = document.createElement('i');
  bar.style.setProperty('--height', `${15 + (Math.sin(i * .7) * .5 + .5) * Math.sin(Math.PI * i / 38) * 100}px`);
  bar.style.setProperty('--delay', `${-i * .07}s`); wave.append(bar);
}
const voiceButton = document.querySelector('#voice-demo');
let voiceTimer;
function stopVoice() {
  clearTimeout(voiceTimer); document.querySelector('.voice-preview').classList.remove('playing');
  voiceButton.setAttribute('aria-pressed', 'false'); voiceButton.innerHTML = 'Animate the idea <span>▶</span>';
}
voiceButton.addEventListener('click', () => {
  if (voiceButton.getAttribute('aria-pressed') === 'true') return stopVoice();
  voiceButton.setAttribute('aria-pressed', 'true');
  voiceButton.innerHTML = motionOff ? 'Waveform shown <span>✓</span>' : 'Pause the sketch <span>Ⅱ</span>';
  if (!motionOff) document.querySelector('.voice-preview').classList.add('playing');
  voiceTimer = setTimeout(stopVoice, 6000);
});
const focusButton = document.querySelector('#focus-demo');
let focusTimer;
focusButton.addEventListener('click', () => {
  clearTimeout(focusTimer); document.querySelector('.focus-preview').classList.add('activated');
  focusButton.querySelector('small').textContent = 'Session found. Right where you left it.';
  document.querySelector('#focus-status').textContent = 'Illustration: the matching session is now highlighted.';
  focusTimer = setTimeout(() => {
    document.querySelector('.focus-preview').classList.remove('activated');
    focusButton.querySelector('small').textContent = 'Preview session highlight';
  }, 4000);
});
function setMotion(value) {
  motionOff = value; document.documentElement.classList.toggle('motion-off', value);
  motionButton.textContent = value ? 'Motion: off' : 'Motion: on';
  motionButton.setAttribute('aria-pressed', String(value));
  if (value) { cancelAnimationFrame(frame); frame = 0; pointer = current = 0; paint(); stopVoice(); }
}
motionButton.addEventListener('click', () => setMotion(!motionOff));
media.addEventListener('change', event => setMotion(event.matches));
setMotion(motionOff);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopVoice(); });

// Explicit project selection gives each small project a complete presentation stage.
const projectTabs = [...document.querySelectorAll('.project-selector [role=tab]')];
const panels = [...document.querySelectorAll('.projects > .project')];
const selector = document.querySelector('.project-selector');
const projectGroup = document.querySelector('.projects');
let activeProject = 0;
function selectProject(index, focus = false) {
  stopVoice();
  activeProject = (index + panels.length) % panels.length;
  projectTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === activeProject));
    tab.tabIndex = i === activeProject ? 0 : -1;
    panels[i].hidden = i !== activeProject;
  });
  if (focus) projectTabs[activeProject].focus({ preventScroll: true });
  if (!motionOff) {
    const panel = panels[activeProject];
    panel.getAnimations().forEach(animation => animation.cancel());
    panel.animate([
      { opacity: 0, transform: 'perspective(1200px) translate3d(35px,25px,-100px) rotateY(-5deg)' },
      { opacity: 1, transform: 'perspective(1200px) translate3d(0,0,0) rotateY(0deg)' }
    ], { duration: 700, easing: 'cubic-bezier(.18,.75,.25,1)' });
  }
  requestAnimationFrame(() => measureScenes());
}
if (selector && projectTabs.length) {
  selector.hidden = false; projectGroup.classList.add('enhanced');
  projectTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectProject(i));
    tab.addEventListener('keydown', event => {
      const targets = { ArrowRight: activeProject + 1, ArrowLeft: activeProject - 1, Home: 0, End: panels.length - 1 };
      if (event.key in targets) { event.preventDefault(); selectProject(targets[event.key], true); }
    });
  });
  selectProject(0);
}

const scenes = [...document.querySelectorAll('.scene')];
const chapterLinks = [...document.querySelectorAll('.scene-nav a')];
const tracks = [];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
let sceneFrame = 0;
scenes.forEach((scene, index) => {
  const track = document.createElement('div'); track.className = 'scene-track';
  scene.before(track); track.append(scene);
  const layers = [...scene.children].filter(element => !element.matches('.hero-meta,.hero-foot'));
  if (scene.matches('.hero')) {
    layers.length = 0; layers.push(scene.querySelector('.hero-copy'), scene.querySelector('.sculpture'));
  }
  layers.forEach(element => element.setAttribute('data-depth', ''));
  tracks.push({ scene, track, layers, index, height: 0, hold: 0 });
});
function measureScenes() {
  tracks.forEach(item => {
    item.height = item.scene.offsetHeight;
    item.hold = motionOff ? 0 : innerHeight * (innerWidth < 701 ? .34 : .65);
    item.track.style.height = `${item.height + item.hold}px`;
    item.scene.style.setProperty('--sticky-top', `${Math.min(0, innerHeight - item.height)}px`);
  });
  updateScenes();
}
function updateScenes() {
  sceneFrame = 0;
  let nearest = 0, distance = Infinity;
  tracks.forEach(item => {
    const bounds = item.track.getBoundingClientRect();
    const height = item.height;
    const start = Math.max(0, height - innerHeight);
    const progress = item.hold ? clamp((-bounds.top - start) / item.hold, 0, 1) : 0;
    const enter = clamp((bounds.top - innerHeight * .15) / (innerHeight * .8), 0, 1);
    const leave = clamp((progress - .3) / .7, 0, 1);
    const visible = bounds.top < innerHeight && bounds.bottom > 0;
    item.scene.classList.toggle('is-visible', visible);
    const score = Math.abs(bounds.top + (height + item.hold) / 2 - innerHeight / 2);
    if (score < distance) { nearest = item.index; distance = score; }
    item.layers.forEach((layer, i) => {
      const factor = innerWidth < 701 ? .5 : 1;
      const y = motionOff ? 0 : (enter * 70 - leave * 75) * factor;
      const z = motionOff ? 0 : (-enter * (140 + i * 25) - leave * (100 + i * 45)) * factor;
      layer.style.setProperty('--depth-y', `${y.toFixed(2)}px`);
      layer.style.setProperty('--depth-z', `${z.toFixed(2)}px`);
      layer.style.setProperty('--depth-r', `${motionOff ? 0 : (enter * 5 - leave * 3) * factor}deg`);
      layer.style.setProperty('--depth-opacity', String(motionOff ? 1 : 1 - enter * .25 - leave * .25));
      if (layer.matches('.sculpture')) {
        layer.style.setProperty('--art-z', `${motionOff ? 0 : progress * 170 * factor}px`);
        layer.style.setProperty('--art-r', `${motionOff ? 0 : progress * -32 * factor}deg`);
        layer.style.setProperty('--art-x', `${motionOff ? 0 : progress * -30 * factor}px`);
      }
    });
  });
  chapterLinks.forEach((link, i) => { if (i === nearest) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
}
function scheduleScenes() { if (!sceneFrame) sceneFrame = requestAnimationFrame(updateScenes); }
addEventListener('scroll', scheduleScenes, { passive: true });
addEventListener('resize', measureScenes, { passive: true });
motionButton.addEventListener('click', measureScenes);
media.addEventListener('change', measureScenes);
document.addEventListener('visibilitychange', () => {
  document.querySelectorAll('.sculpture svg').forEach(element => { element.style.animationPlayState = document.hidden ? 'paused' : ''; });
});
// Focused content stays visually readable even during a scene transition.
document.addEventListener('focusin', event => {
  const scene = event.target.closest('.scene');
  if (scene) scene.querySelectorAll('[data-depth]').forEach(layer => {
    layer.style.setProperty('--depth-opacity', '1');
  });
});
measureScenes();

// Anchor targets resolve to the beginning of their native scroll track.
// Sticky visual positions must not become the navigation destination.
function navigateToChapter(hash, updateHistory = false) {
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  const track = target.closest('.scene-track');
  const top = track ? track.offsetTop : target.offsetTop;
  if (updateHistory) history.pushState(null, '', hash);
  scrollTo({ top, behavior: motionOff ? 'instant' : 'smooth' });
  if (target.matches('.scene')) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
}
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const hash = link.getAttribute('href');
  if (!document.getElementById(hash.slice(1))) return;
  event.preventDefault(); navigateToChapter(hash, true);
}));
addEventListener('popstate', () => { if (location.hash) navigateToChapter(location.hash); });
if (location.hash) requestAnimationFrame(() => navigateToChapter(location.hash));
