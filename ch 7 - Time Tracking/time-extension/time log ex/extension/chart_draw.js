console.log("Running chart_draw.js");
const ctx = document.getElementById("myChart");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const chartType = urlParams.get("type");

console.log("chart type to make: " + chartType);



if (chartType == "day") {
  // ------------------------------------
  //  chart get hours by day
  // --------------------------------------
  async function runGetHoursByDay() {
    const start = urlParams.get("start");

    const end = urlParams.get("end");
    const url =
      "http://localhost:3000/api/getHoursByDay?start=" + start + "&end=" + end;
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }

  runGetHoursByDay().then((content) => {
    console.log(content.hours);

    new Chart(ctx, {
      type: "line",
      data: {
        labels: content.dates, // dates
        datasets: [
          {
            label: "Hours worked",
            data: content.hours, // hours worked
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
} else if (chartType == "month") {
  // ------------------------------------
  //  chart get hours by day
  // --------------------------------------
  async function runGetHoursByDay() {
    const url = "http://localhost:3000/api/getHoursByMonth";
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }

  runGetHoursByDay().then((content) => {
    console.log(content.hours);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: content.months, // dates
        datasets: [
          {
            label: "Hours worked",
            data: content.hours, // hours worked
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
}
