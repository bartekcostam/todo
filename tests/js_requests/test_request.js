const http = require('http');

const baseURL = 'http://localhost:3000/';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      hostname: 'localhost',
        port: 3000,
      path: path,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function addNote() {
  try {
    const response = await makeRequest('POST', '/todos', {
      // Include the task data here
    });
    console.log('Note added:', response);
  } catch (error) {
    console.error('Error adding note:', error);
  }
}

// Number of requests to send
const numRequests = 10;

// Send requests concurrently
async function sendRequests() {
  const requests = [];
  for (let i = 0; i < numRequests; i++) {
    requests.push(addNote());
  }
  await Promise.all(requests);
}

// Start sending requests
sendRequests()
  .then(() => {
    console.log('All requests completed');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
