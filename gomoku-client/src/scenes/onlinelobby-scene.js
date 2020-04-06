import { Scene } from "./scene";
import { OnlineGameScene } from "./onlinegame-scene";
import { getButton } from "../lib/utils";
import { MSG_TYPES } from "../lib/constants";

export class OnlineLobbyScene extends Scene {
  isInGame = true;
  isOnline = true;
  constructor(app, viewport, room) {
    super(app, viewport);
    this.room = room;
    this.player = this.room.state.players[this.room.sessionId];
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(this.startGameButton());
    this.room.onStateChange(state => {
      if (state.playing) {
        this.room.removeAllListeners();
        let newGameScene = new OnlineGameScene(this.app, this.viewport, this.room);
        this.transitionToScene(newGameScene);
      }
    })
  }

  startGameButton() {
    let button = getButton("ready", (e) => {
      this.room.send({action: MSG_TYPES.READY_PLAYER});
      button.style.fill = 0X00FF00;
    }, {
      fontFamily: 'Arial',
      fontSize: 38,
    });
    
    button.anchor.set(0.5);
    button.x = this.viewport.worldWidth / 2;
    button.y = this.viewport.worldHeight / 2 + 100;
    return button;
  }
}