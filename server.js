const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// ROOT FIX
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

// 📁 FILE PATH
const DATA_FILE = "./data.json";

// READ
function readData() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// WRITE
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET ALL
app.get("/requests", (req, res) => {
  res.json(readData());
});

// ADD
app.post("/requests", (req, res) => {
  const data = readData();

  const newItem = {
    id: Date.now(),
    ...req.body,
    status: "open",
  };

  data.push(newItem);
  writeData(data);

  res.json(newItem);
});

// DELETE
app.delete("/requests/:id", (req, res) => {
  let data = readData();
  const id = Number(req.params.id);

  data = data.filter((r) => r.id !== id);
  writeData(data);

  res.json({ msg: "Deleted" });
});

// COMPLETE
app.put("/requests/:id", (req, res) => {
  let data = readData();
  const id = Number(req.params.id);

  data = data.map((r) => (r.id === id ? { ...r, status: "completed" } : r));

  writeData(data);

  res.json({ msg: "Updated" });
});

// EDIT
app.put("/edit/:id", (req, res) => {
  let data = readData();
  const id = Number(req.params.id);

  data = data.map((r) => (r.id === id ? { ...r, ...req.body } : r));

  writeData(data);

  res.json({ msg: "Edited" });
});

// START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
