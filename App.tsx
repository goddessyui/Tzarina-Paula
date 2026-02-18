
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { BlogPage } from './pages/BlogPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StoryShowcasePage } from './pages/StoryShowcasePage';
import { TestimonialSubmissionPage } from './pages/TestimonialSubmissionPage';
import { SEOManager } from './components/SEOManager';
import { AIChatWidget } from './components/AIChatWidget';
import { CustomCursor } from './components/CustomCursor';
import { useConfig } from './contexts/ConfigContext';
import { Trophy, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { gameState, addXP, showLevelUp, closeLevelUp } = useConfig();
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Trigger glitch effect on mode change
    setIsGlitching(true);
    const timer = setTimeout(() => setIsGlitching(false), 300);
    return () => clearTimeout(timer);
  }, [gameState.mode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname === '/feedback' || params.has('code')) {
        setCurrentPage('feedback');
    }
    const timer = setInterval(() => addXP(5), 60000); 
    return () => clearInterval(timer);
  }, [addXP]);

  const handlePageChange = (page: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
    addXP(10);
    if (page === 'home') window.history.replaceState({}, '', '/');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <LandingPage onNavigate={handlePageChange} />;
      case 'blog': return <BlogPage onNavigate={handlePageChange} />;
      case 'admin': return <AdminDashboard onNavigate={handlePageChange} />;
      case 'stories': return <StoryShowcasePage onNavigate={handlePageChange} />;
      case 'feedback': return <TestimonialSubmissionPage onNavigate={handlePageChange} />;
      default: return <LandingPage onNavigate={handlePageChange} />;
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col transition-all duration-1000 overflow-x-hidden 
        ${gameState.mode === 'logic' ? 'logic-mode bg-stone-100' : 'creative-mode bg-paper'}
        ${isGlitching ? 'glitch-active' : ''}
      `}
      style={isGlitching ? { filter: 'url(#glitch-filter)' } : {}}
    >
      <SEOManager />
      <CustomCursor />
      
      <div className={`vignette pointer-events-none fixed inset-0 z-[60] transition-opacity duration-1000 ${gameState.mode === 'logic' ? 'opacity-30' : 'opacity-0'}`} />
      
      {gameState.mode === 'logic' && (
        <div className="fixed inset-0 pointer-events-none z-[70] opacity-[0.05] mix-blend-multiply bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] [background-size:100%_4px,4px_100%]" />
      )}

      {currentPage !== 'admin' && currentPage !== 'feedback' && (
        <Navigation 
          activePage={currentPage} 
          onNavigate={handlePageChange} 
        />
      )}
      
      <main className={`flex-grow ${currentPage !== 'admin' && currentPage !== 'feedback' ? 'pt-24 md:pt-32' : ''}`}>
        {renderPage()}
      </main>

      {currentPage !== 'admin' && currentPage !== 'feedback' && (
        <>
          <AIChatWidget />
          <Footer onNavigate={handlePageChange} />
        </>
      )}

      {showLevelUp && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" onClick={closeLevelUp}></div>
           <div className="relative bg-white rounded-[3rem] p-12 md:p-20 max-w-lg w-full text-center shadow-2xl border-4 border-accent/20">
              <button onClick={closeLevelUp} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-colors z-50 p-2"><X size={32}/></button>
              <h2 className="font-heading text-6xl text-stone-900 mb-6">Level {gameState.level}!</h2>
              <p className="text-stone-500 font-light text-lg mb-10">Your synchronization with the studio has deepened.</p>
              <button onClick={closeLevelUp} className="w-full py-5 bg-stone-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all">Continue Exploration</button>
           </div>
        </div>
      )}

      <style>{`
        .logic-mode {
          --font-body: 'Poppins', sans-serif;
          --font-heading: 'Poppins', sans-serif;
          background-color: #f9f9f9 !important;
        }
        .creative-mode .font-heading { font-family: 'Chewy', cursive; }
        .logic-mode .font-heading { text-transform: uppercase; letter-spacing: 0.15em; font-weight: 900; }
        
        .logic-mode .rounded-2xl, .logic-mode .rounded-3xl, .logic-mode .rounded-[2.5rem], .logic-mode .rounded-[3rem], .logic-mode .rounded-full { 
          border-radius: 0px !important; 
        }

        .logic-mode button:not(.no-logic) {
           border: 1.5px solid currentColor;
           background: transparent !important;
           color: var(--color-text);
        }
        .logic-mode button:hover:not(.no-logic) {
           background: var(--color-text) !important;
           color: white !important;
        }
      `}</style>
    </div>
  );
};

export default App;
