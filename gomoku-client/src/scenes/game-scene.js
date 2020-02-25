import * as PIXI from 'pixi.js'
import { clamp, getGrid, getXOSprite } from "../lib/utils";
import { MouseListener } from "../lib/mouse-listener";
import Game from "../game";
import { Scene } from "./scene";
import { GameOverScene } from "./gameover-scene";

export class GameScene extends Scene {
  HOLO_ALPHA = 0.25
  BOARD_SIZE = 19;
  BOX_SIZE = 40;
  constructor(app, viewport) {
    super(app, viewport);
    this.mouse = new MouseListener();
    this.worldSize = this.BOARD_SIZE * this.BOX_SIZE;
    this.cursorSprite = null;
    this.game = new Game(this.BOARD_SIZE, this.BOX_SIZE);
    this.game.onFinished = (winner) => {
      let gameOverScene = new GameOverScene(this.app, this.viewport, winner, this.viewContainer);
      this.transitionToScene(gameOverScene);
    }
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(getGrid(this.BOARD_SIZE, this.BOX_SIZE));
    this.mouse.listen();
    this.mouse.onDown = (event) => {
      event.preventDefault();
      let col = Math.floor(this.cursorSprite.x / this.BOX_SIZE);
      let row = Math.floor(this.cursorSprite.y / this.BOX_SIZE);
      if (event.button == 0 && this.game.board[row][col] == this.game.EMPTY) {
        let sprite = getXOSprite(this.game.turn, this.BOX_SIZE, resources);
        sprite.position = this.cursorSprite.position;
        this.viewContainer.addChild(sprite);
        this.game.selectSquare(row, col);
        if (!this.game.finished) {
          this.viewContainer.removeChild(this.cursorSprite);
          this.cursorSprite = getXOSprite(this.game.turn, this.BOX_SIZE, resources);
          this.viewContainer.addChild(this.cursorSprite);
        }
      }
    }
    this.cursorSprite = getXOSprite(this.game.turn, this.BOX_SIZE, resources);
    this.viewContainer.addChild(this.cursorSprite);
    this.addTickerFunction(this.updateCursorSpriteToMouse.bind(this));
  }

  /**
   * updates cursorSprite location based on mouse position
   */
  updateCursorSpriteToMouse() {
    let cursor = this.viewport.toWorld(new PIXI.Point(this.mouse.x, this.mouse.y));
    cursor.x = Math.floor(cursor.x / this.BOX_SIZE) * this.BOX_SIZE;
    cursor.y = Math.floor(cursor.y / this.BOX_SIZE) * this.BOX_SIZE;
    cursor.x = clamp(cursor.x, 0, this.worldSize - this.BOX_SIZE);
    cursor.y = clamp(cursor.y, 0, this.worldSize - this.BOX_SIZE);
    let col = Math.floor(cursor.x / this.BOX_SIZE);
    let row = Math.floor(cursor.y / this.BOX_SIZE);
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
}