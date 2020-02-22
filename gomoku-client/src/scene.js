import * as PIXI from 'pixi.js'
import { clamp } from "./lib/utils";
import Game from "./game";

class Scene {
  constructor(app, viewport) {
    this.app = app;
    this.viewport = viewport;
    this.viewContainer = new PIXI.Container();
    this.tickerFunctions = {};
    this.sceneLoadFunction = this.sceneLoadFunction.bind(this);
  }

  /**
   * Scene load function that initializes scene
   * @param {*} loader 
   * @param {*} resources 
   */
  sceneLoadFunction(loader, resources) {
    this.viewport.addChild(this.viewContainer);
    this.loader = loader;
    this.resoures = resources;
  }

  /**
   * Calls endScene and transitions to new scene.
   * @param {Scene} newScene scene to be transitioned to.
   */
  transitionToScene(newScene) {
    this.endScene();
    newScene.sceneLoadFunction(this.loader, this.resources);
  }

  /**
   * Add ticker function to scene
   * @param {Function} ticker ticker callback function
   * @param {string} id ticker id
   */
  addTickerFunction(ticker, id) {
    this.tickerFunctions[id] = ticker;
    this.app.ticker.add(ticker);
  }

  /**
   * Remove ticker funtion from scene
   * @param {string} id ticker id
   */
  removeTickerFunction(id) {
    this.app.ticker.remove(this.tickerFunctions[id]);
    delete this.tickerFunctions[id];
  }

  /**
   * Ends the scene
   */
  endScene() {
    this.viewport.removeChild(this.viewContainer);
    for (const id in this.tickerFunctions) {
      this.removeTickerFunction(id);
    }
  }
}

export class GameScene extends Scene {
  HOLO_ALPHA = 0.25
  constructor(app, viewport, mouse) {
    super(app, viewport);
    this.mouse = mouse;
    this.boardSize = 19;
    this.boxSize = 40;
    this.worldSize = this.boardSize * this.boxSize;
    this.cursorSprite = null;
    this.game = new Game(this.boardSize, this.boxSize);
    this.game.onFinished = (winner) => {
      console.log("The winner is " + winner);
      this.endScene();
    }
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(this.grid());
    this.mouse.listen();
    this.mouse.onDown = (event) => {
      event.preventDefault();
      let col = Math.floor(this.cursorSprite.x / this.boxSize);
      let row = Math.floor(this.cursorSprite.y / this.boxSize);
      if (event.button == 0 && this.game.board[row][col] == this.game.EMPTY) {
        let sprite = this.getXOSprite(this.game.turn);
        sprite.position = this.cursorSprite.position;
        this.viewContainer.addChild(sprite);
        this.game.selectSquare(row, col);
        this.viewContainer.removeChild(this.cursorSprite);
        this.cursorSprite = this.getXOSprite(this.game.turn);
        this.viewContainer.addChild(this.cursorSprite);
      }
    }
    this.cursorSprite = this.getXOSprite(this.game.turn);
    this.viewContainer.addChild(this.cursorSprite);
    this.addTickerFunction(this.updateCursorSpriteToMouse.bind(this));
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
    if (this.game.board[row][col] === this.game.EMPTY) {
      this.cursorSprite.alpha = this.HOLO_ALPHA;
    } else {
      this.cursorSprite.alpha = 0;
    }
  }

  endScene() {
    super.endScene();
    this.mouse.stop();
  }

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
   * Gets X or O sprite
   * @param {string} symbol 'x' or 'o' 
   * @param {number} alpha
   */
  getXOSprite(symbol, alpha = 1) {
    let sprite = new PIXI.Sprite(this.resoures[symbol].texture);
    sprite.alpha = alpha;
    sprite.width = this.boxSize;
    sprite.height = this.boxSize;
    return sprite;
  }
}