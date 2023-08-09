import Header from "./header.js";

function main() {
  const header = document.querySelector(".header-shadow");
  if (header !== null) {
    new Header(header, {});
  }
}

export default main;
