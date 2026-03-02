let btn = document.getElementById('myButton')
btn.addEventListener('click', function() {

        console.log("clicked") 
        getRecordFromDatabase()

});

function getRecordFromDatabase(){

    console.log("getting record from the database"); 
    let result = fetch('http://localhost:3000/api/getData')

    result.then((response) => {
        const prom = response.json();       
        prom.then((data) => {
              
              console.log(data.firstname);
              document.getElementById('outputArea').innerHTML = "Hello " + data.name;
        });
    });
       
}

