import { animate } from 'motion/mini';

document.querySelectorAll<HTMLElement>('[data-workbench]').forEach((bench) => {
  const radios = bench.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  const dot = bench.querySelector<SVGCircleElement>('.request-dot');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animation: ReturnType<typeof animate> | undefined;

  function update(shouldAnimate: boolean) {
    animation?.stop();
    // Keep text available unless the complete behavior has initialized.
    const choice = bench.querySelector<HTMLInputElement>('input:checked')?.value ?? 'one';
    bench.querySelectorAll<HTMLElement>('[data-explanation]').forEach((panel) => {
      panel.hidden = panel.dataset.explanation !== choice;
    });
    bench.dataset.enhanced = 'true';
    if (!dot) return;
    dot.style.transform = 'translateX(0px)';
    dot.style.opacity = '1';
    if (shouldAnimate && !reduced.matches) {
      animation = animate(dot, { transform: ['translate(0px, 0px)', 'translate(329px, 0px)', 'translate(329px, 118px)', 'translate(62px, 118px)'], opacity: [1, 1, 1, 0] }, { duration: 0.9, ease: 'easeInOut' });
      void animation.then(() => { dot.style.transform = 'translateX(0px)'; dot.style.opacity = '1'; });
    }
  }
  radios.forEach((radio) => radio.addEventListener('change', () => update(true)));
  reduced.addEventListener('change', () => update(false));
  update(false);
});
