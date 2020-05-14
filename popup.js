document.addEventListener(
  "DOMContentLoaded",
  function () {
    let links = document.getElementsByTagName("a");
    for (let link of links) {
      let location = link.href;
      link.onclick = function () {
        chrome.tabs.create({ active: true, url: location });
      };
    }
  },
  false
);
