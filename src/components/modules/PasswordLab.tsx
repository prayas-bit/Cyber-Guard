import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Unlock, Lock, ShieldCheck, ShieldAlert, Timer } from 'lucide-react';

export const PasswordLab = ({ onComplete, onExit }) => {
  const [password, setPassword] = useState('');
  const [crackTime, setCrackTime] = useState('Instantly');
  const [score, setScore] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Very simplified estimation logic for demonstration purposes
  const calculateStrength = (pwd) => {
    if (!pwd) return { time: '0 seconds', score: 0 };
    
    let entropy = 0;
    const length = pwd.length;
    
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 32;
    
    entropy = Math.log2(Math.pow(poolSize, length));
    
    // Convert entropy to rough time estimate (assuming 10 billion guesses/sec for a powerful cracker)
    // This is purely educational math, not exact
    const combinations = Math.pow(poolSize, length);
    const seconds = combinations / 1e10; 
    
    let timeString = '';
    if (seconds < 1e-6) timeString = 'Instantly';
    else if (seconds < 60) timeString = 'A few seconds';
    else if (seconds < 3600) timeString = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) timeString = `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 31536000) timeString = `${Math.round(seconds / 86400)} days`;
    else if (seconds < 3153600000) timeString = `${Math.round(seconds / 31536000)} years`;
    else timeString = 'Centuries';

    // Normalize score 0-100 based on entropy (say 60 bits is "secure enough" for this game)
    const normalizedScore = Math.min(100, Math.round((entropy / 80) * 100));

    return { time: timeString, score: normalizedScore };
  };

  useEffect(() => {
    const result = calculateStrength(password);
    setCrackTime(result.time);
    setScore(result.score);
    
    if (result.score >= 100 && !hasCompleted) {
      setHasCompleted(true);
      // Let user enjoy the 100% for a moment before formally "completing" if they want
      // For now, we just track it.
    }
  }, [password, hasCompleted]);

  const finishModule = () => {
    onComplete(hasCompleted ? 100 : score);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8 font-mono flex flex-col items-center justify-center">
       <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <button onClick={onExit} className="text-gray-400 hover:text-white flex items-center">
          &larr; ABORT MISSION
        </button>
        <div className="text-blue-500 font-bold">
          PASSWORD ENTROPY ANALYZER
        </div>
      </div>

      <div className="w-full max-w-2xl bg-gray-900 border border-blue-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <div className="text-center mb-8">
          <Lock className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">CRACK_THE_HASH</h2>
          <p className="text-gray-400">
            Type a password below to see how long it would take a modern GPU cluster to crack it.
            Aim for a score of 100% to pass this module.
          </p>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type password here..."
            className="w-full bg-black border-2 border-gray-700 focus:border-blue-500 text-white text-2xl p-4 rounded-lg outline-none text-center tracking-wider transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/50 p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-2">
              <Timer className="w-4 h-4" /> ESTIMATED CRACK TIME
            </div>
            <div className={`text-2xl font-bold ${score < 50 ? 'text-red-500' : score < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
              {crackTime}
            </div>
          </div>
          
          <div className="bg-black/50 p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-2">
              {score >= 80 ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />} SECURITY SCORE
            </div>
            <div className="w-full bg-gray-700 h-4 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className={`h-full ${score < 50 ? 'bg-red-500' : score < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
            <div className="mt-1 text-right text-sm text-white">{score}/100</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className={`w-3 h-3 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`}></div> Lowercase Letters
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className={`w-3 h-3 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`}></div> Uppercase Letters
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className={`w-3 h-3 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`}></div> Numbers
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className={`w-3 h-3 rounded-full ${/[^a-zA-Z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`}></div> Special Characters
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className={`w-3 h-3 rounded-full ${password.length >= 12 ? 'bg-green-500' : 'bg-gray-700'}`}></div> Length (12+ chars)
          </div>
        </div>

        {score >= 100 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-4 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-center font-bold"
          >
            PASSWORD SECURE. ENTROPY SUFFICIENT.
          </motion.div>
        )}

        <button
          onClick={finishModule}
          className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors"
        >
          COMPLETE MODULE
        </button>
      </div>
    </div>
  );
};
