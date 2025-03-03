/**
 * Hide header on scroll
 */

import EventHandler from "bootstrap/js/src/dom/event-handler.js";

class Header {
  constructor() {
    this._scrollPosition = 0;
    this._lastKnownScrollPosition = 0;
    this._scrollTicking = false; // wait for previous transform animation

    this._scrolledOffset = 0;
    this._wrapper = null;
    this._wrapperHeight = 0;
    this._maxOffset = 0;


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
    this._wrapper = this._element.parentElement;
    this._wrapperHeight = this._wrapper.clientHeight;
    this._maxOffset = this._element.clientHeight;

    EventHandler.on(window, "scroll", () => {
      this._scrollPosition = window.scrollY;

      if (!this._scrollTicking) {
        window.requestAnimationFrame(() => {
          this._transformHeader();
          this._scrollTicking = false;
        });

        this._scrollTicking = true;
      }
    });
  }

  _transformHeader() {
    if (this._scrollPosition < 0) {
      // Scroll up in Safari
      return;
    } else {
      if (this._scrollPosition === this._lastKnownScrollPosition) {
        return;
      }

      // Scroll down in Safari
      const extra = this._scrollPosition + document.documentElement.clientHeight;
      if (extra > document.documentElement.scrollHeight) {
        return;
      }
    }

    if (this._scrollPosition > this._lastKnownScrollPosition) {
      const offset = this._scrollPosition - this._lastKnownScrollPosition;

      if (this._scrolledOffset > -(this._maxOffset)) {
        this._scrolledOffset -= offset;

        if (this._scrolledOffset < -(this._maxOffset)) {
          this._scrolledOffset = -(this._maxOffset);
        }

        this._element.style.transform = "translate3d(0, " + this._scrolledOffset + "px, 0)";
        this._wrapper.style.height = (this._wrapperHeight + this._scrolledOffset) + "px";
      }
    } else {
      const offset = this._lastKnownScrollPosition - this._scrollPosition;

      if (this._scrolledOffset < 0) {
        this._scrolledOffset += offset;

        if (this._scrolledOffset > 0) {
          this._scrolledOffset = 0;
        }

        this._element.style.transform = "translate3d(0, " + this._scrolledOffset + "px, 0)";
        this._wrapper.style.height = (this._wrapperHeight + this._scrolledOffset) + "px";
      }
    }

    this._lastKnownScrollPosition = this._scrollPosition;
  }
}

export default Header;
