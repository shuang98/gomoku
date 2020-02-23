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