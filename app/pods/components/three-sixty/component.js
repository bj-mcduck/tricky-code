import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  images: null,
  cachedImages: null,
  currentImageIndex: 0,
  sliderRotation: 0,
  preloadImageIndex: 0,
  isDragging: false,
  dragValue: null,

  currentImage: computed('currentImageIndex', 'images.[]', function() {
    return (this.images || []).objectAt(this.currentImageIndex);
  }),

  didInsertElement() {
    this._super(...arguments);

    if(this.images.length) {
      this.setProperties({
        images: this.images.sortBy('position').reverse(), // reverse means the images rotate with the slider direction
        cachedImages: []
      });
      this._preloadImage();
    }

    this._endScoped = this._end.bind(this);
  },

  _preloadImage() {
    if(this.isDestroyed) { return; }

    const preloadImage = new Image();
    const index = this.preloadImageIndex;
    const image = this.images.objectAt(index);

    if(index < this.images.length) {
      this.set('preloadImageIndex', this.preloadImageIndex + 1);
      preloadImage.onload = this._preloadImage.bind(this);
    }

    if(image) {
      preloadImage.src = image['large'];
      this.cachedImages.pushObject(image);
    }
  },

  _end() {
    this.set('isDragging', false);

    document.removeEventListener('mouseup', this._endScoped);
    document.removeEventListener('touchend', this._endScoped);
  },

  _updateValueOfMouseEvent(e) {
    const offsetX = getOffsetXOnTargetFromEvent(e);

    let percent = (offsetX / e.target.clientWidth) * 100;
    percent = Math.min(100, Math.max(0, percent)); // need min/max for iOS

    this.updateImageRotation(percent);
  },

  updateImageRotation(sliderRotation) {
    this.setProperties({sliderRotation});
    const newImage = new Image();
    const segmentValue = 100 / this.images.length;
    const currentIndex = () => this.sliderRotation >= 100
      ? this.images.length - 1
      : Math.floor(this.sliderRotation / segmentValue);

    const imageIndex = currentIndex();
    const imageUrl = this.images.objectAt(imageIndex)['large'];

    newImage.onload = () => {
      if(newImage.complete && this.isDragging && imageIndex === currentIndex()) {
        this.set('currentImageIndex', imageIndex);
      }
    };

    newImage.src = imageUrl;
  },

  actions: {
    handleStart(e) {
      e.preventDefault();

      // Bind our drag release handlers
      document.addEventListener('mouseup', this._endScoped);
      document.addEventListener('touchend', this._endScoped);

      this.set('isDragging', true);

      this._updateValueOfMouseEvent(e);
    },

    handleMove(e) {
      e.preventDefault();

      if(!this.get('isDragging')) {
        return;
      }

      this._updateValueOfMouseEvent(e);
    },
  }
});

const getOffsetXOnTargetFromEvent = e => {
  // layerX is non-standard https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/layerX
  // So we provide a fallback after this..
  if(e.hasOwnProperty('layerX')) {
    return e.layerX; // <= offset on target (can be negative on iOS)
  }

  const clientX = e.clientX
    || (e.targetTouches && e.targetTouches[0] && e.targetTouches[0].clientX); // Found that on Androids the event passed is a `TouchEvent`

  // Adapted from https://stackoverflow.com/a/10816667
  let el = e.target;
  let x = 0;

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    el = el.offsetParent;
  }

  return clientX - x;
};
