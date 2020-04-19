import { Scene } from "./scene";
import { OnlineGameScene } from "./onlinegame-scene";
import { getButton } from "../lib/utils";
import { MSG_TYPES } from "../lib/constants";
import store from "../store";
import { setPlayers } from "../actions";
import { LobbyListener } from "../lib/lobby-listener";

export class OnlineLobbyScene extends Scene {
  constructor(app, viewport, room) {
    super(app, viewport);
    this.room = room;
    this.player = this.room.state.players[this.room.sessionId];
  }

  sceneLoadFunction(loader, resources) {
    super.sceneLoadFunction(loader, resources);
    this.viewContainer.addChild(this.startGameButton());
    const lobbyListener = new LobbyListener(this.room, (players) => {
      store.dispatch(setPlayers({...players}));
    });
    lobbyListener.start();
    this.room.onStateChange(state => {
      if (state.playing) {
        this.room.removeAllListeners();
        lobbyListener.stop();
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