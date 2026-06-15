import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestionnaire, submitResponse } from '../api';

export default function Questionnaire() {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [sector, setSector] = useState('');
  const [observations, setObservations] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getQuestionnaire().then(data => {
      setCategories(data.categories.sort((a,b)=>a.order-b.order));
      setQuestions(data.questions);
      const init = {};
      data.questions.forEach(q => { init[q.id] = null; });
      setAnswers(init);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Carregando...</div>;

  const categoriesList = categories;
  const currentCategory = categoriesList[currentPage];
  const currentQuestions = questions.filter(q => q.categoryId === currentCategory?.id);
  const isComplete = currentQuestions.every(q => answers[q.id] !== null);
  const progress = ((currentPage + 1) / categoriesList.length) * 100;

  const handleAnswer = (qid, val) => setAnswers(prev => ({ ...prev, [qid]: val }));
  const nextPage = () => { if (isComplete && currentPage < categoriesList.length-1) setCurrentPage(p => p+1); };
  const prevPage = () => { if (currentPage > 0) setCurrentPage(p => p-1); };

  const handleSubmit = async () => {
    if (!sector) return alert('Selecione seu setor');
    if (!consent) return alert('Aceite o termo de consentimento');
    const answersArray = Object.entries(answers).map(([qid, val]) => ({ questionId: parseInt(qid), value: val }));
    const res = await submitResponse(sector, answersArray, observations);
    navigate('/relatorio', { state: { miniReport: res.miniReport } });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/imagens/Logo.UPABJ.bmp" 
              alt="Logo UPA" 
              className="h-10 w-auto object-contain"
            />
            <img 
              src="/imagens/logoUniSystem.ico" 
              alt="Logo UniSystem" 
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800 ml-2">Avaliação de Riscos Psicossociais | Anônima e confidencial conforme NR-01</h1>
          </div>
          {/* Opcional: link para voltar ou ajuda */}
        </div>
        <p className="text-center text-gray-500 text-sm mt-3">Avaliação anônima e confidencial – conforme NR-01</p>
      </div>

      {!sector && (
        <div className="bg-white rounded-xl shadow p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">Qual é a sua área?</h2>
          <div className="grid grid-cols-2 gap-2">
            {['Administrativo','Departamento Pessoal','Recepção','Segurança do trabalho','Equipe Médica','Imobilização','Assistência','Serviço social','Fisioterapia','Radiologia','Farmácia','Transporte','Suporte','Portaria','TI','Manutenção','Nutrição','Almoxarifado'].map(s => (
              <button key={s} onClick={() => setSector(s)} className="border p-2 rounded hover:bg-gray-100">{s}</button>
            ))}
            <input type="text" placeholder="Outro setor..." className="border p-2 rounded" onBlur={(e) => setSector(e.target.value)} />
          </div>
        </div>
      )}

      {sector && (
        <>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">Seção {currentPage+1} de {categoriesList.length}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div></div>
            <h2 className="text-xl font-bold mb-4">{currentCategory.name}</h2>
            {currentQuestions.map(q => (
              <div key={q.id} className="mb-6 border-b pb-4">
                <p className="mb-2">{q.text}</p>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(v => (
                    <button key={v} onClick={() => handleAnswer(q.id, v)} className={`flex-1 py-2 rounded ${answers[q.id] === v ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{v}</button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Nunca</span><span>Raramente</span><span>Às vezes</span><span>Freq.</span><span>Sempre</span></div>
              </div>
            ))}
            <div className="flex justify-between mt-6">
              <button onClick={prevPage} disabled={currentPage===0} className="px-4 py-2 border rounded disabled:opacity-50">Anterior</button>
              {currentPage === categoriesList.length-1 ? (
                <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded">Finalizar</button>
              ) : (
                <button onClick={nextPage} className="px-6 py-2 bg-blue-600 text-white rounded">Próximo</button>
              )}
            </div>
          </div>
          {currentPage === categoriesList.length-1 && (
            <div className="bg-white rounded-xl shadow p-6 mt-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} /> Aceito o tratamento de dados conforme LGPD para fins da NR-01.</label>
              <textarea className="w-full border p-2 mt-4" rows="3" placeholder="Observações (opcional)" value={observations} onChange={e=>setObservations(e.target.value)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}