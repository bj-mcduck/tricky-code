import Component from '@ember/component';

export default Component.extend({
  //props
  products: null,

  tier1: null,
  tier2: null,
  tier3: null,

  didInsertElement() {
    this._super(...arguments);

    this.setProperties({
      tier1: this.products.slice(0, 10),
      tier2: this.products.slice(10, 20),
      tier3: this.products.slice(20, 30),
    });
  },

});
