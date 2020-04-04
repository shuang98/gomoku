import * as PIXI from 'pixi.js'

export class Scene {
  isInGame = false;
  isOnline = false;
  constructor(app, viewport) {
    this.app = app;
    this.viewport = viewport;
    this.viewContainer = new PIXI.Container();
    this.tickerFunctions = {};
    this.sceneLoadFunction = this.sceneLoadFunction.bind(this);
  }

  /**
   * Scene load function that initializes scene
   * @param {*} loader 
   * @param {*} resources 
   */
  sceneLoadFunction(loader, resources) {
    this.app.setScene(this);
    this.viewport.addChild(this.viewContainer);
    this.loader = loader;
    this.resources = resources;
  }

  /**
   * Calls endScene and transitions to new scene.
   * @param {Scene} newScene scene to be transitioned to.
   */
  transitionToScene(newScene) {
    this.endScene();
    newScene.sceneLoadFunction(this.loader, this.resources);
  }

  /**
   * Add ticker function to scene
   * @param {Function} ticker ticker callback function
   * @param {string} id ticker id
   */
  addTickerFunction(ticker, id) {
    this.tickerFunctions[id] = ticker;
    this.app.ticker.add(ticker);
  }

  /**
   * Remove ticker funtion from scene
   * @param {string} id ticker id
   */
  removeTickerFunction(id) {
    this.app.ticker.remove(this.tickerFunctions[id]);
    delete this.tickerFunctions[id];
  }

  /**
   * Ends the scene
   */
  endScene() {
    this.viewport.removeChild(this.viewContainer);
    for (const id in this.tickerFunctions) {
      this.removeTickerFunction(id);
    }
  }
}