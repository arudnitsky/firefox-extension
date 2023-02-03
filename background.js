chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled.addListener");  
  chrome.contextMenus.create({
    id: "add-stress",
    title: "Add stress marks"
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("onClicked.addListener");
  if (info.menuItemId === "add-stress") {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ["add-stress.js"]
    }).then(sendMessage(tab.id));
  }
});

function sendMessage(tabId) {
  console.log("sendMessage")
  chrome.tabs.sendMessage(tabId, {});
}
