import { Room, Client } from "colyseus";
import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";
import { MSG_TYPES } from "./constants";

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

  @type("boolean")
  isLobbyLeader: boolean = false;

  isReady: boolean = false;
}

class Cursor extends Schema {
  constructor(row: number, col: number) {
    super();
    this.row = row;
    this.col = col;
  }
  @type("number")
  row: number;

  @type("number")
  col: number;
}

class GameState extends Schema {
  @type(["string"])
  board: ArraySchema<string>;

  @type({ map: Player })
  players: MapSchema<Player> = new MapSchema<Player>();

  @type("boolean")
  playing = false;

  @type("string")
  turn: string;

  @type(Cursor)
  cursor: Cursor = new Cursor(0, 0);

  @type(Player)
  winner: Player;

  boardSize: number;

  constructor(boardSize: number) {
    super();
    this.boardSize = boardSize;
    this.board = this.createEmptyBoard();
  }

  createEmptyBoard() {
    let size = this.boardSize * this.boardSize;
    return new ArraySchema<string>(...new Array<string>(size).fill(EMPTY));
  }

  clearBoard() {
    for (let i = 0; i < this.boardSize * this.boardSize; i++) {
      this.board[i] = EMPTY;      
    }
  }

  updateCursor({ row, col }: { row: number, col: number }) {
    this.cursor.row = row;
    this.cursor.col = col;
  }

  getBoardSquare(row: number, col: number) {
    let index = row * this.boardSize + col;
    return this.board[index];
  }

  setBoardSquare(row: number, col: number, symbol: string) {
    let index = row * this.boardSize + col;
    this.board[index] = symbol;
  }

  isFiveInARow(row:number, col:number) {
    if (this.getBoardSquare(row, col) === EMPTY) {
      return false;
    }
    let i, j, count;
    //vertical
    i = row + 1, j = col, count = 0;
    while (i < this.boardSize && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      i++, count++;
    i = row - 1;
    while (i >= 0 && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      i--, count++;
    if (count >= 4)
      return true;
    //horizontal
    i = row, j = col + 1, count = 0;
    while (j < this.boardSize && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      j++, count++;
    j = col - 1;
    while (j >= 0 && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      j--, count++;
    if (count >= 4)
      return true;
    //diagonal
    i = row + 1, j = col + 1, count = 0;
    while (i < this.boardSize && j < this.boardSize && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      j++, i++, count++;
    i = row - 1, j = col - 1;
    while (i >= 0 && j >= 0 && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      i--, j--, count++;
    if (count >= 4)
      return true;
    i = row - 1, j = col + 1, count = 0;
    while (i >= 0 && j < this.boardSize && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      j++, i--, count++;
    i = row + 1, j = col - 1;
    while (i < this.boardSize && j >= 0 && this.getBoardSquare(i, j) === this.getBoardSquare(row, col))
      i++, j--, count++;
    if (count >= 4)
      return true;
    return false;
  }

  areBothPlayersReady() {
    for (const key in this.players) {
      if (!this.players[key].isReady) {
        return false;
      }
    }
    return true;
  }

  resetPlayerReadyStatus() {
    for (const key in this.players) {
      this.players[key].isReady = false;
    }
  }

}

export class GameRoom extends Room<GameState> {
  onCreate(options: any) {
    this.setState(new GameState(options.boardSize));
    this.maxClients = 2;
    this.state.turn = X;
  }

  onJoin(client: Client, options: any) {
    let newPlayer = new Player(client.sessionId);
    if (this.clients.length == 1) {
      newPlayer.isLobbyLeader = true;
      newPlayer.playerSymbol = X;
    } else {
      newPlayer.playerSymbol = this.state.players[this.clients[0].sessionId].playerSymbol == X ? O : X
    }
    this.state.players[client.sessionId] = newPlayer;
  }

  handleSelectSquareMessage(client: Client, msg: any) {
    let {row, col} = msg.payload;
    if (this.state.getBoardSquare(row, col) != EMPTY) {
      client.send("ERROR");
      return;
    }
    this.state.setBoardSquare(row, col, this.state.turn);
    if (this.state.isFiveInARow(row, col)) {
      this.state.winner = this.state.players[client.sessionId];
      this.state.playing = false;
      return;
    }
    this.state.turn = this.state.turn == X ? O : X;
    this.broadcast(msg, { except: client });
  }

  onMessage(client: Client, message: any) {
    switch (message.action) {
      case MSG_TYPES.SELECT_SQUARE:
        this.handleSelectSquareMessage(client, message);
        break;
      case MSG_TYPES.UPDATE_CURSOR:
        this.state.updateCursor(message.payload);
        break;
      case MSG_TYPES.READY_PLAYER:
        this.state.players[client.sessionId].isReady = true;
        if (this.clients.length == 2 && this.state.areBothPlayersReady()) {
          this.state.resetPlayerReadyStatus();
          this.state.playing = true;
          this.state.turn = X;
          this.state.clearBoard();
          const player = new Player("")
          player.playerSymbol = "";
          this.state.winner = player;
        }
        break;
      default:
        break;
    }
  }

  onLeave(client: Client, consented: boolean) {
    const wasLobbyLeader = this.state.players[client.sessionId].isLobbyLeader;
    delete this.state.players[client.sessionId];
    if (wasLobbyLeader) {
      for (let id in this.state.players) {
        const player: Player = this.state.players[id];
        player.isLobbyLeader = true;
      }
    }
  }

  onDispose() {
  }
}
