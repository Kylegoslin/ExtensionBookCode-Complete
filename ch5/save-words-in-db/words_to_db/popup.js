

// Add a word to the storage
let saveButton = document.getElementById('saveNameAndWord');
saveButton.addEventListener("click", () => {


    console.log("Clicked save")
  

    // get word to save
    let newName = document.getElementById('newWord').value;
    let newWord = document.getElementById('newName').value;
    


    console.log("New name is: " + newName);
    console.log("New word is: " + newWord);

    const url = `http://localhost:3000/api/saveData?name=${newName}&word=${newWord}`;


    async function saveToDb() {
      
    try {
      console.log("running fetch for saving")
      const response = await fetch(url);
      const data = await response.json();
      return data
   
    } catch (error) {
        console.log(error);
      }
    }//saveToDb

    saveToDb().then(function(data){
      console.log("clearing values from text boxes")
  
      if(data.status == 'saved') {
        document.getElementById('newWord').value='';
        document.getElementById('newName').value='';
      } else {
        console.log("cannot clear, db call error")
      }


    })//then

 
}); // route







// Get words from the storage
let getWordsButton = document.getElementById('getWords');
getWordsButton.addEventListener("click", () => {

  console.log("Clicked get words")


  async function getData() {

    const url = `http://localhost:3000/api/getData`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      return data

    } catch (error) {
      console.error("error");
    }
  }//getData
  
      
  getData().then(function(data){
    console.log("..................running then..")
    console.log(data)

 
    let dataToSend = '';

    data.forEach(element => {
       let name = element.name;
       let word = element.word

       let newLine = `${name} word is ${word}`

       dataToSend += '\n' + newLine
    });
     console.log("adding data to UI")
     document.getElementById('output').value = dataToSend;

});





});




// Clear the database records
let clearButton = document.getElementById('clear');
clearButton.addEventListener("click", () => {
    
    console.log("Calling clear")


    async function deleteAll() {

      const url = `http://localhost:3000/api/deleteAll`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data
  
      } catch (error) {
        console.error("error");
      }


    }//deleteAll
    

    deleteAll().then(function(data){

      document.getElementById('output').value = '';

    });

  
});



