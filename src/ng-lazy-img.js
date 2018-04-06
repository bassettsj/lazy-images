/* global angular */
import lazyImg from './lazy-img';

export default angular.module('lazy-img', [])
  .directive('lazyImg', () => ({
    restrict: 'A',
    link(scope, element, attrs) {
      const el = element[0];
      if (!(el instanceof HTMLImageElement)) throw new Error('Must be used with an image element');
      attrs.$observe('lazySrc', (newSrc) => {
        lazyImg(el, newSrc);
      });
    },
  }));
