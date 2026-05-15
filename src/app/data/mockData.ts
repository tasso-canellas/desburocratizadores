export type Category = 'pagamento' | 'obrigacao' | 'multa' | 'direito' | 'prazo' | 'modificavel';
export type Confidence = 'alta' | 'media' | 'baixa';
export type DocumentStatus = 'processing' | 'review' | 'validated' | 'sent';
export type RiskLevel = 'alto' | 'medio' | 'baixo';

export interface KeyPoint {
  id: string;
  category: Category;
  title: string;
  simpleDescription: string;
  legalText: string;
  page: number;
  section: string;
  confidence: Confidence;
  confidenceScore: number;
  confidenceNote?: string;
  isReviewed?: boolean;
  editedDescription?: string;
}

export interface Deadline {
  id: string;
  date: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export interface RiskIndicator {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
}

export interface CorrectionRequest {
  id: string;
  pointId: string;
  pointTitle: string;
  clientMessage: string;
  date: string;
  resolved: boolean;
  response?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  type: string;
  fileName: string;
  clientName: string;
  clientEmail: string;
  lawyerName: string;
  lawyerOAB: string;
  uploadedAt: string;
  status: DocumentStatus;
  overallRisk: RiskLevel;
  overview: string;
  keyPoints: KeyPoint[];
  deadlines: Deadline[];
  risks: RiskIndicator[];
  correctionRequests: CorrectionRequest[];
}

export const MOCK_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-001',
    title: 'Contrato de Locação Residencial',
    type: 'Contrato de Aluguel',
    fileName: 'contrato_locacao_rua_flores_123.pdf',
    clientName: 'Maria Silva',
    clientEmail: 'maria.silva@email.com',
    lawyerName: 'Dr. Carlos Mendes',
    lawyerOAB: 'OAB/SP 154.230',
    uploadedAt: '2026-05-10T14:32:00',
    status: 'review',
    overallRisk: 'medio',
    overview:
      'Este é um contrato de aluguel de apartamento por 30 meses. Você vai pagar R$ 2.500 por mês. O contrato tem pontos que precisam de atenção, especialmente a multa por saída antecipada e a proibição de animais com linguagem confusa.',
    keyPoints: [
      {
        id: 'kp-001',
        category: 'pagamento',
        title: 'Valor do Aluguel',
        simpleDescription:
          'Você vai pagar R$ 2.500 por mês, todo dia 5. Se cair em fim de semana, paga no primeiro dia útil depois.',
        legalText:
          'O locatário compromete-se a pagar a título de aluguel, no valor de R$ 2.500,00 (dois mil e quinhentos reais), mensalmente, até o 5º (quinto) dia útil de cada mês, na conta bancária indicada pelo locador.',
        page: 2,
        section: 'Cláusula 3ª – Do Preço e Forma de Pagamento',
        confidence: 'alta',
        confidenceScore: 96,
        isReviewed: false,
      },
      {
        id: 'kp-002',
        category: 'pagamento',
        title: 'Depósito de Garantia (Caução)',
        simpleDescription:
          'Você precisa depositar R$ 7.500 agora (3x o aluguel). Você recebe esse dinheiro de volta quando sair do apartamento, se não tiver causado danos.',
        legalText:
          'Fica estabelecida a caução no valor equivalente a 3 (três) meses de aluguel, no montante de R$ 7.500,00 (sete mil e quinhentos reais), a ser depositada pelo locatário em conta vinculada na data de assinatura do presente instrumento.',
        page: 3,
        section: 'Cláusula 4ª – Das Garantias',
        confidence: 'alta',
        confidenceScore: 91,
        isReviewed: false,
      },
      {
        id: 'kp-003',
        category: 'obrigacao',
        title: 'Contas que Você Paga',
        simpleDescription:
          'Além do aluguel, você é responsável por pagar: IPTU (imposto do imóvel), água, luz e gás. Essas contas não estão incluídas no valor do aluguel.',
        legalText:
          'São de responsabilidade exclusiva do locatário todas as despesas ordinárias do imóvel, compreendendo IPTU, conta de água e esgoto, energia elétrica, gás encanado e demais despesas de consumo.',
        page: 4,
        section: 'Cláusula 7ª – Das Obrigações do Locatário',
        confidence: 'alta',
        confidenceScore: 93,
        isReviewed: false,
      },
      {
        id: 'kp-004',
        category: 'obrigacao',
        title: 'Animais de Estimação',
        simpleDescription:
          'O contrato diz que você NÃO pode ter animais no apartamento. Mas existe uma exceção — ela não está clara. Converse com seu advogado sobre isso.',
        legalText:
          'É expressamente vedada a permanência de quaisquer animais domésticos no imóvel locado, salvo autorização escrita e prévia do locador, mediante análise de caso a caso.',
        page: 5,
        section: 'Cláusula 8ª – Das Restrições de Uso',
        confidence: 'media',
        confidenceScore: 71,
        confidenceNote:
          'A IA identificou uma exceção na cláusula, mas os critérios para obter autorização não estão descritos no contrato. Recomendo verificar com o locador antes de confirmar.',
        isReviewed: false,
      },
      {
        id: 'kp-005',
        category: 'multa',
        title: 'Multa por Atraso no Pagamento',
        simpleDescription:
          'Se você pagar depois do dia 5, vai pagar 10% a mais sobre o valor do aluguel. Também vai pagar juros de 1% por mês enquanto o atraso continuar. Exemplo: pagar R$ 2.500 com 1 mês de atraso = R$ 2.775.',
        legalText:
          'O inadimplemento do aluguel na data avençada ensejará a cobrança de multa moratória correspondente a 10% (dez por cento) sobre o valor total em atraso, acrescida de juros remuneratórios de 1% (um por cento) ao mês, calculados pro rata die.',
        page: 6,
        section: 'Cláusula 5ª – Da Inadimplência',
        confidence: 'alta',
        confidenceScore: 98,
        isReviewed: false,
      },
      {
        id: 'kp-006',
        category: 'multa',
        title: 'Multa por Sair Antes do Prazo',
        simpleDescription:
          'Se você quiser sair antes dos 30 meses combinados, você terá que pagar 3 meses de aluguel como multa (R$ 7.500). Essa multa pode ser reduzida se você sair após 12 meses — confirme isso com seu advogado.',
        legalText:
          'A rescisão unilateral antecipada do contrato pelo locatário acarretará o pagamento de multa rescisória equivalente a 3 (três) meses de aluguel vigente à época da rescisão, nos termos do artigo 4º da Lei nº 8.245/91.',
        page: 7,
        section: 'Cláusula 12ª – Da Rescisão Antecipada',
        confidence: 'media',
        confidenceScore: 77,
        confidenceNote:
          'A Lei do Inquilinato (Lei 8.245/91) prevê redução proporcional da multa conforme o tempo de uso. A IA não tem certeza se o contrato aplica essa redução automaticamente. Verifique com seu advogado.',
        isReviewed: false,
      },
      {
        id: 'kp-007',
        category: 'direito',
        title: 'Direito a Reparos no Apartamento',
        simpleDescription:
          'O dono do apartamento (locador) é obrigado por lei a fazer reparos em problemas de estrutura e encanamento. Se algo quebrar por desgaste normal, não é você que paga. Peça sempre por escrito.',
        legalText:
          'Incumbe ao locador realizar os reparos necessários decorrentes de deterioração natural do imóvel, especialmente aqueles relacionados à estrutura predial, instalações hidráulicas e elétricas de uso coletivo.',
        page: 8,
        section: 'Cláusula 6ª – Das Obrigações do Locador',
        confidence: 'alta',
        confidenceScore: 89,
        isReviewed: false,
      },
      {
        id: 'kp-008',
        category: 'prazo',
        title: 'Duração do Contrato',
        simpleDescription:
          'O contrato dura 30 meses. Começa em 1º de maio de 2026 e termina em 31 de outubro de 2028.',
        legalText:
          'O prazo de vigência da presente locação é de 30 (trinta) meses, com início em 01/05/2026 e término em 31/10/2028, sendo que, findado o prazo sem manifestação das partes, a locação poderá ser considerada por prazo indeterminado.',
        page: 2,
        section: 'Cláusula 2ª – Do Prazo',
        confidence: 'alta',
        confidenceScore: 99,
        isReviewed: false,
      },
      {
        id: 'kp-009',
        category: 'prazo',
        title: 'Aviso para Sair do Apartamento',
        simpleDescription:
          'Se você quiser sair do apartamento, precisa avisar o dono com pelo menos 30 dias de antecedência, por escrito.',
        legalText:
          'O locatário que desejar rescindir o contrato ao término do prazo deverá comunicar o locador com antecedência mínima de 30 (trinta) dias, mediante notificação escrita.',
        page: 9,
        section: 'Cláusula 13ª – Da Denúncia',
        confidence: 'alta',
        confidenceScore: 95,
        isReviewed: false,
      },
      {
        id: 'kp-010',
        category: 'modificavel',
        title: 'Cláusula sobre Animais pode ser Negociada',
        simpleDescription:
          'A regra sobre não poder ter animais pode ser mudada se você negociar com o dono antes de assinar. Converse com seu advogado sobre como fazer isso.',
        legalText: '...salvo autorização escrita e prévia do locador, mediante análise de caso a caso.',
        page: 5,
        section: 'Cláusula 8ª – Das Restrições de Uso',
        confidence: 'baixa',
        confidenceScore: 52,
        confidenceNote:
          'A IA não tem certeza se esta cláusula pode ser modificada no seu caso específico. Isso depende da disposição do locador e deve ser negociado antes da assinatura. NÃO assuma que é negociável sem confirmar.',
        isReviewed: false,
      },
    ],
    deadlines: [
      {
        id: 'dl-001',
        date: '2026-05-01',
        description: 'Início do contrato — entrada no apartamento',
        importance: 'high',
      },
      {
        id: 'dl-002',
        date: '2026-05-05',
        description: 'Primeiro pagamento de aluguel (R$ 2.500)',
        importance: 'high',
      },
      {
        id: 'dl-003',
        date: '2026-05-10',
        description: 'Depósito da caução (R$ 7.500) — já deve ter sido pago',
        importance: 'high',
      },
      {
        id: 'dl-004',
        date: '2028-10-01',
        description: 'Aviso de saída (se não for renovar) — 30 dias antes do fim',
        importance: 'medium',
      },
      {
        id: 'dl-005',
        date: '2028-10-31',
        description: 'Fim do contrato',
        importance: 'medium',
      },
    ],
    risks: [
      {
        id: 'risk-001',
        level: 'alto',
        title: 'Multa por saída antecipada é alta',
        description:
          'R$ 7.500 de multa se sair antes de 30 meses. Verifique se a redução proporcional pela Lei do Inquilinato se aplica.',
      },
      {
        id: 'risk-002',
        level: 'medio',
        title: 'Proibição de animais com linguagem ambígua',
        description:
          'A cláusula de animais menciona exceções mas sem critérios claros, o que pode gerar conflitos futuros.',
      },
      {
        id: 'risk-003',
        level: 'medio',
        title: 'IPTU pode encarecer o custo mensal',
        description:
          'O IPTU é responsabilidade do locatário mas o valor não está especificado no contrato. Verifique o valor anual atual.',
      },
      {
        id: 'risk-004',
        level: 'baixo',
        title: 'Renovação automática não garantida',
        description:
          'Ao fim do prazo, o contrato pode virar indeterminado. Se quiser renovar com novas condições, negocie antes.',
      },
    ],
    correctionRequests: [],
  },
  {
    id: 'doc-002',
    title: 'Contrato de Prestação de Serviços',
    type: 'Prestação de Serviços',
    fileName: 'contrato_servicos_reforma.pdf',
    clientName: 'Maria Silva',
    clientEmail: 'maria.silva@email.com',
    lawyerName: 'Dr. Carlos Mendes',
    lawyerOAB: 'OAB/SP 154.230',
    uploadedAt: '2026-05-08T10:15:00',
    status: 'sent',
    overallRisk: 'baixo',
    overview:
      'Contrato para reforma do seu apartamento. Uma empresa vai fazer os serviços em 60 dias. Você paga em 3 parcelas. Risco baixo, mas fique atento ao prazo de entrega.',
    keyPoints: [
      {
        id: 'kp-s-001',
        category: 'pagamento',
        title: 'Como você vai pagar',
        simpleDescription:
          'Total de R$ 15.000 em 3 parcelas: R$ 5.000 na assinatura, R$ 5.000 no meio da obra e R$ 5.000 na entrega.',
        legalText:
          'O valor total dos serviços é de R$ 15.000,00, dividido em 3 (três) parcelas iguais de R$ 5.000,00: 1ª na assinatura, 2ª na conclusão de 50% das obras e 3ª na entrega final.',
        page: 2,
        section: 'Cláusula 4ª – Do Pagamento',
        confidence: 'alta',
        confidenceScore: 97,
        isReviewed: true,
      },
      {
        id: 'kp-s-002',
        category: 'prazo',
        title: 'Prazo da Obra',
        simpleDescription: 'A empresa tem 60 dias para terminar tudo. Se atrasar por culpa deles, você tem direito a desconto.',
        legalText:
          'O prazo de execução dos serviços é de 60 (sessenta) dias corridos contados da data de início, sujeito a penalidade de 0,5% sobre o valor total por dia de atraso imputável à contratada.',
        page: 3,
        section: 'Cláusula 5ª – Do Prazo de Execução',
        confidence: 'alta',
        confidenceScore: 94,
        isReviewed: true,
      },
    ],
    deadlines: [
      {
        id: 'dl-s-001',
        date: '2026-05-08',
        description: 'Assinatura e pagamento da 1ª parcela (R$ 5.000)',
        importance: 'high',
      },
      {
        id: 'dl-s-002',
        date: '2026-06-07',
        description: 'Vistoria para 2ª parcela (50% da obra concluída)',
        importance: 'medium',
      },
      {
        id: 'dl-s-003',
        date: '2026-07-07',
        description: 'Entrega final e pagamento da última parcela',
        importance: 'high',
      },
    ],
    risks: [
      {
        id: 'risk-s-001',
        level: 'baixo',
        title: 'Garantia de 90 dias para vícios ocultos',
        description: 'A empresa garante os serviços por 90 dias após a entrega.',
      },
    ],
    correctionRequests: [
      {
        id: 'cr-001',
        pointId: 'kp-s-002',
        pointTitle: 'Prazo da Obra',
        clientMessage: 'O que acontece se chover muito e atrasar? Eu pago a multa ou eles?',
        date: '2026-05-09T09:30:00',
        resolved: false,
      },
    ],
  },
];