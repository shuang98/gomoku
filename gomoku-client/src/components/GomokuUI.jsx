import React from "react";
import PlayerList from "./PlayerList.jsx";
import { useSelector } from "react-redux";
import { GameScene } from "../scenes/game-scene.js";
import { OnlineGameScene } from "../scenes/onlinegame-scene.js";
import { OnlineLobbyScene } from "../scenes/onlinelobby-scene.js";
import { OnlineMenuScene } from "../scenes/onlinemenu-scene.js";
import PlayerNameForm from "./PlayerNameForm.jsx";
import SwitchPlayerButton from "./SwitchPlayerButton.jsx";
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
      <SwitchPlayerButton scene={scene} styles={{top: "120px", left: "20px"}}></SwitchPlayerButton>
    </div>)
  } else if (scene instanceof OnlineMenuScene) {
    return (<div>
      <PlayerNameForm></PlayerNameForm>
    </div>)
  }
  return (<div></div>)
}

export default GomokuUI;



