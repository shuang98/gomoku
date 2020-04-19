import { Scene } from "../scenes/scene";
import { OnlineGameScene } from "../scenes/onlinegame-scene";
import * as PIXI from 'pixi.js'
import { MouseListener } from "./mouse-listener";
import { getXOSprite, clamp } from "./utils";
import { BOX_SIZE, EMPTY } from "./constants";

const CURSOR_ALPHA = 0.25;
const TICKER_ID = "cursor_ticker";

export class CursorTracker {
  /**
   * 
   * @param {Scene} scene scene
   * @param {MouseListener} mouse an actively listening MouseListener
   */
  constructor(scene, mouse) {
    this.scene = scene;
    this.mouse = mouse;
    this.sprite = getXOSprite(this.scene.game.turn, BOX_SIZE, this.scene.resources, CURSOR_ALPHA);
    this.cursorSymbol = this.scene.game.turn;
  }

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }

  get row() {
    return Math.floor(this.sprite.y / BOX_SIZE)
  }

  get col() {
    return Math.floor(this.sprite.x / BOX_SIZE)
  }

  get position() {
    return new PIXI.Point(this.x, this.y);
  }

  start() {
    this.scene.viewContainer.addChild(this.sprite);
    this.scene.addTickerFunction(() => {
      this.updateSpriteToClientMouse();
    }, TICKER_ID);
  }

  stop() {
    this.scene.viewContainer.removeChild(this.sprite);
    this.scene.removeTickerFunction(TICKER_ID);
  }

  updateSpriteSymbol() {
    if (this.scene.game.turn != this.cursorSymbol) {
      this.cursorSymbol = this.scene.game.turn;
      this.scene.viewContainer.removeChild(this.sprite);
      this.sprite = getXOSprite(this.scene.game.turn, BOX_SIZE, this.scene.resources, CURSOR_ALPHA);
      this.scene.viewContainer.addChild(this.sprite);
    }
  }

  updateSpriteToClientMouse() {
    this.updateSpriteSymbol();
    let cursor = this.scene.viewport.toWorld(new PIXI.Point(this.mouse.x, this.mouse.y));
    cursor.x = Math.floor(cursor.x / BOX_SIZE) * BOX_SIZE;
    cursor.y = Math.floor(cursor.y / BOX_SIZE) * BOX_SIZE;
    cursor.x = clamp(cursor.x, 0, this.scene.worldSize - BOX_SIZE);
    cursor.y = clamp(cursor.y, 0, this.scene.worldSize - BOX_SIZE);
    let col = Math.floor(cursor.x / BOX_SIZE);
    let row = Math.floor(cursor.y / BOX_SIZE);
    this.sprite.position = cursor;
    if (this.scene.game.getBoardSquare(row, col) === EMPTY) {
      this.sprite.alpha = CURSOR_ALPHA;
    } else {
      this.sprite.alpha = 0;
    }
  }
}

const UPDATE_CURSOR = "UPDATE_CURSOR";
const ONLINE_TICKER_ID = "online_cursor_ticker";


export class OnlineCursorTracker extends CursorTracker {

  /**
   * 
   * @param {OnlineGameScene} scene An OnlineGameScene
   * @param {MouseListener} mouse an actively listening MouseListener
   */
  constructor(scene, mouse) {
    super(scene, mouse);
  }

  start() {
    this.scene.viewContainer.addChild(this.sprite);
    const ticker = () => {
      if (this.scene.isPlayerTurn()) {
        this.updateSpriteToClientMouse();
      }
    }
    this.scene.addTickerFunction(ticker, ONLINE_TICKER_ID);
    this.scene.room.state.cursor.onChange = (changes) => {
      let cursor = { row: this.row, col: this.col };
      for (const { field, value }
        of changes) {
        cursor[field] = value;
      }
      this.updateCursorToOpponentMouse(cursor.row, cursor.col);
    };
  }

  updateCursorToOpponentMouse(row, col) {
    this.updateSpriteSymbol();
    let pos = new PIXI.Point(col * BOX_SIZE, row * BOX_SIZE);
    this.sprite.position = pos;
  }

  updateSpriteToClientMouse() {
    const oldRow = this.row;
    const oldCol = this.col;
    super.updateSpriteToClientMouse();
    if (this.col != oldCol || this.row != oldRow) {
      this.scene.room.send({
        action: UPDATE_CURSOR,
        payload: { row: this.row, col: this.col }
      });
    }

  }
}