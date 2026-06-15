// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // O backend espera { email, password }. Usamos o username como email.
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrap">
        {/* Lado esquerdo - Branding */}
        <div className="brand-pane">
          <div className="wordmark">
            <div className="logo-pill">
              <svg viewBox="0 0 64 64" fill="none">
                <rect x="2" y="2" width="60" height="60" rx="14" fill="#fff" opacity=".15" />
                <path d="M18 22v20c0 2 2 4 4 4h20" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                <path d="M46 42V22c0-2-2-4-4-4H22" stroke="#0ef" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="logo-text">UniSystem</span>
            </div>
            <h1 className="headline">Gestão inteligente para unidades de saúde</h1>
            <p className="sub">UPA Barra de Jangada • Segurança, rastreabilidade e desempenho.</p>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="form-pane">
          <div className="card">
            <h1>Digite suas credenciais</h1>

            {error && (
              <ul className="flash">
                <li>{error}</li>
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                className="input"
                type="text"
                placeholder="seu usuário"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />

              <label htmlFor="password">Senha</label>
              <div className="pw">
                <input
                  id="password"
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="sua senha"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'ocultar' : 'mostrar'}
                </button>
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="meta">© {new Date().getFullYear()} • UniSystem</div>
          </div>
        </div>
      </div>

      {/* Estilos internos (escopados) */}
      <style>{`
        .login-container {
          --brand1: #1248ff;
          --brand2: #00c2d7;
          --bg: #0a1224;
          --ink: #0f172a;
          --card: #ffffffee;
          --stroke: #e6e9f2;
          --muted: #6b7280;
          --radius: 18px;
        }
        .login-container * {
          box-sizing: border-box;
        }
        .login-wrap {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
        }
        .brand-pane {
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 48px;
          background:
            radial-gradient(800px 500px at 20% -10%, #1b56ff33, transparent 60%),
            radial-gradient(900px 700px at 120% 120%, #00cfe02a, transparent 60%),
            linear-gradient(135deg, #0c1b3a, #0b1340);
        }
        .wordmark {
          display: flex;
          flex-direction: column;
          gap: 18px;
          color: #fff;
          max-width: 560px;
          width: 100%;
        }
        .logo-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 22px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--brand1), var(--brand2));
          box-shadow: 0 18px 50px rgba(18, 72, 255, 0.45);
          position: relative;
          isolation: isolate;
          animation: float 6s ease-in-out infinite;
        }
        .logo-pill::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 999px;
          filter: blur(18px);
          background: linear-gradient(90deg, var(--brand1), var(--brand2));
          opacity: 0.55;
          z-index: -1;
        }
        .logo-pill::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: linear-gradient(120deg, transparent, #ffffff66, transparent);
          transform: translateX(-115%);
          animation: shine 3.2s infinite ease;
        }
        @keyframes shine {
          0% { transform: translateX(-115%); }
          60% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .logo-pill svg {
          width: 26px;
          height: 26px;
        }
        .logo-text {
          font-weight: 800;
          letter-spacing: 0.4px;
          font-size: 22px;
        }
        .headline {
          font-weight: 800;
          font-size: 38px;
          line-height: 1.1;
          margin: 0;
        }
        .sub {
          opacity: 0.9;
          margin: 0;
          font-size: 14px;
        }
        .form-pane {
          display: grid;
          place-items: center;
          padding: 40px;
          background: white;
        }
        .card {
          width: min(92vw, 380px);
          background: var(--card);
          border: 1px solid var(--stroke);
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
          padding: 36px 28px 28px;
          backdrop-filter: blur(10px);
        }
        .card h1 {
          margin: 6px 0 18px;
          font-size: 20px;
          text-align: center;
          color: #102046;
          font-family: inherit;
        }
        label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin: 10px 0 6px;
          color: #1e293b;
        }
        .input {
          width: 100%;
          padding: 16px 14px;
          border: 1px solid var(--stroke);
          border-radius: 12px;
          background: #fff;
          font-size: 14px;
          outline: none;
          transition: border 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .input:focus {
          border-color: var(--brand1);
          box-shadow: 0 0 0 3px #1248ff22;
        }
        .pw {
          position: relative;
        }
        .toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: var(--muted);
          font-size: 12px;
          cursor: pointer;
          padding: 2px 6px;
        }
        .btn {
          width: 100%;
          margin-top: 14px;
          padding: 14px;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          background: linear-gradient(90deg, var(--brand1), var(--brand2));
          box-shadow: 0 12px 24px rgba(18, 72, 255, 0.28);
          transition: filter 0.2s, transform 0.06s;
        }
        .btn:hover {
          filter: brightness(1.05);
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .meta {
          margin-top: 10px;
          text-align: center;
          font-size: 11px;
          color: var(--muted);
        }
        .flash {
          list-style: none;
          padding: 0;
          margin: 0 0 10px;
        }
        .flash li {
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
          border: 1px solid #fecaca;
          background: #fff1f2;
          color: #b91c1c;
        }
        @media (max-width: 980px) {
          .login-wrap {
            grid-template-columns: 1fr;
          }
          .brand-pane {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}