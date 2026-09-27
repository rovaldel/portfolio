export {};

const showFallback = (image: HTMLImageElement) => {
  image.hidden = true;
  const fallback = image
    .closest<HTMLElement>('[data-image-frame]')
    ?.querySelector<HTMLElement>('[data-image-fallback]');
  if (fallback) fallback.hidden = false;
};

for (const image of document.querySelectorAll<HTMLImageElement>('[data-stable-image]')) {
  if (image.complete && image.naturalWidth === 0) showFallback(image);
}

document.addEventListener(
  'error',
  (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement && target.matches('[data-stable-image]')) {
      showFallback(target);
    }
  },
  true,
);
