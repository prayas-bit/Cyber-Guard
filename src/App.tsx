import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { PhishingGame } from './components/modules/PhishingGame';
import { PasswordLab } from './components/modules/PasswordLab';
import { TerminalQuiz } from './components/modules/TerminalQuiz';
import { InjectionModule } from './components/modules/InjectionModule';
import { Auth } from './components/Auth';
import { Leaderboard } from './components/Leaderboard';
import { supabase, SERVER_URL } from './utils/supabaseClient';
import { Loader } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [progress, setProgress] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProgress(session.user);
      }
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProgress(session.user);
      } else {
        setProgress({});
        setCurrentView('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProgress = async (currentUser) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`${SERVER_URL}/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        // data might be empty object if new user
        setProgress(data || {});
      }
    } catch (e) {
      console.error("Failed to fetch progress", e);
    }
  };

  const handleModuleComplete = async (moduleId, score) => {
    // Optimistic local update
    const newProgress = {
      ...progress,
      [moduleId]: Math.max(progress[moduleId] || 0, score)
    };
    setProgress(newProgress);
    
    // Server update
    if (user) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch(`${SERVER_URL}/progress`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ moduleId, score })
        });

        if (!response.ok) {
           console.error("Server refused progress update:", await response.text());
        }
      } catch (e) {
        console.error("Failed to save progress", e);
      }
    }

    setTimeout(() => setCurrentView('dashboard'), 1500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  // If no user and trying to access restricted views (dashboard, modules, leaderboard), show Auth
  // Exception: Home is public
  if (!user && currentView !== 'home') {
    return <Auth onLogin={() => setCurrentView('dashboard')} />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <Hero onStart={() => setCurrentView('dashboard')} />;
      case 'dashboard':
        return (
          <Dashboard 
            onSelectModule={(id) => setCurrentView(`module-${id}`)} 
            progress={progress}
          />
        );
      case 'leaderboard':
        return <Leaderboard onBack={() => setCurrentView('dashboard')} />;
      case 'module-phishing':
        return (
          <PhishingGame 
            onComplete={(score) => handleModuleComplete('phishing', score)}
            onExit={() => setCurrentView('dashboard')}
          />
        );
      case 'module-password':
        return (
          <PasswordLab 
            onComplete={(score) => handleModuleComplete('password', score)}
            onExit={() => setCurrentView('dashboard')}
          />
        );
      case 'module-quiz':
        return (
          <TerminalQuiz 
            onComplete={(score) => handleModuleComplete('quiz', score)}
            onExit={() => setCurrentView('dashboard')}
          />
        );
      case 'module-injection':
        return (
          <InjectionModule 
            onComplete={(score) => handleModuleComplete('injection', score)}
            onExit={() => setCurrentView('dashboard')}
          />
        );
      default:
        return <Hero onStart={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000; 
        }
        ::-webkit-scrollbar-thumb {
          background: #22c55e; 
          border-radius: 0px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #16a34a; 
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
      `}</style>
      
      {!currentView.startsWith('module') && (
        <Navbar 
          currentView={currentView} 
          setView={setCurrentView} 
          user={user}
          onLogout={handleLogout}
        />
      )}
      
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
