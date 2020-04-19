import React, { useEffect, useState } from "react";
import { MSG_TYPES } from "../lib/constants";
import { useSelector } from "react-redux";

function SwitchPlayerButton({ scene, styles }) {
  const players = useSelector(state => state.players);
  const onClick = (e) => {
    scene.room.send({
      action: MSG_TYPES.SWITCH_PLAYER_SYMBOLS
    });
  }
  const [isLobbyLeader, setIsLobbyLeader] = useState();
  useEffect(() => {
    const clientPlayer = scene.room.state.players[scene.room.sessionId];
    setIsLobbyLeader(clientPlayer.isLobbyLeader);
  }, [players])
  if (!isLobbyLeader) {
    return (<div></div>)
  }
  return (
    <div className="panel" style={styles}>
      <button onClick={onClick}>
        switch
      </button>
    </div>
  )
}

export default SwitchPlayerButton;