

console.log("In contentscript.js");


try {

    console.log("Attempting to remove element...");
    var e = document.querySelector('#dfp-ad-top');
    console.log(e);


    e.remove();
    console.log("Element removed");



    // create a new text element

    const newContent = document.createTextNode("We got rid of that ad!");

    // Attach the element to the top right corner of the header
    let newtop = document.querySelector('#masthead-bar-one')
    console.log(newtop)
    newtop.appendChild(newContent);
  
  
  } catch (error) {

        console.log("Well that didn't work")
}
