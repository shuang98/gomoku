import { createStore } from "redux";
import { combineReducers } from "redux";
import * as reducers from "./reducers";

const reducer = combineReducers(reducers);
const store = createStore(reducer);
export default store;