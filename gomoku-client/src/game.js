import { Room } from "colyseus.js";
import { MSG_TYPES } from "./lib/constants";
import store from "./store";
import { setTurn } from "./actions";
import { X, O, EMPTY } from "./lib/constants";

export class Game {
  X = 'x';
  O = 'o';
  EMPTY = '0';
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = new Array(this.boardSize).fill(0).map(
      () => new Array(this.boardSize).fill(EMPTY)
    );
    this.turn = X;
    store.dispatch(setTurn(this.turn));
    this.onFinished = (winner) => {};
    this.finished = false;
  }

  getBoardSquare(row, col) {
    return this.board[row][col];
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
    this.turn = this.turn == X ? O : X
    store.dispatch(setTurn(this.turn));
  }

  /**
   * Checks if tile at (row, col) is part of a 5 in a row.
   * @param {number} row row of tile to be checked
   * @param {number} col col of tile to be checked
   */
  isFiveInARow(row, col) {
    let board = this.board;
    if (board[row][col] === EMPTY) {
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
    if (count >= 4)
      return true;
    //horizontal
    i = row, j = col + 1, count = 0;
    while (j < this.boardSize && board[i][j] === board[row][col])
      j++, count++;
    j = col - 1;
    while (j >= 0 && board[i][j] === board[row][col])
      j--, count++;
    if (count >= 4)
      return true;
    //diagonal
    i = row + 1, j = col + 1, count = 0;
    while (i < this.boardSize && j < this.boardSize && board[i][j] === board[row][col])
      j++, i++, count++;
    i = row - 1, j = col - 1;
    while (i >= 0 && j >= 0 && board[i][j] === board[row][col])
      i--, j--, count++;
    if (count >= 4)
      return true;
    i = row - 1, j = col + 1, count = 0;
    while (i >= 0 && j < this.boardSize && board[i][j] === board[row][col])
      j++, i--, count++;
    i = row + 1, j = col - 1;
    while (i < this.boardSize && j >= 0 && board[i][j] === board[row][col])
      i++, j--, count++;
    if (count >= 4)
      return true;
    return false;
  }
}

export class OnlineGame {
  X = 'x';
  O = 'o';
  EMPTY = '0';
  /**
   * 
   * @param {Room} room 
   */
  constructor(boardSize, room) {
    this.room = room;
    this.boardSize = boardSize;
    this.room.state.onChange = (changes) => {
      for (const {field, value} of changes) {
        if (field == "turn") {
          store.dispatch(setTurn(value));
        }
      }
    }
    store.dispatch(setTurn(X));
  }

  get turn() {
    return this.room.state.turn;
  }

  getBoardSquare(row, col) {
    let index = row * this.boardSize + col
    return this.room.state.board[index];
  }

  selectSquare(row, col) {
    this.room.send({
      action: MSG_TYPES.SELECT_SQUARE,
      payload: { row, col }
    });
  }
}