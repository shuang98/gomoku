import * as PIXI from 'pixi.js'

export function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

export function getButton(text, onClick, options) {
  let button = new PIXI.Text(text, { options });
  button.interactive = true;
  button.click = onClick;
  button.mouseover = (e) => {
    button.alpha = 0.5
  }
  button.mouseout = e => {
    button.alpha = 1;
  }
  return button;
}

/**
 * @returns {PIXI.Graphics} Graphics object for the gomoku grid.
 */
export function getGrid(boardSize, boxSize) {
  let worldSize = boardSize * boxSize;
  let graphics = new PIXI.Graphics();
  graphics.lineStyle(1, 0xDDDDDD, 1);
  for (let i = 0; i <= boardSize; i++) {
    graphics.moveTo(i * boxSize, 0);
    graphics.lineTo(i * boxSize, worldSize);
    graphics.moveTo(0, i * boxSize);
    graphics.lineTo(worldSize, i * boxSize);
  }
  return graphics;
}

/**
 * Gets X or O sprite
 * @param {string} symbol 'x' or 'o' 
 * @param {number} alpha
 */
export function getXOSprite(symbol, boxSize, resources, alpha = 1) {
  let sprite = new PIXI.Sprite(resources[symbol].texture);
  sprite.alpha = alpha;
  sprite.width = boxSize;
  sprite.height = boxSize;
  return sprite;
}