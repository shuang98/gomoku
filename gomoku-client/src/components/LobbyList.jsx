import React, { useState, useEffect } from "react";
import PlayerList from "./PlayerList.jsx";
import { LobbyListener } from "../lib/lobby-listener.js";


function LobbyList({scene}) {
  let [players, setPlayers] = useState({});
  if (!scene) {
    return (<div></div>);
  }
  useEffect(() => {
    let lobbyListener = new LobbyListener(scene.room, (players) => {
      setPlayers(players);
    });
    lobbyListener.start();
  }, [scene])
  return (<div>
    <PlayerList players={players}></PlayerList>
  </div>)
}

export default LobbyList;