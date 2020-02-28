import * as PIXI from 'pixi.js'
import { clamp, getGrid, getXOSprite } from "../lib/utils";
import { MouseListener } from "../lib/mouse-listener";
import { Game } from "../game";
import { Scene } from "./scene";
import { GameOverScene } from "./gameover-scene";
import { CursorTracker } from "../lib/cursor-tracker";

export class GameScene extends Scene {
  HOLO_ALPHA = 0.25
  BOARD_SIZE = 19;
  BOX_SIZE = 40;
  constructor(app, viewport) {
    super(app, viewport);
    this.mouse = new MouseListener();
    this.worldSize = this.BOARD_SIZE * this.BOX_SIZE;
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
    this.cursorTracker = new CursorTracker(this, this.mouse);
    this.cursorTracker.start();
    this.mouse.onDown = (event) => {
      event.preventDefault();
      const row = this.cursorTracker.row;
      const col = this.cursorTracker.col;
      if (event.button == 0 && this.game.board[row][col] == this.game.EMPTY) {
        let sprite = getXOSprite(this.game.turn, this.BOX_SIZE, resources);
        sprite.position = this.cursorTracker.position;
        this.viewContainer.addChild(sprite);
        this.game.selectSquare(row, col);
      }
    }
  }

  endScene() {
    super.endScene();
    this.mouse.stop();
  }
}