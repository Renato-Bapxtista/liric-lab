// server.js
const express = require('express');
const cors = require('cors');
const { YoutubeTranscript } = require('youtube-transcript');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Função para extrair o ID do vídeo do YouTube
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Função auxiliar para traduzir texto usando a API pública e gratuita do Google Translate
async function translateText(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en&tl=pt&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // O Google Translate retorna uma estrutura de arrays aninhados. O texto traduzido fica na primeira posição.
      return data[0][0][0];
    }
    return '';
  } catch (err) {
    console.error('Erro ao traduzir linha:', err);
    return '';
  }
}

app.get('/', (req, res) => {
  res.send('Servidor do Lyric Lab está online! 🚀');
});

app.post('/transcribe', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL do YouTube é obrigatória' });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: 'Link do YouTube inválido' });
  }

  try {
    console.log(`\n--- Novo pedido de transcrição ---`);
    console.log(`1. Analisando o vídeo ID: ${videoId}`);

    // Buscar o título real do vídeo
    let title = `Aula Interativa - Código: ${videoId}`;
    try {
      const responseMetadata = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (responseMetadata.ok) {
        const metadata = await responseMetadata.json();
        title = metadata.title;
      }
    } catch (metaError) {
      console.error('Não foi possível obter o título real do vídeo:', metaError);
    }

    console.log(`2. Buscando transcrição oficial do YouTube...`);
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });

    console.log(`3. Traduzindo legendas para o Português...`);

    // Traduz todas as linhas de forma simultânea e ultra veloz
    const formattedLyrics = await Promise.all(
      transcript.map(async (line) => {
        const originalText = decodeHTML(line.text);
        const translatedText = await translateText(originalText);

        return {
          time: Math.floor(line.offset / 1000),
          text: originalText,
          translation: translatedText // Enviando a tradução prontinha para o React!
        };
      })
    );

    console.log(`4. Processamento concluído! Título: "${title}". Enviando para o React.`);

    res.json({
      title: title,
      lyrics: formattedLyrics
    });

  } catch (error) {
    console.error('Erro durante o processamento:', error);
    res.status(500).json({
      error: 'Não há transcrição disponível para este vídeo ou o YouTube bloqueou a requisição.'
    });
  }
});

function decodeHTML(html) {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});