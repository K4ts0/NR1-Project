export const categories = [
  { id: 1, name: 'Demandas e Carga de Trabalho', order: 1 },
  { id: 2, name: 'Estresse Ocupacional', order: 2 },
  { id: 3, name: 'Assédio e Violência', order: 3 },
  { id: 4, name: 'Exaustão / Burnout', order: 4 },
  { id: 5, name: 'Autonomia', order: 5 },
  { id: 6, name: 'Relações Interpessoais', order: 6 },
  { id: 7, name: 'Clareza de Função', order: 7 },
  { id: 8, name: 'Equilíbrio Vida-Trabalho', order: 8 },
  { id: 9, name: 'Reconhecimento', order: 9 },
  { id: 10, name: 'Saúde Mental', order: 10 }
];

export const questions = [
  // 1. Demandas e Carga de Trabalho (category 1)
  { id: 1, categoryId: 1, text: 'Sinto que tenho mais tarefas do que consigo realizar no meu horário de trabalho.' },
  { id: 2, categoryId: 1, text: 'Preciso trabalhar em ritmo acelerado para dar conta das demandas.' },
  { id: 3, categoryId: 1, text: 'Meu trabalho exige que eu lide com muitas tarefas ao mesmo tempo.' },
  { id: 4, categoryId: 1, text: 'Sinto pressão excessiva para cumprir prazos.' },
  { id: 5, categoryId: 1, text: 'As metas estabelecidas são difíceis de alcançar.' },
  // 2. Estresse Ocupacional (2)
  { id: 6, categoryId: 2, text: 'Sinto-me frequentemente tenso(a) ou ansioso(a) no trabalho.' },
  { id: 7, categoryId: 2, text: 'Tenho dificuldade para relaxar após o expediente.' },
  { id: 8, categoryId: 2, text: 'Meu trabalho me causa preocupações constantes.' },
  { id: 9, categoryId: 2, text: 'Sinto dores de cabeça, musculares ou outros sintomas físicos relacionados ao trabalho.' },
  { id: 10, categoryId: 2, text: 'Tenho dificuldade para dormir por causa de questões do trabalho.' },
  // 3. Assédio e Violência (3)
  { id: 11, categoryId: 3, text: 'Já presenciei situações de humilhação no ambiente de trabalho.' },
  { id: 12, categoryId: 3, text: 'Já fui alvo de gritos, xingamentos ou tratamento desrespeitoso.' },
  { id: 13, categoryId: 3, text: 'Sinto que há favoritismo ou tratamento desigual entre colegas.' },
  { id: 14, categoryId: 3, text: 'Já sofri ou presenciei intimidação ou ameaça no trabalho.' },
  { id: 15, categoryId: 3, text: 'Sinto que há pressão psicológica para aceitar condições inadequadas.' },
  // 4. Exaustão / Burnout (4)
  { id: 16, categoryId: 4, text: 'Sinto-me emocionalmente esgotado(a) pelo meu trabalho.' },
  { id: 17, categoryId: 4, text: 'No final do dia, sinto-me completamente sem energia.' },
  { id: 18, categoryId: 4, text: 'Sinto que estou perdendo o interesse pelas minhas atividades.' },
  { id: 19, categoryId: 4, text: 'Tenho dificuldade de me concentrar no trabalho.' },
  { id: 20, categoryId: 4, text: 'Penso em desistir do meu emprego com frequência.' },
  // 5. Autonomia (5)
  { id: 21, categoryId: 5, text: 'Não tenho liberdade para decidir como realizar minhas tarefas.' },
  { id: 22, categoryId: 5, text: 'Sinto que sou excessivamente controlado(a) no trabalho.' },
  { id: 23, categoryId: 5, text: 'Não posso opinar sobre mudanças que afetam minha rotina.' },
  { id: 24, categoryId: 5, text: 'Sinto que minhas sugestões não são consideradas.' },
  { id: 25, categoryId: 5, text: 'Não tenho flexibilidade de horário quando necessário.' },
  // 6. Relações Interpessoais (6)
  { id: 26, categoryId: 6, text: 'Tenho dificuldade de me relacionar com colegas de trabalho.' },
  { id: 27, categoryId: 6, text: 'Sinto que o ambiente entre colegas é hostil ou competitivo.' },
  { id: 28, categoryId: 6, text: 'Meu superior direto não me trata com respeito.' },
  { id: 29, categoryId: 6, text: 'Falta cooperação entre as equipes.' },
  { id: 30, categoryId: 6, text: 'Sinto-me isolado(a) no ambiente de trabalho.' },
  // 7. Clareza de Função (7)
  { id: 31, categoryId: 7, text: 'Não tenho clareza sobre minhas responsabilidades no trabalho.' },
  { id: 32, categoryId: 7, text: 'Recebo instruções contraditórias de diferentes pessoas.' },
  { id: 33, categoryId: 7, text: 'Minha função exige tarefas que não fazem parte do meu cargo.' },
  { id: 34, categoryId: 7, text: 'Não sei exatamente o que esperam de mim.' },
  { id: 35, categoryId: 7, text: 'Tenho dúvidas frequentes sobre como executar meu trabalho.' },
  // 8. Equilíbrio Vida-Trabalho (8)
  { id: 36, categoryId: 8, text: 'O trabalho interfere negativamente na minha vida pessoal.' },
  { id: 37, categoryId: 8, text: 'Tenho dificuldade para dedicar tempo à família ou lazer.' },
  { id: 38, categoryId: 8, text: 'Sou contatado(a) fora do expediente para resolver questões de trabalho.' },
  { id: 39, categoryId: 8, text: 'Sinto culpa quando não estou trabalhando.' },
  { id: 40, categoryId: 8, text: 'Não consigo desconectar mentalmente do trabalho nos meus dias de folga.' },
  // 9. Reconhecimento (9)
  { id: 41, categoryId: 9, text: 'Sinto que meu esforço não é valorizado pela empresa.' },
  { id: 42, categoryId: 9, text: 'Não recebo feedback sobre meu desempenho.' },
  { id: 43, categoryId: 9, text: 'Sinto que não tenho oportunidade de crescimento profissional.' },
  { id: 44, categoryId: 9, text: 'A remuneração não é compatível com as minhas responsabilidades.' },
  { id: 45, categoryId: 9, text: 'Não me sinto motivado(a) com o meu trabalho.' },
  // 10. Saúde Mental (10)
  { id: 46, categoryId: 10, text: 'Sinto-me triste ou desanimado(a) com frequência por causa do trabalho.' },
  { id: 47, categoryId: 10, text: 'Tenho sentido medo ou insegurança no ambiente de trabalho.' },
  { id: 48, categoryId: 10, text: 'Sinto que o trabalho está afetando minha saúde emocional.' },
  { id: 49, categoryId: 10, text: 'Já pensei em procurar ajuda psicológica por causa do trabalho.' },
  { id: 50, categoryId: 10, text: 'Sinto que estou no limite emocional.' }
];

export function calculateCategoryScores(answers) {
  const scores = {};
  for (const cat of categories) {
    const catQuestions = questions.filter(q => q.categoryId === cat.id);
    let total = 0;
    for (const q of catQuestions) {
      const ans = answers.find(a => a.questionId === q.id);
      if (ans) total += ans.value;
    }
    const avg = total / catQuestions.length;
    let riskLevel = '';
    let recommendation = '';
    if (total <= 9) { riskLevel = 'Baixo'; recommendation = 'Situação favorável. Continue promovendo boas práticas.'; }
    else if (total <= 14) { riskLevel = 'Moderado'; recommendation = 'Atenção necessária. Monitorar e implementar melhorias pontuais.'; }
    else if (total <= 19) { riskLevel = 'Alto'; recommendation = 'Risco significativo. Intervenção recomendada em curto prazo.'; }
    else { riskLevel = 'Crítico'; recommendation = 'Situação crítica. Ação imediata necessária conforme NR-01.'; }
    
    scores[cat.id] = { categoryName: cat.name, totalScore: total, averageScore: avg, riskLevel, recommendation };
  }
  return scores;
}

export function calculateIPS(scores) {
  const values = Object.values(scores);
  const total = values.reduce((sum, s) => sum + s.totalScore, 0);
  const maxPossible = values.length * 25;
  const ips = (total / maxPossible) * 5; // IPS de 0 a 5
  let level = '';
  if (ips <= 1.5) level = 'Baixo';
  else if (ips <= 2.5) level = 'Moderado';
  else if (ips <= 3.5) level = 'Alto';
  else level = 'Crítico';
  return { ips: parseFloat(ips.toFixed(2)), level };
}