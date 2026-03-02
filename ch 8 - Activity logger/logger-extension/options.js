// Saves options to storage
const saveOptions = () => {
  const value = document.getElementById('interval').value;

  chrome.storage.local.set({ interval: value }).then(() => {
    console.log("interval option saved");
  });
}

// Restores when options.html loaded
const restoreOptions = () => {


  chrome.storage.local.get(["interval"]).then((result) => {
    console.log("save interval in storage is " + result.interval)

    document.getElementById("interval").value = result.interval;
});

};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
