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
    // this.room.onStateChange(state => {
    //   console.log(state.players);
    // })
    const resolveName = (player) => {
      let name = player.name;
      if (player.isLobbyLeader) {
        name = name +  " (host)";
      }
      return name;
    }
    const setOnChange = (player) => {
      player.onChange = (changes) => {
        // console.log(changes);
        for (const {field, value, previousValue} of changes) {
          if (field == "playerSymbol" && !this.players[value]) {
            delete this.players[previousValue];
          }
        }
        this.players[player.playerSymbol] = resolveName(player);
        this.onLobbyChange(this.players);
      }
    }
    const resolvePlayers = () => {
      let players = {}
      for (const id in this.room.state.players) {
        const player = this.room.state.players[id];
        players[player.playerSymbol] = resolveName(player);
      }
      return players;
    }
    
    this.players = resolvePlayers();
    this.onLobbyChange(this.players);
    for (const id in this.room.state.players) {
        const player = this.room.state.players[id];
        setOnChange(player);
    }
    this.room.state.players.onAdd = (player, key) => {
      this.players[player.playerSymbol] = resolveName(player)
      setOnChange(player);
      this.onLobbyChange(this.players);
    }
    this.room.state.players.onRemove = (player, key) => {
      delete this.players[player.playerSymbol];
      player.onChange = ()=>{};
      this.onLobbyChange(this.players);
    }
  }

  stop() {
    for (const id in this.room.state.players) {
      const player = this.room.state.players[id];
      player.onChange = () => {};
    }
    this.room.state.players.onAdd = ()=>{};
    this.room.state.players.onRemove = ()=>{};
    
  }
}