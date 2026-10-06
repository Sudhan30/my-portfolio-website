// Play each homepage illustration's arrival once when its card scrolls into
// view, and again when a pointer enters the card. The CSS owns the motion and
// skips it entirely under reduced motion; without this script the art is simply static.
const arts = document.querySelectorAll<SVGSVGElement>('.work-art[data-preview]');

function play(art: SVGSVGElement) {
  art.classList.remove('is-playing');
  void art.getBoundingClientRect();
  art.classList.add('is-playing');
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      play(entry.target as SVGSVGElement);
    });
  }, { threshold: 0.5 });
  arts.forEach((art) => observer.observe(art));
}

arts.forEach((art) => {
  art.closest('article')?.addEventListener('pointerenter', (event) => {
    if ((event as PointerEvent).pointerType === 'mouse') play(art);
  });
});
