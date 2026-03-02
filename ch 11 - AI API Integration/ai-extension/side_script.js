$("#spin").hide();

// Listen for the user to click the Explain button
// on the side panel
let btn = document.querySelector("#runButton");

btn.addEventListener("click", function () {
  console.log("Explain button clicked");

  let word = document.getElementById("myWord").value;
  console.log(word);
  if (word.length == 0) {
    $("#errorMessage").html("Please enter a word");
  } else {
    $("#errorMessage").html("");
    $("#spin").show();
    callAPI(word);
  }
});



// -------------------------------------------
// Make a call to the API server and pass
// the word we want to describe
// -------------------------------------------
function callAPI(word) {
  console.log("Calling API");

  fetchData("http://localhost:3000/api/call1?word=" + word).then((response) => {
    if (response == null) {
      console.log("No data to update ");
    } else {
      const prom = response.json();

      prom.then((data) => {
        console.log(data);

        document.getElementById("outputArea").innerHTML = data.output_text;

        $("#spin").hide();
      });
    }
  });
} //callAPI



//
// Perform the fetch on the API server URL
//
async function fetchData(url) {
  try {
    let result = await fetch(url);

    return result;
  } catch (error) {
    console.log("Error contacting the API server. Is it running?");
    $("#errorMessage").html("Cannot reach API server!");
    return null;
  }
}


// --------------------------------------------------
// Listen for a message from service-worker telling us
// what word to process
//  -------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Got a message from the service worker..." + message);

  chrome.windows.getCurrent({ populate: true }, (window) => {
    chrome.sidePanel.open({ windowId: window.id });
  });

  if (message.action === "update") {
    document.getElementById("myWord").value = message.text;

    $("#spin").show();

    callAPI(message.text);
  }
});
