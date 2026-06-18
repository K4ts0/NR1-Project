// backend/reportGenerator.js
import pdf from 'html-pdf';
import { categories, questions } from './questionnaireData.js';

function calculateAveragesAndIPS(responses) {
  const totals = {};
  categories.forEach(cat => { totals[cat.id] = { sum: 0, count: 0 }; });
  for (const resp of responses) {
    const answers = JSON.parse(resp.answers);
    for (const cat of categories) {
      const catQs = questions.filter(q => q.categoryId === cat.id);
      let sum = 0;
      for (const q of catQs) {
        const ans = answers.find(a => a.questionId === q.id);
        if (ans) sum += ans.value;
      }
      totals[cat.id].sum += sum;
      totals[cat.id].count++;
    }
  }
  const averages = [];
  for (const cat of categories) {
    const avg = totals[cat.id].count ? totals[cat.id].sum / totals[cat.id].count : 0;
    let level = '';
    if (avg <= 9) level = 'Baixo';
    else if (avg <= 14) level = 'Moderado';
    else if (avg <= 19) level = 'Alto';
    else level = 'Crítico';
    averages.push({ name: cat.name, score: avg, level });
  }
  const totalAvg = averages.reduce((acc, c) => acc + c.score, 0);
  const ips = (totalAvg / (categories.length * 25)) * 5;
  let ipsLevel = '';
  if (ips <= 1.5) ipsLevel = 'Baixo';
  else if (ips <= 2.5) ipsLevel = 'Moderado';
  else if (ips <= 3.5) ipsLevel = 'Alto';
  else ipsLevel = 'Crítico';
  return { averages, ips, ipsLevel };
}

export async function generateFullReport(responses, sector, companyName = 'UPA BARRA DE JANGADA') {
  const { averages, ips, ipsLevel } = calculateAveragesAndIPS(responses);
  const totalResponses = responses.length;
  const today = new Date().toLocaleDateString('pt-BR');
  const now = new Date().toLocaleString('pt-BR');

  // Texto personalizado da empresa e sistema
  const companyFooter = "UPA BARRA DE JANGADA | SISTEMA DESENVOLVIDO PELA EQUIPE DE TI DA UPA DE BARRA | SISTEMA DE AVALIAÇÃO DE RISCO PSICOSSOCIAIS 1.0 - Conforme NR1-01/2026";

  // Monta o HTML do relatório
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório NR-01 - ${sector}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
        h1 { color: #1e3a8a; text-align: center; font-size: 18px; }
        h2 { color: #1e3a8a; font-size: 14px; margin-top: 20px; border-bottom: 1px solid #ccc; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; vertical-align: top; }
        th { background-color: #1e3a8a; color: white; text-align: center; }
        .critical { color: #b91c1c; font-weight: bold; }
        .high { color: #ea580c; font-weight: bold; }
        .moderate { color: #d97706; font-weight: bold; }
        .low { color: #059669; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 8px; text-align: center; color: gray; border-top: 1px solid #ccc; padding-top: 10px; }
        .progress-bar { width: 100%; background-color: #e2e8f0; border-radius: 10px; margin: 10px 0; }
        .progress-fill { height: 20px; background-color: ${ips > 3.5 ? '#b91c1c' : (ips > 2.5 ? '#ea580c' : (ips > 1.5 ? '#d97706' : '#059669'))}; width: ${(ips/5)*100}%; border-radius: 10px; text-align: center; color: white; line-height: 20px; }
        .ips-number { font-size: 20px; font-weight: bold; text-align: center; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>RELATÓRIO DE AVALIAÇÃO DE RISCOS PSICOSSOCIAIS</h1>
      <p style="text-align:center">NR-01 + NR-17 | Integrado ao PGR</p>

      <h2>1. IDENTIFICAÇÃO DA EMPRESA</h2>
      <p><strong>Empresa:</strong> ${companyName}</p>
      <p><strong>Setor avaliado:</strong> ${sector}</p>
      <p><strong>Data da avaliação:</strong> ${today}</p>
      <p><strong>Total de respondentes:</strong> ${totalResponses}</p>

      <h2>2. ANÁLISE DO AMBIENTE FÍSICO</h2>
      <p>A avaliação considerou fatores psicossociais relacionados à organização do trabalho. Não foram observadas condições físicas inadequadas de forma generalizada.</p>

      <h2>5. ORGANIZAÇÃO DO TRABALHO (NR-17 – FOCO PSICOSSOCIAL)</h2>
      <table>
        <thead>
          <tr><th>Dimensão</th><th>Pontuação Média (0-25)</th><th>Nível</th></tr>
        </thead>
        <tbody>
          ${averages.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align:center">${item.score.toFixed(1)}</td>
              <td style="text-align:center" class="${item.level === 'Crítico' ? 'critical' : (item.level === 'Alto' ? 'high' : (item.level === 'Moderado' ? 'moderate' : 'low'))}">${item.level}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>6. ÍNDICE PSICOSSOCIAL SETORIAL (IPS)</h2>
      <div class="progress-bar"><div class="progress-fill">${ips.toFixed(2)} / 5.0</div></div>
      <div class="ips-number">${ips.toFixed(2)} / 5.0</div>
      <p style="text-align:center; color:#b91c1c"><strong>Nível: ${ipsLevel}</strong></p>

      <h2>7. MATRIZ DE RISCO (INTEGRAÇÃO AUTOMÁTICA AO PGR - NR-01)</h2>
      <table>
        <thead>
          <tr><th>Perigo Identificado</th><th>Tipo</th><th>P</th><th>S</th><th>Nível</th><th>Medida de Controle</th></tr>
        </thead>
        <tbody>
          <tr><td>Má gestão de mudanças organizacionais</td><td>Psicossocial</td><td style="text-align:center">3</td><td style="text-align:center">3</td><td>9 - Amarelo</td><td>Comunicar mudanças com antecedência</td></tr>
          <tr><td>Trabalho em condições de difícil comunicação</td><td>Psicossocial</td><td style="text-align:center">3</td><td style="text-align:center">3</td><td>9 - Amarelo</td><td>Fornecer ferramentas de comunicação adequadas</td></tr>
          <tr><td>Jornada de trabalho excessiva</td><td>Psicossocial</td><td style="text-align:center">3</td><td style="text-align:center">3</td><td>9 - Amarelo</td><td>Respeitar limites legais de jornada</td></tr>
          <tr><td>Excesso de demandas no trabalho (sobrecarga)</td><td>Psicossocial</td><td style="text-align:center">3</td><td style="text-align:center">3</td><td>9 - Amarelo</td><td>Priorizar tarefas</td></tr>
          <tr><td>Eventos violentos ou traumáticos</td><td>Psicossocial</td><td style="text-align:center">3</td><td style="text-align:center">3</td><td>9 - Amarelo</td><td>Implementar protocolo de segurança</td></tr>
          <tr><td>Más relações no local de trabalho</td><td>Psicossocial</td><td style="text-align:center">3</td><td style="text-align:center">3</td><td>9 - Amarelo</td><td>Promover atividades de integração</td></tr>
          <tr><td>Baixas recompensas e reconhecimento</td><td>Psicossocial</td><td style="text-align:center">3</td><td style="text-align:center">3</td><td>9 - Amarelo</td><td>Implementar programa de reconhecimento</td></tr>
        </tbody>
      </table>

      <h2>8. NÍVEL DE MATURIDADE ERGONÔMICA</h2>
      <p style="text-align:center"><strong>Inicial</strong><br>Processo ergonômico inexistente ou incipiente</p>

      <h2>9. PLANO DE AÇÃO ERGONÔMICO</h2>
      <table>
        <thead><tr><th>#</th><th>Ação</th><th>Categoria</th><th>Prioridade</th><th>Prazo</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td style="text-align:center">1</td><td>Reavaliação Ergonômica Periódica</td><td>Organizacional</td><td>Média</td><td>24/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">2</td><td>Programa de reconhecimento</td><td>Organizacional</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">3</td><td>Atividades de integração</td><td>Organizacional</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">4</td><td>Protocolo de segurança</td><td>Organizacional</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">5</td><td>Priorização de tarefas</td><td>Organizacional</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">6</td><td>Limites legais de jornada</td><td>Organizacional</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">7</td><td>Ferramentas de comunicação</td><td>Organizacional</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">8</td><td>Comunicar mudanças com antecedência</td><td>Organizacional</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">9</td><td>Intervenção - Exposição a público agressivo</td><td>Psicossocial</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
          <tr><td style="text-align:center">10</td><td>Intervenção - Falta de clareza nas funções</td><td>Psicossocial</td><td>Alta</td><td>09/06/2026</td><td>Pendente</td></tr>
        </tbody>
      </table>

      <div class="footer">
        Responsável Técnico: Equipe de TI da UPA Barra de Jangada<br>
        Relatório gerado em ${now}<br>
        ${companyFooter}
      </div>
    </body>
    </html>
  `;

  // Opções de geração do PDF
  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
    footer: {
      height: '10mm',
      contents: {
        default: `<span style="font-size:8pt; text-align:center;">Responsável Técnico: MIRELE SEGURANÇA DO TRABALHO | Relatório gerado em ${now} | ${companyFooter}</span>`
      }
    }
  };

  return new Promise((resolve, reject) => {
    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) reject(err);
      else resolve(buffer);
    });
  });
}