let data = [];

// SKELETON LOADING
function showLoading() {
  const list = document.getElementById("list");
  list.innerHTML = `
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    <div class="skeleton"></div>
  `;
}

// LOAD
function load() {
  showLoading();

  setTimeout(() => {
    fetch("/requests")
      .then((res) => res.json())
      .then((res) => {
        data = res;
        render();
        stats();
      });
  }, 600); // fake smooth delay
}

// RENDER
function render() {
  const list = document.getElementById("list");

  if (data.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;margin-top:50px;">
        <h3>🚀 No Requests Yet</h3>
        <p>Click + Add to start helping people</p>
      </div>
    `;
    return;
  }

  list.innerHTML = "";

  data.forEach((r) => {
    list.innerHTML += `
      <div class="item">
        <h4>${r.title}</h4>
        <p>${r.description}</p>
        <small>${r.location}</small>
      </div>
    `;
  });
}

// STATS (ANIMATED)
function animateValue(el, start, end, duration) {
  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    el.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function stats() {
  animateValue(total, 0, data.length, 500);
  animateValue(
    completed,
    0,
    data.filter((r) => r.status === "completed").length,
    500,
  );
  animateValue(
    pending,
    0,
    data.filter((r) => r.status !== "completed").length,
    500,
  );
}

// MODAL
function openModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}

// ADD
function add() {
  const newItem = {
    title: title.value,
    description: description.value,
    location: location.value,
    urgency: urgency.value,
    status: "open",
  };

  fetch("/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  }).then(() => {
    closeModal();
    load();
  });
}

document.querySelectorAll(".sidebar a").forEach((link) => {
  if (link.href.includes(window.location.pathname)) {
    link.style.color = "#00ffcc";
  }
});

load();
