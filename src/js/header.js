/**
 * Hide header on scroll
 */

import BaseComponent from "bootstrap/js/src/base-component.js";
import EventHandler from "bootstrap/js/src/dom/event-handler.js";

const Default = {};
const DefaultType = {};

class Header extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    this._scrollPosition = 0;
    this._lastKnownScrollPosition = 0;
    this._scrollTicking = false;
    this._maxOffset = this._element.clientHeight;
    this._upOffset = 0;
    this._downOffset = 0;

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
      const max = this._downOffset > 0 ? this._downOffset : this._maxOffset;

      if (this._upOffset < max) {
        this._upOffset += offset;

        if (this._upOffset > max) {
          this._upOffset = this._maxOffset;
        }

        console.log("UP: " + this._upOffset);
      }


      // this._element.style.transform = "";
    } else {
      const offset = this._lastKnownScrollPosition - this._scrollPosition;
      const max = this._upOffset > 0 ? this._upOffset : this._maxOffset;

      if (this._downOffset < max) {
        this._downOffset += offset;

        if (this._downOffset > max) {
          this._downOffset = max;
        }

        console.log("DOWN: " + this._downOffset);
      }

      // this._element.style.transform = "";
    }

    this._lastKnownScrollPosition = this._scrollPosition;
  }
}

export default Header;
