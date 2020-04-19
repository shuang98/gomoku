import { Scene } from "./scene";
import { MouseListener } from "../lib/mouse-listener";
import { OnlineGame } from "../game";
import { getGrid, getXOSprite } from "../lib/utils";
import { Room } from "colyseus.js";
import { OnlineCursorTracker } from "../lib/cursor-tracker";
import * as PIXI from 'pixi.js'
import { OnlineGameOverScene } from "./gameover-scene";
import { BOX_SIZE, BOARD_SIZE, EMPTY } from "../lib/constants";
import { X, O } from "../lib/constants";

export class OnlineGameScene extends Scene {
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
    this.worldSize = BOX_SIZE * BOARD_SIZE;
    this.game = new OnlineGame(BOARD_SIZE, this.room);
    this.playerSymbol = EMPTY;
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(getGrid(BOARD_SIZE, BOX_SIZE));
    this.playerSymbol = this.room.state.players[this.room.sessionId].playerSymbol;
    this.mouse.listen();
    this.cursorTracker = new OnlineCursorTracker(this, this.mouse);
    this.cursorTracker.start();
    this.mouse.onDown = (event) => {
      event.preventDefault();
      if (!this.isPlayerTurn()) { return; }
      let col = this.cursorTracker.col
      let row = this.cursorTracker.row
      if (event.button == 0 && this.game.getBoardSquare(row, col) == EMPTY) {
        this.renderSymbolOnSquare(row, col, this.game.turn);
        this.game.selectSquare(row, col);
      }
    }
    this.room.state.board.onChange = (symbol, index) => {
      if (symbol != X && symbol != O) {
        return;
      }
      let row = Math.floor(index / BOARD_SIZE);
      let col = index % BOARD_SIZE;
      this.renderSymbolOnSquare(row, col, symbol);
    }
    const oldOnChange = this.room.state.onChange.bind({})
    this.room.state.onChange = (changes) => {
      oldOnChange(changes);
      for (const { field, value } of changes) {
        if (field == "winner") {
          if (value) {
            this.room.removeAllListeners();
            this.room.state.board.onChange = () => {};
            this.room.state.onChange = () => {};
            let gameOverScene = new OnlineGameOverScene(this.app, this.viewport, value, this.viewContainer, this.room);
            this.transitionToScene(gameOverScene);
          }    

        }
          
      }
      
    }
  }

  renderSymbolOnSquare(row, col, symbol) {
    let sprite = getXOSprite(symbol, BOX_SIZE, this.resources);
    sprite.position = new PIXI.Point(col * BOX_SIZE, row * BOX_SIZE);
    this.viewContainer.addChild(sprite);
  }

  isPlayerTurn() {
    return this.game.turn == this.playerSymbol;
  }

  endScene() {
    super.endScene();
    this.room.removeAllListeners();
    this.mouse.stop();
  }

}