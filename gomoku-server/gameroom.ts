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
  boardSize: number;

  onCreate(options: any) {
    this.setState(new GameState());
    this.boardSize = options.boardSize;
    let size = options.boardSize * options.boardSize;
    this.state.board = new ArraySchema<string>(...new Array<string>(size).fill(EMPTY));
    this.maxClients = 2;
    this.state.turn = X;
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
    if (message.action == "SELECT_SQUARE") {
      const index = message.payload.row * this.boardSize + message.payload.col
      if (this.state.board[index] != EMPTY) {
        client.send("ERROR");
        return;
      }
      this.state.board[index] = this.state.turn;
      this.state.turn = this.state.turn == X ? O : X;
    }
    this.broadcast(message, {except: client});
  }

  onLeave(client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
