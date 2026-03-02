let loginBtn = document.querySelector("#loginButton");
loginBtn.addEventListener("click", async function () {
  let userEmail = document.querySelector("#userEmail").value;
  let userPassword = document.querySelector("#userPassword").value;
  hideAll();

  try {
    let url = `http://localhost:3000/api/login?email=${userEmail}&pass=${userPassword}`;
    const response = await fetch(url);

    const json = await response.json();
    console.log(json);

    if (json.token) {
      console.log("login details correct");
      hideAll();
      $("#dashboardPanel").show();

      // save a token to say we have auth

      chrome.storage.local.set({ token: json.token }).then(() => {
        console.log("Saved auth token" + json.token);
      });
    } else {
      console.log("login details incorrect");
      hideAll();
      $("#incorrectPanel").show();
    }
  } catch (error) {
    console.log("Cannot reach API server")
    console.error(error.message);
  }
});

let registerBtn = document.querySelector("#registerButton");
registerBtn.addEventListener("click", async function () {
  let registerEmail = document.querySelector("#registerEmail").value;
  let registerPassword = document.querySelector("#registerPassword").value;

  let url = `http://localhost:3000/api/register?email=${registerEmail}&pass=${registerEmail}`;
  const response = await fetch(url);

  const json = await response.json();
  console.log(json);

  hideAll();
  $("#registerSuccessPanel").show();
});

let signupButton = document.querySelector("#signupButton");
signupButton.addEventListener("click", async function () {
  hideAll();

  $("#registerPanel").show();
});

let logoutButton = document.querySelector("#logoutButton");
logoutButton.addEventListener("click", async function () {
  chrome.storage.local.get(["token"]).then(async (result) => {
    console.log("Current token is:  " + result.token);

    const headers = { Authorization: `${result.token}` };
    let url = `http://localhost:3000/api/logout`;
    const response = await fetch(url, { headers });

    const json = await response.json();
    console.log(json);

    hideAll();

    $("#loggedoutPanel").show();

    chrome.storage.local.set({ token: "" }).then(() => {
      console.log("removed token");
    });
  });
});

let goToLogin = document.querySelector("#goToLogin");

goToLogin.addEventListener("click", async function () {
  console.log("go to login button clicked");
  hideAll();

  $("#loginPanel").show();
});

function hideAll() {
  $("#registerPanel").hide();
  $("#loginPanel").hide();
  $("#registerSuccessPanel").hide();
  $("#incorrectPanel").hide();
  $("#dashboardPanel").hide();
  $("#loggedoutPanel").hide();
}

function checkStatusOfAuth() {
  console.log("checking status of UI");

  chrome.storage.local.get(["token"]).then(async (result) => {
    console.log("Current token is:  " + result.token);

    // make a call to server to see if token is still valid.

    try {
      const headers = { Authorization: `${result.token}` };
      let url = `http://localhost:3000/api/validate`;
      const response = await fetch(url, { headers });

      const json = await response.json();
      console.log(json);

      if (json.result == "invalid") {
        console.log("need to authenticate");
        // otherwise send them to the login
        hideAll();
        $("#loginPanel").show();
      } else {
        console.log("already authenticated");
        hideAll();
        $("#dashboardPanel").show();
      }
    } catch (er) {
      console.log("API server disconected");
      hideAll();
      $("#loginPanel").show();
    } 

   if(result.token == ""){

    hideAll();
    $("#loginPanel").show();
    }
  }); //storage
}

window.onload = function () {
  checkStatusOfAuth();
};
