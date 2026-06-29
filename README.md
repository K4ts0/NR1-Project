# NR1-Project — Avaliação de Riscos Psicossociais (NR-01)

Sistema web para avaliação de riscos psicossociais conforme a **Norma Regulamentadora 1 (NR-01)**. Ferramenta desenvolvida para gestores visualizarem de forma anônima as respostas por setor, gerarem relatórios e distribuírem o link de acesso aos funcionários.

🔗 **Acesse o sistema online:** [Seu link do Render aqui]

---

## 📸 Dashboard

![Dashboard NR-01](screenshots/dashboard.png)

---

## ✨ Funcionalidades

### 👨‍💼 Painel Administrativo
- ✅ **Dashboard com visão geral** — Total de respostas, setores avaliados e riscos críticos
- ✅ **Análise por setor** — Visualização de respostas agrupadas por setor, **sem identificar o respondente**
- ✅ **Gráfico IPS por Setor** — Índice de Percepção de Segurança (escala 0-5)
- ✅ **Distribuição de Risco** — Visualização gráfica da distribuição dos riscos
- ✅ **Resumo por Setor** — Tabela consolidada com dados de cada setor

### 📄 Relatórios
- ✅ **Geração de relatórios em PDF** com numeração correta das seções
- ✅ **Relatório completo** com todos os dados da avaliação

### 🔗 Distribuição
- ✅ **Botão de copiar link** — Gera e copia o link de acesso para distribuir entre os funcionários
- ✅ Link direto para o questionário de avaliação

### 🔐 Segurança
- ✅ **Autenticação do administrador** — Acesso restrito ao painel de gestão
- ✅ **Respostas anônimas** — Os funcionários respondem sem identificação

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| **Backend** | Node.js |
| **Banco de Dados** | SQLite (nr01.db) |
| **Frontend** | React + Vite |
| **Estilização** | Tailwind CSS |
| **Deploy** | Render |
| **Relatórios** | Geração de PDF |
| **Ferramentas de IA** | Kimi, DeepSeek, ChatGPT (auxílio no desenvolvimento) |

---

Estrutura do projeto : 

NR1-Project/
├── backend/
│   ├── .env                  # Variáveis de ambiente
│   ├── auth.js               # Autenticação
│   ├── database.js           # Conexão com banco de dados
│   ├── nr01.db               # Banco SQLite
│   ├── questionnaireData.js  # Dados do questionário NR-01
│   ├── reportGenerator.js    # Geração de relatórios PDF
│   ├── server.js             # Servidor principal
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/imagens/       # Imagens e logos
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── App.jsx           # Aplicação principal
│   │   ├── api.js            # Comunicação com backend
│   │   ├── index.css         # Estilos globais
│   │   └── main.jsx          # Entry point
│   ├── .env                  # Variáveis de ambiente do frontend
│   ├── index.html
│   ├── tailwind.config.js    # Configuração Tailwind
│   ├── postcss.config.js
│   ├── package.json
│   └── package-lock.json
├── start.bat                 # Script de inicialização
├── package.json              # Configuração root
├── package-lock.json
├── .gitignore
├── LICENSE
└── README.md

🧠 Aprendizados : 

Durante o desenvolvimento deste projeto, aprofundei conhecimentos em:
Arquitetura fullstack com Node.js + React
Banco de dados SQLite para aplicações leves
Geração de relatórios em PDF
Deploy unificado de frontend e backend no Render
Configuração de Vite para produção
Estilização com Tailwind CSS
Uso de IA como ferramenta produtiva no desenvolvimento
Resolução de problemas de compatibilidade (bcrypt → bcryptjs para Linux)

📝 Licença : 

MIT License

👤 Autor : 

Emerson Hugo Venceslau
https://www.linkedin.com/in/emerson-venceslau-9587bb2b7/
https://github.com/K4ts0

## 📁 Estrutura do Projeto
