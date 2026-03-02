let btn = document.querySelector('#myButton')

btn.addEventListener('click', function() {

    console.log("main button clicked")

    let wordsString = document.getElementById('filter_words').value;
    console.log(wordsString)

    runProcess(wordsString)

});


async function runProcess(wordsString){

    console.log("in runProcess async");
    
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    const response = await chrome.tabs.sendMessage(tab.id, {status: "run_filter", words: wordsString});


}



