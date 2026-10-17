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
    focusButton.querySelector('small').textContent = 'Click to explore the idea';
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
