const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/:url', async (req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.params.url);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(500).send('Failed to fetch image');
    }

    // Pega o tipo da imagem original e repassa
    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType);

    // Transmite a imagem como stream
    response.body.pipe(res);
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
    res.status(500).send('Erro ao carregar imagem');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Image proxy server running on port ${PORT}`);
});
