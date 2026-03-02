

// Add a word to the storage
let saveButton = document.getElementById('saveWord');
saveButton.addEventListener("click", () => {


    console.log("Clicked save word")
  

    // get word to save
    let val = document.getElementById('newWord').value;

    let newWord = val;
    console.log("New word is: " + newWord);
    chrome.storage.local.get(['word']).then((result) => {

        if(result.word){ // if it exists
            console.log("existing result: " + result.word)
            let newRecord = {"word": result.word + ' ' + newWord}
            chrome.storage.local.set(newRecord)

        } else { // if it does not exist
            chrome.storage.local.set({"word": newWord})
        }

    });

    document.getElementById('newWord').value='';
});



// Get words from the storage
let getWordsButton = document.getElementById('getWords');
getWordsButton.addEventListener("click", () => {

    console.log("Clicked get words")

    chrome.storage.local.get(['word']).then((result) => {
     
            // check if there is a record to show on the output box
            if(result.word === undefined){

                document.getElementById('output').value = ''
            } else {

                console.log(result)
                document.getElementById('output').value = result.word;
    
            }
        
    });


});


// Clear the storage
let clearButton = document.getElementById('clear');
clearButton.addEventListener("click", () => {
    
    console.log("Calling clear")

    chrome.storage.local.clear()
    document.getElementById('output').value = '';
});



