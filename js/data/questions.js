// Questionário de perfil de investidor (suitability simplificado).
// Cada opção soma pontos: quanto maior, maior a tolerância a risco.

export const QUESTIONS = [
  {
    q: 'Qual é o seu principal objetivo ao investir?',
    options: [
      ['Preservar meu dinheiro, sem correr riscos', 1],
      ['Ter uma renda um pouco melhor que a poupança', 2],
      ['Fazer o dinheiro crescer de forma equilibrada', 3],
      ['Buscar o maior retorno possível no longo prazo', 4],
    ],
  },
  {
    q: 'Por quanto tempo você pretende deixar o dinheiro investido?',
    options: [
      ['Menos de 1 ano', 1],
      ['De 1 a 3 anos', 2],
      ['De 3 a 5 anos', 3],
      ['Mais de 5 anos', 4],
    ],
  },
  {
    q: 'Imagine que seu investimento caiu 15% em um mês. O que você faria?',
    options: [
      ['Resgataria tudo imediatamente', 1],
      ['Resgataria uma parte para reduzir o risco', 2],
      ['Manteria e esperaria recuperar', 3],
      ['Aproveitaria para investir mais', 4],
    ],
  },
  {
    q: 'Como você descreveria seu conhecimento sobre investimentos?',
    options: [
      ['Nenhum — estou começando agora', 1],
      ['Conheço poupança e alguns produtos de banco', 2],
      ['Já investi em Tesouro Direto, CDB ou fundos', 3],
      ['Já invisto em ações, FIIs ou outros produtos de risco', 4],
    ],
  },
  {
    q: 'Você já tem uma reserva de emergência?',
    options: [
      ['Não tenho nada guardado', 1],
      ['Tenho menos de 3 meses de gastos', 2],
      ['Tenho de 3 a 6 meses de gastos', 3],
      ['Tenho mais de 6 meses de gastos', 4],
    ],
  },
  {
    q: 'Que parte da sua renda mensal sobra para investir?',
    options: [
      ['Quase nada, ou nada', 1],
      ['Até 10%', 2],
      ['Entre 10% e 20%', 3],
      ['Mais de 20%', 4],
    ],
  },
  {
    q: 'Qual destas carteiras hipotéticas você escolheria para 1 ano?',
    options: [
      ['Ganho de 8%, sem chance de perda', 1],
      ['Ganho médio de 10%, podendo perder até 3%', 2],
      ['Ganho médio de 14%, podendo perder até 10%', 3],
      ['Ganho médio de 20%, podendo perder até 25%', 4],
    ],
  },
  {
    q: 'Se precisasse do dinheiro de repente, quanto dos seus investimentos você precisaria resgatar?',
    options: [
      ['Tudo ou quase tudo', 1],
      ['Mais da metade', 2],
      ['Uma pequena parte', 3],
      ['Nada — tenho outras fontes', 4],
    ],
  },
];

export const PROFILES = [
  {
    id: 'conservador',
    name: 'Conservador',
    max: 15,
    desc: 'Você prioriza a segurança e prefere evitar oscilações, mesmo que isso signifique ganhar um pouco menos. Ótimo momento para fortalecer a reserva de emergência e conhecer bem a renda fixa.',
    alloc: [['Renda fixa pós-fixada (Tesouro Selic, CDB)', 70], ['Renda fixa atrelada à inflação (Tesouro IPCA+)', 20], ['Fundos imobiliários / ações', 10]],
    next: 'Comece pelo módulo "Reserva de emergência" do curso e, depois, conheça o Tesouro Selic.',
  },
  {
    id: 'moderado',
    name: 'Moderado',
    max: 24,
    desc: 'Você busca equilíbrio: aceita algum risco para ter retornos melhores, mas sem abrir mão de uma base sólida. Diversificar entre renda fixa e um pouco de renda variável combina com você.',
    alloc: [['Renda fixa pós-fixada', 40], ['Renda fixa atrelada à inflação', 25], ['Fundos imobiliários', 15], ['Ações / ETFs', 20]],
    next: 'Revise o módulo "Primeiros investimentos" e estude ETFs como forma simples de diversificar.',
  },
  {
    id: 'arrojado',
    name: 'Arrojado',
    max: 32,
    desc: 'Você aceita oscilações no curto prazo em busca de retornos maiores no longo prazo. Mesmo assim, mantenha uma reserva de emergência em renda fixa e diversifique bem.',
    alloc: [['Renda fixa (reserva e equilíbrio)', 25], ['Renda fixa atrelada à inflação', 15], ['Fundos imobiliários', 20], ['Ações / ETFs', 35], ['Investimentos no exterior', 5]],
    next: 'Aprofunde-se em análise de empresas e diversificação internacional — sempre com a reserva em dia.',
  },
];

export const MIN_SCORE = QUESTIONS.length;
export const MAX_SCORE = QUESTIONS.length * 4;
export const profileFor = (score) => PROFILES.find((p) => score <= p.max) || PROFILES[PROFILES.length - 1];
