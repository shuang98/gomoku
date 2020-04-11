import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import { initializeGomokuCanvas } from "./gomoku-pixi";
import * as PIXI from 'pixi.js';
import GomokuUI from "./components/GomokuUI.jsx";
const app = new PIXI.Application();
initializeGomokuCanvas(app, "gomoku-canvas");
const uiContainer = document.getElementById("gomoku-ui");
uiContainer ? ReactDOM.render(<Provider store={store}><GomokuUI/></Provider>, uiContainer) : false;