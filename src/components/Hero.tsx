import React from 'react';
import { motion } from 'motion/react';
import { Shield, ChevronRight, Lock, Terminal } from 'lucide-react';

export const Hero = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-black min-h-[calc(100vh-64px)] flex items-center justify-center">
      {/* Background Matrix/Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20">
         <img 
            src="https://images.unsplash.com/photo-1640730204494-21ecdf5ce03a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHNlY3VyaXR5JTIwbWF0cml4JTIwY29kZSUyMG5lb24lMjBncmVlbnxlbnwxfHx8fDE3NzAzMjI2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            className="w-full h-full object-cover"
            alt="Cyber Background"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-500/10 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <Shield className="h-16 w-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-mono mb-4">
            LEVEL UP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              SECURITY SKILLS
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 font-mono">
            Learn to defend against phishing, crack passwords (ethically), and master the terminal in our gamified cyber range.
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <button 
              onClick={onStart}
              className="group relative px-8 py-3 bg-green-600 text-black font-bold text-lg font-mono rounded hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
            >
              INITIALIZE_TRAINING
              <ChevronRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors">
            <Terminal className="h-8 w-8 text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-white font-mono">Interactive Labs</h3>
            <p className="mt-2 text-gray-400 text-sm">Hands-on simulations of real-world cyber threats and defensive scenarios.</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors">
            <Lock className="h-8 w-8 text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-white font-mono">Password Hygiene</h3>
            <p className="mt-2 text-gray-400 text-sm">Visualize entropy and understand why complexity matters for security.</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors">
            <Shield className="h-8 w-8 text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-white font-mono">Phishing Defense</h3>
            <p className="mt-2 text-gray-400 text-sm">Train your eye to spot malicious emails and social engineering attempts.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
