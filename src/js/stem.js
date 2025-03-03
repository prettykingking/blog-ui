/**
 * STEM rendering using Katex
 */
import EventHandler from "bootstrap/js/src/dom/event-handler.js";

class Stem {
  constructor() {
    this.setup();
  }

  setup() {
    EventHandler.on(document, "DOMContentLoaded", () => {
      const spans = document.querySelectorAll("span.inline-stem");
      for (const s of spans) {
        renderMathInElement(s);
      }
      const blocks = document.querySelectorAll("div.stem");
      for (const b of blocks) {
        renderMathInElement(b);
      }
    });
  }
}

export default Stem;
