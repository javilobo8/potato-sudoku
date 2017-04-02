
const letters = 'abcdefghi'.split('');
const storeIds = _.range(9 * 9).map((i) => `${letters[i % 9]}-${Math.floor(i / 9)}`);

function createSudoku() {
  const index = _.random(0, sudokus.length - 1);
  const sudoku = sudokus[index][0];
  const result = sudoku.split('').map(Number);
  return result;
}

class Sudoku {
  constructor(store) {
    this.store = store;
    this.createGrid();
    this.draw();
    this.selectedBox = null;
    this.acceptedValues = _.range(1, 10).map(String).concat(' ');
    this.validation = {
      numbers: _.range(1, 10)
    };
    window.onkeypress = this.onKeyPress.bind(this);
    this.validate();
  }

  set(position, value) {
    this.store[position] = value;
    this.selectedValue = null;
    this.draw();
    this.validate();
    return this.store;
  }

  validate() {
    const store = this.store;
    const isValid = [
      this.rowValidation(store),
      this.colValidation(store)
    ].reduce((valid, next) => valid && next, true);
    document.getElementById('result').innerHTML = isValid ? 'VALID' : 'NOT VALID';
  }

  isValid(arr) { return _.isEqual(arr, _.range(1, 10)); }

  rowValidation(store) {
    return _
      .range(9)
      .fill(false)
      .map((valid, i) => this.isValid(store.slice(i * 9, i * 9 + 9).sort()))
      .reduce((valid, next) => valid && next, true);
  }

  colValidation(store) {
    return _
      .range(9)
      .fill(false)
      .map((valid, i) => this.isValid(_.range(9).map((j) => store[i + (9 * j)]).sort()))
      .reduce((valid, next) => valid && next, true);
  }

  getPosition(id) { return storeIds.indexOf(id); }

  onKeyPress(event) {
    if (this.selectedBox) {
      let key = event.key;
      if (this.acceptedValues.includes(key)) {
        document.getElementById(this.selectedBox).style.background = '#FFF';
        if (key === ' ') key = 0;
        const position = this.getPosition(this.selectedBox);
        this.set(position, parseInt(key));
        this.selectedBox = null;
      }
    }
  }

  onCellClick(event) {
    if (this.selectedBox) document.getElementById(this.selectedBox).style.background = '#FFF';
    document.getElementById(event.target.id).style.background = '#CCC';
    this.selectedBox = event.target.id;
  }

  createGrid() {
    const CELL_BORDER = 1;
    const CELL_W = 40;
    const CELL_H = 40;
    const ROOT_W = 9 * CELL_W + CELL_BORDER * 6;
    const ROOT_H = 9 * CELL_H + CELL_BORDER * 6;
    const root = document.getElementById('suduku-grid');
    root.style.width = ROOT_W + 'px';
    root.style.height = ROOT_H + 'px';
    this.store.forEach((value, i) => {
      var cell = document.createElement('div');
      cell.id = storeIds[i];
      cell.className = 'sudoku-cell';
      cell.onclick = this.onCellClick.bind(this);
      cell.style.width = CELL_W + 'px';
      cell.style.height = CELL_H + 'px';
      cell.style.lineHeight = CELL_H + 'px';
      if ((i + 1) % 3 === 0 && ((i + 1) % 9 !== 0)) {
        cell.style.marginRight = '1px';
      }
      if ((Math.floor(i / 9) + 1) % 3 === 0 && ((Math.floor(i / 9) + 1) % 9 !== 0)) {
        cell.style.marginBottom = '1px';
      }
      root.append(cell);
    });
  }

  draw() {
    this.store.forEach((value, i) => {
      document.getElementById(storeIds[i]).textContent = value || '';
    })
  }
}

const game = new Sudoku(createSudoku());