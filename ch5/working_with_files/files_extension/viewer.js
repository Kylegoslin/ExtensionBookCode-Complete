
let output = document.getElementById('output')
output.value =  localStorage.getItem("tempFile")
//localStorage.setItem("tempFile", output.value);


chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {
    
    
        console.log("Got message!");
        
        if(request.status == 'clear'){
            console.log("Running clear")
            let output = document.getElementById('output').value = ''
            localStorage.setItem("tempFile", '');
        }
        else if(request.status == 'save'){
        
            console.log("saving file locally")
            async function getNewFileHandle() {
                          try {
                
                            const newHandle = await window.showSaveFilePicker();
                            const writableStream = await newHandle.createWritable();
                            let content = document.getElementById('output').value;
                            await writableStream.write(content);

                     
                            await writableStream.close();
                          } catch (err) {
                            console.error(err.name, err.message);
                          }
            }//async function


            getNewFileHandle();
            
        }
        
    }//req function
    
    );
