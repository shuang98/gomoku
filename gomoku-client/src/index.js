import GomokuMain from "./components/GomokuMain.jsx";
import React from "react";
import ReactDOM from "react-dom";

const uiContainer = document.getElementById("gomoku");
uiContainer ? ReactDOM.render(<GomokuMain/>, uiContainer) : false;