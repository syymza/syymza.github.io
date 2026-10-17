(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const folio = document.querySelector('.folio');
  const buttons = [...document.querySelectorAll('[data-select]')];
  const panels = {builder: document.querySelector('#builder-panel'), leader: document.querySelector('#leader-panel')};
  document.querySelector('.study-control').hidden = false;
  document.querySelector('.replay').hidden = false;
  let running = [];
  function settle() {
    running.forEach(animation => animation.cancel()); running = [];
    if (reduce.matches) return;
    folio.querySelectorAll('.sheet:not([hidden])').forEach((sheet, i) => {
      const transform = getComputedStyle(sheet).transform;
      running.push(sheet.animate([
        {transform: `translateY(${22 + i * 11}px) rotate(${i % 2 ? 9 : -13}deg)`, opacity: .15},
        {transform, opacity: 1}
      ], {duration: 950, delay:i * 65, easing:'cubic-bezier(.16,1,.3,1)'}));
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const side = button.dataset.select;
    if (folio.dataset.side === side) return;
    folio.dataset.side = side;
    Object.entries(panels).forEach(([name, panel]) => panel.hidden = name !== side);
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    if (!reduce.matches) running.push(panels[side].animate([
      {transform:'translateY(12px) rotate(1.5deg)',opacity:0},
      {transform:getComputedStyle(panels[side]).transform,opacity:1}
    ], {duration:480,easing:'cubic-bezier(.16,1,.3,1)'}));
  }));
  document.querySelector('.replay').addEventListener('click', settle);
  reduce.addEventListener('change', () => { if(reduce.matches) running.forEach(animation=>animation.cancel()); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('arriving');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: .14});
    document.querySelectorAll('.reveal').forEach(element => {
      if (!reduce.matches) element.classList.add('arriving');
      observer.observe(element);
    });
  }
  settle();
})();
