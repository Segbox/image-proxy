const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// Função para verificar extensão válida
function isValidImageUrl(url) {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.bmp', '.ico'];
  return validExtensions.some(ext => url.toLowerCase().includes(ext));
}

app.get('/:url', async (req, res) => {
  try {
    const targetUrl = decodeURIComponent(req.params.url);

    if (!isValidImageUrl(targetUrl)) {
      return res.status(400).send('Invalid or unsupported image extension.');
    }

    // Primeiro, tenta obter apenas os headers
    const headRes = await fetch(targetUrl, { method: 'HEAD' });

    if (!headRes.ok) {
      return res.status(400).send('Could not fetch image headers.');
    }

    const contentLength = headRes.headers.get('content-length');
    const maxSizeBytes = 4 * 1024 * 1024; // 4 MB

    if (contentLength && parseInt(contentLength) > maxSizeBytes) {
      return res.status(400).send('Image too large to proxy.');
    }

    // Agora, faz o fetch real da imagem
    const imageRes = await fetch(targetUrl);

    res.setHeader('Content-Type', imageRes.headers.get('content-type'));
    imageRes.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Image proxy server running on port ${PORT}`);
});
