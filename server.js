const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

let requests = [];

// GET
app.get("/requests", (req, res) => {
  res.json(requests);
});

// ADD
app.post("/requests", (req, res) => {
  const newItem = {
    id: Date.now(),
    ...req.body,
    status: "open",
  };
  requests.push(newItem);
  res.json(newItem);
});

// DELETE
app.delete("/requests/:id", (req, res) => {
  const id = Number(req.params.id);
  requests = requests.filter((r) => r.id !== id);
  res.json({ msg: "Deleted" });
});

// COMPLETE
app.put("/requests/:id", (req, res) => {
  const id = Number(req.params.id);
  requests = requests.map((r) =>
    r.id === id ? { ...r, status: "completed" } : r,
  );
  res.json({ msg: "Updated" });
});

// EDIT
app.put("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  requests = requests.map((r) => (r.id === id ? { ...r, ...req.body } : r));
  res.json({ msg: "Edited" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
