/**
 * Hide header on scroll
 */

import BaseComponent from "bootstrap/js/src/base-component.js";
import EventHandler from "bootstrap/js/src/dom/event-handler.js";

const Default = {
};
const DefaultType = {
};

class Header extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    this._scrollPosition = 0;
    this._lastKnownScrollPosition = 0;
    this._scrollTicking = false;

    this._scrolledOffset = 0;
    this._wrapper = this._element.parentElement;
    this._wrapperHeight = this._wrapper.clientHeight;
    this._maxOffset = this._element.clientHeight;

    this._setListeners();
  }

  static get Default() {
    return Default;
  }

  static get DefaultType() {
    return DefaultType;
  }

  static get NAME() {
    return "header";
  }

  _setListeners() {
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
    if (this._scrollPosition === this._lastKnownScrollPosition) {
      return;
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
