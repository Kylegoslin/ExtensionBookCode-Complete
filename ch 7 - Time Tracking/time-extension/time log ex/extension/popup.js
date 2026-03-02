// save record button
let saveButton = document.getElementById("saveRecord");
saveButton.addEventListener("click", saveNewRecord);

function saveNewRecord() {
  console.log("Saving new record...");

  let startTime = document.getElementById("startTime").value;
  console.log("Start time: " + startTime);
  let endTime = document.getElementById("endTime").value;
  console.log("End time: " + endTime);
  let dateLogged = document.getElementById("dateLogged").value;
  console.log("dateLogged: " + dateLogged);
  let workType = document.getElementById("workType").value;
  console.log("workType: " + workType);

  saveNewTimeRecord_db(startTime, endTime, dateLogged, workType);

  alert("Saved!");
}

// asyns function to call the API server.
async function saveNewTimeRecord_db(startTime, endTime, dateLogged, workType) {
  const url = `http://localhost:3000/api/saveNewTimeRecord?startTime=${startTime}&endTime=${endTime}&dateLogged=${dateLogged}&workType=${workType}`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}


// generate chart by day
let genChartDayRange = document.getElementById("genChartDayRange");
genChartDayRange.addEventListener("click", byDay);

function byDay() {
  let start = $("#chartStart").val();

  let end = $("#chartEnd").val();

  chrome.tabs.create({
    url: "showChart.html?type=day&start=" + start + "&end=" + end,
  });
}


// generate chart by month
let genChart = document.getElementById("genChartMonth");
genChart.addEventListener("click", byMonth);

function byMonth() {
  chrome.tabs.create({
    url: "showChart.html?type=month",
  });
}



function getCurrentDate() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  return currentDate;
}
$("#dateLogged").val(getCurrentDate());




$(function () {
  $("#dateLogged").datepicker({ dateFormat: "yy-mm-dd", changeYear: true });

  $("#chartStart").datepicker({ dateFormat: "yy-mm-dd", changeYear: true });
  $("#chartEnd").datepicker({ dateFormat: "yy-mm-dd", changeYear: true });
});
