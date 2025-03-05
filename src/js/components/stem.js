/**
 * STEM rendering using Katex
 */
import EventHandler from "bootstrap/js/src/dom/event-handler.js";

class Stem {
  constructor() {
    EventHandler.on(document, "DOMContentLoaded", () => {
      this.setup();
    });
  }

  setup() {
    const spans = document.querySelectorAll(".article span.inline-stem");
    for (const s of spans) {
      renderMathInElement(s);
    }
    const blocks = document.querySelectorAll(".article div.stem");
    for (const b of blocks) {
      renderMathInElement(b);
    }
  }
}

export default Stem;
