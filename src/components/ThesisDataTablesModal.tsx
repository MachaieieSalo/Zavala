import React, { useState } from 'react';
import {
  X,
  BarChart3,
  MapPin,
  CloudLightning,
  FileSpreadsheet,
} from 'lucide-react';

interface ThesisDataTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThesisDataTablesModal: React.FC<ThesisDataTablesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'choques' | 'bairros' | 'estatisticas'>('choques');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1F2A1A]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFDF8] border border-[#DDD0B4] rounded-md shadow-lg flex flex-col overflow-hidden text-[#1F2A1A]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#DDD0B4] bg-[#F2E9D8]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#5B7B4F]/15 text-[#3F5837] flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4 text-[#5B7B4F]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F2A1A] font-display">
                Tabelas e Indicadores Oficiais da Dissertação
              </h3>
              <p className="text-xs text-[#5C6B52]">
                Dados auditados do SDAE Zavala, CHIRPS v2.0, Sentinel-2 (Dynamic World) e SRTM
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-[#F2E9D8] hover:bg-[#DDD0B4] text-[#5C6B52] hover:text-[#1F2A1A] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-2.5 px-5 bg-[#F2E9D8]/30 border-b border-[#DDD0B4] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('choques')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'choques'
                ? 'bg-[#5B7B4F] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A] hover:bg-[#F2E9D8]'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>Tabela 5: Choques Críticos (14 Anos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bairros')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bairros'
                ? 'bg-[#5B7B4F] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A] hover:bg-[#F2E9D8]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Tabela 7: 11 Bairros de Quissico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('estatisticas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'estatisticas'
                ? 'bg-[#5B7B4F] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A] hover:bg-[#F2E9D8]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tabela 1: Parâmetros Descritivos</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {activeTab === 'choques' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-[#F2E9D8]/40 border border-[#DDD0B4] text-xs text-[#1F2A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <strong>Perda Acumulada em 31 Anos:</strong> 717.751 toneladas (equivalente a 5,4 anos de colheita média distrital).
                </span>
                <span className="font-mono text-[#5B7B4F] font-bold">14 anos adversos (45,2%)</span>
              </div>

              <div className="overflow-x-auto border border-[#DDD0B4] rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F2E9D8]/60 text-[#5C6B52] text-[11px] font-mono border-b border-[#DDD0B4]">
                      <th className="p-3">Ano</th>
                      <th className="p-3">Evento Climático / Contexto</th>
                      <th className="p-3 text-right">Prod. Real (t)</th>
                      <th className="p-3 text-right">Perda (t)</th>
                      <th className="p-3 text-right">Perda (%)</th>
                      <th className="p-3 text-center">Classificação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD0B4]/60 font-mono text-xs text-[#1F2A1A]">
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A]">1994</td>
                      <td className="p-3 font-sans">Recuperação pós-guerra civil (1977-1992)</td>
                      <td className="p-3 text-right">52.164</td>
                      <td className="p-3 text-right text-[#B5651D]">10.836</td>
                      <td className="p-3 text-right">17,2%</td>
                      <td className="p-3 text-center text-[#5C6B52] font-semibold">MODERADO</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20 bg-[#B5651D]/5">
                      <td className="p-3 font-bold text-[#1F2A1A]">2000</td>
                      <td className="p-3 font-sans">Cheias históricas e ciclones regionais (CHIRPS +76,3%)</td>
                      <td className="p-3 text-right">37.327</td>
                      <td className="p-3 text-right text-[#B5651D] font-bold">46.292</td>
                      <td className="p-3 text-right font-bold text-[#B5651D]">55,4%</td>
                      <td className="p-3 text-center text-[#B5651D] font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20 bg-[#B5651D]/5">
                      <td className="p-3 font-bold text-[#1F2A1A]">2007</td>
                      <td className="p-3 font-sans">Ciclone Favio (Cat. 4, proximidade ~219,8 km de Zavala)</td>
                      <td className="p-3 text-right">41.677</td>
                      <td className="p-3 text-right text-[#B5651D] font-bold">74.902</td>
                      <td className="p-3 text-right font-bold text-[#B5651D]">64,3%</td>
                      <td className="p-3 text-center text-[#B5651D] font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A]">2008</td>
                      <td className="p-3 font-sans">Recuperação pós-Favio (perda de ramas e estacas de plantio)</td>
                      <td className="p-3 text-right">70.534</td>
                      <td className="p-3 text-right text-[#B5651D]">51.921</td>
                      <td className="p-3 text-right">42,4%</td>
                      <td className="p-3 text-center text-[#B5651D] font-semibold">SEVERO</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20 bg-[#B5651D]/5">
                      <td className="p-3 font-bold text-[#1F2A1A]">2016</td>
                      <td className="p-3 font-sans">Seca extrema El Niño (CHIRPS sazonal -45,5%)</td>
                      <td className="p-3 text-right">89.818</td>
                      <td className="p-3 text-right text-[#B5651D] font-bold">131.628</td>
                      <td className="p-3 text-right font-bold text-[#B5651D]">59,4%</td>
                      <td className="p-3 text-center text-[#B5651D] font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20 bg-[#B5651D]/10 border-t-2 border-[#B5651D]/30">
                      <td className="p-3 font-bold text-[#1F2A1A]">2023</td>
                      <td className="p-3 font-sans">Colapso de produção (CHIRPS +78,1% de anomalia)</td>
                      <td className="p-3 text-right font-bold text-[#1F2A1A]">35.371</td>
                      <td className="p-3 text-right text-[#B5651D] font-bold">438.447</td>
                      <td className="p-3 text-right font-bold text-[#B5651D]">92,5%</td>
                      <td className="p-3 text-center text-[#B5651D] font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A]">2024</td>
                      <td className="p-3 font-sans">Recuperação pós-colapso em curso (dados SDAE)</td>
                      <td className="p-3 text-right">48.573</td>
                      <td className="p-3 text-right text-[#5B7B4F] font-bold">+37,3% vs 2023</td>
                      <td className="p-3 text-right">-</td>
                      <td className="p-3 text-center text-[#5B7B4F] font-semibold">RECUP. PARCIAL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bairros' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-[#F2E9D8]/40 border border-[#DDD0B4] text-xs text-[#1F2A1A]">
                <p>
                  <strong>Posto Administrativo de Quissico:</strong> 11 bairros cartografados totalizando 22.343 hectares. O Modelo B utiliza o sinal agrícola da classe <em>crops</em> do Dynamic World (Sentinel-2 a 10 m, percentil P75) entre 2016 e 2024.
                </p>
              </div>

              <div className="overflow-x-auto border border-[#DDD0B4] rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F2E9D8]/60 text-[#5C6B52] text-[11px] font-mono border-b border-[#DDD0B4]">
                      <th className="p-3">Bairro</th>
                      <th className="p-3">Grupo Zonal</th>
                      <th className="p-3 text-right">Territorial (%)</th>
                      <th className="p-3 text-right">ESA CCI 1994-15 (%)</th>
                      <th className="p-3 text-right">Dynamic World 2016-24 (%)</th>
                      <th className="p-3">Vulnerabilidade SRTM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD0B4]/60 font-mono text-xs text-[#1F2A1A]">
                    <tr className="hover:bg-[#F2E9D8]/20 bg-[#5B7B4F]/5">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Nzile</td>
                      <td className="p-3 font-sans text-[#5B7B4F] font-semibold">Costeiro</td>
                      <td className="p-3 text-right">26,8%</td>
                      <td className="p-3 text-right">11,1%</td>
                      <td className="p-3 text-right font-bold text-[#5B7B4F]">16,6%</td>
                      <td className="p-3 font-sans text-[#B5651D] font-bold">66% &lt; 9m altitude (elev. média 12,4m)</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Zavalene</td>
                      <td className="p-3 font-sans text-[#3F5837] font-semibold">Interior</td>
                      <td className="p-3 text-right">11,6%</td>
                      <td className="p-3 text-right">16,5%</td>
                      <td className="p-3 text-right font-bold text-[#5B7B4F]">13,6%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Interior seguro contra ressacas</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Dombe</td>
                      <td className="p-3 font-sans text-[#5B7B4F] font-semibold">Costeiro</td>
                      <td className="p-3 text-right">8,9%</td>
                      <td className="p-3 text-right">11,8%</td>
                      <td className="p-3 text-right font-bold text-[#5B7B4F]">13,4%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Planalto costeiro &gt; 100m elevação</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Nhamajal</td>
                      <td className="p-3 font-sans text-[#3F5837] font-semibold">Interior</td>
                      <td className="p-3 text-right">9,8%</td>
                      <td className="p-3 text-right">13,7%</td>
                      <td className="p-3 text-right">10,5%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Área produtiva interiorana</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Nhacodue</td>
                      <td className="p-3 font-sans text-[#B5651D] font-semibold">Intermédio</td>
                      <td className="p-3 text-right">6,8%</td>
                      <td className="p-3 text-right">7,2%</td>
                      <td className="p-3 text-right">9,0%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Transição ecológica</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Macomane</td>
                      <td className="p-3 font-sans text-[#B5651D] font-semibold">Intermédio</td>
                      <td className="p-3 text-right">10,6%</td>
                      <td className="p-3 text-right">6,3%</td>
                      <td className="p-3 text-right">8,0%</td>
                      <td className="p-3 font-sans text-[#B5651D]">50,8% &lt; 9m altitude</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Nhangave</td>
                      <td className="p-3 font-sans text-[#5B7B4F] font-semibold">Costeiro</td>
                      <td className="p-3 text-right">7,2%</td>
                      <td className="p-3 text-right">8,3%</td>
                      <td className="p-3 text-right">7,6%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Faixa litorânea consorciada</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Mahumane</td>
                      <td className="p-3 font-sans text-[#B5651D] font-semibold">Intermédio</td>
                      <td className="p-3 text-right">5,1%</td>
                      <td className="p-3 text-right">7,0%</td>
                      <td className="p-3 text-right">6,5%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Área agrária intermédia</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Ngomene</td>
                      <td className="p-3 font-sans text-[#3F5837] font-semibold">Interior</td>
                      <td className="p-3 text-right">5,9%</td>
                      <td className="p-3 text-right">8,0%</td>
                      <td className="p-3 text-right">5,9%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Maneio familiar</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Ticongolo</td>
                      <td className="p-3 font-sans text-[#5B7B4F] font-semibold">Costeiro</td>
                      <td className="p-3 text-right">4,2%</td>
                      <td className="p-3 text-right">5,6%</td>
                      <td className="p-3 text-right">4,7%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Elevação média &gt; 100m</td>
                    </tr>
                    <tr className="hover:bg-[#F2E9D8]/20">
                      <td className="p-3 font-bold text-[#1F2A1A] font-sans">Muinhe</td>
                      <td className="p-3 font-sans text-[#3F5837] font-semibold">Interior</td>
                      <td className="p-3 text-right">3,0%</td>
                      <td className="p-3 text-right">4,3%</td>
                      <td className="p-3 text-right">4,3%</td>
                      <td className="p-3 font-sans text-[#5C6B52]">Menor extensão territorial</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'estatisticas' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Média Aritmética (1994-2024)</p>
                  <p className="text-xl font-bold font-mono text-[#5B7B4F]">115.333 t</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Mediana</p>
                  <p className="text-xl font-bold font-mono text-[#1F2A1A]">100.990 t</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Desvio Padrão</p>
                  <p className="text-xl font-bold font-mono text-[#B5651D]">64.965 t</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Coeficiente de Variação (CV)</p>
                  <p className="text-xl font-bold font-mono text-[#B5651D]">56,3%</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Teste de Normalidade Shapiro-Wilk</p>
                  <p className="text-base font-bold font-mono text-[#1F2A1A]">W = 0,909 (p = 0,012)</p>
                  <p className="text-[11px] text-[#5C6B52]">Rejeita normalidade clássica</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Autocorrelação Serial (AC1 e AC2)</p>
                  <p className="text-base font-bold font-mono text-[#1F2A1A]">AC1 = 0,695 | AC2 = 0,371</p>
                  <p className="text-[11px] text-[#5C6B52]">Exige correcção Hamed-Rao &amp; Newey-West</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#DDD0B4] bg-[#F2E9D8]/40 flex items-center justify-between text-xs text-[#5C6B52]">
          <span>Fonte: Dissertação de Mestrado de Yolanda Tamele (UEM | ESUDER, 2026)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#5B7B4F] hover:bg-[#3F5837] text-white font-semibold cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
