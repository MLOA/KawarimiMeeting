const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/api', function (req, res) {
  res.send('api')
});

app.listen(3000);