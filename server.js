const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/:url(*)', async (req, res) => {
  const url = req.params.url;

  try {
    const decodedUrl = decodeURIComponent(url);
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return res.status(response.status).send(`Error fetching image: ${response.statusText}`);
    }

    // Copia os headers da imagem original
    res.setHeader('Content-Type', response.headers.get('content-type'));
    const buffer = await response.buffer();
    res.send(buffer);

  } catch (err) {
    res.status(500).send(`Proxy error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Image proxy server running on port ${PORT}`);
});
