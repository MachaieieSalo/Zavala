import React, { useState } from 'react';
import {
  X,
  Table,
  BarChart3,
  MapPin,
  CloudLightning,
  TrendingDown,
  TrendingUp,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Tabelas e Indicadores Oficiais da Dissertação
              </h3>
              <p className="text-xs text-slate-400">
                Dados auditados do SDAE Zavala, CHIRPS v2.0, Sentinel-2 (Dynamic World) e SRTM
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-3 px-6 bg-slate-950/40 border-b border-slate-800 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('choques')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'choques'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>Tabela 5: Choques Críticos (14 Anos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bairros')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bairros'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Tabela 7: 11 Bairros de Quissico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('estatisticas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'estatisticas'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 flex items-center justify-between">
                <span>
                  <strong>Perda Acumulada em 31 Anos:</strong> 717.751 toneladas (equivalente a 5,4 anos de colheita média distrital).
                </span>
                <span className="font-mono text-emerald-400 font-bold">14 anos adversos (45,2%)</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-[11px] font-mono border-b border-slate-800">
                      <th className="p-3">Ano</th>
                      <th className="p-3">Evento Climático / Contexto</th>
                      <th className="p-3 text-right">Prod. Real (t)</th>
                      <th className="p-3 text-right">Perda (t)</th>
                      <th className="p-3 text-right">Perda (%)</th>
                      <th className="p-3 text-center">Classificação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-200">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">1994</td>
                      <td className="p-3 font-sans">Recuperação pós-guerra civil (1977-1992)</td>
                      <td className="p-3 text-right">52.164</td>
                      <td className="p-3 text-right text-amber-400">10.836</td>
                      <td className="p-3 text-right">17,2%</td>
                      <td className="p-3 text-center text-blue-400">MODERADO</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 bg-rose-950/20">
                      <td className="p-3 font-bold text-white">2000</td>
                      <td className="p-3 font-sans">Cheias históricas e ciclones regionais (CHIRPS +76,3%)</td>
                      <td className="p-3 text-right">37.327</td>
                      <td className="p-3 text-right text-rose-400 font-bold">46.292</td>
                      <td className="p-3 text-right font-bold text-rose-400">55,4%</td>
                      <td className="p-3 text-center text-rose-400 font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 bg-rose-950/20">
                      <td className="p-3 font-bold text-white">2007</td>
                      <td className="p-3 font-sans">Ciclone Favio (Cat. 4, proximidade ~219,8 km de Zavala)</td>
                      <td className="p-3 text-right">41.677</td>
                      <td className="p-3 text-right text-rose-400 font-bold">74.902</td>
                      <td className="p-3 text-right font-bold text-rose-400">64,3%</td>
                      <td className="p-3 text-center text-rose-400 font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">2008</td>
                      <td className="p-3 font-sans">Recuperação pós-Favio (perda de ramas e estacas de plantio)</td>
                      <td className="p-3 text-right">70.534</td>
                      <td className="p-3 text-right text-amber-400">51.921</td>
                      <td className="p-3 text-right">42,4%</td>
                      <td className="p-3 text-center text-amber-400">SEVERO</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 bg-rose-950/20">
                      <td className="p-3 font-bold text-white">2016</td>
                      <td className="p-3 font-sans">Seca extrema El Niño (CHIRPS sazonal -45,5%)</td>
                      <td className="p-3 text-right">89.818</td>
                      <td className="p-3 text-right text-rose-400 font-bold">131.628</td>
                      <td className="p-3 text-right font-bold text-rose-400">59,4%</td>
                      <td className="p-3 text-center text-rose-400 font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 bg-rose-950/40 border-t-2 border-rose-500/40">
                      <td className="p-3 font-bold text-white">2023</td>
                      <td className="p-3 font-sans">Colapso de produção (CHIRPS +78,1% de anomalia)</td>
                      <td className="p-3 text-right font-bold text-white">35.371</td>
                      <td className="p-3 text-right text-rose-400 font-bold">438.447</td>
                      <td className="p-3 text-right font-bold text-rose-400">92,5%</td>
                      <td className="p-3 text-center text-rose-400 font-bold">CRÍTICO</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">2024</td>
                      <td className="p-3 font-sans">Recuperação pós-colapso em curso (dados SDAE)</td>
                      <td className="p-3 text-right">48.573</td>
                      <td className="p-3 text-right text-emerald-400">+37,3% vs 2023</td>
                      <td className="p-3 text-right">-</td>
                      <td className="p-3 text-center text-emerald-400">RECUP. PARCIAL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bairros' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
                <p>
                  <strong>Posto Administrativo de Quissico:</strong> 11 bairros cartografados totalizando 22.343 hectares. O Modelo B utiliza o sinal agrícola da classe <em>crops</em> do Dynamic World (Sentinel-2 a 10 m, percentil P75) entre 2016 e 2024.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-[11px] font-mono border-b border-slate-800">
                      <th className="p-3">Bairro</th>
                      <th className="p-3">Grupo Zonal</th>
                      <th className="p-3 text-right">Territorial (%)</th>
                      <th className="p-3 text-right">ESA CCI 1994-15 (%)</th>
                      <th className="p-3 text-right">Dynamic World 2016-24 (%)</th>
                      <th className="p-3">Vulnerabilidade SRTM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-200">
                    <tr className="hover:bg-slate-800/40 bg-emerald-950/20">
                      <td className="p-3 font-bold text-white font-sans">Nzile</td>
                      <td className="p-3 font-sans text-emerald-300">Costeiro</td>
                      <td className="p-3 text-right">26,8%</td>
                      <td className="p-3 text-right">11,1%</td>
                      <td className="p-3 text-right font-bold text-emerald-400">16,6%</td>
                      <td className="p-3 font-sans text-rose-400 font-bold">66% &lt; 9m altitude (elev. média 12,4m)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Zavalene</td>
                      <td className="p-3 font-sans text-indigo-300">Interior</td>
                      <td className="p-3 text-right">11,6%</td>
                      <td className="p-3 text-right">16,5%</td>
                      <td className="p-3 text-right font-bold text-emerald-400">13,6%</td>
                      <td className="p-3 font-sans text-slate-300">Interior seguro contra ressacas</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Dombe</td>
                      <td className="p-3 font-sans text-emerald-300">Costeiro</td>
                      <td className="p-3 text-right">8,9%</td>
                      <td className="p-3 text-right">11,8%</td>
                      <td className="p-3 text-right font-bold text-emerald-400">13,4%</td>
                      <td className="p-3 font-sans text-slate-300">Planalto costeiro &gt; 100m elevação</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Nhamajal</td>
                      <td className="p-3 font-sans text-indigo-300">Interior</td>
                      <td className="p-3 text-right">9,8%</td>
                      <td className="p-3 text-right">13,7%</td>
                      <td className="p-3 text-right">10,5%</td>
                      <td className="p-3 font-sans text-slate-300">Área produtiva interiorana</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Nhacodue</td>
                      <td className="p-3 font-sans text-amber-300">Intermédio</td>
                      <td className="p-3 text-right">6,8%</td>
                      <td className="p-3 text-right">7,2%</td>
                      <td className="p-3 text-right">9,0%</td>
                      <td className="p-3 font-sans text-slate-300">Transição ecológica</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Macomane</td>
                      <td className="p-3 font-sans text-amber-300">Intermédio</td>
                      <td className="p-3 text-right">10,6%</td>
                      <td className="p-3 text-right">6,3%</td>
                      <td className="p-3 text-right">8,0%</td>
                      <td className="p-3 font-sans text-amber-400">50,8% &lt; 9m altitude</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Nhangave</td>
                      <td className="p-3 font-sans text-emerald-300">Costeiro</td>
                      <td className="p-3 text-right">7,2%</td>
                      <td className="p-3 text-right">8,3%</td>
                      <td className="p-3 text-right">7,6%</td>
                      <td className="p-3 font-sans text-slate-300">Faixa litorânea consorciada</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Mahumane</td>
                      <td className="p-3 font-sans text-amber-300">Intermédio</td>
                      <td className="p-3 text-right">5,1%</td>
                      <td className="p-3 text-right">7,0%</td>
                      <td className="p-3 text-right">6,5%</td>
                      <td className="p-3 font-sans text-slate-300">Área agrária intermédia</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Ngomene</td>
                      <td className="p-3 font-sans text-indigo-300">Interior</td>
                      <td className="p-3 text-right">5,9%</td>
                      <td className="p-3 text-right">8,0%</td>
                      <td className="p-3 text-right">5,9%</td>
                      <td className="p-3 font-sans text-slate-300">Maneio familiar</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Ticongolo</td>
                      <td className="p-3 font-sans text-emerald-300">Costeiro</td>
                      <td className="p-3 text-right">4,2%</td>
                      <td className="p-3 text-right">5,6%</td>
                      <td className="p-3 text-right">4,7%</td>
                      <td className="p-3 font-sans text-slate-300">Elevação média &gt; 100m</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">Muinhe</td>
                      <td className="p-3 font-sans text-indigo-300">Interior</td>
                      <td className="p-3 text-right">3,0%</td>
                      <td className="p-3 text-right">4,3%</td>
                      <td className="p-3 text-right">4,3%</td>
                      <td className="p-3 font-sans text-slate-300">Menor extensão territorial</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'estatisticas' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <p className="text-slate-400 text-xs">Média Aritmética (1994-2024)</p>
                  <p className="text-xl font-bold font-mono text-emerald-400">115.333 t</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <p className="text-slate-400 text-xs">Mediana</p>
                  <p className="text-xl font-bold font-mono text-indigo-400">100.990 t</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <p className="text-slate-400 text-xs">Desvio Padrão</p>
                  <p className="text-xl font-bold font-mono text-amber-400">64.965 t</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <p className="text-slate-400 text-xs">Coeficiente de Variação (CV)</p>
                  <p className="text-xl font-bold font-mono text-rose-400">56,3%</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <p className="text-slate-400 text-xs">Teste de Normalidade Shapiro-Wilk</p>
                  <p className="text-base font-bold font-mono text-slate-200">W = 0,909 (p = 0,012)</p>
                  <p className="text-[11px] text-slate-400">Rejeita normalidade clássica</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <p className="text-slate-400 text-xs">Autocorrelação Serial (AC1 e AC2)</p>
                  <p className="text-base font-bold font-mono text-slate-200">AC1 = 0,695 • AC2 = 0,371</p>
                  <p className="text-[11px] text-slate-400">Exige correcção Hamed-Rao & Newey-West</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Fonte: Dissertação de Mestrado de Yolanda Tamele (UEM • ESUDER, 2026)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
