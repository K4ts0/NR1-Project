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

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-600">Carregando...</div>;

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
    <div className="max-w-3xl mx-auto p-3 sm:p-4">
      {/* Cabeçalho com logos */}
      <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <img 
              src="/imagens/Logo.UPABJ.bmp" 
              alt="Logo UPA" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <img 
              src="/imagens/logoUniSystem.ico" 
              alt="Logo UniSystem" 
              className="h-6 sm:h-8 w-auto object-contain"
            />
            <h1 className="text-sm sm:text-xl font-bold text-gray-800 text-center sm:text-left">
              Avaliação de Riscos Psicossociais
            </h1>
          </div>
        </div>
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">
          Anônima e confidencial – conforme NR-01
        </p>
      </div>

      {/* Seleção de setor */}
      {!sector && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-4">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">Qual é a sua área?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {['Administrativo','Departamento Pessoal','Recepção','Segurança do trabalho','Equipe Médica','Imobilização','Assistência','Serviço social','Fisioterapia','Radiologia','Farmácia','Transporte','Suporte','Portaria','TI','Manutenção','Nutrição','Almoxarifado'].map(s => (
              <button 
                key={s} 
                onClick={() => setSector(s)} 
                className="border p-2 sm:p-3 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition text-sm sm:text-base min-h-[44px]"
              >
                {s}
              </button>
            ))}
            <input 
              type="text" 
              placeholder="Outro setor..." 
              className="border p-2 sm:p-3 rounded-lg text-sm sm:text-base col-span-2 sm:col-span-3 lg:col-span-4 min-h-[44px]"
              onBlur={(e) => { if(e.target.value) setSector(e.target.value); }}
            />
          </div>
        </div>
      )}

      {/* Questionário */}
      {sector && (
        <>
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            {/* Progresso */}
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-1">
              <span>Seção {currentPage+1} de {categoriesList.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">{currentCategory.name}</h2>

            {/* Perguntas */}
            {currentQuestions.map((q, idx) => (
              <div key={q.id} className="mb-6 border-b pb-4 last:border-0">
                <p className="text-sm sm:text-base font-medium text-gray-700 mb-3">
                  {idx+1}. {q.text}
                </p>
                <div className="flex gap-1 sm:gap-2">
                  {[1,2,3,4,5].map(v => (
                    <button
                      key={v}
                      onClick={() => handleAnswer(q.id, v)}
                      className={`flex-1 py-3 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium min-h-[44px] touch-manipulation
                        ${answers[q.id] === v 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mt-1 px-1">
                  <span>Nunca</span>
                  <span>Raramente</span>
                  <span>Às vezes</span>
                  <span>Freq.</span>
                  <span>Sempre</span>
                </div>
              </div>
            ))}

            {/* Navegação */}
            <div className="flex justify-between mt-6 gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage===0}
                className="px-4 py-2 sm:px-6 sm:py-2 border rounded-lg text-sm sm:text-base disabled:opacity-50 hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
              >
                Anterior
              </button>
              {currentPage === categoriesList.length-1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 sm:px-8 sm:py-2 bg-green-600 text-white rounded-lg text-sm sm:text-base hover:bg-green-700 active:bg-green-800 min-h-[44px]"
                >
                  Finalizar
                </button>
              ) : (
                <button
                  onClick={nextPage}
                  className="px-6 py-2 sm:px-8 sm:py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base hover:bg-blue-700 active:bg-blue-800 min-h-[44px]"
                >
                  Próximo
                </button>
              )}
            </div>
          </div>

          {/* Última página: consentimento e observações */}
          {currentPage === categoriesList.length-1 && (
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-4">
              <label className="flex items-start gap-2 text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e=>setConsent(e.target.checked)}
                  className="mt-1 min-w-[18px] min-h-[18px]"
                />
                <span className="text-gray-700">
                  Aceito o tratamento de dados conforme LGPD para fins da NR-01.
                </span>
              </label>
              <textarea
                className="w-full border p-3 rounded-lg mt-4 text-sm sm:text-base min-h-[100px]"
                rows="3"
                placeholder="Observações (opcional)"
                value={observations}
                onChange={e=>setObservations(e.target.value)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}