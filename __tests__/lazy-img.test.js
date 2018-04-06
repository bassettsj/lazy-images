import lazyImg from '../src/lazy-img';

describe('Lazy Image Vanilla Implementation', () => {
  let img;
  const src = 'http://example.com/img.png';
  beforeEach(() => {
    img = document.createElement('img');
  });
  describe('Execpections', () => {
    it('throws an error when not called with an image element', () => {
      expect(() => lazyImg()).toThrowErrorMatchingSnapshot();
    });
    it('throws an error when it is not called with a src string', () => {
      expect(() => lazyImg(img)).toThrowErrorMatchingSnapshot();
    });
    it('throws an error when given an emptry string', () => {
      expect(() => lazyImg(img, '')).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Loading without an intersection observer', () => {
    let original;
    beforeEach(() => {
      original = window.requestAnimationFrame;
      jest.useFakeTimers();
      window.requestAnimationFrame = jest.fn((cb) => { cb(); });
    });
    afterEach(() => {
      window.requestAnimationFrame = original;
      jest.useRealTimers();
    });
    it('should call set timeout when the IntesectionObserver is not supported', () => {
      expect(window).not.toHaveProperty('IntersectionObserver');
      lazyImg(img, src);
      expect(img.src).not.toBe(src);
      jest.advanceTimersByTime(500);
      expect(img.src).toBe(src);
      expect(requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Loading with intersection observer', () => {
    let original;
    let isIntersecting;
    let io;
    beforeEach(() => {
      original = window.IntersectionObserver;
      isIntersecting = false;
      window.IntersectionObserver = jest.fn((cb) => {
        io = {
          disconnect: jest.fn(),
          observe: jest.fn(() => {
            setTimeout(() => {
              cb([{ isIntersecting }]);
            }, 200);
          }),
        };
        return io;
      });
      jest.useFakeTimers();
    });
    afterEach(() => {
      window.IntersectionObserver = original;
      jest.useRealTimers();
    });

    it('should not set the src when the observe returns the it is not intersecting', () => {
      lazyImg(img, src);
      expect(IntersectionObserver).toHaveBeenCalled();
      expect(io.observe).toHaveBeenCalledWith(img);
      jest.advanceTimersByTime(500);
      expect(io.disconnect).not.toHaveBeenCalled();
    });

    it('should set the src when the observe returns the it is not intersecting', () => {
      isIntersecting = true;
      lazyImg(img, src);
      expect(IntersectionObserver).toHaveBeenCalled();
      expect(io.observe).toHaveBeenCalledWith(img);
      jest.advanceTimersByTime(500);
      expect(io.disconnect).toHaveBeenCalled();
      expect(img.src).toBe(src);
    });
  });
});
