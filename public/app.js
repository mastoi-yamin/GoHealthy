let data = [];

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
    .catch((err) => console.log("ERROR:", err));
}

// RENDER LIST
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

// ADD REQUEST
function add() {
  const item = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
    urgency: document.getElementById("urgency").value,
  };

  fetch("/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
    .then((res) => res.json())
    .then(() => {
      // IMPORTANT FIX
      window.location.href = "requests.html";
    })
    .catch((err) => console.log(err));
}

// DELETE
function del(id) {
  fetch("/requests/" + id, { method: "DELETE" }).then(() => load());
}

// COMPLETE
function complete(id) {
  fetch("/requests/" + id, { method: "PUT" }).then(() => load());
}

// EDIT
function edit(id) {
  const newTitle = prompt("Edit title:");
  if (!newTitle) return;

  fetch("/edit/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle }),
  }).then(() => load());
}

// OPTIONAL SAFE FUNCTIONS
function stats() {}
function charts() {}
function recentData() {}

// LOAD ON PAGE
load();
