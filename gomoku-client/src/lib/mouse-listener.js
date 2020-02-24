export class MouseListener {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.isDown = false;
    this.button = -1;
    this.isListening = false;
  }
  listen() {
    this.isListening = true;
    this._onMove = event => {
      this.x = event.clientX;
      this.y = event.clientY;
    }
    this._onDown = event => {
      this.isDown = true;
      this.button = event.button;
      if (this.onDown) {
        this.onDown(event);
      }
    }
    this._onUp = event => {
      this.isDown = false;
      this.button = -1;
      if (this.onUp) {
        this.onUp(event);
      }
    }
    document.addEventListener("mousemove", this._onMove);
    document.addEventListener("mousedown", this._onDown);
    document.addEventListener("mouseup", this._onUp);
  }
  stop() {
    this.isListening = false;
    document.removeEventListener("mousemove", this._onMove);
    document.removeEventListener("mousedown", this._onDown);
    document.removeEventListener("mouseup", this._onUp);
  }
}