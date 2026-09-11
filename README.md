# Lyric Lab

Aplicacao web para transformar videos do YouTube em aulas interativas de ingles. O projeto busca a transcricao do video, traduz as frases para portugues e apresenta o conteudo sincronizado com o player.

## Estrutura

- `lyric-lab/`: frontend em React com Vite.
- `lyric-lab-backend/`: API em Node.js e Express.

## Requisitos

- Node.js 18 ou superior.
- Um video do YouTube com transcricao disponivel.

## Instalacao

Instale as dependencias na pasta principal:

```bash
npm install
```

## Como executar

Inicie o frontend e o backend juntos:

```bash
npm run dev
```

O backend ficara disponivel em `http://localhost:3001` e o frontend em `http://localhost:5173`.
Para interromper os dois processos, pressione `Ctrl+C`.

## Comandos uteis

Execute os comandos a partir da pasta principal:

```bash
npm run build  # gera a versao de producao do frontend
npm run lint   # verifica o codigo do frontend
```

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

Exemplo de resposta:

```json
{
  "title": "Titulo do video",
  "lyrics": [
    {
      "time": 12,
      "text": "Original sentence",
      "translation": "Frase original"
    }
  ]
}
```

## Observacoes

- A API depende da disponibilidade da transcricao do YouTube.
- A traducao usa o endpoint publico do Google Translate.
- O historico e salvo no `localStorage` do navegador.
