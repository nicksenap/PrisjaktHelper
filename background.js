console.log("Background script running");

// Background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === "getOptions") {
    chrome.storage.sync.get(["behavior", "color"], function (result) {
      sendResponse({ options: result });
    });
    return true; // return true from the event listener to indicate you wish to send a response asynchronously
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let key in changes) {
    let storageChange = changes[key];
    if (key === "color" || key === "behavior") {
      // Inform all tabs that options have been updated.
      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
          chrome.storage.sync.get(["color", "behavior"], function (result) {
            chrome.tabs.sendMessage(tabs[i].id, {
              action: "updateOptions",
              options: {
                color: changes.color ? changes.color.newValue : result.color,
                behavior: changes.behavior
                  ? changes.behavior.newValue
                  : result.behavior,
              },
            });
          });
        }
      });
    }
  }
});
