/**
 * Cliente de Comunicação com a Estação de Pesquisa Server-Side
 * ZAVALAVOZ — UEM / ESUDER
 */

import {
  ResearchQueryRequest,
  ResearchQueryResponse,
  ResearchScope,
} from '../types/research';

export async function queryDissertationResearch(
  query: string,
  scope: ResearchScope = 'todos',
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<ResearchQueryResponse> {
  const payload: ResearchQueryRequest = {
    query: query.trim(),
    scope,
    history,
  };

  const response = await fetch('/api/research/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `Erro no servidor (${response.status})` };
    }
    throw new Error(
      errorData.error || 'Falha na comunicação com a Estação de Pesquisa.'
    );
  }

  return response.json();
}

export async function checkResearchApiStatus(): Promise<{
  status: string;
  hasOpenAiKey: boolean;
  model: string;
  corpus: string;
}> {
  const res = await fetch('/api/research/status');
  if (!res.ok) {
    throw new Error('Serviço de pesquisa indisponível');
  }
  return res.json();
}
