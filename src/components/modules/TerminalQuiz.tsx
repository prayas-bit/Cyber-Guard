import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const questions = [
  {
    q: "What protocol is used to securely encrypt web traffic?",
    a: "https",
    hint: "It's HTTP with Security."
  },
  {
    q: "What is the command to list files in a Linux directory?",
    a: "ls",
    hint: "Short for 'list'."
  },
  {
    q: "What type of attack involves overwhelming a server with traffic?",
    a: "ddos",
    hint: "Distributed Denial of Service."
  },
  {
    q: "What does '2FA' stand for?",
    a: "two factor authentication",
    hint: "A second step to log in."
  }
];

export const TerminalQuiz = ({ onComplete, onExit }) => {
  const [history, setHistory] = useState([
    "Welcome to CyberGuard Terminal v1.0.4",
    "Initializing Quiz Module...",
    "Type 'help' for commands.",
    "----------------------------------------"
  ]);
  const [input, setInput] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [history]);

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, `user@cyberguard:~$ ${cmd}`];

    if (!quizActive) {
      if (cleanCmd === 'start') {
        setQuizActive(true);
        setCurrentQIndex(0);
        setScore(0);
        newHistory.push(`QUESTION 1: ${questions[0].q}`);
      } else if (cleanCmd === 'help') {
        newHistory.push("Available commands:", "  start - Begin the quiz", "  clear - Clear terminal", "  exit - Return to dashboard");
      } else if (cleanCmd === 'clear') {
        setHistory(["Console cleared."]);
        setInput('');
        return;
      } else if (cleanCmd === 'exit') {
        onExit();
        return;
      } else {
        newHistory.push(`Command not found: ${cleanCmd}`);
      }
    } else {
      // Quiz Logic
      const currentQ = questions[currentQIndex];
      if (cleanCmd === currentQ.a) {
        newHistory.push(">> CORRECT. Access Granted.");
        const newScore = score + 1;
        setScore(newScore);
        
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
          newHistory.push(`QUESTION ${currentQIndex + 2}: ${questions[currentQIndex + 1].q}`);
        } else {
          setQuizActive(false);
          newHistory.push("----------------------------------------");
          newHistory.push(`QUIZ COMPLETE. Final Score: ${newScore}/${questions.length}`);
          newHistory.push("Type 'exit' to leave or 'start' to retry.");
          // We can auto-complete or let them type exit
          setTimeout(() => onComplete(Math.round((newScore / questions.length) * 100)), 2000);
        }
      } else {
        newHistory.push(">> ACCESS DENIED. Incorrect Answer.");
        newHistory.push(`HINT: ${currentQ.hint}`);
      }
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 font-mono flex flex-col items-center justify-center" onClick={() => inputRef.current?.focus()}>
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center text-green-500">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5" /> TERMINAL_ACCESS
        </div>
        <button onClick={onExit} className="hover:text-white border border-green-500/30 px-3 py-1 rounded text-xs">
          EXIT
        </button>
      </div>

      <div className="w-full max-w-4xl h-[600px] bg-black border border-green-500/50 rounded-lg p-6 shadow-[0_0_20px_rgba(34,197,94,0.2)] overflow-hidden flex flex-col text-green-400 text-lg">
        <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar">
          {history.map((line, i) => (
            <div key={i} className={`${line.startsWith('>>') ? 'text-green-300 font-bold' : line.startsWith('user') ? 'text-white' : 'text-green-400'}`}>
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        <div className="mt-4 flex items-center">
          <span className="text-white mr-2">user@cyberguard:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent border-none outline-none text-white focus:ring-0"
            autoFocus
          />
        </div>
      </div>
      
      <div className="mt-4 text-gray-500 text-sm">
        Use "start" to begin the quiz.
      </div>
    </div>
  );
};
