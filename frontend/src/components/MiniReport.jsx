import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function MiniReport() {
  const { state } = useLocation();
  const report = state?.miniReport;

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Relatório Individual</h1>
          <p className="text-gray-600">Nenhuma avaliação encontrada.</p>
          <Link to="/responder" className="text-blue-600 mt-4 inline-block">Voltar ao questionário</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Seu Relatório Individual</h1>
        <p className="text-gray-500">NR-01 - Avaliação de Riscos Psicossociais</p>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
        <p className="text-gray-700 text-center">{report.message || "Avaliação concluída. Relatório gerado conforme NR-01."}</p>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Seus dados permanecem anônimos e são utilizados apenas para fins de melhoria do ambiente de trabalho, conforme LGPD e NR-01.</p>
        <Link to="/responder" className="inline-block mt-4 text-blue-600 hover:underline">
          ← Responder novamente
        </Link>
      </div>
    </div>
  );
}