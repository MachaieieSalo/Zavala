import React, { useState, useMemo } from 'react';
import { ScientificTimeSeriesPoint, THESIS_CORE_FACTS } from '../../data/thesisScientificData';
import {
  ArrowUpDown,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
} from 'lucide-react';

interface ScientificTableProps {
  series: ScientificTimeSeriesPoint[];
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
  onSendToStudio?: (text: string) => void;
}

type SortField = 'year' | 'production' | 'yield' | 'rainfall';
type SortOrder = 'asc' | 'desc';

export const ScientificTable: React.FC<ScientificTableProps> = ({
  series,
  selectedYear,
  onSelectYear,
  onSendToStudio,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OBSERVADO' | 'MODELADO' | 'SHOCK'>('ALL');
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return series
      .filter((row) => {
        if (statusFilter === 'OBSERVADO' && row.status !== 'OBSERVADO') return false;
        if (statusFilter === 'MODELADO' && row.status !== 'MODELADO') return false;
        if (statusFilter === 'SHOCK' && !row.isAdverseYear) return false;

        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchesYear = row.year.toString().includes(term);
          const matchesEvent = row.eventOrShock.toLowerCase().includes(term);
          const matchesStatus = row.statusLabel.toLowerCase().includes(term);
          return matchesYear || matchesEvent || matchesStatus;
        }
        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'year') comp = a.year - b.year;
        if (sortField === 'production') comp = a.productionTonnes - b.productionTonnes;
        if (sortField === 'yield') comp = a.effectiveYieldTonnesHa - b.effectiveYieldTonnesHa;
        if (sortField === 'rainfall') comp = a.chirpsRainfallMm - b.chirpsRainfallMm;
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [series, searchTerm, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'year' ? 'asc' : 'desc');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Ano',
      'Estatuto',
      'Producao_t',
      'Tendencia_t',
      'Area_ha',
      'Rendimento_t_ha',
      'Chuva_CHIRPS_mm',
      'Anomalia_Chuva_pct',
      'Perda_t',
      'Evento_Choque',
      'Nota_Metodologica',
    ];
    const rows = series.map((r) => [
      r.year,
      `"${r.status}"`,
      r.productionTonnes,
      r.trendProductionTonnes,
      r.areaHa,
      r.effectiveYieldTonnesHa,
      r.chirpsRainfallMm,
      r.chirpsAnomalyPercent,
      r.shockLossTonnes || 0,
      `"${r.eventOrShock.replace(/"/g, '""')}"`,
      `"${r.methodologicalNote.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'dissertacao_zavala_serie_1994_2024.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const text = `Série Histórica Zavala (${THESIS_CORE_FACTS.initialYear}-${THESIS_CORE_FACTS.terminalYear}): ${THESIS_CORE_FACTS.totalYears} anos analisados. ${THESIS_CORE_FACTS.initialYear}: 52.164 t; ${THESIS_CORE_FACTS.peakYear} (pico): 273.773 t; 2023 (Freddy): 35.371 t; ${THESIS_CORE_FACTS.terminalYear}: 48.573 t. Tendência OLS: +4.229 t/ano (p=0,020). Mann-Kendall Z=${THESIS_CORE_FACTS.mannKendallZ.toFixed(3).replace('.', ',')} (p=0,0019).`;
    navigator.clipboard.writeText(text);
    setCopyFeedback('Resumo estatístico copiado!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  return (
    <div className="space-y-3">
      {/* Table filters and utilities bar */}
      <div className="bg-[#FCFAF6] p-3 rounded-[4px] border border-[#D9CDAF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Quick search input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#4F5C48] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por ano ou choque (ex: 2007, Freddy, Favio)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFDF8] border border-[#D9CDAF] rounded-[2px] text-[#1A2417] placeholder:text-[#4F5C48]/70 focus:outline-none focus:border-[#354D2C]"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 py-1 text-xs font-medium rounded-[2px] cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[#1A2417] text-[#FCFAF6]'
                  : 'bg-[#EAE2D2]/50 text-[#1A2417] hover:bg-[#EAE2D2]'
              }`}
            >
              Todos (31)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('OBSERVADO')}
              className={`px-2 py-1 text-xs font-medium rounded-[2px] cursor-pointer ${
                statusFilter === 'OBSERVADO'
                  ? 'bg-[#354D2C] text-[#FCFAF6]'
                  : 'bg-[#EAE2D2]/50 text-[#354D2C] hover:bg-[#EAE2D2]'
              }`}
            >
              SDAE (8)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('MODELADO')}
              className={`px-2 py-1 text-xs font-medium rounded-[2px] cursor-pointer ${
                statusFilter === 'MODELADO'
                  ? 'bg-[#1A2417] text-[#FCFAF6]'
                  : 'bg-[#EAE2D2]/50 text-[#1A2417] hover:bg-[#EAE2D2]'
              }`}
            >
              Modelado (23)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('SHOCK')}
              className={`px-2 py-1 text-xs font-medium rounded-[2px] cursor-pointer ${
                statusFilter === 'SHOCK'
                  ? 'bg-[#A8531E] text-[#FCFAF6]'
                  : 'bg-[#EAE2D2]/50 text-[#A8531E] hover:bg-[#EAE2D2]'
              }`}
            >
              Choques (14)
            </button>
          </div>
        </div>

        {/* Action buttons: CSV download & copy */}
        <div className="flex items-center gap-2">
          {copyFeedback && (
            <span className="text-[11px] font-medium text-[#354D2C] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {copyFeedback}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopySummary}
            className="p-1.5 text-xs text-[#4F5C48] hover:text-[#1A2417] bg-[#EAE2D2]/40 hover:bg-[#EAE2D2] rounded-[2px] border border-[#D9CDAF] cursor-pointer inline-flex items-center gap-1"
            title="Copiar resumo para a área de transferência"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copiar Síntese</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="p-1.5 text-xs text-[#354D2C] hover:text-[#1A2417] bg-[#EAE2D2]/40 hover:bg-[#EAE2D2] rounded-[2px] border border-[#D9CDAF] cursor-pointer inline-flex items-center gap-1 font-medium"
            title="Descarregar tabela em formato CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Oficial</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-[4px] border border-[#D9CDAF] bg-[#FCFAF6]">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-[#EAE2D2]/60 border-b border-[#D9CDAF] text-[#4F5C48] text-[11px] font-mono uppercase tracking-wider">
              <th scope="col" className="py-2.5 px-3 font-semibold cursor-pointer select-none" onClick={() => handleSort('year')}>
                <div className="flex items-center gap-1">
                  <span>Ano</span>
                  <ArrowUpDown className="w-3 h-3 text-[#4F5C48]" />
                </div>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold text-right cursor-pointer select-none" onClick={() => handleSort('production')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Produção (t)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#4F5C48]" />
                </div>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold">
                Estatuto do Dado
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold text-right">
                Área (ha)
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold text-right cursor-pointer select-none" onClick={() => handleSort('yield')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Rend. (t/ha)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#4F5C48]" />
                </div>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold text-right cursor-pointer select-none" onClick={() => handleSort('rainfall')}>
                <div className="flex items-center justify-end gap-1">
                  <span>CHIRPS (mm)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#4F5C48]" />
                </div>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold text-right">
                Anomalia (%)
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold">
                Evento Agroclimático Registado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9CDAF]/60">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#4F5C48] italic">
                  Nenhum ano coincide com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                const isSelected = row.year === selectedYear;
                return (
                  <tr
                    key={`row-${row.year}`}
                    onClick={() => onSelectYear(row.year)}
                    className={`cursor-pointer transition-colors duration-100 ${
                      isSelected
                        ? 'bg-[#EAE2D2]/80 font-medium'
                        : 'hover:bg-[#EAE2D2]/30'
                    }`}
                  >
                    {/* Ano */}
                    <td className="py-2 px-3 font-mono font-bold text-[#1A2417] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {row.isAdverseYear && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[#A8531E]"
                            title="Ano adverso ou choque documentado"
                          />
                        )}
                        <span>{row.year}</span>
                      </div>
                    </td>

                    {/* Produção (t) */}
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#1A2417] tabular-nums whitespace-nowrap">
                      {row.productionTonnes.toLocaleString('pt-MZ')}
                    </td>

                    {/* Estatuto */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] uppercase font-semibold ${
                          row.status === 'OBSERVADO'
                            ? 'bg-[#354D2C]/10 text-[#354D2C] border border-[#354D2C]/30'
                            : 'bg-[#4F5C48]/10 text-[#4F5C48] border border-[#4F5C48]/30'
                        }`}
                      >
                        {row.status === 'OBSERVADO' ? 'OBSERVADO (SDAE)' : 'MODELADO'}
                      </span>
                    </td>

                    {/* Área (ha) */}
                    <td className="py-2 px-3 text-right font-mono text-[#4F5C48] tabular-nums whitespace-nowrap">
                      {row.areaHa.toLocaleString('pt-MZ')}
                    </td>

                    {/* Rendimento (t/ha) */}
                    <td className="py-2 px-3 text-right font-mono text-[#1A2417] tabular-nums whitespace-nowrap">
                      {row.effectiveYieldTonnesHa.toFixed(2)}
                    </td>

                    {/* CHIRPS (mm) */}
                    <td className="py-2 px-3 text-right font-mono text-[#1A2417] tabular-nums whitespace-nowrap">
                      {row.chirpsRainfallMm.toFixed(1)}
                    </td>

                    {/* Anomalia CHIRPS (%) */}
                    <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          row.chirpsAnomalyPercent < -15
                            ? 'text-[#A8531E]'
                            : row.chirpsAnomalyPercent > 20
                            ? 'text-[#354D2C]'
                            : 'text-[#4F5C48]'
                        }`}
                      >
                        {row.chirpsAnomalyPercent > 0 ? '+' : ''}
                        {row.chirpsAnomalyPercent.toFixed(1)}%
                      </span>
                    </td>

                    {/* Evento Agroclimático */}
                    <td className="py-2 px-3 text-[#1A2417] max-w-xs truncate text-[11px]">
                      <span title={row.eventOrShock}>{row.eventOrShock}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#4F5C48] px-1">
        <span>
          Apresentando {filteredData.length} de {series.length} anos da série oficial da dissertação.
        </span>
        <span className="font-mono">
          Valores numéricos formatados em padrão internacional (t: toneladas; ha: hectares; mm: milímetros).
        </span>
      </div>
    </div>
  );
};
