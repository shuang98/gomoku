import { clamp } from "./lib/utils";
import mouseListener from "./lib/mouse-listener";
import * as PIXI from 'pixi.js'

const EMPTY = '0',
  X = 'x',
  O = 'o';
const HOLO_ALPHA = 0.25;

class Game {
  constructor({ boardSize, boxSize, viewport, app }) {
    this.boardSize = boardSize;
    this.boxSize = boxSize;
    this.worldSize = boardSize * boxSize;
    this.viewport = viewport;
    this.app = app;
    // gameState
    this.gameState = {
      board: new Array(this.boardSize).fill(0).map(
        () => new Array(this.boardSize).fill(EMPTY)
      ), // 2D array of X, O, or EMPTY
      turn: EMPTY //
    };
    // cursorSprite
    this.cursorSprite = null;
    // mouseListener
    this.mouse = mouseListener();
    //
    this.viewContainer = new PIXI.Container();
  }

  /**
   * Gets the load function to be passed in to PIXI.Loader.load
   * @returns {Function} load function
   */
  getLoadFunction() { return (loader, resources) => {} }

  // helpers below 
  /**
   * @returns {PIXI.Graphics} Graphics object for the gomoku grid.
   */
  grid() {
    let graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xDDDDDD, 1);
    for (let i = 0; i <= this.boardSize; i++) {
      graphics.moveTo(i * this.boxSize, 0);
      graphics.lineTo(i * this.boxSize, this.worldSize);
      graphics.moveTo(0, i * this.boxSize);
      graphics.lineTo(this.worldSize, i * this.boxSize);
    }
    return graphics;
  }

  /**
   * Gets X or O sprite based on texture
   * @param {PIXI.Texture} texture 
   * @param {number} alpha
   */
  getXOSprite(texture, alpha = 1) {
    let sprite = new PIXI.Sprite(texture);
    sprite.alpha = alpha;
    sprite.width = this.boxSize;
    sprite.height = this.boxSize;
    return sprite;
  }

  /**
   * updates cursorSprite location based on mouse position
   */
  updateCursorSpriteToMouse() {
    let cursor = this.viewport.toWorld(new PIXI.Point(this.mouse.x, this.mouse.y));
    cursor.x = Math.floor(cursor.x / this.boxSize) * this.boxSize;
    cursor.y = Math.floor(cursor.y / this.boxSize) * this.boxSize;
    cursor.x = clamp(cursor.x, 0, this.worldSize - this.boxSize);
    cursor.y = clamp(cursor.y, 0, this.worldSize - this.boxSize);
    let col = Math.floor(cursor.x / this.boxSize);
    let row = Math.floor(cursor.y / this.boxSize);
    this.cursorSprite.position = cursor;
    if (this.gameState.board[row][col] === EMPTY) {
      this.cursorSprite.alpha = HOLO_ALPHA;
    } else {
      this.cursorSprite.alpha = 0;
    }
  }

  /**
   * Checks if tile at (row, col) is part of a 5 in a row.
   * @param {number} row row of tile to be checked
   * @param {number} col col of tile to be checked
   */
  isFiveInARow(row, col) {
    let board = this.gameState.board;
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

export class ClientOnlyGame extends Game {
  constructor(options) {
    super(options);
    this.sprites = {}
    this.loop = this.loop.bind(this);
  }

  getLoadFunction() {
    return (loader, resources) => {
      this.mouse.listen();
      this.mouse.onDown = (event) => {
        event.preventDefault();
        let col = Math.floor(this.cursorSprite.x / this.boxSize);
        let row = Math.floor(this.cursorSprite.y / this.boxSize);
        if (this.gameState.board[row][col] === EMPTY && event.button == 0) {
          this.onSquareSelected(row, col, resources);
        }
      };
      this.viewContainer.addChild(this.grid());
      this.setup(loader, resources);
      this.viewport.addChild(this.viewContainer);
      this.app.ticker.add(this.loop);
    }
  }

  onSquareSelected(row, col, resources) {
    this.gameState.board[row][col] = this.gameState.turn;
    let texture = resources[this.gameState.turn].texture;
    let sprite = this.getXOSprite(texture);
    sprite.position = this.cursorSprite.position;
    this.viewContainer.addChild(sprite);
    this.viewContainer.removeChild(this.cursorSprite);
    if (this.isFiveInARow(row, col)) {
      this.endGame();
      return;
    }
    this.cursorSprite = (this.gameState.turn === X) ? this.sprites.holoO : this.sprites.holoX
    this.viewContainer.addChild(this.cursorSprite);
    this.gameState.turn = (this.gameState.turn === X) ? O : X;
  }

  setup(loader, resources) {
    // holo sprite initialization
    let holoX = this.getXOSprite(resources.x.texture, HOLO_ALPHA);
    let holoO = this.getXOSprite(resources.o.texture, HOLO_ALPHA);
    this.sprites.holoO = holoO;
    this.sprites.holoX = holoX
    this.viewContainer.addChild(holoX);
    // current game initialization
    this.gameState.turn = X;
    this.cursorSprite = holoX;
  }

  loop() {
    this.updateCursorSpriteToMouse();
  }

  endGame() {
    this.mouse.stop();
    this.app.ticker.remove(this.loop);
  }
}

export class ClientToClientGame extends Game {}