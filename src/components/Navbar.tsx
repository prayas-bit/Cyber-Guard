import React from 'react';
import { Shield, Menu, X, LogOut, User } from 'lucide-react';

export const Navbar = ({ currentView, setView, user, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="border-b border-green-500/20 bg-black/90 text-green-400 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <Shield className="h-8 w-8 text-green-500 mr-2" />
            <span className="font-mono text-xl font-bold tracking-wider text-white">
              CYBER<span className="text-green-500">GUARD</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <button 
                onClick={() => setView('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium font-mono transition-colors ${currentView === 'home' ? 'text-white bg-green-500/20' : 'text-gray-300 hover:text-green-400'}`}
              >
                HOME
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium font-mono transition-colors ${currentView === 'dashboard' || currentView.startsWith('module') ? 'text-white bg-green-500/20' : 'text-gray-300 hover:text-green-400'}`}
              >
                TRAINING_MODULES
              </button>
              <button 
                onClick={() => setView('leaderboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium font-mono transition-colors ${currentView === 'leaderboard' ? 'text-white bg-green-500/20' : 'text-gray-300 hover:text-green-400'}`}
              >
                LEADERBOARD
              </button>
              
              {user && (
                <div className="flex items-center ml-4 pl-4 border-l border-gray-700">
                  <div className="flex items-center text-sm mr-4 text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    {user.email.split('@')[0]}
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-red-900/20 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-400 hover:text-white hover:bg-green-500/20 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black border-b border-green-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => { setView('home'); setIsOpen(false); }} className="text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium font-mono w-full text-left">HOME</button>
            <button onClick={() => { setView('dashboard'); setIsOpen(false); }} className="text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium font-mono w-full text-left">TRAINING_MODULES</button>
            <button onClick={() => { setView('leaderboard'); setIsOpen(false); }} className="text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium font-mono w-full text-left">LEADERBOARD</button>
            {user && (
               <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-red-400 hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium font-mono w-full text-left border-t border-gray-800 mt-2 pt-2">LOGOUT</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
