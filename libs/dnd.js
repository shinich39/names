'use strict';

class DnD {
  constructor(element, enableGrab) {
    const self = this;

    // handlers
    self.start = null;
    self.move = null;
    self.end = null;

    // state
    self.__enableGrab__ = !!enableGrab;
    self.__mouseX__ = null;
    self.__mouseY__ = null;
    self.__cloneX__ = null;
    self.__cloneY__ = null;

    // elements
    self.__element__ = element;
    self.__clone__ = null;

    // func
    self.destroy = destroy;

    function mouseDown(e) {
      e.preventDefault();

      self.__mouseX__ = e.clientX;
      self.__mouseY__ = e.clientY;

      if (self.__enableGrab__) {
        const clone = self.__element__.cloneNode(true);
        const rect = self.__element__.getBoundingClientRect();

        clone.style.position = "absolute";
        clone.style.top = rect.top + "px";
        clone.style.left = rect.left + "px";
        clone.style.width = rect.width + "px";
        clone.style.height = rect.height + "px";
        clone.style.zIndex = 1000;
        clone.style.opacity = 0.5;
        clone.style.pointerEvents = "none";

        self.__clone__ = clone;
        self.__cloneX__ = rect.left;
        self.__cloneY__ = rect.top;

        window.document.body.appendChild(clone);
      }

      if (typeof(self.start) === "function") {
        self.start(e);
      }
  
      // add move event
      window.addEventListener("mousemove", mouseMove);
  
      // add end event
      window.addEventListener("mouseup", mouseUp);
    }

    function mouseMove(e) {
      e.preventDefault();

      if (self.__enableGrab__ && self.__clone__) {
        const moveX = e.clientX - self.__mouseX__;
        const moveY = e.clientY - self.__mouseY__;

        const cloneX = self.__cloneX__ + moveX;
        const cloneY = self.__cloneY__ + moveY;

        self.__clone__.style.top = cloneY + "px";
        self.__clone__.style.left = cloneX + "px";
      }

      if (typeof(self.move) === "function") {
        self.move(e);
      }
    }

    function mouseUp(e) {
      e.preventDefault();

      if (typeof(self.end) === "function") {
        self.end(e);
      }

      // remove clone
      if (self.__enableGrab__ && self.__clone__) {
        self.__clone__.parentNode.removeChild(self.__clone__);
        self.__clone__ = null;

        // clear clone state
        self.__cloneX__ = null;
        self.__cloneY__ = null;
      }

      // clear mouse state
      self.__mouseX__ = null;
      self.__mouseY__ = null;

      // remove move event
      window.removeEventListener("mousemove", mouseMove);

      // remove end event
      window.removeEventListener("mouseup", mouseUp);
    }

    function destroy() {  
      self.__element__.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);

      if (self.__clone__) {
        self.__clone__.parentNode.removeChild(self.__clone__);
      }

      delete self.start;
      delete self.move;
      delete self.end;
      delete self.__enableGrab__;
      delete self.__mouseX__;
      delete self.__mouseY__;
      delete self.__cloneX__;
      delete self.__cloneY__;
      delete self.__clone__;
      delete self.__element__;
    }

    self.__element__.addEventListener("mousedown", mouseDown);
  }
}

if (typeof(window.DnD) === "undefined") {
  window.DnD = DnD;
}