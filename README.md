# Lyric Lab

Aplicacao web para transformar videos do YouTube em aulas interativas de ingles. O projeto busca a transcricao do video, traduz as frases para portugues e apresenta o conteudo sincronizado com o player.

## Estrutura

- `lyric-lab/`: frontend em React com Vite.
- `lyric-lab-backend/`: API em Node.js e Express.

## Requisitos

- Node.js 18 ou superior.
- Um video do YouTube com transcricao disponivel.

## Instalacao

Instale as dependencias de cada parte do projeto:

```bash
cd lyric-lab
npm install

cd ../lyric-lab-backend
npm install
```

## Como executar

Em um terminal, inicie a API:

```bash
cd lyric-lab-backend
node src/server.js
```

A API ficara disponivel em `http://localhost:3001`.

Em outro terminal, inicie o frontend:

```bash
cd lyric-lab
npm run dev
```

Abra o endereco exibido pelo Vite, normalmente `http://localhost:5173`.

## Funcionalidades

- Transcricao de videos do YouTube.
- Traducao automatica das legendas para portugues.
- Player com frases sincronizadas.
- Historico local das ultimas aulas.
- Temas claro e escuro.

## API

### `POST /transcribe`

Recebe um link do YouTube e retorna o titulo e as frases transcritas:

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Cada frase retornada inclui o tempo em segundos, o texto original e a traducao.

## Observacoes

- A API depende da disponibilidade da transcricao do YouTube.
- A traducao usa o endpoint publico do Google Translate.
- O historico e salvo no `localStorage` do navegador.
