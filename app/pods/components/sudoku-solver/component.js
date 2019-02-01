import Component from '@ember/component';
//(1) If a square has only one possible value, then eliminate that value from the square's peers. 
//(2) If a unit has only one possible place for a value, then put the value there.

export default Component.extend({
  a1: 9,
  a2: 6,
  a4: 3,
  a5: 7,
  a8: 1,

  b1: 1,
  b2: 8,
  b3: 5,
  b4: 4,
  b5: 2,
  b6: 9,
  b7: 7,
  b8: 6,

  c2: 7,
  c6: 1,
  c9: 8,

  d2: 3,
  d3: 1,
  d7: 6,
  d9: 2,

  e3: 9,
  e5: 5,
  e7: 8,
  e9: 1,

  f3: 7,
  f6: 3,
  f8: 4,
  f9: 9,

  g3: 6,
  g6: 2,

  h3: 8,
  h4: 7,
  h6: 5,
  h8: 9,
  h9: 6,

  i1: 7,
  i2: 5,
  i8: 8,

  grid: null,
  alphaRange: 'abcdefghi'.split(''),
  numberRange: new Array(9).fill('').map((_, i) => i + 1),

  setGrid() {
    const grid = {};
    this.alphaRange.forEach(letter => {
      this.numberRange.forEach(num => {
        const point = `${letter}${num}`;
        const value = this.get(point);
        grid[point] = value ? `${value}` : this.numberRange.join('');
      });
    });
    this.setProperties({grid});
  },

  getSlice(row) {
    return Object.keys(this.grid)
      .filter(k => k.match(row))
      .map(k => this._formatKeyValue(k));
  },

  _formatKeyValue(key) {
    return {key, value: this.grid[key]};
  },

  getBlock(position) {
    const [alpha, numberString] = position.split('');

    return this._gridRowsForY(alpha)
      .reduce((acc, letter) => {
        this._gridColumnsForX(Number(numberString))
          .forEach(num => acc.push(this._formatKeyValue(`${letter}${num}`)));
        return acc;
      }, []);
  },

  _gridColumnsForX(x) {
   if(x <= 3) {
      return [1, 2, 3];
    } else if(x >= 7) {
      return [7, 8, 9];
    } else {
      return [4, 5, 6];
    } 
  },

  _gridRowsForY(y) {
    if(y == 'a' || y == 'b' || y == 'c') {
      return ['a', 'b', 'c'];
    } else if(y == 'd' || y == 'e' || y == 'f') {
      return ['d', 'e', 'f'];
    } else {
      return ['g', 'h', 'i'];
    }
  },

  actions: {
    onSolve() {
      this.setGrid();
    },

    updateGridValue(key, value) {
      this.set(key, value);
    },
  } 
});
