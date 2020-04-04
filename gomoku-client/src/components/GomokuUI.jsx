import React from "react";
import PlayerList from "./PlayerList.jsx";
import LobbyList from "./LobbyList.jsx";

function GomokuUI({ scene }) {
  let players = null;
  if (scene && scene.isInGame && !scene.isOnline) {
    players = {x: "player 1", o: "player 2"};
    return (<div>
      <PlayerList players={players}></PlayerList>
    </div>)
  } else if (scene && scene.isInGame && scene.isOnline) {
    return (<div>
      <LobbyList scene={scene}></LobbyList>
    </div>)
  }
  return (<div></div>);
  
}

export default GomokuUI;



