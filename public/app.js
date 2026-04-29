let data = [];

// AUTO REFRESH EVERY 2 SEC (🔥 IMPORTANT)
setInterval(load, 2000);

function load() {
  fetch("/requests")
    .then((res) => res.json())
    .then((res) => {
      data = res;

      render();
      stats();
      charts();
      recentData();
    })
    .catch((err) => console.log(err));
}

// RENDER
function render() {
  const box = document.getElementById("list");
  if (!box) return;

  box.innerHTML = "";

  let filtered = data;

  if (window.location.pathname.includes("completed.html")) {
    filtered = data.filter((r) => r.status === "completed");
  }

  if (filtered.length === 0) {
    box.innerHTML = "<p>No requests found</p>";
    return;
  }

  filtered.forEach((r) => {
    box.innerHTML += `
      <div class="card">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <small>${r.location}</small><br/>

        <button onclick="complete(${r.id})">Complete</button>
        <button onclick="del(${r.id})">Delete</button>
        <button onclick="edit(${r.id})">Edit</button>
      </div>
    `;
  });
}

// ADD
function add() {
  const item = {
    title: title.value,
    description: description.value,
    location: location.value,
    urgency: urgency.value,
  };

  fetch("/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  }).then(() => {
    // 🔥 IMPORTANT
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);
  });
}

// DELETE
function del(id) {
  fetch("/requests/" + id, { method: "DELETE" });
}

// COMPLETE
function complete(id) {
  fetch("/requests/" + id, { method: "PUT" });
}

// EDIT
function edit(id) {
  const t = prompt("Edit title");
  if (!t) return;

  fetch("/edit/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: t }),
  });
}

// STATS
function stats() {
  if (!document.getElementById("total")) return;

  document.getElementById("total").innerText = data.length;
  document.getElementById("completed").innerText = data.filter(
    (r) => r.status === "completed",
  ).length;
  document.getElementById("pending").innerText = data.filter(
    (r) => r.status !== "completed",
  ).length;
}

let urgencyChart = null;
let statusChart = null;

function charts() {
  const uCanvas = document.getElementById("urgencyChart");
  const sCanvas = document.getElementById("statusChart");

  if (!uCanvas || !sCanvas) return;

  // 🔥 DESTROY OLD CHARTS
  if (urgencyChart) urgencyChart.destroy();
  if (statusChart) statusChart.destroy();

  // DATA
  const high = data.filter(r => r.urgency === "High").length;
  const medium = data.filter(r => r.urgency === "Medium").length;
  const low = data.filter(r => r.urgency === "Low").length;

  const completed = data.filter(r => r.status === "completed").length;
  const pending = data.filter(r => r.status !== "completed").length;

  // 🔥 CREATE NEW CHARTS

  urgencyChart = new Chart(uCanvas, {
    type: "doughnut",
    data: {
      labels: ["High", "Medium", "Low"],
      datasets: [{
        data: [high, medium, low]
      }]
    }
  });

  statusChart = new Chart(sCanvas, {
    type: "bar",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completed, pending]
      }]
    }
  });
}
// RECENT
function recentData() {
  const el = document.getElementById("recent");
  if (!el) return;

  el.innerHTML = "";

  data
    .slice(-3)
    .reverse()
    .forEach((r) => {
      el.innerHTML += `<div class="mini-card">${r.title}</div>`;
    });
}

// INITIAL LOAD
load();
