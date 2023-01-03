browser.contextMenus.create({
    id: "add-stress",
    title: "Add stress marks"
  });
  
  function messageTab(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {});
  }
  
  function onExecuted(result) {
      let querying = browser.tabs.query({
          active: true,
          currentWindow: true
      });
      querying.then(messageTab);
  }
  
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add-stress") {
      let executing = browser.tabs.executeScript({
        file: "add-stress.js"
      });
      executing.then(onExecuted);
    }
  });
  