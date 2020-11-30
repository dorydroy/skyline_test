const express = require('express');
const path = require('path');
const app = express();

const port=5000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/cesium', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
