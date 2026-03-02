


let saveButton = document.getElementById('save');
saveButton.addEventListener("click", () => {

   console.log("Clicked save") 


   let firstName = document.getElementById('firstName').value;
   let lastName = document.getElementById('lastName').value;
   let userEmail = document.getElementById('userEmail').value;
   let userPassword = document.getElementById('userPassword').value;    
    

   console.log("Firstname is: " + firstName);
   console.log("Lastname is: " + firstName);
   console.log("Email is: " + userEmail);
   console.log("Password is: "+ userPassword);
   
   
   let error = ''; // variable to hold the error message when form items not valid
   
   
   
   let result1 = validateName(firstName)
   let result2 = validateName(lastName)   
   let result3 = validateEmailRegex(userEmail)
   let result4  = validatePass(userPassword)
 


   if(!result1){
        error+= 'First name not valid <br>'
   }
   if(!result2){
        error+= 'Second name not valid <br>'
   }
   if(!result3){
        error+= 'Email not valid <br>'
   }  
   if(!result4){
        error+= 'Password not valid <br>'
   }
   
 
 
  if(error.length > 0){
    document.getElementById('errorMessage').innerHTML = error + '<p>';
  } else {
    document.getElementById('errorMessage').innerHTML = '<p>';
     //
     // Send the data to the API server
     //
     //
  }
 
 
});

function validateName(name){

    if(name.length > 1 && name.length < 20){
        return true
    }
    else {
        return false;
    }
}


function validatePass(pass){
    const regex = /^(?=.{11,})(?:.*[!@#$%^&*(),.?":{}|<>]){3,}/;

    if (regex.test(pass)) {
       
        return true;
      } else {

        return false
      }
}


function validateEmailRegex(userEmail){
    // RFC 2822

     const myRe = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/

   const result = myRe.test(userEmail);

   return result 
    
}

