
console.log("In content-script.js")


chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {

            
        console.log(request);
      
        if (request.status == 'run_filter'){
            console.log("running filter");

            let pairs = processWords(request.words);

            for (const [key, value] of Object.entries(pairs)) {
                    console.log(`${key}: ${value}`);
                    replaceText(document.body, key, value);       
            }
        }
   
 }//listener function
); //listener




function processWords(wordsList){

    console.log("Processing words")
    let pairs = {}
    
    let items = wordsList.split('\n')
    

    
    items.forEach((singleItem) => {
  
        if(singleItem.includes("=")){
            console.log(singleItem);
            
            key = singleItem.split('=')[0]
            value = singleItem.split('=')[1]
            

            pairs[key] = value
            
            
        }
            
    });


    return pairs


  

}










// Function to replace a single key with a value in text nodes
// better to avoid innerHTML changes as it reparses the page
function replaceText(node, key, value) {
    if (node.nodeType === Node.TEXT_NODE) {
        const regex = new RegExp(`\\b${key}\\b`, "gi");  // case-insensitive match for whole words
        node.textContent = node.textContent.replace(regex, value);
    } else {
        for (let child of node.childNodes) {
            replaceText(child, key, value);
        }
    }
}


