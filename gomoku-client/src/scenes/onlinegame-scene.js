import { Scene } from "./scene";
import { MouseListener } from "../lib/mouse-listener";
import { getGrid } from "../lib/utils";
import { Client } from "colyseus.js";
import Game from "../game";

export class OnlineGameScene extends Scene {
  HOLO_ALPHA = 0.25
  BOARD_SIZE = 19;
  BOX_SIZE = 40;
  constructor(app, viewport) {
    super(app, viewport);
    this.mouse = new MouseListener();
    this.worldSize = this.BOX_SIZE * this.BOARD_SIZE;
    this.cursorSprite = null;
    this.game = new Game(this.BOARD_SIZE, this.BOX_SIZE);
    this.playerSymbol = this.game.EMPTY;
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(getGrid(this.BOARD_SIZE, this.BOX_SIZE));
    this.joinGame();
  }

  joinGame() {
    let client = new Client("ws://localhost:2567");
    client.joinOrCreate("game").then(room => {
      room.onStateChange(state => {
        console.log(state);
      });
      console.log(room);
    });
  }
}