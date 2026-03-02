

let selectedFile = document.getElementById('selectFile');
selectedFile.addEventListener('click', async () => {


  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  localStorage.setItem("tempFile", contents);

  chrome.tabs.create({url: 'viewer.html'}) 


  
});



// Save file
let saveFile = document.getElementById('saveFile');
saveFile.addEventListener('click', async () => {


     console.log("save file called");
    
     const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
     const response = await chrome.tabs.sendMessage(tab.id, {status: "save"});
     
     console.log("message sent")


});


let clear = document.getElementById('clear');
clear.addEventListener('click', async () => {

     console.log("Clearing...");
    
     const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
     const response = await chrome.tabs.sendMessage(tab.id, {status: "clear"});
     
     console.log("message sent")
})









