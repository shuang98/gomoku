class Game {
  X = 'x';
  O = 'o';
  EMPTY = '0';
  constructor(boardSize, boxSize) {
    this.boardSize = boardSize;
    this.boxSize = boxSize;
    this.worldSize = this.boardSize * this.boxSize;
    this.board = new Array(this.boardSize).fill(0).map(
      () => new Array(this.boardSize).fill(this.EMPTY)
    );
    this.turn = this.X;
    this.onFinished = (winner) => {};
    this.finished = false;
  }

  /**
   * Select square and advance to the other player's turn.
   * @param {number} row row of square selected
   * @param {number} col col of square selected
   */
  selectSquare(row, col) {
    this.board[row][col] = this.turn;
    if (this.isFiveInARow(row, col)) {
      this.finished = true;
      this.onFinished(this.turn);
    }
    this.turn = this.turn == this.X ? this.O : this.X
  }

  /**
   * Checks if tile at (row, col) is part of a 5 in a row.
   * @param {number} row row of tile to be checked
   * @param {number} col col of tile to be checked
   */
  isFiveInARow(row, col) {
    let board = this.board;
    if (board[row][col] === this.EMPTY) {
      return false;
    }
    let i, j, count;
    //vertical
    i = row + 1, j = col, count = 0;
    while (i < this.boardSize && board[i][j] === board[row][col])
      i++, count++;
    i = row - 1;
    while (i >= 0 && board[i][j] === board[row][col])
      i--, count++;
    if (count == 4)
      return true;
    //horizontal
    i = row, j = col + 1, count = 0;
    while (j < this.boardSize && board[i][j] === board[row][col])
      j++, count++;
    j = col - 1;
    while (j >= 0 && board[i][j] === board[row][col])
      j--, count++;
    if (count == 4)
      return true;
    //diagonal
    i = row + 1, j = col + 1, count = 0;
    while (i < this.boardSize && j < this.boardSize && board[i][j] === board[row][col])
      j++, i++, count++;
    i = row - 1, j = col - 1;
    while (i >= 0 && j >= 0 && board[i][j] === board[row][col])
      i--, j--, count++;
    if (count == 4)
      return true;
    i = row - 1, j = col + 1, count = 0;
    while (i >= 0 && j < this.boardSize && board[i][j] === board[row][col])
      j++, i--, count++;
    i = row + 1, j = col - 1;
    while (i < this.boardSize && j >= 0 && board[i][j] === board[row][col])
      i++, j--, count++;
    if (count == 4)
      return true;
    return false;
  }
}

export default Game;