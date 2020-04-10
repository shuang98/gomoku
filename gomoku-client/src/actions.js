export const SET_PLAYERS = 'SET_PLAYERS';
export const SET_TURN = 'SET_TURN';
export const SET_SCENE = 'SET_SCENE';

export function setPlayers(players) {
  return {type: SET_PLAYERS, players};
}

export function setTurn(turn) {
  return {type: SET_TURN, turn};
}

export function setScene(scene) {
  return {type: SET_SCENE, scene};
}