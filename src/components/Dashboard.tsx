import React from 'react';
import { motion } from 'motion/react';
import { Mail, Key, Terminal, Database, Play } from 'lucide-react';

const modules = [
  {
    id: 'phishing',
    title: 'Phishing Detective',
    description: 'Analyze incoming emails and identify malicious attempts before they breach the system.',
    icon: Mail,
    difficulty: 'Beginner',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400/30'
  },
  {
    id: 'password',
    title: 'Entropy Lab',
    description: 'Test password strength against brute-force attacks and learn about hashing.',
    icon: Key,
    difficulty: 'Intermediate',
    color: 'text-blue-400',
    borderColor: 'border-blue-400/30'
  },
  {
    id: 'quiz',
    title: 'Terminal Trivia',
    description: 'Test your knowledge of cybersecurity terminology and command line basics.',
    icon: Terminal,
    difficulty: 'Advanced',
    color: 'text-green-400',
    borderColor: 'border-green-400/30'
  },
  {
    id: 'injection',
    title: 'SQL Injection',
    description: 'Exploit database vulnerabilities to bypass authentication and leak sensitive data.',
    icon: Database,
    difficulty: 'Expert',
    color: 'text-red-500',
    borderColor: 'border-red-500/30'
  }
];

export const Dashboard = ({ onSelectModule, progress }) => {
  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">TRAINING_MODULES</h2>
          <div className="h-1 w-20 bg-green-500 rounded"></div>
          <p className="mt-4 text-gray-400">Select a mission to begin your training.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {modules.map((mod, index) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectModule(mod.id)}
              className={`relative group p-6 rounded-xl border-2 bg-gray-900/50 transition-all duration-300 cursor-pointer hover:bg-gray-800 hover:shadow-lg ${mod.borderColor} hover:border-opacity-100 border-opacity-40`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-black/50 ${mod.color}`}>
                  <mod.icon className="h-8 w-8" />
                </div>
                {progress[mod.id] !== undefined && (
                   <div className="flex flex-col items-end">
                     <span className="text-xs text-gray-500 mb-1">COMPLETION</span>
                     <div className="text-xl font-bold text-white">{progress[mod.id]}%</div>
                   </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-white">
                {mod.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6 h-10">
                {mod.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-xs px-2 py-1 rounded bg-gray-800 ${mod.color} bg-opacity-10 border border-opacity-20 border-current`}>
                  {mod.difficulty.toUpperCase()}
                </span>
                
                <button className="flex items-center text-sm font-bold text-white group-hover:text-green-400 transition-colors">
                  LAUNCH <Play className="ml-1 w-4 h-4 fill-current" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
