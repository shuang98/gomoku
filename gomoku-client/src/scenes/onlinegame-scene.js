import { Scene } from "./scene";
import { MouseListener } from "../lib/mouse-listener";
import { OnlineGame } from "../game";
import { getGrid, getXOSprite } from "../lib/utils";
import { Room } from "colyseus.js";
import { OnlineCursorTracker } from "../lib/cursor-tracker";
import * as PIXI from 'pixi.js'
import { GameOverScene } from "./gameover-scene";
import { MSG_TYPES } from "../lib/constants";

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
    this.game = new OnlineGame(this.BOARD_SIZE, this.room);
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
      if (event.button == 0 && this.game.getBoardSquare(row, col) == this.game.EMPTY) {
        this.renderSymbolOnSquare(row, col, this.game.turn);
        this.game.selectSquare(row, col);
      }
    }
    this.room.state.board.onChange = (symbol, index) => {
      let row = Math.floor(index / this.BOARD_SIZE);
      let col = index % this.BOARD_SIZE;
      this.renderSymbolOnSquare(row, col, symbol);
    }
    this.room.state.winner.onChange = (changes) => {
      let winner = {}
      for (const { field, value }
        of changes) {
        winner[field] = value;
      }
      let gameOverScene = new GameOverScene(this.app, this.viewport, winner.playerSymbol, this.viewContainer);
      this.transitionToScene(gameOverScene);
    }
  }

  renderSymbolOnSquare(row, col, symbol) {
    let sprite = getXOSprite(symbol, this.BOX_SIZE, this.resources);
    sprite.position = new PIXI.Point(col * this.BOX_SIZE, row * this.BOX_SIZE);
    this.viewContainer.addChild(sprite);
  }

  isPlayerTurn() {
    return this.game.turn == this.playerSymbol;
  }

  endScene() {
    super.endScene();
    this.room.removeAllListeners();
  }

}