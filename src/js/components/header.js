/**
 * Hide header on scroll
 */

import EventHandler from "bootstrap/js/src/dom/event-handler.js";

class Header {
  constructor() {
    this.scrollPosition = 0;
    this.lastKnownScrollPosition = 0;
    this.scrollTicking = false; // wait for previous transform animation

    this.scrolledOffset = 0;
    this.wrapper = null;
    this.wrapperHeight = 0;
    this.maxOffset = 0;


    EventHandler.on(document, "DOMContentLoaded", () => {
      this.setup();
    });
  }

  setup() {
    const headerElm = document.querySelector(".header-shadow");
    if (headerElm === null) {
      return;
    }

    this._element = headerElm;
    this.wrapper = this._element.parentElement;
    this.wrapperHeight = this.wrapper.clientHeight;
    this.maxOffset = this._element.clientHeight;

    EventHandler.on(window, "scroll", () => {
      this.scrollPosition = window.scrollY;

      if (!this.scrollTicking) {
        window.requestAnimationFrame(() => {
          this.transformHeader();
          this.scrollTicking = false;
        });

        this.scrollTicking = true;
      }
    });
  }

  transformHeader() {
    if (this.scrollPosition < 0) {
      // Scroll up in Safari
      return;
    } else {
      if (this.scrollPosition === this.lastKnownScrollPosition) {
        return;
      }

      // Scroll down in Safari
      const extra = this.scrollPosition + document.documentElement.clientHeight;
      if (extra > document.documentElement.scrollHeight) {
        return;
      }
    }

    if (this.scrollPosition > this.lastKnownScrollPosition) {
      const offset = this.scrollPosition - this.lastKnownScrollPosition;

      if (this.scrolledOffset > -(this.maxOffset)) {
        this.scrolledOffset -= offset;

        if (this.scrolledOffset < -(this.maxOffset)) {
          this.scrolledOffset = -(this.maxOffset);
        }

        this._element.style.transform = "translate3d(0, " + this.scrolledOffset + "px, 0)";
        this.wrapper.style.height = (this.wrapperHeight + this.scrolledOffset) + "px";
      }
    } else {
      const offset = this.lastKnownScrollPosition - this.scrollPosition;

      if (this.scrolledOffset < 0) {
        this.scrolledOffset += offset;

        if (this.scrolledOffset > 0) {
          this.scrolledOffset = 0;
        }

        this._element.style.transform = "translate3d(0, " + this.scrolledOffset + "px, 0)";
        this.wrapper.style.height = (this.wrapperHeight + this.scrolledOffset) + "px";
      }
    }

    this.lastKnownScrollPosition = this.scrollPosition;
  }
}

export default Header;
