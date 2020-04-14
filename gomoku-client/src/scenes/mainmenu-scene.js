import { Scene } from "./scene";
import { GameScene } from "./game-scene";
import * as PIXI from 'pixi.js';
import { getButton } from "../lib/utils";
import { OnlineQueueScene } from "./onlinequeue-scene";
import { OnlineMenuScene } from "./onlinemenu-scene";

export class MainMenuScene extends Scene {
  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(this.titleText());
    this.viewContainer.addChild(this.startOnlineGameButton());
    this.viewContainer.addChild(this.startClientOnlyGameButton());
  }

  titleText() {
    let text = new PIXI.Text("gomoku", {
      fontFamily: 'Arial',
      fontSize: 50,
    });
    text.anchor.set(0.5);
    text.x = this.viewport.worldWidth / 2
    text.y = this.viewport.worldHeight / 5
    return text;
  }

  startClientOnlyGameButton() {
    let onClick = e => {
      let newGameScene = new GameScene(this.app, this.viewport);
      this.transitionToScene(newGameScene);
    }
    let button = getButton("2-player", onClick, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    button.anchor.set(0.5);
    button.x = this.viewport.worldWidth / 2;
    button.y = this.viewport.worldHeight / 2 + 100;
    return button;
  }

  startOnlineGameButton() {
    let onClick = e => {
      this.transitionToScene(new OnlineMenuScene(this.app, this.viewport));
    }
    let button = getButton("Online", onClick, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    button.anchor.set(0.5);
    button.x = this.viewport.worldWidth / 2;
    button.y = this.viewport.worldHeight / 2;
    return button;
  }

}