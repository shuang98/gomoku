import { SET_PLAYERS, SET_TURN } from "./actions";

export function players(state={}, action) {
  switch (action.type) {
    case SET_PLAYERS:
      return action.players
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