import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import oImage from '../images/o.png';
import xImage from '../images/x.png'
import { MainMenuScene } from './scenes/mainmenu-scene';

let BOARD_SIZE = 19;
let BOX_SIZE = 40;
let WORLD_SIZE = BOARD_SIZE * BOX_SIZE;
const app = new PIXI.Application();
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

document.body.appendChild(app.view);

app.stage.addChild(viewport);
viewport
  .decelerate();
viewport.moveCenter(WORLD_SIZE / 2, WORLD_SIZE / 2);
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);
let mainMenuScene = new MainMenuScene(app, viewport);
app.loader
  .add('o', oImage)
  .add('x', xImage)
  .load(mainMenuScene.sceneLoadFunction);