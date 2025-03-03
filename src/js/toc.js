/**
 * TOC sidebar
 */

import EventHandler from "bootstrap/js/src/dom/event-handler.js";

const BREAKPOINT_XL = 1200; // minimum article dimension
const PANEL_MARGIN_LEFT = 12; // margin left
const PANEL_MARGIN_TOP = 24 + 48; // margin top + header height
// header + article top padding + footer + toc heading + toc top margin
const RESERVED_SPACE = 48 + 24 + 54 + 27 + 16;


class Toc {
  constructor() {
    this._article = null;
    this._panel = null;
    this._toc = null;

    this._titleHeight = 0; // title block height
    this._scrollPos = 0; // scroll position
    this._scrollTicking = false;
    this._lastPosLeft = 0; // last left position
    this._lastPosTop = 0; // last top position
    this._headings = []; // headings
    this._anchors = []; // toc anchors
    this._activeAnchor = null; // active anchor in toc list

    EventHandler.on(document, "DOMContentLoaded", () => {
      this.setup();
    });
  }

  setup() {
    const article = document.querySelector(".article")
    if (article === null) {
      return; // not article page
    }
    const panel = document.querySelector(".toc-panel")
    if (panel === null) {
      return;
    }
    const title = article.querySelector(".component")
    if (title === null) {
      return;
    }
    this._article = article;
    this._panel = panel;
    this._titleHeight = title.clientHeight;

    this._composeToc();
    this._panel.appendChild(this._toc);

    EventHandler.on(window, "resize", () => {
      window.requestAnimationFrame(() => {
        this._transformVisibility();
      });
    });

    EventHandler.on(window, "scroll", () => {
      this._scrollPos = window.scrollY;

      if (!this._scrollTicking) {
        window.requestAnimationFrame(() => {
          this._transformPos();
          this._spyScroll();
          this._scrollTicking = false;
        });
      }

      this._scrollTicking = true;
    });

    this._transformPos();
    this._spyScroll();
    this._transformVisibility();
  }

  _transformPos() {
    const left = this._article.offsetLeft + this._article.offsetWidth;
    if (left !== this._lastPosLeft) {
      this._panel.style.left = `${left + PANEL_MARGIN_LEFT}px`;
      this._lastPosLeft = left;
    }

    // Scroll up in Safari
    if (this._scrollPos < 0) {
      return;
    } else {
      // Scroll down in Safari
      const extra = this._scrollPos + document.documentElement.clientHeight;
      if (extra > document.documentElement.scrollHeight) {
        return;
      }
    }

    let top = PANEL_MARGIN_TOP;
    if (this._scrollPos < this._titleHeight) {
      const delta = this._titleHeight - this._scrollPos;
      top += delta;
    } else {
      top = PANEL_MARGIN_TOP;
    }
    if (top !== this._lastPosTop) {
      this._panel.style.top = `${top}px`;
      this._lastPosTop = top;
    }
  }

  _transformVisibility() {
    if (document.documentElement.clientWidth < BREAKPOINT_XL) {
      if (!this._panel.classList.contains("hidden")) {
        this._panel.classList.add("hidden");
      }
      return;
    }

    const delta = document.documentElement.clientHeight - RESERVED_SPACE;
    if (delta < this._titleHeight) {
      if (!this._panel.classList.contains("hidden")) {
        this._panel.classList.add("hidden");
      }
    } else {
      if (this._panel.classList.contains("hidden")) {
        this._panel.classList.remove("hidden");
      }
      this._toc.style.maxHeight = `${delta}px`;
    }
  }

  _spyScroll() {
    const currentHeading = this._queryCurrentHeading();
    if (currentHeading === null) {
      return;
    }

    let currentAnchor = null;
    for (const a of this._anchors) {
      if (a.getAttribute('href') === `#${currentHeading.id}`) {
        currentAnchor = a;
      }
    }
    if (currentAnchor === null) {
      return;
    }

    if (this._activeAnchor !== null) {
      this._activeAnchor.classList.remove("active");
    }
    currentAnchor.classList.add("active");
    this._activeAnchor = currentAnchor;
  }

  /**
   * @returns {HTMLHeadingElement|null}
   * @private
   */
  _queryCurrentHeading() {
    const hLen = this._headings.length;
    for (let i = 0; i < hLen; i++) {
      const h = this._headings[i];
      const startAt = h.offsetTop;
      let endAt = 0;
      if ((i + 1) < hLen) {
        const next = this._headings[i + 1];
        endAt = next.offsetTop;
      }
      if (this._scrollPos >= startAt) {
        if (endAt === 0) {
          return h;
        } else if (this._scrollPos < endAt) {
          return h;
        }
      }
    }

    return null;
  }

  _composeToc() {
    const headings = this._article.querySelectorAll(".component > .component-heading")
    for (const heading of headings) {
      if (heading.nodeName === "H2") {
        this._headings.push(heading);
      }
      if (heading.nodeName === "H3") {
        this._headings.push(heading);
      }
    }

    this._toc = document.createElement("ul");
    this._toc.classList.add("toc-sidebar");
    return this._appendItems();
  }

  _appendItems() {
    const len = this._headings.length;
    let parent = null;
    let subAppended = false;
    for (let i = 0; i < len; i++) {
      const h = this._headings[i];
      if (h.nodeName === "H2") {
        parent = this._createItem(h);
        this._toc.appendChild(parent);
        subAppended = false;
      }
      if (h.nodeName === "H3") {
        if (!subAppended) {
          const sub = this._appendSubItems(i, "H3");
          if (parent !== null) {
            parent.appendChild(sub);
          }

          subAppended = true;
        }
      }
    }
  }

  _appendSubItems(start, nodeName) {
    const ul = document.createElement("ul");
    const len = this._headings.length;
    for (let i = start; i < len; i++) {
      const h = this._headings[i];
      if (h.nodeName === nodeName) {
        ul.appendChild(this._createItem(h));
      } else {
        return ul;
      }
    }
    return ul;
  }

  _createItem(heading) {
    const anchor = document.createElement("a");
    anchor.setAttribute('href', '#' + heading.id);
    anchor.text = heading.textContent;
    if (heading.nodeName === "H3") {
      anchor.classList.add("l2");
    }

    this._anchors.push(anchor);
    const li = document.createElement("li");
    li.appendChild(anchor);
    return li;
  }
}

export default Toc;
