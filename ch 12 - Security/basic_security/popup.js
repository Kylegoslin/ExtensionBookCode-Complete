


let saveButton = document.getElementById('save');
saveButton.addEventListener("click", () => {

   console.log("Clicked save") 

   let userEmail = document.getElementById('userEmail').value;
   let userPassword = document.getElementById('userPassword').value;    
    

   console.log("Email is: " + userEmail);
   console.log("Password is: "+ userPassword);
   
   
   let result1 = basicEmailCheck(userEmail)
   console.log("Basic email validation status " +result1);
   
   
   let result2 = validateEmailRegex(userEmail)
   console.log("RegEx email validation status " +result2);
   
 
});


function basicEmailCheck(userEmail){


    if(userEmail.includes("@") && userEmail.includes(".com") && userEmail.length < 20){
        return true;
    } else{
        return false;
    }

}


function validateEmailRegex(userEmail){


    // RFC 2822

     const myRe = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/


   const result = myRe.test(userEmail);




   return result
   
   
    
}

