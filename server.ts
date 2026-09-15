import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import lamejs from '@breezystack/lamejs';
import { handleResearchQuery } from './server/researchEngine';
import {
  evaluateCandidateResponse,
  selectNextAdaptiveQuestion,
  generateFinalDefenseReport,
  generateModelCandidateResponse,
  EXAMINER_PROFILES,
  CANONICAL_ADAPTIVE_QUESTIONS,
  ExaminerId,
  DefenseTone,
  ArgumentationStepRecord,
} from './src/data/adaptiveDefenseEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Estação de Pesquisa Científica com LLM
app.get('/api/research/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'zavalavoz-scientific-engine-v1',
    corpus: 'Dissertação Yolanda Tamele (ESUDER / UEM 1994-2024)',
  });
});

app.post('/api/research/query', async (req: Request, res: Response) => {
  try {
    const { query, scope, history } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        error: 'A consulta deve conter texto válido.',
      });
    }

    const response = await handleResearchQuery({
      query: query.trim(),
      scope,
      history,
    });

    return res.json(response);
  } catch (error: any) {
    console.error('Error in /api/research/query:', error);
    const isTimeout = error?.code === 'ETIMEDOUT' || error?.message?.includes('timeout');
    const isRateLimit = error?.status === 429 || error?.message?.includes('rate limit') || error?.message?.includes('quota');

    let userMessage = 'Ocorreu uma falha ao consultar os materiais da dissertação.';
    if (isTimeout) {
      userMessage = 'O tempo limite de resposta da consulta foi excedido. Por favor, tente formular uma questão mais específica.';
    } else if (isRateLimit) {
      userMessage = 'O limite de consultas da API externa foi momentaneamente atingido. O motor determinístico foi accionado.';
    }

    return res.status(500).json({
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
});

// FASE 14: SALA DE BANCA DIGITAL & SIMULAÇÃO CIENTÍFICA ADAPTATIVA
app.get('/api/defense/adaptive/examiners', (req: Request, res: Response) => {
  res.json({
    examiners: Object.values(EXAMINER_PROFILES),
    initialQuestions: CANONICAL_ADAPTIVE_QUESTIONS,
  });
});

app.post('/api/defense/adaptive/evaluate', (req: Request, res: Response) => {
  try {
    const { question, candidateResponse, examinerId, tone, history, sessionLength } = req.body;
    if (!question || !candidateResponse) {
      return res.status(400).json({ error: 'Pergunta e resposta da candidata são obrigatórias.' });
    }

    const examinerProfile = EXAMINER_PROFILES[examinerId as ExaminerId] || EXAMINER_PROFILES.metodologia_estatistica;
    const selectedTone: DefenseTone = tone === 'hostil' ? 'hostil' : 'realista';

    const result = evaluateCandidateResponse({
      question,
      candidateResponse,
      examinerProfile,
      tone: selectedTone,
      history: history || [],
      sessionLength: sessionLength || 5,
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/defense/adaptive/evaluate:', error);
    return res.status(500).json({ error: 'Falha ao avaliar resposta adaptativa da candidata.' });
  }
});

app.post('/api/defense/adaptive/next-question', (req: Request, res: Response) => {
  try {
    const { currentQuestion, evalResult, examinerId, usedQuestionIds } = req.body;
    const selectedExaminerId: ExaminerId = examinerId || 'metodologia_estatistica';
    const usedSet = new Set<string>(Array.isArray(usedQuestionIds) ? usedQuestionIds : []);

    const nextQ = selectNextAdaptiveQuestion(
      currentQuestion,
      evalResult,
      selectedExaminerId,
      usedSet
    );

    return res.json(nextQ);
  } catch (error: any) {
    console.error('Error in /api/defense/adaptive/next-question:', error);
    return res.status(500).json({ error: 'Falha ao selecionar a próxima questão adaptativa.' });
  }
});

app.post('/api/defense/adaptive/report', (req: Request, res: Response) => {
  try {
    const { sessionId, startedAt, examinerId, tone, history } = req.body;
    const report = generateFinalDefenseReport(
      sessionId || `sess_${Date.now()}`,
      startedAt || new Date().toISOString(),
      (examinerId as ExaminerId) || 'metodologia_estatistica',
      (tone as DefenseTone) || 'realista',
      (history as ArgumentationStepRecord[]) || []
    );
    return res.json(report);
  } catch (error: any) {
    console.error('Error in /api/defense/adaptive/report:', error);
    return res.status(500).json({ error: 'Falha ao gerar relatório final da banca.' });
  }
});

app.post('/api/defense/adaptive/train-response', (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Questão é necessária para gerar resposta modelo.' });
    }
    const modelResponse = generateModelCandidateResponse(question);
    return res.json(modelResponse);
  } catch (error: any) {
    console.error('Error in /api/defense/adaptive/train-response:', error);
    return res.status(500).json({ error: 'Falha ao gerar modelo de resposta de treino.' });
  }
});

// Helper to chunk long texts safely on natural boundaries
function splitTextIntoChunks(rawText: string, maxChunkLen = 800): string[] {
  const paragraphs = rawText.split(/\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    if ((currentChunk + '\n\n' + cleanPara).length <= maxChunkLen) {
      currentChunk = currentChunk ? currentChunk + '\n\n' + cleanPara : cleanPara;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      if (cleanPara.length <= maxChunkLen) {
        currentChunk = cleanPara;
      } else {
        const sentences = cleanPara.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanPara];
        for (const sentence of sentences) {
          const s = sentence.trim();
          if (!s) continue;
          if ((currentChunk + ' ' + s).length <= maxChunkLen) {
            currentChunk = currentChunk ? currentChunk + ' ' + s : s;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = s;
          }
        }
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks.length > 0 ? chunks : [rawText.trim()];
}

// Text-to-Speech Endpoint
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, variation = 'pt-BR', voice = 'Kore', tone = 'natural', speed = 1.0 } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Texto não fornecido ou vazio.' });
    }

    if (text.length > 30000) {
      return res.status(400).json({ error: 'O texto excede o limite de 30.000 caracteres.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chave de API Gemini não configurada no servidor (GEMINI_API_KEY).',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Determine prompt directives based on language variation & tone
    let variationDirective = 'Speak in clear, natural Portuguese.';
    switch (variation) {
      case 'pt-BR':
        variationDirective =
          'Speak in natural Brazilian Portuguese with an authentic, fluent Brazilian accent (Português do Brasil).';
        break;
      case 'pt-PT':
        variationDirective =
          'Speak in authentic European Portuguese with standard Lisbon/Portugal pronunciation, rhythm, and cadence (Português de Portugal).';
        break;
      case 'pt-AO':
        variationDirective =
          'Speak in authentic Angolan Portuguese with a warm, melodic Angolan cadence and pronunciation (Português de Angola).';
        break;
      case 'pt-MZ':
        variationDirective =
          'Speak in authentic Mozambican Portuguese with clear, expressive Mozambican intonation (Português de Moçambique).';
        break;
      case 'en-US':
        variationDirective =
          'Speak in natural General American English with a standard US accent.';
        break;
      case 'en-GB':
        variationDirective =
          'Speak in refined British English with standard Received Pronunciation (crisp UK accent).';
        break;
      case 'en-AU':
        variationDirective =
          'Speak in warm Australian English with a natural, friendly Australian accent (Aussie cadence).';
        break;
      case 'en-CA':
        variationDirective =
          'Speak in smooth Canadian English with standard Canadian pronunciation and gentle cadence.';
        break;
    }

    let toneDirective = 'Deliver in a balanced, conversational tone.';
    switch (tone) {
      case 'cheerful':
        toneDirective = 'Deliver cheerfully with enthusiasm, warmth, and bright energy.';
        break;
      case 'formal':
        toneDirective = 'Deliver in an authoritative, professional, and clear broadcasting style.';
        break;
      case 'calm':
        toneDirective = 'Deliver in a calm, soothing, relaxed, and unhurried pacing.';
        break;
      case 'narrative':
        toneDirective = 'Deliver like a skilled audiobook narrator, with nuanced emotional expression and storytelling pauses.';
        break;
    }

    let speedDirective = '';
    if (speed && speed < 0.9) {
      speedDirective = 'Speak at a slightly slower, deliberate pace.';
    } else if (speed && speed > 1.1) {
      speedDirective = 'Speak at a brisk, energetic pace.';
    }

    // Build the instruction prompt for Gemini TTS
    const speechPrompt = `Instructions: ${variationDirective} ${toneDirective} ${speedDirective} Do NOT add any preamble, conversational introduction, commentary, or quotes. Read the following text aloud verbatim:\n\n${text.trim()}`;

    // Valid prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const validVoices = ['Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'];
    const chosenVoice = validVoices.includes(voice) ? voice : 'Kore';

    const textChunks = splitTextIntoChunks(text, 850);
    console.log(`Processing TTS in ${textChunks.length} chunk(s) for ${text.length} chars...`);

    const pcmBuffers: Buffer[] = [];

    for (let cIdx = 0; cIdx < textChunks.length; cIdx++) {
      const chunkText = textChunks[cIdx];
      const speechPrompt = `Instructions: ${variationDirective} ${toneDirective} ${speedDirective} Do NOT add any preamble, conversational introduction, commentary, or quotes. Read the following text aloud verbatim:\n\n${chunkText.trim()}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: speechPrompt }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: chosenVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error(`Falha ao sintetizar o trecho ${cIdx + 1} de ${textChunks.length}.`);
      }

      pcmBuffers.push(Buffer.from(base64Audio, 'base64'));

      // If multiple chunks, add subtle 120ms silence pause between paragraphs
      if (cIdx < textChunks.length - 1) {
        const silence = Buffer.alloc(5760);
        pcmBuffers.push(silence);
      }
    }

    const combinedPcm = Buffer.concat(pcmBuffers);
    const samples = new Int16Array(
      combinedPcm.buffer,
      combinedPcm.byteOffset,
      Math.floor(combinedPcm.length / 2)
    );

    const durationSeconds = Number((samples.length / 24000).toFixed(2));

    // Convert to MP3 using @breezystack/lamejs
    const Mp3Encoder = lamejs.Mp3Encoder || (lamejs as any).default?.Mp3Encoder;
    if (!Mp3Encoder) {
      throw new Error('Codificador MP3 indisponível no servidor.');
    }

    const encoder = new Mp3Encoder(1, 24000, 128); // mono, 24kHz, 128kbps
    const blockSize = 1152;
    const mp3Chunks: Buffer[] = [];

    for (let i = 0; i < samples.length; i += blockSize) {
      const chunk = samples.subarray(i, i + blockSize);
      const mp3buf = encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) {
        mp3Chunks.push(Buffer.from(mp3buf));
      }
    }

    const endBuf = encoder.flush();
    if (endBuf.length > 0) {
      mp3Chunks.push(Buffer.from(endBuf));
    }

    const finalMp3Buffer = Buffer.concat(mp3Chunks);

    // Clean safe filename
    const safeSnippet = text
      .trim()
      .slice(0, 20)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'audio';
    const fileName = `${safeSnippet}_${variation.toLowerCase()}_${chosenVoice.toLowerCase()}.mp3`;

    return res.json({
      audioBase64: finalMp3Buffer.toString('base64'),
      mimeType: 'audio/mpeg',
      durationSeconds,
      fileSizeBytes: finalMp3Buffer.length,
      fileName,
      text: text.trim(),
      voice: chosenVoice,
      variation,
      createdAt: Date.now(),
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    const isQuota =
      error?.status === 429 ||
      error?.message?.includes('429') ||
      error?.message?.includes('RESOURCE_EXHAUSTED') ||
      error?.message?.includes('quota');

    const message = isQuota
      ? 'A cota gratuita do modelo de voz Gemini foi atingida para este período. Você pode ouvir instantaneamente utilizando a "Voz Local do Navegador" (ilimitada) ou aguardar a liberação da cota.'
      : (error?.message || 'Falha ao processar conversão de texto para áudio.');

    return res.status(isQuota ? 429 : 500).json({
      error: message,
      isQuotaError: isQuota,
    });
  }
});

// Vite middleware in development vs static server in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TTS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
