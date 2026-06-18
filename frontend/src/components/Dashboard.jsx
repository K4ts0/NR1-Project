import React, { useState, useEffect } from 'react';
import { getStats, getResponses, downloadPdf, deleteSector, getCurrentUser } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  const isInformatica = currentUser?.email === 'Informatica';

  useEffect(() => {
    Promise.all([getStats(), getResponses()])
      .then(([statsData, responsesData]) => {
        setStats(statsData);
        setResponses(responsesData.responses || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalResponses = stats?.totalResponses || 0;
  const sectorsCount = stats?.sectorStats?.length || 0;
  const criticalCount = stats?.riskDistribution?.Crítico || 0;

  const sectorChartData = stats?.sectorStats?.map(s => ({
    name: s.sector,
    ips: parseFloat(s.avgIps),
  })) || [];

  const riskData = stats?.riskDistribution ? [
    { name: 'Baixo', value: stats.riskDistribution.Baixo || 0, color: '#059669' },
    { name: 'Moderado', value: stats.riskDistribution.Moderado || 0, color: '#d97706' },
    { name: 'Alto', value: stats.riskDistribution.Alto || 0, color: '#ea580c' },
    { name: 'Crítico', value: stats.riskDistribution.Crítico || 0, color: '#b91c1c' },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard de Riscos Psicossociais</h1>
        <p className="text-sm text-gray-500">Visão geral das avaliações por setor – conforme NR-01</p>
      </div>

      {/* Cards superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 shadow-sm border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-700 text-xs sm:text-sm font-medium">Total de Respostas</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">{totalResponses}</p>
            </div>
            <div className="bg-blue-200 p-2 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 sm:p-5 shadow-sm border border-emerald-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-700 text-xs sm:text-sm font-medium">Setores Avaliados</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900 mt-1">{sectorsCount}</p>
            </div>
            <div className="bg-emerald-200 p-2 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 sm:p-5 shadow-sm border border-red-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-700 text-xs sm:text-sm font-medium">Riscos Críticos</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-900 mt-1">{criticalCount}</p>
            </div>
            <div className="bg-red-200 p-2 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">IPS por Setor</h2>
          <div className="h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorChartData}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} interval={0} tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} label={{ value: 'IPS (0-5)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <Tooltip formatter={(value) => `${value} / 5`} />
                <Bar dataKey="ips" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Distribuição de Risco</h2>
          <div className="h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} resposta(s)`, name]} />
                <Legend verticalAlign="bottom" height={30} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela de setores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Resumo por Setor</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setor</th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Total Respostas</th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IPS</th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível</th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.sectorStats?.map((sector) => {
                const ipsValue = parseFloat(sector.avgIps);
                let levelText = '';
                let levelColor = '';
                if (ipsValue <= 1.5) { levelText = 'Baixo'; levelColor = 'bg-green-100 text-green-800'; }
                else if (ipsValue <= 2.5) { levelText = 'Moderado'; levelColor = 'bg-yellow-100 text-yellow-800'; }
                else if (ipsValue <= 3.5) { levelText = 'Alto'; levelColor = 'bg-orange-100 text-orange-800'; }
                else { levelText = 'Crítico'; levelColor = 'bg-red-100 text-red-800'; }
                
                const barWidth = (ipsValue / 5) * 100;
                let barColor = '';
                if (ipsValue <= 1.5) barColor = '#059669';
                else if (ipsValue <= 2.5) barColor = '#d97706';
                else if (ipsValue <= 3.5) barColor = '#ea580c';
                else barColor = '#b91c1c';

                return (
                  <tr key={sector.sector} className="hover:bg-gray-50 transition">
                    <td className="px-3 sm:px-5 py-3 font-medium text-gray-900 text-sm sm:text-base">{sector.sector}</td>
                    <td className="px-3 sm:px-5 py-3 text-gray-600 hidden sm:table-cell">{sector.total}</td>
                    <td className="px-3 sm:px-5 py-3 w-28 sm:w-48">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-medium">{ipsValue.toFixed(2)}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div className="h-1.5 sm:h-2 rounded-full" style={{ width: `${barWidth}%`, backgroundColor: barColor }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3">
                      <span className={`px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full font-medium ${levelColor}`}>{levelText}</span>
                    </td>
                    <td className="px-3 sm:px-5 py-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => downloadPdf(sector.sector)}
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </button>
                        {isInformatica && (
                          <button
                            onClick={async () => {
                              if (window.confirm(`Tem certeza que deseja excluir TODAS as respostas do setor "${sector.sector}"? Essa ação é irreversível.`)) {
                                try {
                                  await deleteSector(sector.sector);
                                  const [statsData, responsesData] = await Promise.all([getStats(), getResponses()]);
                                  setStats(statsData);
                                  setResponses(responsesData.responses || []);
                                  alert(`Setor "${sector.sector}" excluído com sucesso.`);
                                } catch (err) {
                                  alert('Erro ao excluir setor: ' + (err.response?.data?.error || err.message));
                                }
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1"
                          >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}