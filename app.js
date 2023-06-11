const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

function getData() {
    return fs.readFile('data.json', 'utf8')
        .then(fileData => {
            try {
                // If the file is empty, return an empty array
                if (fileData === '') {
                    return [];
                }

                // Otherwise, parse the JSON data
                return JSON.parse(fileData);
            } catch (err) {
                console.error('Failed to parse JSON data:', err);
                throw err;
            }
        })
        .catch(err => {
            if (err.code === 'ENOENT') {
                return [];
            } else {
                throw err;
            }
        });
}


function saveData(data) {
    return fs.writeFile('data.json', JSON.stringify(data));
}

app.get('/todos', (req, res) => {
    getData()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

app.post('/todos', (req, res) => {
    getData()
        .then(data => {
            const task = req.body;
            task.id = Date.now(); // Here is where the id is assigned
            task.date = new Date().toISOString();
            data.push(task);
            return saveData(data)
                .then(() => {
                    res.json(task); // Include the assigned task ID in the response
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
        
});


app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    getData()
        .then(data => {
            const index = data.findIndex(task => task.id == id);
            if (index !== -1) {
                data.splice(index, 1);
                return saveData(data)
                    .then(() => {
                        res.sendStatus(200);
                    });
            } else {
                res.status(404).json({ error: 'Task not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Internal server error' });
        });
});




app.put('/todos/:id', (req, res) => {
    getData()
        .then(data => {
            const index = data.findIndex(task => task.id == req.params.id);
            if (index !== -1) {
                const task = req.body;
                task.date = new Date().toISOString();
                data[index] = task;
                return saveData(data)
                    .then(() => {
                        res.json(task); // Move this line here
                    });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
