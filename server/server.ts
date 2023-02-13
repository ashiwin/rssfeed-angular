const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/rss', async (req, res) => {
  try {
    const response = await axios.get('https://www.dailymail.co.uk/articles.rss');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.listen(4201, () => {
  console.log('RSS proxy server listening on port 4201');
});
