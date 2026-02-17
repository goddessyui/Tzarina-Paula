
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
import { Trophy, Sparkles, Terminal, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { gameState, addXP, showLevelUp, closeLevelUp } = useConfig();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname === '/feedback' || params.has('code')) {
        setCurrentPage('feedback');
    }
    
    // Reward for focus
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
    <div className={`min-h-screen flex flex-col transition-all duration-1000 overflow-x-hidden ${gameState.mode === 'logic' ? 'logic-mode bg-stone-100' : 'creative-mode bg-paper'}`}>
      <SEOManager />
      <CustomCursor />
      
      {/* GLOBAL HUD ELEMENTS */}
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

      {/* LEVEL UP OVERLAY */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" onClick={closeLevelUp}></div>
           <div className="relative bg-white rounded-[3rem] p-12 md:p-20 max-w-lg w-full text-center shadow-[0_0_100px_rgba(250,140,150,0.3)] border-4 border-accent/20">
              <button 
                onClick={closeLevelUp} 
                className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-colors cursor-pointer z-50 p-2"
              >
                <X size={32}/>
              </button>
              <div className="flex justify-center mb-10">
                 <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce">
                    <Trophy size={48} />
                 </div>
              </div>
              <p className="text-accent font-bold uppercase tracking-[0.5em] text-[10px] mb-4">Achievement Unlocked</p>
              <h2 className="font-heading text-6xl text-stone-900 mb-6">Level {gameState.level}!</h2>
              <p className="text-stone-500 font-light text-lg mb-10 leading-relaxed">
                Your synchronization with the portfolio has deepened. {gameState.level > 5 ? 'New experimental UI features unlocked.' : 'Keep exploring to unlock hidden lore fragments.'}
              </p>
              <button onClick={closeLevelUp} className="w-full py-5 bg-stone-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all cursor-pointer">
                Continue Exploration
              </button>
           </div>
        </div>
      )}

      <style>{`
        .logic-mode {
          --font-body: 'Poppins', sans-serif;
          --font-heading: 'Poppins', sans-serif;
          background-color: #f9f9f9 !important;
          filter: contrast(1.05) saturate(0.9);
        }
        .creative-mode {
          background-color: #f4f1ea !important;
        }
        .logic-mode .font-heading {
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 900;
        }
        .creative-mode .font-heading {
          font-family: 'Chewy', cursive;
          font-weight: 400;
        }
        .creative-mode .font-body {
          font-weight: 300;
        }
        .logic-mode .font-body {
          font-weight: 400;
        }
        
        .logic-mode .rounded-2xl, 
        .logic-mode .rounded-3xl, 
        .logic-mode .rounded-full, 
        .logic-mode .card-radius,
        .logic-mode .rounded-[1.5rem],
        .logic-mode .rounded-[2.25rem],
        .logic-mode .rounded-[2.5rem],
        .logic-mode .rounded-[3rem],
        .logic-mode .rounded-[4rem] { 
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
