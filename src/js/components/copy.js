// Copy code
import EventHandler from "bootstrap/js/src/dom/event-handler.js";
import Toast from "../bootstrap/toast.js";

class Copy {
  constructor() {
    this.alert = null; // toast alert

    EventHandler.on(document, "DOMContentLoaded", () => {
      this.setup();
    });
  }

  setup() {
    const list = document.querySelectorAll(".code-listing");
    for (const li of list) {
      this.registerEvent(li);
    }
  }

  /**
   *
   * @param listing HTMLElement
   * @private
   */
  registerEvent(listing) {
    const copy = listing.querySelector(".code-copy");
    if (copy === null) {
      return;
    }

    EventHandler.on(listing, "mouseover", () => {
      copy.classList.add("show");
    });
    EventHandler.on(listing, "mouseout", () => {
      copy.classList.remove("show");
    });

    const btn = copy.querySelector(".btn");
    EventHandler.on(btn, "click", (e) => {
      const pres = listing.querySelectorAll("table td pre");
      if (pres.length > 1) {
        this.copyToClipboard(pres[1]);
      } else if (pres.length > 0) {
        this.copyToClipboard(pres[0]);
      }
    });
  }

  /**
   * @param pre HTMLElement
   * @private
   */
  copyToClipboard(pre) {
    navigator.clipboard.writeText(pre.textContent).then(() => {
      this.showAlert();
    }, (reason) => {
      console.log(reason);
    });
  }

  showAlert() {
    if (this.alert) {
      if (!this.alert.isShown()) {
        this.alert.show();
      }
      return;
    }

    const alertEl = document.querySelector("#code-copy-alert");
    this.alert = new Toast(alertEl, {
      delay: 3000
    });
    this.alert.show();
  }
}

export default Copy;
