


//
// Get status of the recording, either active or inactive
//
chrome.storage.local.get(["status"]).then((result) => {
    console.log("Current status is:  " + result.status);

    if (result.status == "active") {
        setActiveUI();
    }
});



// Update the UI to show a green bar and the word active
function setActiveUI(){

     console.log("Updating UI satus to green")
     let status = document.getElementById("status");
     status.innerHTML = "Active";
     status.style.backgroundColor = "#46ff33";
     
}


//
// Check if the status is active, if it is, run the setActiveUI function.
// to add a green bar
function checkStatusofUI(){

    console.log("checking status of UI")

    chrome.storage.local.get(["status"]).then((result) => {
        console.log("Current status is:  " + result.status);
    
        if (result.status == "active") {
            setActiveUI();
        }
    });


}

//
// Main buttons handlers
//
let startButton = document.querySelector("#startSession");
startButton.addEventListener("click", function () {
    startSession();
});

let stopButton = document.querySelector("#stopSession");
stopButton.addEventListener("click", function () {
    stopSession();
});

let stopButton2 = document.querySelector("#options");
stopButton2.addEventListener("click", function () {
    openOptions()
});

let clear = document.querySelector("#clear");
clear.addEventListener("click", function () {
    clearUI()
});



//
//  Start a new session
//
function startSession() {
    console.log("Session started....");


    // clear the UI fields
    clearUI()
    setActiveUI()

    // Save the start time locally
    let start = Math.round(Date.now() / 1000);
    chrome.storage.local.set({ startTime: start }).then(() => {
        console.log("Saved start time: " + start);
    });


   // Save the status as active as we are starting a new recording
   // session
   chrome.storage.local.set({ status: "active" }).then(() => {
    console.log("Status is set to active");
  });

    // Send a message to the background.js file to start recording
    chrome.runtime.sendMessage({ status: "start" });
}


function clearUI(){

    document.getElementById("history").innerHTML = "";
    document.getElementById("unique_url_ui").innerHTML = "";
    document.getElementById("total_urls_ui").innerHTML = "";
    document.getElementById("totalTime").innerHTML = "";
}

//
// Stop the current session
//
function stopSession() {
    console.log("Session stopped");


    // Send message to background.js to stop
    chrome.runtime.sendMessage({ status: "stop" });

}



//
// Update the UI with statistics
//
function updateUI(){


     chrome.storage.local.get(["startTime"]).then((result) => {
         let end = Math.round(Date.now() / 1000);
         console.log("start time is  is " + result.startTime);
 
         let total = end - Number(result.startTime);
         document.getElementById("totalTime").innerHTML = total;
     });
 


     chrome.storage.local.get(["totalUnique"]).then((result) => {
         document.getElementById("unique_url_ui").innerHTML = result.totalUnique;
     });
 
 
 
     chrome.storage.local.get(["totalURLs"]).then((result) => {
         document.getElementById("total_urls_ui").innerHTML = result.totalURLs;
     });
 
 
 
 
     // change the colour of the status field
     let status = document.getElementById("status");
     status.innerHTML = "Inactive";
     status.style.backgroundColor = "#FFFFFF";
 
     // get the session history and add it to the UI
     chrome.storage.local.get(["history"]).then((result) => {
         document.getElementById("history").innerHTML = result.history;
     });
 
}


//
// Listen for the background.js sending us a signal to
// update the UI of the panel with stats
//
chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {
  
        console.log("in popup.js")
        console.log(request);
  
        if(request.status == "update"){
                 updateUI()
        }
    }
)



//
// When called will open the extenion option page
//
function openOptions(){
    window.open(chrome.runtime.getURL('options.html'));
}

//
// When the panel is opened, check the status to see
// if it needs to be set to green
window.onload = function() {
    checkStatusofUI()
};
