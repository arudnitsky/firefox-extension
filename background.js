var scriptHasBeenInjected = false;

console.log("background.js executing");
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-stress",
    title: "Add stress marks"
  });
  console.debug("onInstalled.addListener done");
});

function onClickHandler(info, tab) {
  console.debug("onClickHandler");
  if (info.menuItemId === "add-stress") {
    if (!scriptHasBeenInjected) {
      injectScripts(tab.id);
    }
    sendMessageToTab(tab.id);
  }
  console.debug("onClickHandler done");
}

function injectScripts(tabId) {
  try {
    for (const cs of chrome.runtime.getManifest().content_scripts) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: cs.js,
      });
    }
    scriptHasBeenInjected = true;
    console.debug("injectScript done");
  } catch (error) {
    console.error("Could not inject scripts");
    console.error(error);
  }
}

function sendMessageToTab(tabId) {
  console.debug("sendMessageToTab " + tabId)
  chrome.tabs.sendMessage(tabId, { "selection": null } /*, logResponse*/);
  console.debug("sendMessageToTab done");
}

function logResponse(message) {
  console.debug(message);
}