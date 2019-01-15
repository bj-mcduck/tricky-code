import Component from '@ember/component';
import {next} from '@ember/runloop';

export default Component.extend({
  //props
  products: null,
  speed: 1,

  //state
  rowOffset: 0,
  _products: null,
  isAnimating: false,

  didInsertElement() {
    this._super(...arguments);
    this._initAnimation();
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if(!this.isAnimating) {
      this._initAnimation();
    }
  },

  _initAnimation() {
    if(this.products) {
      this.set('_products', this.products.slice());
      next(() => this.moveRow());
    }
  },

  moveRow() {
    const firstProduct = document.querySelector(`#${this.componentId} > div`);
    if(this.isDestroyed || !firstProduct) { return; }
    const productWidth =  firstProduct.offsetWidth;
    let rowOffset = this.rowOffset + this.speed;
    const properties = {rowOffset};

    if(!this.isAnimating) {
      properties.isAnimating = true;
    }

    if(rowOffset >= productWidth) {
      const products = this._products.slice();
      products.push(products.shift());
      properties._products = products;
      properties.rowOffset = 0;
    }

    this.setProperties(properties);
    requestAnimationFrame(this.moveRow.bind(this));
  },
});
