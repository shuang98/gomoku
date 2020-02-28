import { Scene } from "./scene";
import { MouseListener } from "../lib/mouse-listener";
import { Game } from "../game";
import { getGrid, getXOSprite } from "../lib/utils";
import { Room } from "colyseus.js";
import { OnlineCursorTracker } from "../lib/cursor-tracker";
import * as PIXI from 'pixi.js'

const SELECT_SQUARE = 'SELECT_SQUARE';

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
      if (!this.isPlayerTurn()) { return; }
      let col = this.cursorTracker.col
      let row = this.cursorTracker.row
      if (event.button == 0 && this.game.board[row][col] == this.game.EMPTY) {
        this.selectSquare(row, col);
        this.room.send({
          action: SELECT_SQUARE,
          payload: { row, col }
        });
      }
    }
    this.room.onMessage(({ action, payload }) => {
      if (action == SELECT_SQUARE) {
        this.selectSquare(payload.row, payload.col)
      }
    })
  }

  selectSquare(row, col) {
    let sprite = getXOSprite(this.game.turn, this.BOX_SIZE, this.resources);
    sprite.position = this.cursorTracker.position;
    this.viewContainer.addChild(sprite);
    this.game.selectSquare(row, col);
  }

  isPlayerTurn() {
    return this.game.turn == this.playerSymbol;
  }

  endScene() {
    super.endScene();
    this.room.removeAllListeners();
  }

}