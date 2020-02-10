function mouseListener() {
  let mouse = {};
  mouse.x = 0;
  mouse.y = 0;
  mouse.isDown = false;
  mouse.button = -1;
  mouse.isListening = false;

  function onMove(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }

  function onDown(event) {
    mouse.isDown = true;
    mouse.button = event.button;
    if (mouse.onDown) {
      mouse.onDown(event);
    }
  }

  function onUp(event) {
    mouse.isDown = false;
    mouse.button = -1;
    if (mouse.onUp) {
      mouse.onUp(event);
    }
  }
  mouse.listen = () => {
    mouse.isListening = true;
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
  }
  mouse.stop = () => {
    mouse.isListening = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mousedown", onDown);
    document.removeEventListener("mouseup", onUp);
  }
  return mouse;
}

export default mouseListener;