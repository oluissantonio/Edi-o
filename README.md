# WInvest — app de educação financeira

App web (PWA) minimalista, em tons de azul, para pessoas que estão começando a entender o mercado financeiro. Funciona no navegador do celular e pode ser **instalado na tela inicial** ("Adicionar à tela inicial").

## As 5 sessões (barra inferior)

| Sessão | O que faz |
| --- | --- |
| **Notícias** | IPCA, Selic, INPC, IGP-M e Dólar, cada um com uma explicação simples, e as notícias do mercado do dia. |
| **Hábitos** | Checklist diário de 5 hábitos (Estudar, Exercício físico, Alimentação saudável, Leitura, Sono), calendário com o progresso, sequência de dias e constância por hábito. Concluir uma aula em *Cursos* marca "Estudar" automaticamente. |
| **Planejamento** | Renda e gastos mês a mês em 3 categorias, comparados com a regra **50/30/20** (Essenciais 50%, Lazer 30%, Metas 20%), com alertas e dicas. |
| **Cursos** | Curso gratuito "Finanças do Zero": 5 módulos e 15 aulas, com acompanhamento de progresso. |
| **Perfil** | Questionário de 8 perguntas que define o perfil de investidor (Conservador, Moderado ou Arrojado), com um exemplo educativo de carteira. |

Os dados do usuário ficam salvos **no próprio aparelho** (localStorage), sem login.

## Fontes de dados

- **Indicadores:** API SGS do Banco Central (IPCA 433, Selic meta 432, INPC 188, IGP-M 189, PTAX 1) e AwesomeAPI para o dólar. IPCA, INPC e IGP-M mostram o acumulado de 12 meses e a variação do mês.
- **Notícias:** feeds RSS (InfoMoney, g1 Economia, Google Notícias).

O app busca os indicadores ao vivo e completa o que faltar com `data/daily.json`. Esse arquivo é atualizado **todo dia** pelo workflow `.github/workflows/update-data.yml` (script `scripts/update-data.mjs`). Se o arquivo não tiver notícias, o app tenta lê-las ao vivo pelo rss2json.

## Rodar localmente

Os módulos JavaScript precisam de um servidor HTTP (abrir o `index.html` direto não funciona):

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Atualizar os dados manualmente (Node 18+):

```bash
node scripts/update-data.mjs
```

## Publicar (GitHub Pages)

1. Em **Settings → Pages**, escolha **Source: GitHub Actions** (no plano gratuito do GitHub, o repositório precisa ser público).
2. O workflow `pages.yml` publica o site a cada push na branch padrão e depois de cada atualização diária dos dados.

> Workflows agendados (`schedule`) só rodam na branch padrão do repositório.

## Editar o curso e o questionário

- Aulas: `js/data/course.js`. Para colocar um vídeo do YouTube, preencha o campo `video` com o ID do vídeo.
- Perguntas e perfis: `js/data/questions.js`.
