const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/:encodedUrl', async (req, res) => {
  try {
    const encodedUrl = req.params.encodedUrl;
    const targetUrl = decodeURIComponent(encodedUrl);

    // Impede loop de proxy
    if (targetUrl.includes('image-proxy-x6i2.onrender.com')) {
      return res.status(400).send('Erro: URL já foi processada pelo proxy.');
    }

    const response = await fetch(targetUrl, { timeout: 10000 });

    // Verifica status da resposta
    if (!response.ok) {
      return res.status(400).send(`Erro ao buscar imagem. Status: ${response.status}`);
    }

    // Verifica se é imagem válida
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return res.status(400).send(`Tipo de conteúdo não suportado: ${contentType}`);
    }

    // Encaminha imagem
    res.setHeader('Content-Type', contentType);
    response.body.pipe(res);

  } catch (err) {
    console.error('Erro:', err.message);
    res.status(500).send('Erro ao processar imagem.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de proxy iniciado na porta ${PORT}`);
});
