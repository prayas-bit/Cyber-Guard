import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const emails = [
  {
    id: 1,
    sender: "security@paypa1.com",
    subject: "URGENT: Suspicious Activity Detected",
    body: "We detected an unauthorized login attempt from Russia. Please click the link below to verify your identity immediately or your account will be locked.",
    isPhishing: true,
    reason: "The sender domain is 'paypa1.com' instead of 'paypal.com' (typosquatting), and the message creates a false sense of urgency.",
    linkText: "Verify Identity Now"
  },
  {
    id: 2,
    sender: "hr@company.com",
    subject: "Updated Holiday Policy",
    body: "Hi Team, please find attached the updated holiday policy for 2024. Let me know if you have any questions.",
    isPhishing: false,
    reason: "The sender is from the correct internal domain, the tone is professional and non-urgent, and the context is standard business communication.",
    linkText: "View Policy.pdf"
  },
  {
    id: 3,
    sender: "ceo-office@gmail.com",
    subject: "Wire Transfer Needed ASAP",
    body: "I am in a meeting and cannot talk. I need you to process a wire transfer for a vendor immediately. It's urgent. Reply with your cell number.",
    isPhishing: true,
    reason: "CEO using a generic @gmail.com address instead of company email. Urgent financial request bypassing standard procedures (CEO Fraud).",
    linkText: "Reply Now"
  },
  {
    id: 4,
    sender: "support@netflix.com",
    subject: "New sign-in to your account",
    body: "Your Netflix account was signed in to from a new device. If this was you, you can ignore this email. If not, please change your password.",
    isPhishing: false,
    reason: "Legitimate security notification. It doesn't demand immediate clicking but offers a standard advisory warning.",
    linkText: "Manage Devices"
  }
];

export const PhishingGame = ({ onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleChoice = (choice) => {
    const email = emails[currentIndex];
    const isCorrect = (choice === 'phishing' && email.isPhishing) || (choice === 'safe' && !email.isPhishing);
    
    if (isCorrect) setScore(s => s + 1);
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct Analysis! " + email.reason : "Incorrect. " + email.reason
    });
  };

  const nextEmail = () => {
    setFeedback(null);
    if (currentIndex < emails.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setIsFinished(true);
      onComplete(Math.round(((score + (feedback?.correct ? 1 : 0)) / emails.length) * 100));
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center font-mono">
        <div className="max-w-md w-full bg-gray-900 border border-green-500/30 p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">MISSION DEBRIEF</h2>
          <div className="text-6xl font-bold text-green-500 mb-4">
            {Math.round((score / emails.length) * 100)}%
          </div>
          <p className="text-gray-400 mb-8">
            You correctly identified {score} out of {emails.length} threats.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={reset}
              className="w-full py-3 bg-green-600 hover:bg-green-500 rounded font-bold transition-colors"
            >
              RETRY MISSION
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

  const currentEmail = emails[currentIndex];

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8 font-mono flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <button onClick={onExit} className="text-gray-400 hover:text-white flex items-center">
          &larr; ABORT MISSION
        </button>
        <div className="text-green-500 font-bold">
          EMAIL {currentIndex + 1}/{emails.length}
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl min-h-[500px] flex flex-col relative">
        {/* Email Header */}
        <div className="bg-gray-100 p-6 border-b border-gray-200 text-gray-800">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {currentEmail.sender[0].toUpperCase()}
             </div>
             <div>
                <div className="font-bold text-lg">{currentEmail.sender}</div>
                <div className="text-sm text-gray-500">to me</div>
             </div>
           </div>
           <h2 className="text-2xl font-bold">{currentEmail.subject}</h2>
        </div>

        {/* Email Body */}
        <div className="p-8 text-gray-800 text-lg leading-relaxed flex-grow">
          {currentEmail.body}
          <div className="mt-8">
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 pointer-events-none opacity-80">
              {currentEmail.linkText}
            </button>
          </div>
        </div>

        {/* Game Controls Overlay */}
        <AnimatePresence>
          {feedback ? (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute bottom-0 left-0 right-0 p-6 text-white ${feedback.correct ? 'bg-green-900/95' : 'bg-red-900/95'} backdrop-blur-sm border-t-4 ${feedback.correct ? 'border-green-500' : 'border-red-500'}`}
            >
              <div className="flex items-start gap-4">
                {feedback.correct ? <CheckCircle className="w-8 h-8 flex-shrink-0 text-green-400" /> : <AlertCircle className="w-8 h-8 flex-shrink-0 text-red-400" />}
                <div>
                  <h3 className="text-xl font-bold mb-1">{feedback.correct ? "ANALYSIS CORRECT" : "THREAT DETECTED INCORRECTLY"}</h3>
                  <p className="opacity-90">{feedback.message}</p>
                </div>
                <button 
                  onClick={nextEmail}
                  className="ml-auto bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-center gap-6">
              <button 
                onClick={() => handleChoice('phishing')}
                className="flex items-center gap-2 px-8 py-4 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold border border-red-300 transition-colors w-48 justify-center"
              >
                <AlertCircle className="w-5 h-5" /> PHISHING
              </button>
              <button 
                onClick={() => handleChoice('safe')}
                className="flex items-center gap-2 px-8 py-4 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-bold border border-green-300 transition-colors w-48 justify-center"
              >
                <CheckCircle className="w-5 h-5" /> SAFE
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
