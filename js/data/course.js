// Conteúdo do curso gratuito.
// Para adicionar um vídeo a uma aula, preencha `video` com o ID do YouTube
// (o trecho depois de "v=" no link, ex.: https://www.youtube.com/watch?v=ABC123 → 'ABC123').

export const COURSE = {
  title: 'Finanças do Zero',
  subtitle: 'Um curso gratuito para organizar seu dinheiro e começar a investir com segurança.',
  modules: [
    {
      id: 'm1',
      title: 'Primeiros passos',
      lessons: [
        {
          id: 'm1-l1',
          title: 'O que é educação financeira',
          minutes: 4,
          video: '',
          body: `
            <p>Educação financeira é aprender a tomar boas decisões com o dinheiro: quanto gastar, quanto guardar e onde investir. Não tem a ver com ganhar muito, e sim com <strong>usar bem o que se ganha</strong>.</p>
            <h3>Os três pilares</h3>
            <ul>
              <li><strong>Organizar:</strong> saber quanto entra e para onde vai o dinheiro.</li>
              <li><strong>Proteger:</strong> evitar dívidas caras e ter uma reserva para imprevistos.</li>
              <li><strong>Multiplicar:</strong> investir para que o dinheiro trabalhe por você.</li>
            </ul>
            <div class="callout">💡 Este app segue esses três pilares: <strong>Planejamento</strong> para organizar, este <strong>curso</strong> para aprender a proteger e multiplicar, e o <strong>Perfil</strong> para descobrir como investir.</div>`,
        },
        {
          id: 'm1-l2',
          title: 'Renda bruta x renda líquida',
          minutes: 3,
          video: '',
          body: `
            <p><strong>Renda bruta</strong> é o valor total do seu salário antes dos descontos. <strong>Renda líquida</strong> é o que realmente cai na sua conta depois de INSS, Imposto de Renda, vale-transporte e outros descontos.</p>
            <p>Todo planejamento deve partir da <strong>renda líquida</strong>, porque é com ela que você paga as contas.</p>
            <div class="callout">✍️ Exercício: abra seu último contracheque (ou extrato) e anote sua renda líquida. Depois, lance esse valor na aba Planejamento.</div>`,
        },
        {
          id: 'm1-l3',
          title: 'Sua relação com o dinheiro',
          minutes: 4,
          video: '',
          body: `
            <p>Muitas decisões financeiras são emocionais: compramos por impulso, para aliviar o estresse ou para acompanhar os outros. Perceber esses gatilhos é o primeiro passo para mudá-los.</p>
            <h3>Perguntas antes de comprar</h3>
            <ul>
              <li>Eu preciso disso ou só quero agora?</li>
              <li>Ainda vou querer daqui a 7 dias?</li>
              <li>Quantas horas de trabalho isso custa?</li>
            </ul>
            <p>A regra dos 7 dias é simples: para compras não essenciais, espere uma semana. Se o desejo continuar, compre com tranquilidade.</p>`,
        },
      ],
    },
    {
      id: 'm2',
      title: 'Organizando o orçamento',
      lessons: [
        {
          id: 'm2-l1',
          title: 'A regra 50/30/20',
          minutes: 5,
          video: '',
          body: `
            <p>A regra 50/30/20 divide a renda líquida em três partes:</p>
            <ul>
              <li><strong>50% – Necessidades essenciais:</strong> moradia, contas, mercado, transporte, saúde.</li>
              <li><strong>30% – Lazer e estilo de vida:</strong> passeios, restaurantes, assinaturas, compras.</li>
              <li><strong>20% – Metas financeiras:</strong> reserva de emergência, investimentos e quitação de dívidas.</li>
            </ul>
            <div class="callout">Exemplo: com renda de R$ 3.000, o ideal é até R$ 1.500 em essenciais, até R$ 900 em lazer e pelo menos R$ 600 para metas.</div>
            <p>Os percentuais são um ponto de partida, não uma regra rígida. O importante é que a parte das metas exista todo mês.</p>`,
        },
        {
          id: 'm2-l2',
          title: 'Como registrar seus gastos',
          minutes: 4,
          video: '',
          body: `
            <p>Você só controla o que mede. Durante um mês, registre todos os gastos — inclusive os pequenos, como café e aplicativos de transporte.</p>
            <h3>Dicas práticas</h3>
            <ul>
              <li>Comece pelos gastos fixos: aluguel, contas, escola, assinaturas.</li>
              <li>Use a fatura do cartão e o extrato do banco para não esquecer nada.</li>
              <li>Reserve 10 minutos por semana para atualizar o Planejamento.</li>
            </ul>`,
        },
        {
          id: 'm2-l3',
          title: 'Cortando gastos sem sofrimento',
          minutes: 4,
          video: '',
          body: `
            <p>Cortar tudo de uma vez costuma não durar. Prefira ajustes que você mal sente:</p>
            <ul>
              <li>Revise planos de celular, internet e streaming — cancele o que não usa.</li>
              <li>Faça lista antes do mercado e evite ir com fome.</li>
              <li>Compare preços de seguros e tarifas bancárias (muitos bancos digitais são gratuitos).</li>
              <li>Troque, não elimine: um passeio mais barato ainda é lazer.</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'm3',
      title: 'Dívidas e crédito',
      lessons: [
        {
          id: 'm3-l1',
          title: 'Juros compostos: amigos ou inimigos',
          minutes: 5,
          video: '',
          body: `
            <p>Juros compostos são "juros sobre juros". A cada período, os juros incidem sobre o valor já acrescido dos juros anteriores.</p>
            <p>Nos <strong>investimentos</strong>, isso faz seu dinheiro crescer cada vez mais rápido. Nas <strong>dívidas</strong>, faz o valor devido explodir.</p>
            <div class="callout">Uma dívida de R$ 1.000 a 10% ao mês vira cerca de R$ 3.138 em 1 ano. É por isso que o rotativo do cartão e o cheque especial são tão perigosos.</div>`,
        },
        {
          id: 'm3-l2',
          title: 'Cartão de crédito com consciência',
          minutes: 4,
          video: '',
          body: `
            <p>O cartão é uma ferramenta útil quando você paga a <strong>fatura inteira</strong> todo mês. O problema começa ao pagar o mínimo: o restante entra no rotativo, um dos juros mais altos do mercado.</p>
            <ul>
              <li>Defina um limite pessoal menor que o limite do banco.</li>
              <li>Parcelado também é gasto: some as parcelas futuras no seu orçamento.</li>
              <li>Escolha uma data de vencimento logo após receber o salário.</li>
            </ul>`,
        },
        {
          id: 'm3-l3',
          title: 'Plano para sair das dívidas',
          minutes: 5,
          video: '',
          body: `
            <ol>
              <li><strong>Liste todas as dívidas</strong> com valor, juros mensais e número de parcelas.</li>
              <li><strong>Priorize as de juros mais altos</strong> (rotativo, cheque especial).</li>
              <li><strong>Negocie:</strong> bancos costumam oferecer descontos para quitação à vista.</li>
              <li><strong>Troque dívida cara por barata:</strong> um empréstimo consignado ou a portabilidade pode reduzir os juros.</li>
              <li><strong>Não faça novas dívidas</strong> enquanto quita as antigas.</li>
            </ol>
            <p>Enquanto houver dívidas caras, elas devem ser a sua principal "meta financeira" dos 20%.</p>`,
        },
      ],
    },
    {
      id: 'm4',
      title: 'Reserva de emergência',
      lessons: [
        {
          id: 'm4-l1',
          title: 'Por que ter uma reserva',
          minutes: 3,
          video: '',
          body: `
            <p>A reserva de emergência é um dinheiro guardado para imprevistos: perda de emprego, problema de saúde, conserto do carro. Ela evita que você precise recorrer a empréstimos caros.</p>
            <p>É o <strong>primeiro investimento</strong> de qualquer pessoa — antes de pensar em rentabilidade.</p>`,
        },
        {
          id: 'm4-l2',
          title: 'Quanto guardar e onde',
          minutes: 5,
          video: '',
          body: `
            <h3>Quanto</h3>
            <p>O recomendado é de <strong>3 a 6 meses dos seus gastos essenciais</strong>. Quem tem renda variável (autônomos) deve mirar em 6 a 12 meses.</p>
            <h3>Onde</h3>
            <p>A reserva precisa de <strong>segurança</strong> e <strong>liquidez</strong> (resgate rápido). Boas opções:</p>
            <ul>
              <li><strong>Tesouro Selic:</strong> título público, acompanha a Selic, resgate em D+1 (ou na hora, em dias úteis, em várias corretoras).</li>
              <li><strong>CDB com liquidez diária</strong> que renda pelo menos 100% do CDI, de banco coberto pelo FGC.</li>
            </ul>
            <div class="callout">Evite deixar a reserva na poupança: ela costuma render menos que as opções acima.</div>`,
        },
      ],
    },
    {
      id: 'm5',
      title: 'Primeiros investimentos',
      lessons: [
        {
          id: 'm5-l1',
          title: 'Inflação, Selic e o seu dinheiro',
          minutes: 5,
          video: '',
          body: `
            <p>A <strong>inflação</strong> (IPCA) mostra quanto o custo de vida subiu. Se seu dinheiro rende menos que a inflação, você perde poder de compra.</p>
            <p>A <strong>Selic</strong> é a taxa básica de juros. Ela serve de referência para quase todos os investimentos de renda fixa e para os juros dos empréstimos.</p>
            <div class="callout">Juro real = rendimento − inflação (aproximadamente). Se um investimento rende 11% ao ano e a inflação é 4%, o ganho real fica perto de 7%.</div>
            <p>Acompanhe esses indicadores na aba <a href="#noticias">Notícias</a>.</p>`,
        },
        {
          id: 'm5-l2',
          title: 'Renda fixa: o básico',
          minutes: 6,
          video: '',
          body: `
            <p>Na renda fixa, você empresta dinheiro e sabe a regra de rendimento desde o início.</p>
            <ul>
              <li><strong>Tesouro Direto:</strong> você empresta ao governo. Tesouro Selic (reserva), Tesouro IPCA+ (longo prazo, protege da inflação) e Prefixado.</li>
              <li><strong>CDB:</strong> você empresta a um banco. Protegido pelo FGC até R$ 250 mil por CPF por instituição.</li>
              <li><strong>LCI e LCA:</strong> parecidas com o CDB, também com FGC, e <strong>isentas de Imposto de Renda</strong> para pessoa física.</li>
            </ul>
            <h3>Imposto de Renda (tabela regressiva)</h3>
            <p>Até 180 dias: 22,5% · 181 a 360 dias: 20% · 361 a 720 dias: 17,5% · acima de 720 dias: 15% — cobrado só sobre o lucro.</p>`,
        },
        {
          id: 'm5-l3',
          title: 'Renda variável: ações e fundos imobiliários',
          minutes: 6,
          video: '',
          body: `
            <p>Na renda variável, o rendimento não é conhecido antecipadamente. Os preços sobem e descem — por isso, é indicada para objetivos de longo prazo e para quem já tem reserva de emergência.</p>
            <ul>
              <li><strong>Ações:</strong> você se torna sócio de uma empresa e participa dos lucros (dividendos) e da valorização.</li>
              <li><strong>Fundos imobiliários (FIIs):</strong> investem em imóveis como shoppings e galpões e distribuem aluguéis mensalmente.</li>
              <li><strong>ETFs:</strong> fundos que replicam um índice (como o Ibovespa) — uma forma simples de diversificar.</li>
            </ul>
            <div class="callout">⚠️ Desconfie de promessas de ganho rápido e garantido. Em investimentos, retorno maior sempre vem com risco maior.</div>`,
        },
        {
          id: 'm5-l4',
          title: 'Conheça seu perfil de investidor',
          minutes: 3,
          video: '',
          body: `
            <p>Antes de investir, é importante entender quanto risco você aceita correr e por quanto tempo pode deixar o dinheiro aplicado. Isso define o seu <strong>perfil de investidor</strong>:</p>
            <ul>
              <li><strong>Conservador:</strong> prioriza segurança.</li>
              <li><strong>Moderado:</strong> aceita algum risco para ganhar mais.</li>
              <li><strong>Arrojado:</strong> aceita oscilações em busca de retornos maiores no longo prazo.</li>
            </ul>
            <p>Faça o questionário na aba <a href="#perfil">Perfil</a> para descobrir o seu. 🎓 Parabéns por concluir o curso!</p>`,
        },
      ],
    },
  ],
};

export const ALL_LESSONS = COURSE.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })));
