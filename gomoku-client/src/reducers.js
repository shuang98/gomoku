import { SET_PLAYERS, SET_TURN, SET_SCENE, SET_ONLINE_NAME } from "./actions";

export function players(state={}, action) {
  switch (action.type) {
    case SET_PLAYERS:
      return {...action.players}
    default:
      return state;
  }
}

export function turn(state = null, action ) {
  switch (action.type) {
    case SET_TURN:
      return action.turn
    default:
      return state;
  }
}

export function scene(state = null, action) {
  switch (action.type) {
    case SET_SCENE:
      return action.scene
    default:
      return state;
  }
}

export function onlineName(state = "guest" + Math.floor(Math.random() * 100), action) {
  switch (action.type) {
    case SET_ONLINE_NAME:
      return action.name;
    default:
      return state;
  }
}