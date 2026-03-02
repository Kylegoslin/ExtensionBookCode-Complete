// open the side panel when the extension icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "open",
    title: "Open Explain with AI",
    type: "normal",
    contexts: ["selection"],
  });

  // right click content menus
  chrome.contextMenus.create({
    id: "explain",
    title: "Explain with AI",
    type: "normal",
    contexts: ["selection"],
  });

  // Notification popup
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "Installed",
    message: "Extension installed!",
    buttons: [{ title: "Great job, you installed the extension!" }],
    priority: 0,
  });
});


chrome.contextMenus.onClicked.addListener(checkClicks);


async function checkClicks(data, tab) {
  // This will open the panel in all the pages on the current window.
  await chrome.sidePanel.open({ windowId: tab.windowId });

  console.log("click happened in context menu");
  console.log(data.menuItemId);

  
  if (data.menuItemId == "explain") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // get the selected text
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => window.getSelection().toString(),
        },
        (results) => {
          if (results && results[0]) {
            console.log(results[0].result);

            // send to the panel word box

            chrome.runtime.sendMessage({
              action: "update",
              text: results[0].result,
            });
          }
        }
      );
    });
  } // if
  else if (data.menuItemId == "open") {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
}


