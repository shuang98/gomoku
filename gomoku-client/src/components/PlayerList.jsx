import React from "react";
import PlayerPanel from "./PlayerPanel.jsx";
import { X, O } from "../lib/constants";
import { useSelector } from "react-redux";

function PlayerList() {
  const players = useSelector(state => state.players);
  const turn = useSelector(state => state.turn);
  console.log(turn);
  const color = {
    x: "red",
    o: "blue"
  }
  const styles = (symbol) => {
    const c = symbol === turn ? color[symbol] : "grey";
    const top = symbol == X ? "5px" : "55px";
    const left = "20px";
    const height = "40px";
    const boxShadow = "5px 5px 3px " + c
    return {top, left, height, boxShadow};
  }
  return (<div>
    <PlayerPanel symbol={X} name={players[X] ? players[X] : "waiting..."} styles={styles(X)}/>
    <PlayerPanel symbol={O} name={players[O] ? players[O] : "waiting..."} styles={styles(O)}/>
  </div>)
}

export default PlayerList;