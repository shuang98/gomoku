import GomokuMain from "./components/GomokuMain.jsx";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";

const uiContainer = document.getElementById("gomoku");
uiContainer ? ReactDOM.render(<Provider store={store}><GomokuMain/></Provider>, uiContainer) : false;