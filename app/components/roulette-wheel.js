import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { later } from '@ember/runloop';

export default Component.extend({
  classNames: 'roulettewheel',

  numberOfSlots: 25,
  timesToSpin: 3,
  chosenSlot: 0,
  backgroundOffset: 0,
  slotWidthInPixels: 100,

  /**
   * Adds a one-slot offset without changing the stored value so that
   * the chosen slot lines up in the middle rather than the left.
   */
  backgroundStyle: computed('backgroundOffset', function() {
    const offset = this.get('backgroundOffset') + this.get('slotWidthInPixels');

    return htmlSafe(`background-position: ${offset}px;`);
  }),

  _newRandomSlot() {
    return Math.ceil(Math.random() * this.get('numberOfSlots'));
  },

  _newOffsetForSlot(chosenSlot) {
    const oldSlot = this.get('chosenSlot');
    const numberOfSlots = this.get('numberOfSlots');
    const slotWidthInPixels = this.get('slotWidthInPixels');
    const oldOffset = this.get('backgroundOffset');

    const slotsLeftToBalance = (numberOfSlots - oldSlot) * slotWidthInPixels;
    const amountToSpin = numberOfSlots * this.get('timesToSpin') * slotWidthInPixels;
    const newOffset = chosenSlot * slotWidthInPixels;

    return oldOffset - (newOffset + amountToSpin + slotsLeftToBalance);
  },

  actions: {
    spin() {
      const chosenSlot = this._newRandomSlot();
      const backgroundOffset = this._newOffsetForSlot(chosenSlot);

      this.setProperties({
        chosenSlot,
        backgroundOffset,
        displayedResult: null
      });

      later(_ => {
        this.set('displayedResult', chosenSlot);
      }, 6000);
    }
  }
});
