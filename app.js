const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; 
const util = require('util');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

let data;
fs.readFile('data.json')
    .then(fileData => {
        data = JSON.parse(fileData);
    })
    .catch(err => {
        if (err.code === 'ENOENT') {
            data = [];
        } else {
            throw err;
        }
    });

function saveData() {
    return fs.writeFile('data.json', JSON.stringify(data));
}

app.get('/todos', (req, res) => {
    res.json(data);
});

app.post('/todos', (req, res) => {
    const task = req.body;
    task.id = Date.now();  
    task.date = new Date().toISOString();
    data.push(task);
    saveData()
        .then(() => {
            res.json(task);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

app.delete('/todos/:id', (req, res) => {
    const index = data.findIndex(task => task.id == req.params.id);
    if (index !== -1) {
        data.splice(index, 1);
        saveData()
            .then(() => {
                res.sendStatus(200);
            })
            .catch(err => {
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(404);
    }
});

app.put('/todos/:id', (req, res) => {
    const index = data.findIndex(task => task.id == req.params.id);
    if (index !== -1) {
        const task = req.body;
        task.date = new Date().toISOString();
        data[index] = task;
        saveData()
            .then(() => {
            res.json(task);
        })
        .catch(err => {
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(404);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
