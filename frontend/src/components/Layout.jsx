import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, getShareLink } from '../api';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleCopyLink = async () => {
    try {
      const { link } = await getShareLink();
      // Verifica se a API clipboard está disponível
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        alert('Link copiado! Compartilhe com os funcionários.');
      } else {
        // Fallback: exibe o link em um prompt para o usuário copiar manualmente
        prompt('Copie o link manualmente:', link);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar o link. Tente novamente.');
    }
  };

  return (
    <div>
      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/imagens/Logo.UPABJ.bmp" 
            alt="Logo UPA" 
            className="h-8 w-auto"
          />
          <img 
            src="/imagens/logoUniSystem.ico" 
            alt="Logo UniSystem" 
            className="h-6 w-auto"
          />
          <h1 className="text-xl font-bold">NR-01 | Riscos Psicossociais</h1>
        </div>
        <div className="flex gap-4 items-center">
          <span>{user?.name} ({user?.role})</span>
          {user?.role === 'Segurança do trabalho' && (
            <button onClick={handleCopyLink} className="bg-green-100 text-green-700 px-3 py-1 rounded">
              📋 Compartilhar Link
            </button>
          )}
          <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500">
            Sair
          </button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}