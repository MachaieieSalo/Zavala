// Matriz Científica de Evidência Cruzada (Triangulação Metodológica)
// Dissertação de Yolanda Tamele • Zavala (1994–2024)
// Liga: Registos Fotográficos Reais ↔ Entrevistas/Inquéritos de Campo ↔ Observação da Investigadora ↔ Dissertação
// REGRAS DE INTEGRIDADE:
// - 'Relação confirmada': Ligação documental direta com o local, evento ou amostra registada.
// - 'Relação temática sugerida': Correspondência teórica ou empírica inferida por convergência de temas.

export type RelationshipType = 'Relação confirmada' | 'Relação temática sugerida';

export interface CrossEvidenceItem {
  id: string;
  theme: string;
  themeCategory: 'Agronomia e Solos' | 'Fitossanidade e Pragas' | 'Clima e Choques' | 'Sociologia e Género' | 'Extensão e Políticas' | 'Sistemas Agrários';
  title: string;
  relationshipType: RelationshipType;
  relationshipJustification: string;
  dissertationChapter: string;
  dissertationReference: string;
  empiricalBasis: string;
  // Conexões empíricas
  relatedPhotoIds: string[];
  relatedInterviewIds: string[];
  // Quatro camadas epistemológicas explícitas
  participantVoiceExcerpt: string;
  fieldObservationExcerpt: string;
  analyticalInterpretation: string;
}

export const CROSS_EVIDENCE_ITEMS: CrossEvidenceItem[] = [
  {
    id: 'cruz_01',
    theme: 'Sistemas Agroecológicos e Fixação em Solos Arenosos',
    themeCategory: 'Agronomia e Solos',
    title: 'Consociação Mandioca-Leguminosas em Arenossolos Litorâneos',
    relationshipType: 'Relação confirmada',
    relationshipJustification: 'Registo fotográfico da machamba de Quissico Sul (Foto 2) e depoimentos sistemáticos de consociação com amendoim e feijão registados em Canetane, Massava e Mindu Quissico.',
    dissertationChapter: 'Capítulo 2 (§2.3) e Capítulo 4 (§4.2.1)',
    dissertationReference: 'Dissertação, p. 48–52: Caracterização dos Arenossolos e Práticas Tradicionais de Policultura em Zavala.',
    empiricalBasis: '100% dos produtores inquiridos declaram cultivar amendoim e feijão (nhemba/jogo) simultaneamente ou em rotação com a mandioca em solo arenoso.',
    relatedPhotoIds: ['foto_2', 'foto_1'],
    relatedInterviewIds: ['entrevista_p01_01', 'entrevista_p05_01', 'entrevista_p06_01', 'entrevista_p23_01'],
    participantVoiceExcerpt: '"Consociação de amendoim, feijão e mandioca... o solo é areia, usamos pousio e capina para aguentar a terra." (Amaral Marciano & Cacilda Matavel)',
    fieldObservationExcerpt: 'Machamba ampla instalada em cordão arenoso litorâneo. Plantio consorciado com Arachis hypogaea e Vigna unguiculata para cobertura rasteira e retenção de humidade superficial sob coqueiros.',
    analyticalInterpretation: 'A consociação tradicional mitiga a excessiva perda de água por percolação nos Arenossolos e providencia fixação biológica de azoto numa agricultura desprovida de fertilizantes químicos industriais.',
  },
  {
    id: 'cruz_02',
    theme: 'Fitossanidade e Vetores de Propagação por Estacas',
    themeCategory: 'Fitossanidade e Pragas',
    title: 'Mosaico Vírico (CMD), Cochonilha e Manchas nas Estacas',
    relationshipType: 'Relação confirmada',
    relationshipJustification: 'Identificação in-situ de sintomas de mosaico nas folhas e pragas (insecto escama/cochonilha) relatadas em mais de 80% das fichas de inquérito nos 9 povoados.',
    dissertationChapter: 'Capítulo 2 (§2.4.2) e Capítulo 4 (§4.4)',
    dissertationReference: 'Dissertação, p. 65–71: Dinâmica Epifitiológica do Cassava Mosaic Virus (CMD) e Degradação de Germoplasma Local.',
    empiricalBasis: '68 de 77 formulários de inquérito (88,3%) reportam expressamente Mosaico, Insecto Escama, Cochonilha ou Podridão como constrangimento central.',
    relatedPhotoIds: ['foto_4', 'foto_10'],
    relatedInterviewIds: ['entrevista_p01_01', 'entrevista_p03_01', 'entrevista_p08_01', 'entrevista_p14_01', 'entrevista_p15_01', 'entrevista_p29_01'],
    participantVoiceExcerpt: '"Manchas brancas nas estacas... mosaico e insecto escama comem as folhas." (Carolina Paulo, Massava & Adelina Sondeia, Canetane)',
    fieldObservationExcerpt: 'Observação em campo de caules ramificados com deformação apical e clorose internerval. As estacas são reiteradamente partilhadas entre vizinhos sem tratamento fitossanitário prévio.',
    analyticalInterpretation: 'A propagação vegetativa informal entre agregados familiares atua como vetor involuntário do vírus do mosaico e de cochonilhas, acelerando a quebra de produtividade mesmo em anos com chuva favorável.',
  },
  {
    id: 'cruz_03',
    theme: 'Clima, Choques e o Paradoxo da Pluviosidade',
    themeCategory: 'Clima e Choques',
    title: 'Causas de Quebra: Seca Extrema vs. Encharcamento e Ciclones',
    relationshipType: 'Relação temática sugerida',
    relationshipJustification: 'A tese demonstra que a precipitação CHIRPS isolada não tem correlação linear com a colheita (r = 0,057). Os produtores apontam "chuva/seca" de forma qualitativa e multidirecional.',
    dissertationChapter: 'Capítulo 4 (§4.3) e Resumo Executivo',
    dissertationReference: 'Dissertação, p. 84–91: Análise Econométrica do Impacto de Eventos Climáticos Extremos (1994–2024).',
    empiricalBasis: 'Na série histórica de 31 anos, registam-se 14 anos de choques com perda acumulada de 547.224 t. O colapso de 2023 (-59,6%) deu-se sob precipitação +78,1% acima da média (Ciclone Freddy).',
    relatedPhotoIds: ['foto_8', 'foto_7'],
    relatedInterviewIds: ['entrevista_p02_02', 'entrevista_p17_01', 'entrevista_p24_01', 'entrevista_p28_01'],
    participantVoiceExcerpt: '"A produção diminuiu por causa da falta de chuva e do clima... em 2023 a água estragou as raízes no chão." (João Hambanane & Boaventura António)',
    fieldObservationExcerpt: 'Reunião de grupo focal em Mahumane sobre choques cíclicos. Agricultores relatam que tanto a estiagem prolongada quanto o alagamento súbito apodrecem raízes tuberosas nas baixas de Quissico.',
    analyticalInterpretation: 'O discurso dos camponeses sintetiza sob a palavra "chuva" duas vulnerabilidades distintas: o stress hídrico que impede a tuberização e o excesso com drenagem deficiente que provoca a asfixia radicular.',
  },
  {
    id: 'cruz_04',
    theme: 'Divisão Sexual do Trabalho e Práticas Comunitárias',
    themeCategory: 'Sociologia e Género',
    title: 'Protagonismo Feminino, Enxada de Cabo Curto (Xikotso) e Kukwatsana',
    relationshipType: 'Relação confirmada',
    relationshipJustification: 'Foto 6 documenta o mutirão de mulheres com enxadas e Foto 8 documenta o grupo focal etnográfico. Os dados mostram cerca de 60% de mulheres nos inquéritos e 85% das operações manuais.',
    dissertationChapter: 'Capítulo 3 (§3.2) e Capítulo 4 (§4.5)',
    dissertationReference: 'Dissertação, p. 58–62: Organização Social do Trabalho Agrícola e Relações de Género no Distrito de Zavala.',
    empiricalBasis: '38 das 63 fichas individuais foram respondidas diretamente por mulheres agricultoras, com presença predominante do trabalho coletivo de ajuda mútua (kukwatsana).',
    relatedPhotoIds: ['foto_6', 'foto_8', 'foto_9', 'foto_3'],
    relatedInterviewIds: ['entrevista_p05_01', 'entrevista_p07_01', 'entrevista_p12_02', 'entrevista_p26_01', 'entrevista_p38_01'],
    participantVoiceExcerpt: '"Trabalhamos em mutirão com as enxadas de mão para abrir a terra e sachar antes que o capim abafe a mandioca." (Madalena Ernesto & Laurinda Macucule)',
    fieldObservationExcerpt: 'Mutirão comunitário de mulheres (kukwatsana) reunidas com enxadas manuais de cabo curto artesanal. Ausência quase total de mecanização ou tração animal nas machambas familiares.',
    analyticalInterpretation: 'A mandioca constitui a base da segurança alimentar doméstica sustentada primordialmente pelo trabalho reprodutivo e produtivo feminino, num contexto de migração histórica masculina para a África do Sul.',
  },
  {
    id: 'cruz_05',
    theme: 'Difusão Tecnológica e Variedades Melhoradas',
    themeCategory: 'Extensão e Políticas',
    title: 'Impacto dos Projetos de Fomento (PROCAVA, SUSTENTA, SDAE)',
    relationshipType: 'Relação confirmada',
    relationshipJustification: 'Apoio institucional nominal citado nos formulários (SDAE, PROCAVA, SUSTENTA, PROSUL) e verificação de novas variedades (Umbeluzi 2, Tapioca, Nguilande, Muvanguele).',
    dissertationChapter: 'Capítulo 4 (§4.6) e Capítulo 5 (§5.2)',
    dissertationReference: 'Dissertação, p. 102–109: Avaliação dos Programas Públicos de Fomento Agrário e Difusão de Germoplasma em Zavala.',
    empiricalBasis: 'Produtores beneficiários do PROCAVA e SUSTENTA (ex.: p. 29, 30, 31, 34, 35) reportam aumento de rendimento associado à distribuição de estacas melhoradas.',
    relatedPhotoIds: ['foto_4', 'foto_5'],
    relatedInterviewIds: ['entrevista_p15_03_lider', 'entrevista_p27_01', 'entrevista_p30_01', 'entrevista_p31_01', 'entrevista_p35_01'],
    participantVoiceExcerpt: '"A produção aumentou por causa do apoio de estacas e combate de pragas do projeto PROCAVA e SUSTENTA." (Carolina Macilauane, Luís Butine, Francisco Muchanga)',
    fieldObservationExcerpt: 'Equipa de extensionistas rurais uniformizados com fardamento de serviço acompanhando a investigadora e examinando a sanidade de variedades melhoradas fornecidas pelo SDAE.',
    analyticalInterpretation: 'Quando articulada com assistência técnica e fornecimento de material são, a intervenção pública tem capacidade demonstrada de elevar a produção familiar, contrariando o ciclo de estagnação.',
  },
  {
    id: 'cruz_06',
    theme: 'Manejo do Solo e Regeneração da Fertilidade',
    themeCategory: 'Sistemas Agrários',
    title: 'Pousio Tradicional, Rotação e Corte-e-Queima (Itikoma)',
    relationshipType: 'Relação confirmada',
    relationshipJustification: 'Foto 7 documenta a machamba com troncos queimados e desbrave. 85% dos inquiridos assinalam "Pousio" ou "Muda de campo/lugar" como método exclusivo de conservação.',
    dissertationChapter: 'Capítulo 2 (§2.5) e Capítulo 4 (§4.2.3)',
    dissertationReference: 'Dissertação, p. 54–57: Sistemas de Pousio, Mobilidade Espacial e Sustentabilidade da Fertilidade dos Solos.',
    empiricalBasis: '49 formulários indicam "Pousio", 12 indicam "Capina" e 3 indicam "Queimada" explícita como prática de renovação.',
    relatedPhotoIds: ['foto_7', 'foto_1'],
    relatedInterviewIds: ['entrevista_p01_01', 'entrevista_p05_01', 'entrevista_p28_02', 'entrevista_p43_02'],
    participantVoiceExcerpt: '"A terra cansa depressa na areia; temos de mudar de lugar e deixar a machamba velha em pousio para recuperar." (Amaral Marciano, Sagineta Albino, Berta Fabião)',
    fieldObservationExcerpt: 'Agricultor em parcela com troncos carbonizados de desbrave tradicional ("Itikoma"). Os restos vegetais retêm o solo e funcionam como barreira contra o escoamento arenoso.',
    analyticalInterpretation: 'A rotação de terras e o pousio arbustivo compensam a baixíssima Capacidade de Troca Catiónica (CTC) dos solos de Zavala, embora a pressão demográfica esteja a reduzir os ciclos de repouso.',
  },
  {
    id: 'cruz_07',
    theme: 'Comercialização, Valor Agregado e Rendimento Familiar',
    themeCategory: 'Sistemas Agrários',
    title: 'Venda em Sacos e Transformação Local (Rale e Farinha)',
    relationshipType: 'Relação temática sugerida',
    relationshipJustification: 'Nas fichas de inquérito, a quase totalidade dos camponeses declara "Venda em sacos" ou "Consumo e venda", cruzada com a análise de rendimento radicular fresco da Foto 5.',
    dissertationChapter: 'Capítulo 4 (§4.7)',
    dissertationReference: 'Dissertação, p. 112–117: Circuitos de Comercialização da Mandioca e Valorização Pós-Colheita em Inhambane.',
    empiricalBasis: 'A comercialização informal em sacos na berma da Estrada Nacional n.º 1 (EN1) e mercados locais de Quissico assegura liquidez monetária imediata para as famílias.',
    relatedPhotoIds: ['foto_5', 'foto_8'],
    relatedInterviewIds: ['entrevista_p01_01', 'entrevista_p06_01', 'entrevista_p24_01', 'entrevista_p42_01'],
    participantVoiceExcerpt: '"Vendemos a mandioca em sacos na vila de Quissico... quando o preço no mercado cai, temos prejuízo." (Anabela Carlos & Gonsalves Salomão Amade)',
    fieldObservationExcerpt: 'Escavação manual e medição biométrica de raízes frescas de calibre comercial (~35-42 cm). Produto altamente perecível exigindo escoamento rápido ou transformação em rale seco.',
    analyticalInterpretation: 'A dependência da venda in natura em sacos sem processamento agro-industrial deixa os agricultores reféns de intermediários de transporte e de oscilações acentuadas de preços nos mercados urbanos.',
  },
];
