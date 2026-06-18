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
  const [error, setError] = useState('');
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen text-gray-600">
      Carregando questionário...
    </div>
  );

  const categoriesList = categories;
  const currentCategory = categoriesList[currentPage];
  const currentQuestions = questions.filter(q => q.categoryId === currentCategory?.id);
  const isComplete = currentQuestions.every(q => answers[q.id] !== null && answers[q.id] !== undefined);
  const progress = ((currentPage + 1) / categoriesList.length) * 100;

  const handleAnswer = (qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
    setError(''); // limpa erro ao selecionar uma resposta
  };

  const validateAndNext = () => {
    if (!isComplete) {
      setError('Por favor, responda todas as perguntas desta seção antes de continuar.');
      // Rola para o topo da seção para o usuário ver o aviso
      document.getElementById('section-top')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (currentPage < categoriesList.length - 1) {
      setCurrentPage(p => p + 1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!sector) {
      setError('Selecione seu setor antes de finalizar.');
      return;
    }
    if (!consent) {
      setError('Aceite o termo de consentimento para finalizar.');
      document.getElementById('consent-checkbox')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const answersArray = Object.entries(answers).map(([qid, val]) => ({ questionId: parseInt(qid), value: val }));
    try {
      const res = await submitResponse(sector, answersArray, observations);
      navigate('/relatorio', { state: { miniReport: res.miniReport } });
    } catch (err) {
      setError('Erro ao enviar respostas. Tente novamente.');
      console.error(err);
    }
  };

  const selectSector = (s) => {
    setSector(s);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Cabeçalho com logos responsivo */}
      <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap justify-center">
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
          </div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 text-center">
            Avaliação de Riscos Psicossociais
          </h1>
        </div>
        <p className="text-center text-gray-500 text-xs sm:text-sm mt-2">
          Anônima e confidencial – conforme NR-01
        </p>
      </div>

      {!sector ? (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Qual é a sua área?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {['Administrativo','Departamento Pessoal','Recepção','Segurança do trabalho','Equipe Médica','Imobilização','Assistência','Serviço social','Fisioterapia','Radiologia','Farmácia','Transporte','Suporte','Portaria','TI','Manutenção','Nutrição','Almoxarifado'].map(s => (
              <button 
                key={s} 
                onClick={() => selectSector(s)} 
                className="border border-gray-300 p-2 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition text-sm sm:text-base"
              >
                {s}
              </button>
            ))}
            <input 
              type="text" 
              placeholder="Outro setor..." 
              className="border border-gray-300 p-2 rounded-lg text-sm sm:text-base col-span-2 sm:col-span-1"
              onBlur={(e) => { if (e.target.value) selectSector(e.target.value); }}
            />
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <div id="section-top" className="flex flex-wrap justify-between items-center mb-2 text-xs sm:text-sm text-gray-500">
            <span>Seção {currentPage+1} de {categoriesList.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold mb-4">{currentCategory.name}</h2>

          {error && (
            <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-700 rounded text-sm">
              ⚠️ {error}
            </div>
          )}

          {currentQuestions.map((q, idx) => (
            <div key={q.id} className="mb-6 pb-4 border-b border-gray-100 last:border-0">
              <p className="text-sm sm:text-base font-medium text-gray-700 mb-3">
                {idx+1}. {q.text}
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {[1,2,3,4,5].map(v => (
                  <button
                    key={v}
                    onClick={() => handleAnswer(q.id, v)}
                    className={`flex-1 min-w-[40px] py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition ${
                      answers[q.id] === v 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base disabled:opacity-50 hover:bg-gray-50 transition order-2 sm:order-1"
            >
              ◀ Anterior
            </button>
            <button
              onClick={validateAndNext}
              className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base hover:bg-blue-700 transition order-1 sm:order-2"
            >
              {currentPage === categoriesList.length - 1 ? 'Finalizar' : 'Próximo ▶'}
            </button>
          </div>
        </div>
      )}

      {/* Consentimento e observações (visíveis apenas na última seção) */}
      {sector && currentPage === categoriesList.length - 1 && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-4">
          <div className="flex items-start gap-3">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <label htmlFor="consent-checkbox" className="text-sm sm:text-base text-gray-700">
              Aceito o tratamento de dados conforme LGPD para fins da NR-01.
            </label>
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 mt-4 text-sm sm:text-base"
            rows="3"
            placeholder="Observações (opcional)"
            value={observations}
            onChange={e => setObservations(e.target.value)}
          />
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}