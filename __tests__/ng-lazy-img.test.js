import 'angular';
import 'angular-mocks';
import ngLazyImg from '../src/ng-lazy-img';
import lazyImg from '../src/lazy-img';

jest.mock('../src/lazy-img');

describe('Lazy Images Angular directive', () => {
  let $compile;
  let $rootScope;
  const src = 'https://example.com/logo.png';
  beforeEach(window.module(ngLazyImg.name));

  beforeEach(window.inject((_$rootScope_, _$compile_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should observe the lazy src attribute', () => {
    const el = $compile(`<img lazy-img lazy-src="${src}"/>`)($rootScope);
    expect(el).toMatchSnapshot();
    expect(lazyImg).not.toHaveBeenCalled();
    $rootScope.$apply();
    expect(lazyImg).toHaveBeenCalled();
  });

  it('should throw an error when it called on another element', () => {
    const fn = () => {
      $compile(`<p lazy-img lazy-src="${src}"/>`)($rootScope);
    };
    expect(fn).toThrowErrorMatchingSnapshot();
  });
});
