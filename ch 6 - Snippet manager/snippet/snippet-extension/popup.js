/*
#############################################################
popup.js

This file contains all the button listners for the extension.

It also contains the functions to perform the fetch() calls on
the API backend.

#############################################################
*/

// fill the drop down select on the extension with list names
populateListNames().then((json) => {
  for (let i = 0; i < json.length; i++) {
    let singleItem = json[i].listname;
    $("#myListNames").append(new Option(singleItem, singleItem));
  }
});

// when the select option changes to view a new
// list, load all the Snippets related to that
// list into the table.
$("#myListNames").on("change", function () {
  console.log(this.value);

  getAllInList(this.value);
});

// when called will fill the drop down select
function getAllInList(listname) {
  console.log("getting all snippets in list");

  $("table tbody").empty();

  getAllListSnippets(listname).then((json) => {
    console.log(json);

    for (let i = 0; i < json.length; i++) {
      let singleSnipet = json[i].snippet;
      let listName = json[i].listname;
      let id = json[i]._id;

      let newRow = `
                <tr>
                <td></td>
                <td>${listname}</td>
                <td>${singleSnipet}</td>
                <td> <button expandId ="${id}" type="submit" class="btn btn-link">Expand</button></td>
               </tr>
               `;

      tableBody = $("table tbody");
      tableBody.append(newRow);
    }
  });
}

// Get one single Snippet
// for the view Snippet modal
function getSingleSnippet(id) {
  let json = getOneSnippet(id).then((json) => {
    console.log("completed");
    console.log(json)
    $("#viewSingleTA").val(json.snippet);
  });
}

// open the modal to save a new Snippet
let btn = document.getElementById("openSave");
btn.addEventListener("click", function () {
  console.log("clicked");
  $("#saveNewModal").modal("show");
});

// close button on save modal
let btn2 = document.getElementById("closeSave");
btn2.addEventListener("click", function () {
  console.log("clicked");
  $("#saveNewModal").modal("hide");
});

// save Snippet button
let btn3 = document.getElementById("saveSnippet");
btn3.addEventListener("click", function () {
  console.log("clicked");
  let content = $("#newSnippetContent").val();
  let selectedList = $("#myListNames").val();

  // if they haven't selected a list yet
  if (selectedList == "") {
    alert("select a list first");
    //$("#newSnippetContent").val("");
    //$("#saveNewModal").modal("hide");
  } else {
    saveNewSnippetToDb(content, selectedList);
    $("#newSnippetContent").val("");
    $("#saveNewModal").modal("hide");
    getAllInList(selectedList);
  }
});

// close Snippet modal
let btn5 = document.getElementById("closeSingleSnippet");
btn5.addEventListener("click", function () {
  console.log("clicked");
  $("#viewSingleSnippet").modal("hide");
});

// -------------------------------
//
// Each individual function that talsk to
// the API backend to get JSON data for the extension
// -------------------------------
async function getAllListSnippets(listName) {
  const url = "http://localhost:3000/api/getAllByListName?listname=" + listName;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

async function getOneSnippet(id) {
  const url = "http://localhost:3000/api/getOneSnippet?id=" + id;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

// The name of a new list to be created is passed to this function
// A call is then made tot he API to save the list name to the database
async function addNewListToDb(listname) {
  const url = "http://localhost:3000/api/addNewList?newlistname=" + listname;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

//save new Snippet to the db
async function saveNewSnippetToDb(content, selectedList) {
  const url = `http://localhost:3000/api/saveSnippet?content=${content}&selectedList=${selectedList}`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

async function populateListNames() {
  const url = "http://localhost:3000/api/getListNames";
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

// listener for all "expand" options beside Snippet
// to open modal and pass ID in
document.onclick = function (e) {
  if (e.target.getAttribute("expandId")) {
    var id = e.target.getAttribute("expandId");
    console.log(id);
    getSingleSnippet(id);
    $("#currentSnippetId").html(id);
    $("#viewSingleSnippet").modal("show");
  }

  if (e.target.id == "addNewList") {
    console.log("adding new list..");
    // get the name for the new list from the UI
    let newListName = $("#newListName").val();

    addNewListToDb(newListName).then((json) => {
      console.log("completed");
      $("#newListName").val("");

      // Fill the select with all list names
      // even the new name
      populateListNames().then((json) => {
        for (let i = 0; i < json.length; i++) {
          let singleItem = json[i].listname;
          $("#myListNames").append(new Option(singleItem, singleItem));
        }
        // select the list item we just created
        $("#myListNames").val(newListName);
      });
    });
  }
};
