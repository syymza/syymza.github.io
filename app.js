'use strict';
const media = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const track = document.querySelector('.story-track');
const stage = document.querySelector('.fixed-stage');
const beats = [...document.querySelectorAll('.beat')];
const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];
const motionButton = document.querySelector('#motion-toggle');
const form = document.querySelector('.shared-form');
const number = document.querySelector('#scene-number');
const progressFill = document.querySelector('#progress-fill');
const scrollLabel = document.querySelector('#scroll-label');
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const mix = (a, b, t) => a + (b - a) * t;
function smooth(a, b, value) { const t = clamp((value - a) / (b - a)); return t * t * (3 - 2 * t); }
let motionOff = media.matches;
let span = 1, current = 0, target = 0, activeIndex = -1, frame = 0;
const ellipses = [];
for (let i = 0; i < 36; i++) {
  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ellipse.setAttribute('cx', '250'); ellipse.setAttribute('cy', '250');
  document.querySelector('#ribbon-lines').append(ellipse); ellipses.push(ellipse);
}
const wave = document.querySelector('.wave');
for (let i = 0; i < 39; i++) {
  const bar = document.createElement('i');
  bar.style.setProperty('--height', `${14 + (Math.sin(i * .7) * .5 + .5) * Math.sin(Math.PI * i / 38) * 110}px`);
  bar.style.setProperty('--delay', `${-i * .065}s`); wave.append(bar);
}
document.querySelectorAll('.js-control').forEach(element => { element.hidden = false; });
const voiceButton = document.querySelector('#voice-demo');
let voiceTimer = 0;
function stopVoice() {
  clearTimeout(voiceTimer); document.querySelector('.voice-art').classList.remove('playing');
  voiceButton.setAttribute('aria-pressed', 'false'); voiceButton.innerHTML = 'Animate visual <span aria-hidden="true">▶</span>';
}
voiceButton.addEventListener('click', () => {
  if (voiceButton.getAttribute('aria-pressed') === 'true') return stopVoice();
  voiceButton.setAttribute('aria-pressed', 'true');
  voiceButton.innerHTML = motionOff ? 'Waveform shown <span aria-hidden="true">✓</span>' : 'Pause visual <span aria-hidden="true">Ⅱ</span>';
  if (!motionOff) document.querySelector('.voice-art').classList.add('playing');
  voiceTimer = setTimeout(stopVoice, 6000);
});
const focusButton = document.querySelector('#focus-demo');
let focusTimer = 0;
focusButton.addEventListener('click', () => {
  clearTimeout(focusTimer); document.querySelector('.focus-art').classList.add('activated');
  focusButton.querySelector('small').textContent = 'Session found. Right where you left it.';
  document.querySelector('#focus-status').textContent = 'Illustration: the matching session is highlighted.';
  focusTimer = setTimeout(() => {
    document.querySelector('.focus-art').classList.remove('activated');
    focusButton.querySelector('small').textContent = 'Preview session highlight';
  }, 4000);
});
// Each camera is an original composition. One visual persists across the story.
// x/y are viewport percentages, followed by scale, yaw, roll, opacity and line twist.
const desktopCameras = [
  [77,52,1,0,-12,.95,0], [70,51,1.22,52,12,.82,55],
  [76,50,.95,-35,-20,.65,105], [83,53,.8,65,10,.14,155],
  [76,52,.75,-15,0,.025,195], [75,52,.7,35,0,.02,235],
  [77,52,.8,-30,20,.025,275], [85,62,1.25,60,20,.12,315],
  [81,50,1.08,-35,-16,.28,360]
];
const mobileCameras = [
  [50,64,.73,0,-12,.9,0], [58,66,1.05,45,18,.74,55],
  [61,67,.9,-35,-18,.6,105], [88,61,.8,60,8,.07,155],
  [50,65,.7,0,0,.015,195], [50,65,.7,35,0,.015,235],
  [50,65,.7,-30,20,.015,275], [75,75,1.1,60,20,.075,315],
  [70,67,.9,-35,-16,.12,360]
];
function drawCamera(progress) {
  const cameras = innerWidth < 701 ? mobileCameras : desktopCameras;
  const i = Math.min(cameras.length - 2, Math.floor(progress));
  const t = smooth(0, 1, progress - i);
  const camera = cameras[i].map((value, n) => mix(value, cameras[i + 1][n], t));
  form.style.left = `${camera[0]}%`; form.style.top = `${camera[1]}%`;
  form.style.transform = `translate(-50%,-50%) perspective(1200px) scale(${camera[2]}) rotateY(${camera[3]}deg) rotateZ(${camera[4]}deg)`;
  form.style.opacity = camera[5];
  ellipses.forEach((ellipse, n) => {
    ellipse.setAttribute('rx', String(61 + n * 3.2 + Math.sin(progress * .7 + n * .12) * 8));
    ellipse.setAttribute('ry', String(180 + Math.sin(progress * .5) * 10));
    ellipse.setAttribute('transform', `rotate(${n * 5 + camera[6]} 250 250)`);
  });
}
function paint(progress) {
  const nextActive = clamp(Math.round(progress), 0, beats.length - 1);
  if (activeIndex !== nextActive) {
    activeIndex = nextActive; stopVoice();
    number.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(beats.length).padStart(2, '0')}`;
    scrollLabel.textContent = activeIndex === beats.length - 1 ? 'Keep asking why' : 'Scroll to continue';
    chapterLinks.forEach((link, i) => {
      if (i === Number(beats[activeIndex].dataset.chapter)) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  const mobile = innerWidth < 701;
  beats.forEach((beat, index) => {
    const local = progress - index;
    const enter = smooth(-.48, -.015, local);
    const exit = smooth(.17, .73, local);
    const alpha = enter * (1 - exit);
    const visualEnter = smooth(-.55, 0, local);
    const visualExit = smooth(.28, .85, local);
    const visualAlpha = visualEnter * (1 - visualExit);
    const drawn = alpha > .002 || visualAlpha > .002;
    beat.classList.toggle('is-drawn', drawn);
    beat.classList.toggle('is-active', index === activeIndex);
    beat.style.opacity = '1';
    beat.style.setProperty('--scene-opacity', String(alpha));
    beat.inert = index !== activeIndex;
    beat.setAttribute('aria-hidden', String(index !== activeIndex));
    if (!drawn) return;
    const copy = beat.querySelector('.beat-copy');
    const incoming = 1 - enter;
    const x = mobile ? 0 : exit * Math.min(innerWidth * .22, 310);
    const y = incoming * 75 + exit * (mobile ? innerHeight * .17 : -100);
    const z = -incoming * 260 - exit * 580;
    const scale = mix(.76, 1, enter) * mix(1, .3, exit);
    copy.style.transform = `perspective(1400px) translate3d(${x}px,${y}px,${z}px) scale(${scale}) rotateX(${incoming * -9 + exit * 12}deg)`;
    copy.style.opacity = String(alpha);
    const visual = beat.querySelector('.beat-visual');
    if (visual) {
      const incomingVisual = 1 - visualEnter;
      const visualScale = mix(.22, 1, visualEnter) * mix(1, .3, visualExit);
      visual.style.transform = `perspective(1200px) translate3d(${visualExit * -80}px,${incomingVisual * 170 - visualExit * 60}px,${-incomingVisual * 650 - visualExit * 250}px) scale(${visualScale}) rotateY(${incomingVisual * -22 + visualExit * 15}deg)`;
      visual.style.opacity = String(visualAlpha);
    }
  });
  progressFill.style.transform = `scaleX(${progress / (beats.length - 1)})`;
  drawCamera(progress);
}
function sample() {
  frame = 0;
  if (motionOff) return;
  target = clamp(scrollY / span, 0, beats.length - 1);
  if (Math.abs(target - Math.round(target)) * span < 2) target = Math.round(target);
  current += (target - current) * .23;
  if (Math.abs(target - current) < .0004) current = target;
  paint(current);
  if (current !== target) frame = requestAnimationFrame(sample);
}
function schedule() { if (!motionOff && !frame) frame = requestAnimationFrame(sample); }
function measure(preserve = true) {
  if (motionOff) return;
  const previous = current;
  span = stage.clientHeight * (innerWidth < 701 ? .91 : .94);
  track.style.height = `${stage.clientHeight + span * (beats.length - 1)}px`;
  if (preserve) scrollTo({ top: previous * span, behavior: 'instant' });
  current = target = clamp(scrollY / span, 0, beats.length - 1);
  if (Math.abs(target - Math.round(target)) * span < 2) target = Math.round(target); paint(current);
}
function staticIndex() {
  let best = 0, distance = Infinity;
  beats.forEach((beat, i) => { const d = Math.abs(beat.getBoundingClientRect().top - innerHeight * .2); if (d < distance) { distance = d; best = i; } });
  return best;
}
function setMode(value, initial = false) {
  const index = initial ? 0 : motionOff ? staticIndex() : activeIndex;
  motionOff = value; cancelAnimationFrame(frame); frame = 0; stopVoice();
  root.classList.toggle('cinematic', !value);
  motionButton.textContent = value ? 'Motion: off' : 'Motion: on';
  motionButton.setAttribute('aria-pressed', String(value));
  motionButton.setAttribute('aria-label', value ? 'Motion off. Enable fixed-stage presentation.' : 'Motion on. Switch to static page view.');
  if (value) {
    track.style.height = '';
    beats.forEach(beat => {
      beat.inert = false; beat.removeAttribute('aria-hidden'); beat.classList.remove('is-active', 'is-drawn'); beat.style.removeProperty('opacity');
      beat.querySelectorAll('.beat-copy,.beat-visual').forEach(element => { element.style.removeProperty('transform'); element.style.removeProperty('opacity'); });
    });
    if (!initial) requestAnimationFrame(() => beats[Math.max(0,index)].scrollIntoView({ behavior: 'instant', block: 'start' }));
  } else {
    measure(false);
    if (!initial) { current = target = Math.max(0,index); scrollTo({ top: current * span, behavior: 'instant' }); paint(current); }
  }
}
function navigate(hash, historyEntry = false) {
  const targetElement = document.getElementById(hash.slice(1));
  if (!targetElement) return;
  const beat = targetElement.closest('.beat') || beats[0];
  const index = beats.indexOf(beat);
  if (historyEntry) history.pushState(null, '', hash);
  if (motionOff) beat.scrollIntoView({ behavior: 'instant', block: 'start' });
  else {
    // Native scrolling remains the source of truth. Chapter jumps skip the long runway.
    scrollTo({ top: index * span, behavior: 'instant' });
    current = target = index; paint(index);
  }
  beat.tabIndex = -1; beat.focus({ preventScroll: true });
}
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const hash = link.getAttribute('href');
  if (!document.getElementById(hash.slice(1))) return;
  event.preventDefault(); navigate(hash, true);
}));
motionButton.addEventListener('click', () => setMode(!motionOff));
media.addEventListener('change', event => setMode(event.matches));
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', () => measure(), { passive: true });
addEventListener('popstate', () => navigate(location.hash || '#intro-scene'));
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopVoice(); cancelAnimationFrame(frame); frame = 0; } else schedule(); });
setMode(motionOff, true);
if (location.hash) requestAnimationFrame(() => navigate(location.hash));
