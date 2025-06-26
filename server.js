const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/:imageUrl(*)', async (req, res) => {
  const imageUrl = decodeURIComponent(req.params.imageUrl);

  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (err) {
    res.status(404).send('Image not found or blocked');
  }
});

app.listen(PORT, () => {
  console.log(`Image proxy server running on port ${PORT}`);
});
