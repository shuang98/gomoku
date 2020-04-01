import { Scene } from "./scene";
import { Client } from "colyseus.js";
import * as PIXI from 'pixi.js';
import { OnlineGameScene } from "./onlinegame-scene";

export class OnlineQueueScene extends Scene {
  SERVER_CONNECTION = "ws://localhost:2567";
  waiting = true;
  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.client = new Client(this.SERVER_CONNECTION);
    this.viewContainer.addChild(this.waitingMessage());
    this.joinGame();
  }

  waitingMessage() {
    let text = new PIXI.Text("waiting to join game...", {
      fontFamily: 'Arial',
      fontSize: 50,
    });
    text.anchor.set(0.5);
    text.x = this.viewport.worldWidth / 2;
    text.y = this.viewport.worldHeight / 2;
    return text;
  }

  joinGame() {
    this.client.joinOrCreate("game").then(room => {
      room.onStateChange(state => {
        if (state.playing) {
          room.removeAllListeners();
          let game = new OnlineGameScene(this.app, this.viewport, room)
          this.transitionToScene(game);
        }
      })
    });
  }
}