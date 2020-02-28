import { Scene } from "./scene";
import { MouseListener } from "../lib/mouse-listener";
import { getGrid } from "../lib/utils";
import { Room } from "colyseus.js";
import { OnlineCursorTracker } from "../lib/cursor-tracker";
import * as PIXI from 'pixi.js'

export class OnlineGameScene extends Scene {
  HOLO_ALPHA = 0.25
  BOARD_SIZE = 19;
  BOX_SIZE = 40;
  /**
   * 
   * @param {PIXI.Application} app 
   * @param {Viewport} viewport 
   * @param {Room} room 
   */
  constructor(app, viewport, room) {
    super(app, viewport);
    this.room = room;
    this.mouse = new MouseListener();
    this.worldSize = this.BOX_SIZE * this.BOARD_SIZE;
    this.game = new Game(this.BOARD_SIZE, this.BOX_SIZE);
    this.playerSymbol = this.game.EMPTY;
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(getGrid(this.BOARD_SIZE, this.BOX_SIZE));
    this.playerSymbol = this.room.state.players[this.room.sessionId].playerSymbol;
    this.mouse.listen();
    this.cursorTracker = new OnlineCursorTracker(this, this.mouse);
    this.cursorTracker.start();
    this.mouse.onDown = (event) => {
      event.preventDefault();
      let col = this.cursorTracker.col
      let row = this.cursorTracker.row
      if (event.button == 0 && this.game.board[row][col] == this.game.EMPTY) {}
    }
  }

  isPlayerTurn() {
    return this.game.turn == this.playerSymbol;
  }

  endScene() {
    super.endScene();
    this.room.removeAllListeners();
  }

}