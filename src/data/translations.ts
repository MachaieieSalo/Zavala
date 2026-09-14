import { DISSERTATION_FULL_QUESTIONS, DEFENSE_SCENARIOS } from './dissertationText';

export type SupportedLang = 'pt' | 'en';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tabs: {
    estudio: string;
    defesa: string;
    campo: string;
    dados: string;
    pesquisa: string;
  };
  header: {
    charBadge: string;
    switchLangTooltip: string;
  };
  studio: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    charCounter: string;
    charsRemaining: string;
    btnSynthesize: string;
    btnSynthesizing: string;
    btnPlayBrowser: string;
    btnPlayingBrowser: string;
    btnClear: string;
    btnDownloadMp3: string;
    speechSpeed: string;
    speechPitch: string;
    speedNormal: string;
    currentLoaded: string;
    noAudioGenerated: string;
    audioReady: string;
  };
  defense: {
    title: string;
    subtitle: string;
    totalQuestions: string;
    allScenarios: string;
    mockDefenseMode: string;
    studyMode: string;
    startMockDefense: string;
    mockTitle: string;
    mockDesc: string;
    timer: string;
    nextQuestion: string;
    prevQuestion: string;
    finishMock: string;
    scoreCard: string;
    juryQuestion: string;
    candidateResponse: string;
    btnListenQuestion: string;
    btnListenResponse: string;
    btnLoadToStudio: string;
    btnCopyResponse: string;
    difficultyFilter: string;
    searchPlaceholder: string;
    btnFullText: string;
    langToggle: string;
  };
  field: {
    title: string;
    subtitle: string;
    uploadTitle: string;
    uploadDesc: string;
    btnSelectFiles: string;
    dropzoneText: string;
    authenticBadge: string;
    originalFile: string;
    location: string;
    gpsCoords: string;
    technicalNotes: string;
    btnListenPhoto: string;
    btnSendToStudio: string;
    btnReplacePhoto: string;
    btnRemovePhoto: string;
    photoNumber: string;
    of: string;
    noPhotosUploadedYet: string;
    uploadRealInstructions: string;
  };
  data: {
    title: string;
    subtitle: string;
    series31: string;
    shocksLosses: string;
    assumptions: string;
    methodology: string;
    villages: string;
    searchDataPlaceholder: string;
    paramToggle: string;
    btnListenRow: string;
    btnSendToStudio: string;
  };
  search: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    allResults: string;
    dataResults: string;
    fieldResults: string;
    defenseResults: string;
    quickTags: string;
    noResults: string;
  };
  toasts: {
    langSwitchedPt: string;
    langSwitchedEn: string;
    sampleLoaded: string;
    questionLoaded: string;
    audioSuccess: string;
    photosLoaded: string;
    photoRemoved: string;
  };
}

export const TRANSLATIONS: Record<SupportedLang, Translations> = {
  pt: {
    appName: 'ZavalaVoz',
    appSubtitle: 'Estúdio de Voz, Defesa & Dados de Zavala (1994–2024)',
    tabs: {
      estudio: 'Estúdio',
      defesa: 'Defesa',
      campo: 'Campo',
      dados: 'Dados',
      pesquisa: 'Pesquisa',
    },
    header: {
      charBadge: '30k caracteres',
      switchLangTooltip: 'Alternar idioma da interface e síntese (PT / EN)',
    },
    studio: {
      title: 'Estúdio de Síntese de Voz',
      subtitle: 'Converta qualquer texto em áudio de alta fidelidade com sotaques regionais',
      inputPlaceholder: 'Escreva ou cole aqui o texto para conversão em voz (artigo científico, ata, síntese da tese)...',
      charCounter: 'caracteres',
      charsRemaining: 'restantes',
      btnSynthesize: 'Sintetizar com IA',
      btnSynthesizing: 'A processar áudio...',
      btnPlayBrowser: 'Ouvir no Navegador',
      btnPlayingBrowser: 'A reproduzir...',
      btnClear: 'Limpar',
      btnDownloadMp3: 'Descarregar MP3',
      speechSpeed: 'Velocidade',
      speechPitch: 'Tom da Voz',
      speedNormal: '1.0x Normal',
      currentLoaded: 'Texto Carregado',
      noAudioGenerated: 'Nenhum áudio gerado ainda. Digite ou carregue uma pergunta e clique em sintetizar.',
      audioReady: 'Áudio sintetizado pronto para reprodução e download.',
    },
    defense: {
      title: 'Banco de Perguntas & Simulação de Defesa',
      subtitle: `Explore as ${DISSERTATION_FULL_QUESTIONS.length} questões estruturadas em ${DEFENSE_SCENARIOS.length} cenários da tese de Yolanda Tamele (ESUDER / UEM)`,
      totalQuestions: 'perguntas disponíveis',
      allScenarios: 'Todos os Cenários',
      mockDefenseMode: 'Simulador de Defesa Real',
      studyMode: 'Modo de Estudo & Leitura',
      startMockDefense: 'Sortear Banca Simulada (5 Perguntas)',
      mockTitle: 'Sessão de Arguição Simulada',
      mockDesc: 'Treine as suas respostas com cronómetro oficial e perguntas sorteadas pelo júri.',
      timer: 'Tempo de Resposta',
      nextQuestion: 'Pergunta Seguinte',
      prevQuestion: 'Pergunta Anterior',
      finishMock: 'Encerrar Simulação',
      scoreCard: 'Progresso da Banca',
      juryQuestion: 'Pergunta da Comissão Examinadora (Júri):',
      candidateResponse: 'Resposta Científica de Yolanda Tamele:',
      btnListenQuestion: 'Ouvir Pergunta do Júri',
      btnListenResponse: 'Ouvir Resposta',
      btnLoadToStudio: 'Carregar no Estúdio',
      btnCopyResponse: 'Copiar Texto',
      difficultyFilter: 'Perfil do Examinador',
      searchPlaceholder: 'Pesquisar perguntas por tema, conceito ou palavra-chave...',
      btnFullText: 'Texto Completo',
      langToggle: 'Idioma das Perguntas',
    },
    field: {
      title: 'Galeria Etnográfica e Agronómica de Campo',
      subtitle: 'Registos autênticos do Apêndice D em Zavala e Posto Administrativo de Quissico',
      uploadTitle: 'Carregar Fotografias Reais de Campo',
      uploadDesc: 'Selecione ou arraste os seus ficheiros reais (.jpeg/.png) para substituir as fichas de catálogo.',
      btnSelectFiles: 'Selecionar Ficheiros Reais',
      dropzoneText: 'Arraste as suas fotografias reais para aqui ou clique para selecionar',
      authenticBadge: 'Registo do Apêndice D',
      originalFile: 'Ficheiro Original',
      location: 'Localização',
      gpsCoords: 'Coordenadas & Altitude',
      technicalNotes: 'Observações Técnicas de Campo:',
      btnListenPhoto: 'Ouvir Descrição Etnográfica',
      btnSendToStudio: 'Enviar ao Estúdio',
      btnReplacePhoto: 'Substituir Foto',
      btnRemovePhoto: 'Remover Foto',
      photoNumber: 'Registo',
      of: 'de',
      noPhotosUploadedYet: 'Ficha documental autêntica. Carregue o seu ficheiro fotográfico real para visualização direta.',
      uploadRealInstructions: 'Carregue ficheiros com os nomes do WhatsApp (ex: WhatsApp Image 2026-09-04 at 15.23...) ou qualquer fotografia do seu trabalho de campo.',
    },
    data: {
      title: 'Dados do Modelo Zavala Mandioca (1994–2024)',
      subtitle: 'Reconstituição de 31 anos baseada no SDAE Zavala, World Bank Jobs WP 31, PROSUL e Choques Climáticos.',
      series31: 'Série 31 Anos (B)',
      shocksLosses: 'Choques & Perdas (D)',
      assumptions: 'Pressupostos (A)',
      methodology: 'Metodologia (E)',
      villages: '11 Bairros',
      searchDataPlaceholder: 'Filtrar por ano, status ou evento...',
      paramToggle: 'Ver Parâmetros Completos (F_Área, F_Rend)',
      btnListenRow: 'Ouvir Dados',
      btnSendToStudio: 'No Estúdio',
    },
    search: {
      title: 'Motor de Pesquisa Global da Dissertação',
      subtitle: 'Pesquise simultaneamente na série histórica, nas fotos reais de campo e nas perguntas da defesa.',
      inputPlaceholder: 'Pesquisar anos, choques, fotos de campo, termos técnicos ou perguntas...',
      allResults: 'Todos os Registos',
      dataResults: 'Dados 1994–2024',
      fieldResults: 'Fotos de Campo',
      defenseResults: 'Perguntas de Defesa',
      quickTags: 'Sugestões de Pesquisa Rápida:',
      noResults: 'Nenhum resultado encontrado para o termo pesquisado.',
    },
    toasts: {
      langSwitchedPt: 'Idioma alterado para Português (Moçambique)',
      langSwitchedEn: 'Language switched to English',
      sampleLoaded: 'Frase de exemplo carregada!',
      questionLoaded: 'Pergunta carregada no Estúdio!',
      audioSuccess: 'Áudio sintetizado com sucesso!',
      photosLoaded: 'Fotografias reais de campo carregadas com sucesso!',
      photoRemoved: 'Fotografia personalizada removida.',
    },
  },
  en: {
    appName: 'ZavalaVoz',
    appSubtitle: 'Voice Studio, Dissertation Defense & Zavala Data (1994–2024)',
    tabs: {
      estudio: 'Studio',
      defesa: 'Defense',
      campo: 'Field',
      dados: 'Data',
      pesquisa: 'Search',
    },
    header: {
      charBadge: '30k characters',
      switchLangTooltip: 'Toggle interface and voice language (PT / EN)',
    },
    studio: {
      title: 'Voice Synthesis Studio',
      subtitle: 'Convert any text into high-fidelity speech with regional Mozambican and international accents',
      inputPlaceholder: 'Write or paste text here for speech conversion (academic paper, summary, field notes)...',
      charCounter: 'characters',
      charsRemaining: 'remaining',
      btnSynthesize: 'Synthesize with AI',
      btnSynthesizing: 'Processing audio...',
      btnPlayBrowser: 'Listen in Browser',
      btnPlayingBrowser: 'Playing audio...',
      btnClear: 'Clear',
      btnDownloadMp3: 'Download MP3',
      speechSpeed: 'Speed',
      speechPitch: 'Pitch',
      speedNormal: '1.0x Normal',
      currentLoaded: 'Loaded Text',
      noAudioGenerated: 'No audio generated yet. Enter text or load a defense question and click synthesize.',
      audioReady: 'Synthesized audio ready for playback and MP3 download.',
    },
    defense: {
      title: 'Defense Question Bank & Mock Exam Simulator',
      subtitle: `Explore ${DISSERTATION_FULL_QUESTIONS.length} comprehensive questions structured across ${DEFENSE_SCENARIOS.length} thesis defense scenarios (Yolanda Tamele, ESUDER / UEM)`,
      totalQuestions: 'questions available',
      allScenarios: 'All Scenarios',
      mockDefenseMode: 'Live Mock Defense Simulator',
      studyMode: 'Study & Reading Mode',
      startMockDefense: 'Draw Mock Examination Panel (5 Questions)',
      mockTitle: 'Simulated Examination Session',
      mockDesc: 'Practice defense responses with an official countdown timer and drawn examiner questions.',
      timer: 'Response Time',
      nextQuestion: 'Next Question',
      prevQuestion: 'Previous Question',
      finishMock: 'End Simulation',
      scoreCard: 'Panel Progress',
      juryQuestion: 'Examining Committee Question (Jury):',
      candidateResponse: "Yolanda Tamele's Scientific Answer:",
      btnListenQuestion: 'Listen to Jury Question',
      btnListenResponse: 'Listen to Answer',
      btnLoadToStudio: 'Load into Studio',
      btnCopyResponse: 'Copy Text',
      difficultyFilter: 'Examiner Profile',
      searchPlaceholder: 'Search questions by topic, concept, or keyword...',
      btnFullText: 'Full Text',
      langToggle: 'Question Language',
    },
    field: {
      title: 'Ethnographic and Agronomic Field Gallery',
      subtitle: '10 authentic records from Appendix D in Zavala District and Quissico Administrative Post',
      uploadTitle: 'Upload Real Field Photos',
      uploadDesc: 'Select or drag your 10 authentic photo files (.jpeg/.png) to replace the catalog cards.',
      btnSelectFiles: 'Select Real Photos',
      dropzoneText: 'Drag your 10 real field photos here or click to select files',
      authenticBadge: 'Appendix D Field Record',
      originalFile: 'Original File',
      location: 'Location',
      gpsCoords: 'Coordinates & Elevation',
      technicalNotes: 'Field Agronomic Observations:',
      btnListenPhoto: 'Listen to Field Notes',
      btnSendToStudio: 'Send to Studio',
      btnReplacePhoto: 'Replace Photo',
      btnRemovePhoto: 'Remove Photo',
      photoNumber: 'Record',
      of: 'of',
      noPhotosUploadedYet: 'Authentic documentary card. Upload your actual field photo for direct viewing.',
      uploadRealInstructions: 'Upload files with your WhatsApp photo filenames or any photographs from your Zavala field survey.',
    },
    data: {
      title: 'Zavala Cassava Model Data (1994–2024)',
      subtitle: '31-year reconstruction based on SDAE Zavala, World Bank Jobs WP 31, PROSUL, and Climate Shocks.',
      series31: '31-Year Series (B)',
      shocksLosses: 'Shocks & Losses (D)',
      assumptions: 'Assumptions (A)',
      methodology: 'Methodology (E)',
      villages: '11 Villages',
      searchDataPlaceholder: 'Filter by year, status, or event...',
      paramToggle: 'View Full Parameters (F_Area, F_Yield)',
      btnListenRow: 'Listen to Data',
      btnSendToStudio: 'In Studio',
    },
    search: {
      title: 'Global Dissertation Search Engine',
      subtitle: 'Search simultaneously across the historical time series, authentic field photos, and defense questions.',
      inputPlaceholder: 'Search years, climate shocks, field photos, technical terms, or defense questions...',
      allResults: 'All Records',
      dataResults: '1994–2024 Data',
      fieldResults: 'Field Photos',
      defenseResults: 'Defense Questions',
      quickTags: 'Quick Search Terms:',
      noResults: 'No records found matching the search query.',
    },
    toasts: {
      langSwitchedPt: 'Idioma alterado para Português (Moçambique)',
      langSwitchedEn: 'Language switched to English (US)',
      sampleLoaded: 'Sample phrase loaded!',
      questionLoaded: 'Question loaded into Studio!',
      audioSuccess: 'Audio synthesized successfully!',
      photosLoaded: 'Real field photos uploaded successfully!',
      photoRemoved: 'Custom photo removed.',
    },
  },
};
