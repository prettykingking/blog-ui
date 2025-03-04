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
    this.article = null;
    this.panel = null;
    this.toc = null;

    this.titleHeight = 0; // title block height
    this.scrollPos = 0; // scroll position
    this.scrollTicking = false;
    this.lastPosLeft = 0; // last left position
    this.lastPosTop = 0; // last top position
    this.headings = []; // headings
    this.anchors = []; // toc anchors
    this.activeAnchor = null; // active anchor in toc list

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
    this.article = article;
    this.panel = panel;
    this.titleHeight = title.clientHeight;

    this.composeToc();
    this.panel.appendChild(this.toc);

    EventHandler.on(window, "resize", () => {
      window.requestAnimationFrame(() => {
        this.transformVisibility();
      });
    });

    EventHandler.on(window, "scroll", () => {
      this.scrollPos = window.scrollY;

      if (!this.scrollTicking) {
        window.requestAnimationFrame(() => {
          this.transformPos();
          this.spyScroll();
          this.scrollTicking = false;
        });
      }

      this.scrollTicking = true;
    });

    this.transformPos();
    this.spyScroll();
    this.transformVisibility();
  }

  transformPos() {
    const left = this.article.offsetLeft + this.article.offsetWidth;
    if (left !== this.lastPosLeft) {
      this.panel.style.left = `${left + PANEL_MARGIN_LEFT}px`;
      this.lastPosLeft = left;
    }

    // Scroll up in Safari
    if (this.scrollPos < 0) {
      return;
    } else {
      // Scroll down in Safari
      const extra = this.scrollPos + document.documentElement.clientHeight;
      if (extra > document.documentElement.scrollHeight) {
        return;
      }
    }

    let top = PANEL_MARGIN_TOP;
    if (this.scrollPos < this.titleHeight) {
      const delta = this.titleHeight - this.scrollPos;
      top += delta;
    } else {
      top = PANEL_MARGIN_TOP;
    }
    if (top !== this.lastPosTop) {
      this.panel.style.top = `${top}px`;
      this.lastPosTop = top;
    }
  }

  transformVisibility() {
    if (document.documentElement.clientWidth < BREAKPOINT_XL) {
      if (!this.panel.classList.contains("hidden")) {
        this.panel.classList.add("hidden");
      }
      return;
    }

    const delta = document.documentElement.clientHeight - RESERVED_SPACE;
    if (delta < this.titleHeight) {
      if (!this.panel.classList.contains("hidden")) {
        this.panel.classList.add("hidden");
      }
    } else {
      if (this.panel.classList.contains("hidden")) {
        this.panel.classList.remove("hidden");
      }
      this.toc.style.maxHeight = `${delta}px`;
    }
  }

  spyScroll() {
    const currentHeading = this.queryCurrentHeading();
    if (currentHeading === null) {
      return;
    }

    let currentAnchor = null;
    for (const a of this.anchors) {
      if (a.getAttribute('href') === `#${currentHeading.id}`) {
        currentAnchor = a;
      }
    }
    if (currentAnchor === null) {
      return;
    }

    if (this.activeAnchor !== null) {
      this.activeAnchor.classList.remove("active");
    }
    currentAnchor.classList.add("active");
    this.activeAnchor = currentAnchor;
  }

  /**
   * @returns {HTMLHeadingElement|null}
   * @private
   */
  queryCurrentHeading() {
    const hLen = this.headings.length;
    for (let i = 0; i < hLen; i++) {
      const h = this.headings[i];
      const startAt = h.offsetTop;
      let endAt = 0;
      if ((i + 1) < hLen) {
        const next = this.headings[i + 1];
        endAt = next.offsetTop;
      }
      if (this.scrollPos >= startAt) {
        if (endAt === 0) {
          return h;
        } else if (this.scrollPos < endAt) {
          return h;
        }
      }
    }

    return null;
  }

  composeToc() {
    const headings = this.article.querySelectorAll(".component > .component-heading")
    for (const heading of headings) {
      if (heading.nodeName === "H2") {
        this.headings.push(heading);
      }
      if (heading.nodeName === "H3") {
        this.headings.push(heading);
      }
    }

    this.toc = document.createElement("ul");
    this.toc.classList.add("toc-sidebar");
    return this.appendItems();
  }

  appendItems() {
    const len = this.headings.length;
    let parent = null;
    let subAppended = false;
    for (let i = 0; i < len; i++) {
      const h = this.headings[i];
      if (h.nodeName === "H2") {
        parent = this.createItem(h);
        this.toc.appendChild(parent);
        subAppended = false;
      }
      if (h.nodeName === "H3") {
        if (!subAppended) {
          const sub = this.appendSubItems(i, "H3");
          if (parent !== null) {
            parent.appendChild(sub);
          }

          subAppended = true;
        }
      }
    }
  }

  appendSubItems(start, nodeName) {
    const ul = document.createElement("ul");
    const len = this.headings.length;
    for (let i = start; i < len; i++) {
      const h = this.headings[i];
      if (h.nodeName === nodeName) {
        ul.appendChild(this.createItem(h));
      } else {
        return ul;
      }
    }
    return ul;
  }

  createItem(heading) {
    const anchor = document.createElement("a");
    anchor.setAttribute('href', '#' + heading.id);
    anchor.text = heading.textContent;
    if (heading.nodeName === "H3") {
      anchor.classList.add("l2");
    }

    this.anchors.push(anchor);
    const li = document.createElement("li");
    li.appendChild(anchor);
    return li;
  }
}

export default Toc;
