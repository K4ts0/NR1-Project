import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, getShareLink } from '../api';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleCopyLink = async () => {
    try {
      const { link } = await getShareLink();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        alert('Link copiado! Compartilhe com os funcionários.');
      } else {
        prompt('Copie o link manualmente:', link);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar o link. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo e título */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <img
                src="/imagens/Logo.UPABJ.bmp"
                alt="Logo UPA"
                className="h-7 sm:h-9 w-auto object-contain flex-shrink-0"
              />
              <img
                src="/imagens/logoUniSystem.ico"
                alt="Logo UniSystem"
                className="h-5 sm:h-7 w-auto object-contain flex-shrink-0"
              />
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                NR-01 | Riscos Psicossociais
              </h1>
            </div>

            {/* Menu do usuário */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-600 hidden xs:inline">
                {user?.name}
              </span>
              {user?.role === 'Segurança do trabalho' && (
                <button
                  onClick={handleCopyLink}
                  className="text-xs sm:text-sm bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-green-100 whitespace-nowrap"
                >
                  <span className="hidden xs:inline">📋 Compartilhar</span>
                  <span className="xs:hidden">📋</span>
                </button>
              )}
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="text-xs sm:text-sm text-red-600 hover:text-red-800 whitespace-nowrap"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}