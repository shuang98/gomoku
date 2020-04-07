import { Scene } from "./scene";
import { Client } from "colyseus.js";
import * as PIXI from 'pixi.js';
import { OnlineLobbyScene } from "./onlinelobby-scene";

export class OnlineQueueScene extends Scene {
  SERVER_CONNECTION = process.env.NODE_ENV == "development" ? "ws://localhost:2567" : "ws://young-temple-84590.herokuapp.com/";
  waiting = true;
  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.client = new Client(this.SERVER_CONNECTION);
    this.viewContainer.addChild(this.waitingMessage());
    this.joinGame();
  }

  waitingMessage() {
    let text = new PIXI.Text("waiting to join lobby...", {
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
        room.removeAllListeners();
        let lobby = new OnlineLobbyScene(this.app, this.viewport, room);
        this.transitionToScene(lobby);
      })
    });
  }
}