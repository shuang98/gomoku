import React, { useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { setOnlineName } from "../actions";
import { OnlineQueueScene } from "../scenes/onlinequeue-scene";

function PlayerNameForm() {
  
  const styles = {
    display: "block", 
    padding: "5px",
    width: "50vw",
    textAlign: "center",
    top: "30vh",
    left: "25vw"
  }
  const dispatch = useDispatch();
  const store = useStore();
  const [text, setText] = useState(store.getState().onlineName);
  const scene = store.getState().scene;
  const onClickHandler = (e) => {
    dispatch(setOnlineName(text));
    const onlineQueue = new OnlineQueueScene(scene.app, scene.viewport);
    scene.transitionToScene(onlineQueue);
  }
  return (<div className="panel" style={styles}>
    <h3>Enter Your Name:</h3>
    <input type="text" onChange={(e) => {setText(e.target.value)}} value={text}></input>
    <button onClick={onClickHandler}>Continue</button>
  </div>)
}

export default PlayerNameForm