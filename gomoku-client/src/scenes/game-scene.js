import { getGrid, getXOSprite } from "../lib/utils";
import { MouseListener } from "../lib/mouse-listener";
import { Game } from "../game";
import { Scene } from "./scene";
import { GameOverScene } from "./gameover-scene";
import { CursorTracker } from "../lib/cursor-tracker";
import { BOX_SIZE, BOARD_SIZE, EMPTY } from '../lib/constants';
import store from '../store';
import { setPlayers } from '../actions';

export class GameScene extends Scene {
  constructor(app, viewport) {
    super(app, viewport);
    this.mouse = new MouseListener();
    this.worldSize = BOARD_SIZE * BOX_SIZE;
    this.game = new Game(BOARD_SIZE);
    this.game.onFinished = (winner) => {
      let gameOverScene = new GameOverScene(this.app, this.viewport, winner, this.viewContainer);
      this.transitionToScene(gameOverScene);
    }
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(getGrid(BOARD_SIZE, BOX_SIZE));
    this.mouse.listen();
    store.dispatch(setPlayers({x: "player 1", o: "player 2"}));
    this.cursorTracker = new CursorTracker(this, this.mouse);
    this.cursorTracker.start();
    this.mouse.onDown = (event) => {
      event.preventDefault();
      const row = this.cursorTracker.row;
      const col = this.cursorTracker.col;
      if (event.button == 0 && this.game.getBoardSquare(row, col) == EMPTY) {
        let sprite = getXOSprite(this.game.turn, BOX_SIZE, resources);
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