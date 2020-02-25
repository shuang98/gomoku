import { Room, Client } from "colyseus";
import { Schema, ArraySchema, type } from "@colyseus/schema";

const EMPTY = 0;
const X = 1;
const O = 2;

class Player extends Schema {

  constructor(playerSessionID: string) {
    super();
    this.playerSessionID = playerSessionID;
  }

  @type("string")
  playerSessionID: string;
}

class GameState extends Schema {
  @type(["number"])
  board: ArraySchema<number>;

  @type(Player)
  playerX: Player;

  @type(Player)
  playerO: Player;

  @type("number")
  cursorIndex: number;

  @type("number")
  turn: number;

}

export class GameRoom extends Room<GameState> {

  onCreate(options: any) {
    this.setState(new GameState());
    let size = options.boardSize * options.boardSize;
    this.state.board = new ArraySchema<number>(size);
    this.state.board.fill(EMPTY);
    this.maxClients = 2;
  }

  onJoin(client: Client, options: any) {
    let newPlayer = new Player(client.sessionId);
    if (this.state.playerX) {
      this.state.playerO = newPlayer
    } else {
      this.state.playerX = newPlayer
    }
  }

  onMessage(client: Client, message: any) {
  }

  onLeave(client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
