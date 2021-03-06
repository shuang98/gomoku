import { Scene } from "./scene";
import { GameScene } from './game-scene';
import { getButton } from "../lib/utils";
import * as PIXI from 'pixi.js'
import { MainMenuScene } from "./mainmenu-scene";
import { OnlineGameScene } from "./onlinegame-scene";
import { MSG_TYPES } from "../lib/constants";
import { OnlineLobbyScene } from "./onlinelobby-scene";

export class GameOverScene extends Scene {
  constructor(app, viewport, winner, gameSceneViewContainer) {
    super(app, viewport);
    this.winner = winner;
    this.gameSceneViewContainer = gameSceneViewContainer;
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.gameSceneViewContainer.alpha = 0.3;
    this.viewContainer.addChild(this.gameSceneViewContainer);
    this.viewContainer.addChild(this.gameOverTitleText());
    this.viewContainer.addChild(this.mainMenuButton());
    this.viewContainer.addChild(this.rematchButton());
  }

  gameOverTitleText() {
    let text = new PIXI.Text(`${this.winner} wins!!`, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    text.anchor.set(0.5);
    text.x = this.viewport.worldWidth / 2;
    text.y = this.viewport.worldHeight / 5;
    return text;
  }

  rematchButton() {
    let onClick = e => {
      let newGameScene = new GameScene(this.app, this.viewport);
      this.transitionToScene(newGameScene);
    }
    let button = getButton("rematch?", onClick, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    button.anchor.set(0.5);
    button.x = this.viewport.worldWidth / 2;
    button.y = this.viewport.worldHeight / 2;
    return button;
  }

  mainMenuButton() {
    let onClick = e => {
      let mainMenuScene = new MainMenuScene(this.app, this.viewport);
      this.transitionToScene(mainMenuScene);
    }
    let button = getButton("back to menu", onClick, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    button.anchor.set(0.5);
    button.x = this.viewport.worldWidth / 2;
    button.y = this.viewport.worldHeight / 2 + 100;
    return button;

  }
}

export class OnlineGameOverScene extends GameOverScene {
  constructor(app, viewport, winner, gameSceneViewContainer, room) {
    super(app, viewport, winner, gameSceneViewContainer);
    this.room = room;
  }
  rematchButton() {
    let onClick = (e) => {
      this.room.removeAllListeners();
      let lobby = new OnlineLobbyScene(this.app, this.viewport, this.room);
      this.transitionToScene(lobby);
    }
    let button = getButton("back to lobby", onClick, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    button.anchor.set(0.5);
    button.x = this.viewport.worldWidth / 2;
    button.y = this.viewport.worldHeight / 2;
    return button;
  }

  mainMenuButton() {
    let onClick = e => {
      this.room.leave();
      let mainMenuScene = new MainMenuScene(this.app, this.viewport);
      this.transitionToScene(mainMenuScene);
    }
    let button = getButton("back to menu", onClick, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    button.anchor.set(0.5);
    button.x = this.viewport.worldWidth / 2;
    button.y = this.viewport.worldHeight / 2 + 100;
    return button;
  }
}