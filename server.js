// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/:encodedUrl', async (req, res) => {
  try {
    const encodedUrl = req.params.encodedUrl;
    const targetUrl = decodeURIComponent(encodedUrl);

    // Impede redirecionar para ele mesmo (evita loop de proxy)
    if (targetUrl.includes('image-proxy-x6i2.onrender.com')) {
      return res.status(400).send('Erro: URL já está sendo processada pelo proxy.');
    }

    const response = await fetch(targetUrl, {
      timeout: 10000, // 10 segundos
    });

    // Verifica se é uma imagem válida
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return res.status(400).send(`Unsupported content type: ${contentType}`);
    }

    // Transfere a imagem
    res.setHeader('Content-Type', contentType);
    response.body.pipe(res);
  } catch (err) {
    console.error('Erro ao buscar imagem:', err.message);
    res.status(500).send('Erro ao buscar imagem. Verifique se a URL está correta.');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
