const express = require('express')
const app = express()
const path = require('path')
const port = 3000

let todoList = [];

app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static('public'));




app.get('/todos', (req, res) => {
  res.json(todoList);
});

app.post('/todos', (req, res) => {
  const { note } = req.body;
  todoList.push(note);
  res.status(201).json({ message: 'Note added successfully', note });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  if (id >= 0 && id < todoList.length) {
    todoList[id] = note;
    res.json({ message: 'Note updated successfully', note });
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (id >= 0 && id < todoList.length) {
    const removedNote = todoList.splice(id, 1);
    res.json({ message: 'Note deleted successfully', note: removedNote });
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
