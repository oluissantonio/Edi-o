# Meu orçamento por blocos

Planilha de orçamento gratuita, feita para abrir no celular. A pessoa divide o que entrou no mês em 5 blocos, lança gastos e compras no cartão (com parcelas) e vê quanto ainda resta. Não tem login e nada é enviado para servidor: os dados ficam no navegador de cada pessoa.

O que dá para fazer:

- Lançar entradas, planejar quanto vai para cada bloco e lançar gastos, mês a mês.
- Renomear os blocos (é só tocar no nome).
- Lançar compras no cartão de crédito, à vista ou parceladas, em cada bloco.
- Baixar tudo como planilha (CSV, abre no Excel, Google Planilhas e Numbers).
- Fazer backup e restaurar em outro aparelho.
- Instalar na tela inicial do celular e usar sem internet.

## Publicar na Vercel

1. Entre em [vercel.com](https://vercel.com) com a sua conta do GitHub.
2. Clique em **Add New → Project** e importe este repositório.
3. Em **Root Directory**, clique em **Edit** e escolha a pasta `orcamento`.
4. Em **Framework Preset**, deixe **Other**. Não precisa de comando de build.
5. Clique em **Deploy**. Em cerca de 1 minuto sai o link (algo como `seu-projeto.vercel.app`).

Cada novo push na branch padrão publica a versão nova automaticamente.

## Antes de divulgar

- **Seu @ no rodapé:** em `index.html`, procure `var INSTAGRAM = '';` e coloque o seu usuário sem o @, por exemplo `var INSTAGRAM = 'meuperfil';`.
- **Prévia do link:** para a imagem `og.png` aparecer quando alguém compartilhar o link (WhatsApp, Instagram etc.), troque `content="og.png"` pelo endereço completo depois do deploy, por exemplo `content="https://seu-projeto.vercel.app/og.png"`.
- **Atualizações:** se mudar o `index.html`, troque também `orcamento-v1` por `orcamento-v2` em `sw.js`, para os celulares que instalaram a planilha baixarem a versão nova.

## Testar no computador

```bash
cd orcamento
python3 -m http.server 8000
# abra http://localhost:8000
```
