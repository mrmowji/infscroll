// the main context menu element
chrome.contextMenus.create({
  title: "Scroll",
  contexts: ["all"],
  id: "parent",
});

// infinitely scrolling up context menu element
chrome.contextMenus.create({
  title: "Infinitely Up",
  contexts: ["all"],
  parentId: "parent",
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      action: "scroll",
      direction: "up",
      isInfinite: true,
    });
  },
});

// infinitely scrolling down context menu element
chrome.contextMenus.create({
  title: "Infinitely Down",
  contexts: ["all"],
  parentId: "parent",
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      action: "scroll",
      direction: "down",
      isInfinite: true,
    });
  },
});

// separator context menu element
chrome.contextMenus.create({ type: "separator", parentId: "parent" });

// stop scrolling context menu element
chrome.contextMenus.create({
  title: "Stop",
  contexts: ["all"],
  parentId: "parent",
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      action: "stop",
    });
  },
});

// separator context menu element
chrome.contextMenus.create({ type: "separator", parentId: "parent" });

// scroll up N times context menu element
chrome.contextMenus.create({
  title: "N Times Up",
  contexts: ["all"],
  parentId: "parent",
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      action: "scroll",
      direction: "up",
    });
  },
});

// scroll down N times context menu element
chrome.contextMenus.create({
  title: "N Times Down",
  contexts: ["all"],
  parentId: "parent",
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      action: "scroll",
      direction: "down",
    });
  },
});
