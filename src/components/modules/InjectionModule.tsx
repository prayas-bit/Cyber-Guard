import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Shield, Lock, Terminal, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const levels = [
  {
    id: 1,
    title: "Logic Bypass",
    description: "The system checks if the username exists. Can you trick the database into returning TRUE for every row?",
    query: "SELECT * FROM users WHERE username = '$input'",
    hint: "Try to close the quote and add a condition that is always true.",
    solution_pattern: /'.*OR.*'1'='1/i,
    successMessage: "Access Granted! The query became: SELECT * FROM users WHERE username = '' OR '1'='1'",
    failMessage: "Access Denied. The query is still looking for a specific user."
  },
  {
    id: 2,
    title: "Comment Injection",
    description: "Now the system checks for a password too. Can you ignore the password check entirely?",
    query: "SELECT * FROM users WHERE username = '$input' AND password = '...'",
    hint: "Close the username string, then use a comment symbol (-- or #) to ignore the rest of the query.",
    solution_pattern: /admin'.*(--|#)/i,
    successMessage: "Admin Access Granted! The password check was commented out.",
    failMessage: "Login Failed. The database is still checking the password."
  },
  {
    id: 3,
    title: "Union Based",
    description: "Retrieve data from a hidden table named 'secrets' by combining results.",
    query: "SELECT title, content FROM posts WHERE id = $input",
    hint: "Use UNION SELECT to join results from the 'secrets' table.",
    solution_pattern: /UNION.*SELECT.*FROM.*secrets/i,
    successMessage: "Data Leaked! You successfully retrieved hidden secrets.",
    failMessage: "Query Failed. You didn't retrieve data from the 'secrets' table."
  }
];

export const InjectionModule = ({ onComplete, onExit }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleExecute = (e) => {
    e.preventDefault();
    if (!input) return;

    const level = levels[currentLevel];
    const success = level.solution_pattern.test(input);
    
    setIsSuccess(success);
    setShowResult(true);
    
    if (success) {
      setScore(s => s + 33); // Approx 33 points per level
    }
  };

  const nextLevel = () => {
    setShowResult(false);
    setInput('');
    setIsSuccess(false);

    if (currentLevel < levels.length - 1) {
      setCurrentLevel(c => c + 1);
    } else {
      setIsFinished(true);
      onComplete(100); // If they pass all levels
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center font-mono">
        <div className="max-w-md w-full bg-gray-900 border border-green-500/30 p-8 rounded-xl text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
          <Database className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">SYSTEM BREACHED</h2>
          <div className="text-6xl font-bold text-green-500 mb-4">
            100%
          </div>
          <p className="text-gray-400 mb-8">
            You successfully exploited all database vulnerabilities. Remember: Sanitize your inputs!
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setCurrentLevel(0);
                setScore(0);
                setIsFinished(false);
                setShowResult(false);
                setInput('');
              }}
              className="w-full py-3 bg-green-600 hover:bg-green-500 rounded font-bold transition-colors"
            >
              REPLAY SIMULATION
            </button>
            <button 
              onClick={onExit}
              className="w-full py-3 border border-gray-700 hover:bg-gray-800 rounded font-bold transition-colors"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  const level = levels[currentLevel];

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8 font-mono flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <button onClick={onExit} className="text-gray-400 hover:text-white flex items-center transition-colors">
          &larr; ABORT MISSION
        </button>
        <div className="flex items-center gap-2 text-yellow-500 font-bold">
          <Database className="w-5 h-5" />
          LEVEL {currentLevel + 1}/{levels.length}
        </div>
      </div>

      <div className="w-full max-w-4xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col relative min-h-[600px]">
        
        {/* Header */}
        <div className="bg-gray-800 p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">{level.title}</h2>
          <p className="text-gray-400">{level.description}</p>
        </div>

        {/* Workspace */}
        <div className="flex-grow p-8 flex flex-col gap-8">
          
          {/* Visual Query Representation */}
          <div className="bg-black rounded-lg p-6 border border-gray-700 shadow-inner">
             <div className="text-gray-500 text-sm mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> SERVER_SIDE_QUERY.sql
             </div>
             <div className="font-mono text-lg text-blue-400 break-all">
               {level.query.split('$input').map((part, i) => (
                 <React.Fragment key={i}>
                   {part}
                   {i < level.query.split('$input').length - 1 && (
                     <span className="text-white bg-gray-800 px-1 rounded animate-pulse">
                       {input || '$input'}
                     </span>
                   )}
                 </React.Fragment>
               ))}
             </div>
          </div>

          {/* Interactive Input */}
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex flex-col items-center justify-center gap-6">
             <div className="w-full max-w-md">
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  INJECTION PAYLOAD
                </label>
                <form onSubmit={handleExecute} className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type SQL injection..."
                    className="w-full bg-black border border-gray-600 rounded p-4 text-green-500 font-mono focus:border-green-500 focus:outline-none shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    spellCheck="false"
                    autoComplete="off"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold transition-colors"
                  >
                    EXECUTE
                  </button>
                </form>
             </div>
             
             {!showResult && (
                <div className="flex items-start gap-3 text-sm text-gray-500 bg-yellow-900/10 border border-yellow-700/30 p-4 rounded max-w-md">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p>{level.hint}</p>
                </div>
             )}
          </div>
        </div>

        {/* Result Overlay */}
        <AnimatePresence>
          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`absolute bottom-0 left-0 right-0 p-8 text-white ${isSuccess ? 'bg-green-900/95 border-green-500' : 'bg-red-900/95 border-red-500'} backdrop-blur-md border-t-4`}
            >
              <div className="flex items-center gap-6 max-w-4xl mx-auto">
                {isSuccess ? (
                  <div className="p-3 bg-green-500/20 rounded-full border border-green-500">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                ) : (
                  <div className="p-3 bg-red-500/20 rounded-full border border-red-500">
                    <Lock className="w-8 h-8 text-red-400" />
                  </div>
                )}
                
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-1">
                    {isSuccess ? "EXPLOIT SUCCESSFUL" : "INJECTION FAILED"}
                  </h3>
                  <p className="opacity-90 text-lg">
                    {isSuccess ? level.successMessage : level.failMessage}
                  </p>
                </div>

                {isSuccess ? (
                  <button 
                    onClick={nextLevel}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-green-900 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    NEXT LEVEL <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowResult(false)}
                    className="px-6 py-3 bg-black/30 hover:bg-black/50 text-white font-bold rounded-lg border border-white/20 transition-colors"
                  >
                    TRY AGAIN
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
