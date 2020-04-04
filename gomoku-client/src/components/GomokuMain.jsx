import React, { useLayoutEffect, useState } from "react";
import { initializeGomokuCanvas } from "../gomoku-pixi";
import * as PIXI from 'pixi.js';
import GomokuUI from "./GomokuUI.jsx";

function GomokuMain() {
  let [scene, setScene] = useState();
  useLayoutEffect(() => {
    const app = new PIXI.Application();
    app.setScene = setScene;
    initializeGomokuCanvas(app);
  }, []);
  return (<div>
    <div id="gomoku-canvas"></div>
    <GomokuUI scene={scene}/>
  </div>)
}

export default GomokuMain;