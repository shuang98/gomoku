import React from "react";
import PlayerList from "./PlayerList.jsx";
import { useSelector } from "react-redux";
import { GameScene } from "../scenes/game-scene.js";
import { OnlineGameScene } from "../scenes/onlinegame-scene.js";
import { OnlineLobbyScene } from "../scenes/onlinelobby-scene.js";
function GomokuUI() {
  let scene = useSelector(state => state.scene);
  if (scene instanceof GameScene) {
    return (<div>
      <PlayerList></PlayerList>
    </div>)
  } else if (scene instanceof OnlineGameScene) {
    return (<div>
      <PlayerList></PlayerList>
    </div>)
  } else if (scene instanceof OnlineLobbyScene) {
    return (<div>
      <PlayerList></PlayerList>
    </div>)
  }
  return (<div></div>)
}

export default GomokuUI;



