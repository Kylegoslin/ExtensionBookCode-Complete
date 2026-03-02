// --------------------------------
// Main buttons handlers for the pop up
//
// --------------------------------


let startRecordingButton = document.querySelector("#startRecordingButton");
startRecordingButton.addEventListener("click", function () {
 
 chrome.runtime.sendMessage({ type: 'start-recording', target: 'background' });
});



let stopRecordingButton = document.querySelector("#stopRecordingButton");
stopRecordingButton.addEventListener("click", function () {

 chrome.runtime.sendMessage({ type: 'stop-recording', target: 'background' });

});

let downloadPageButton = document.querySelector("#downloadPageButton");
downloadPageButton.addEventListener("click", function () {

chrome.runtime.sendMessage({ type: 'download-page', target: 'background' });


});
