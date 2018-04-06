export default function lazyImgs(img, src) {
  const isImageElement = img instanceof HTMLImageElement;
  const hasSrc = typeof src === 'string' && src.length > 0;
  const hasIntersectionObserver = ('IntersectionObserver' in window);
  if (!isImageElement) throw new TypeError('Must be called with HTMLImageElement');
  if (!hasSrc) throw new TypeError('Must be called with src');
  if (hasIntersectionObserver) {
    const io = new IntersectionObserver((data) => {
      if (data[0].isIntersecting) {
        io.disconnect();
        img.setAttribute('src', src);
      }
    });
    io.observe(img);
  } else {
    setTimeout(() => {
      requestAnimationFrame(() => {
        img.setAttribute('src', src);
      });
    }, 300);
  }
}
