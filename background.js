console.log("background.js executed");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-stress",
    title: "Add stress marks"
  });
  console.log("onInstalled.addListener");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("onClicked.addListener");
  if (info.menuItemId === "add-stress") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["walkNodeTree.js", "add-stress.js"],
    }).then( () => {
    console.log("executeScript done");
    sendMessage(tab.id);});
  }
});

function sendMessage(tabId) {
  console.log("sendMessage " + tabId)
  response = chrome.tabs.sendMessage(tabId, {"selection": null});
  console.log(response.farewell);
}
