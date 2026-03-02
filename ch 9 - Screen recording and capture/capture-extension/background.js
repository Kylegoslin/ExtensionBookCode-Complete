console.log("In background.js");

chrome.runtime.onInstalled.addListener(async () => {
  
    // right click content menus
    chrome.contextMenus.create({
      id: "download_page",
      title: "Download page",
      type: 'normal',
      contexts: ['page'],
    });
    
    
     chrome.contextMenus.create({
      id: "start_recording",
      title: "Start recording",
      type: 'normal',
      contexts: ['page'],
    });
    
    chrome.contextMenus.create({
      id: "stop_recording",
      title: "Stop recording",
      type: 'normal',
      contexts: ['page'],
    });
    
    
      // Notification popup
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Installed',
    message: "Extension installed!",
    buttons: [{ title: 'Great job, you installed the extension!' }],
    priority: 0
  });
  
  }); // context menus






  
  chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {
  
        console.log(request);

         // sent from offscreen.js
         if(request.type == "save-video-download"){ 
            console.log("Saving downloaded video")

            // save the video that was recorded
            chrome.downloads.download({
              url: request.data
            });
        }  
        // sent from the popup.js associated with the popup.html UI 
        else if(request.type == "download-page"){
        
             saveCurrentPageToFile()
        }
        else if(request.type =="start-recording"){
            startRecordingCurrentTab()
        }
        else if(request.type =="stop-recording"){
            stopRecordingCurrentTab()
        }
    }// function
) // listener




// context menu listeners
chrome.contextMenus.onClicked.addListener(
  checkClicks,
)

function checkClicks(data){

  console.log("click happened in menu")
  console.log(data.menuItemId)

  if(data.menuItemId == "download_page"){

    saveCurrentPageToFile()

  }
  else if(data.menuItemId =="start_recording"){
   
    startRecordingCurrentTab()

  }
  else if(data.menuItemId =="stop_recording"){

   
    stopRecordingCurrentTab()

  }
}



async function startRecordingCurrentTab(){

    const existingContexts = await chrome.runtime.getContexts({});
    let recording = false;

    const offscreenDocument = existingContexts.find(
      (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
    );

    // If an offscreen document is not already open, create one.
    if (!offscreenDocument) {
      // Create an offscreen document.
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'Recording from chrome.tabCapture API'
      });
    } else {
      recording = offscreenDocument.documentUrl.endsWith('#recording');
    }

    if (recording) { // if already recording
      chrome.runtime.sendMessage({ 
        type: 'stop-recording',
        target: 'offscreen'
      });
    
      return;
    }





       // Get the current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });


      // Get a MediaStream for the active tab.
      const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: tab.id
      });

      // Send the stream ID to the offscreen document to start recording.
      chrome.runtime.sendMessage({
        type: 'start-recording',
        target: 'offscreen',
        data: streamId
      });
}

async function saveCurrentPageToFile(){

  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, async (blob) => {
    const content = await blob.text();
    const url = "data:application/x-mimearchive;base64," + btoa(content);
    chrome.downloads.download({
        url,
        filename: 'filename.mhtml'
    });
});


}


async function stopRecordingCurrentTab(){
   
    chrome.runtime.sendMessage({
      type: 'stop-recording',
      target: 'offscreen'
    });
}




