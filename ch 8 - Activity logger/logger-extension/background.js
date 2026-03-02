console.log("In background.js");

let urlHistory = []; // store all URL history here for each snap shot of the URL
let uniqueHistory = []; // only store unique URLs here

// when the icon is clicked in the browser menu bar, open the side panel
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(console.error);
});

//
// When the keys are pressed defined in the manifest.json,
// we will open this page
chrome.commands.onCommand.addListener((command) => {
  if (command !== "open-tab") return;
  chrome.tabs.create({ url: "options.html" });
});




//
// Handler to wait for start or stop message.
//
//

chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {

         console.log("in bg.js")
         console.log(request);

         if(request.status == "start"){
            startRecording()
         } else{
            stopRecording()
         }
  }

)






// loop to check if it is active or not
function startRecording(){
  // clear the history arrays
  urlHistory = [];
  uniqueHistory = [];
  // Get the number of interval for the delay betwen recordings
  chrome.storage.local.get(["interval"]).then((result) => {
    console.log("save interval in storage is " + result.interval)

    let interval = result.interval

    if(!result.interval){

      interval = 1 / 6
    }
   chrome.alarms.create("myTask", { periodInMinutes: Number(interval) }); 
});
}



chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "myTask") {
          console.log("Recording in loop");
        saveCurrentTabInfo();
 
  }
});


  //
  // Stop recording
  //
  function stopRecording(){

    console.log("Stopping recording...")
    
    chrome.alarms.clear("myTask");
    saveSessionData();

    chrome.storage.local.set({ status: "inactive" }).then(() => {
      console.log("Value is set to inactive");
    });

    // send back to popup.js
    chrome.runtime.sendMessage({ status: "update" });
  }


//
// Save the values from the current session to local storage
//
function saveSessionData() {


  let historyForUI = "";
  urlHistory.forEach((item) => {
    historyForUI = historyForUI + item + "\n---\n";
  });



  chrome.storage.local.set({ history: historyForUI }).then(() => {
    console.log("session history saved");

  });



  let total = uniqueHistory.length;

  chrome.storage.local.set({ totalUnique: total }).then(() => {
    console.log("saved total unique URLs");
  });


  let fullHistory = urlHistory.length;

  chrome.storage.local.set({ totalURLs: fullHistory }).then(() => {
    console.log("saved total URLs");
  });
}



//
// Get info from the current tab and save it.
//
//
async function saveCurrentTabInfo() {
  console.log("Recording..");


  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (tab) {

    // store unique URLs if we haven't seen them before
    if (!uniqueHistory.includes(tab.url)) {
      
      uniqueHistory.push(tab.url);
    }

    
    // Save all URLs to history
    urlHistory.push(tab.url);
  }
}
