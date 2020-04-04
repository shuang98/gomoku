import { Room } from "colyseus.js";
export class LobbyListener {
  /**
   * @param {Room} room 
   * @param {Function} onLobbyChange 
   */
  constructor(room, onLobbyChange) {
    this.room = room;
    this.onLobbyChange = onLobbyChange.bind(this);
    this.clientSymbol = this.room.state.players[this.room.sessionId].playerSymbol;
    this.players = {}
  }

  start() {
    const resolveName = (player) => {
      let name = player.playerSymbol == this.clientSymbol ? "You" : "Opponent";
      if (player.isLobbyLeader) {
        name = name +  " (host)";
      }
      return name;
    }
    for (const id in this.room.state.players) {
      const player = this.room.state.players[id];
      this.players[player.playerSymbol] = resolveName(player);
    }
    this.onLobbyChange({...this.players});
    this.room.state.players.onAdd = (player, key) => {
      this.players[player.playerSymbol] = resolveName(player);
      this.onLobbyChange({...this.players});
    }
    this.room.state.players.onRemove = (player, key) => {
      delete this.players[player.playerSymbol];
      this.onLobbyChange({...this.players});
    }
    this.room.state.players.onChange = (player, key) => {
      this.players[player.playerSymbol] = resolveName(player);
      this.onLobbyChange({...this.players});
    }

  }
}