import { Room, Client } from "colyseus";
import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";

const EMPTY = '0';
const X = 'x';
const O = 'o';

class Player extends Schema {

  constructor(playerSessionID: string) {
    super();
    this.playerSessionID = playerSessionID;
  }

  @type("string")
  playerSessionID: string;

  @type("string")
  playerSymbol: string;
}

class GameState extends Schema {
  @type(["string"])
  board: ArraySchema<string>;

  @type({map: Player})
  players: MapSchema<Player> = new MapSchema<Player>();

  @type("boolean")
  ready = false;

  @type("string")
  turn: string;

}

export class GameRoom extends Room<GameState> {

  onCreate(options: any) {
    this.setState(new GameState());
    let size = options.boardSize * options.boardSize;
    this.state.board = new ArraySchema<string>(...new Array<string>(size).fill(EMPTY));
    this.maxClients = 2;
  }

  onJoin(client: Client, options: any) {
    let newPlayer = new Player(client.sessionId);
    if (this.clients.length == 1) {
      newPlayer.playerSymbol = X;
    } else {
      newPlayer.playerSymbol = O;
      this.state.ready = true;
    }
    this.state.players[client.sessionId] = newPlayer;
  }

  onMessage(client: Client, message: any) {
  }

  onLeave(client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
