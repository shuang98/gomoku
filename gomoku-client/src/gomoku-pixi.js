import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import oImage from '../images/o.png';
import xImage from '../images/x.png'
import { MainMenuScene } from './scenes/mainmenu-scene';
import { BOX_SIZE, BOARD_SIZE } from './lib/constants';

/**
 * Initializes pixi app for gomoku
 * @param {PIXI.Application} app 
 */
export function initializeGomokuCanvas(app) {
  let WORLD_SIZE = BOARD_SIZE * BOX_SIZE;
  let viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: WORLD_SIZE,
    worldHeight: WORLD_SIZE,
    interaction: app.renderer.plugins.interaction
  });
  
  app.renderer.backgroundColor = 0xFFFFFF;
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
  app.renderer.autoResize = true;
  app.renderer.resize(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", event => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    viewport.resize(window.innerWidth, window.innerHeight, WORLD_SIZE, WORLD_SIZE);
    viewport.moveCenter(WORLD_SIZE / 2, WORLD_SIZE / 2);
  })
  
  document.getElementById("gomoku-canvas").appendChild(app.view);
  
  app.stage.addChild(viewport);
  viewport
    .decelerate();
  viewport.moveCenter(WORLD_SIZE / 2, WORLD_SIZE / 2);
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  }, false);
  let mainMenuScene = new MainMenuScene(app, viewport);
  app.loader
    .add('o', oImage)
    .add('x', xImage)
    .load(mainMenuScene.sceneLoadFunction);
}
