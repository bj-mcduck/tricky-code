import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  value: null,
  onChange() {}, 

  actions: {
    handleOnChange(e) {
      const value = Number(e.target.value);
      if(value <= 9 && value > 0) {
        this.onChange(value);
      } else if(value == 0) {
        this.onChange(null);
        e.target.value = null;
      } else {
        e.target.value = this.value;
      }
    },
  }
});
