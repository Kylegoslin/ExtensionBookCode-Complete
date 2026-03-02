console.log("In background.js");

function injectedFunction() {
  console.log("Changing color");
  document.body.style.backgroundColor = "grey";
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : injectedFunction,
  });
});
