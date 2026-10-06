import { animate } from 'motion/mini';

// The shared runtime for every playable figure on a story page.
//
// A figure supplies one `render` function that draws a scenario. `render` must
// leave the figure in that scenario's final state whether or not it animates,
// because the same call serves reduced motion, keyboard changes, and the first
// paint. Motion only explains how the figure gets there.

type Keyframes = Parameters<typeof animate>[1];
type Options = Parameters<typeof animate>[2];

export interface Run {
  /** The scenario the visitor chose. */
  choice: string;
  /** False under reduced motion and on the first silent paint. */
  animate: boolean;
  /** False once a newer run has started; long sequences check it between steps. */
  alive(): boolean;
  /** Resolves after `ms` when animating, at once otherwise. */
  wait(ms: number): Promise<void>;
  /** Animates when allowed, otherwise jumps straight to the last keyframe. */
  tween(target: Element | Element[], keyframes: Keyframes, options?: Options): Promise<void>;
}

export const ease = [0.16, 1, 0.3, 1] as const;

export function q<T extends Element = SVGElement>(root: ParentNode, selector: string): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`figure is missing ${selector}`);
  return found;
}

export function qa<T extends Element = SVGElement>(root: ParentNode, selector: string): T[] {
  return [...root.querySelectorAll<T>(selector)];
}

export function setText(el: Element, text: string) {
  if (el.textContent !== text) el.textContent = text;
}

export function playable(kind: string, render: (root: HTMLElement, run: Run) => void | Promise<void>) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>(`[data-playable="${kind}"]`).forEach((root) => {
    const radios = root.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    const replay = root.querySelector<HTMLButtonElement>('[data-replay]');
    let generation = 0;
    let running: ReturnType<typeof animate>[] = [];

    function start(shouldAnimate: boolean, forced?: string) {
      const mine = ++generation;
      running.forEach((animation) => animation.stop());
      running = [];
      if (forced) radios.forEach((radio) => { radio.checked = radio.value === forced; });
      const choice = forced ?? root.querySelector<HTMLInputElement>('input[type="radio"]:checked')?.value ?? root.dataset.default ?? '';
      root.querySelectorAll<HTMLElement>('[data-explanation]').forEach((panel) => {
        panel.hidden = panel.dataset.explanation !== choice;
      });
      root.dataset.choice = choice;
      root.dataset.enhanced = 'true';
      const moving = shouldAnimate && !reduced.matches;
      const run: Run = {
        choice,
        animate: moving,
        alive: () => mine === generation,
        wait: (ms) => (moving ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve()),
        tween(target, keyframes, options) {
          if (mine !== generation) return Promise.resolve();
          const animation = animate(target as Element, keyframes, moving ? { ease: [...ease], duration: 0.5, ...options } : { ...options, duration: 0, delay: 0 });
          running.push(animation);
          return animation.then(() => undefined, () => undefined);
        },
      };
      void render(root, run);
    }

    radios.forEach((radio) => radio.addEventListener('change', () => start(true)));
    replay?.addEventListener('click', () => start(true, root.dataset.choice));
    // A figure's own controls choose a chipless panel through choose().
    root.addEventListener('play:choose', (event) => start((event as CustomEvent<{ animate: boolean }>).detail.animate, (event as CustomEvent<{ id: string }>).detail.id));
    reduced.addEventListener('change', () => start(false, root.dataset.choice));
    start(false);

    // Play the opening scenario once, the first time most of it is on screen.
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start(true, root.dataset.choice);
      }, { threshold: 0.45 });
      observer.observe(root.querySelector('.play-stage') ?? root);
    }
  });
}

/** Switch a figure to a scenario or chipless panel from its own controls. */
export function choose(root: HTMLElement, id: string, animate = true) {
  root.dispatchEvent(new CustomEvent('play:choose', { detail: { id, animate } }));
}
