import React from "react";
import PlayerPanel from "./PlayerPanel.jsx";
import { X, O } from "../lib/constants";

function PlayerList({players}) {
  return (<div>
    <PlayerPanel symbol={X} name={players[X] ? players[X] : "waiting..."} styles={{ top: "5px", left: "20px", height: "40px" }}/>
    <PlayerPanel symbol={O} name={players[O] ? players[O] : "waiting..."} styles={{ top: "55px", left: "20px", height: "40px" }}/>
  </div>)
}

export default PlayerList;