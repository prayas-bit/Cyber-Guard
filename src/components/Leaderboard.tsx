import React, { useEffect, useState } from 'react';
import { SERVER_URL, ANON_KEY } from '../utils/supabaseClient';
import { Trophy, Medal, User, Target } from 'lucide-react';

export const Leaderboard = ({ onBack }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // The server requires the Anon Key even for public routes to pass the gateway
    fetch(`${SERVER_URL}/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
           throw new Error(`Server returned ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLeaders(data);
        } else {
          console.error("Leaderboard data is not an array:", data);
          setLeaders([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch leaderboard", err);
        setError("Failed to load leaderboard data.");
        setLeaders([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 font-mono text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">ELITE_HACKERS</h2>
              <p className="text-gray-400">Global Ranking System</p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-gray-700 hover:border-green-500 rounded text-gray-400 hover:text-green-500 transition-colors"
          >
            RETURN_TO_BASE
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-green-500 animate-pulse">
            LOADING DATA STREAMS...
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden min-h-[400px]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-gray-500 text-sm font-bold uppercase tracking-wider bg-gray-900">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-6">Operative</div>
              <div className="col-span-4 text-right">Score</div>
            </div>
            
            <div className="divide-y divide-gray-800">
              {leaders.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                   <div className="p-4 bg-gray-800 rounded-full mb-6">
                      <Target className="w-12 h-12 text-gray-600" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-300 mb-2">DATABASE EMPTY</h3>
                   <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                     No operatives have established a ranking yet. Be the first to complete a training mission and claim the <span className="text-yellow-500 font-bold">#1</span> spot on the global leaderboard.
                   </p>
                   <button 
                     onClick={onBack}
                     className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                   >
                     START FIRST MISSION
                   </button>
                </div>
              ) : (
                leaders.map((player, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                    <div className="col-span-2 flex justify-center">
                      {index === 0 ? <Medal className="w-6 h-6 text-yellow-500" /> :
                       index === 1 ? <Medal className="w-6 h-6 text-gray-400" /> :
                       index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                       <span className="text-gray-500 font-bold">#{index + 1}</span>}
                    </div>
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-bold text-white">{player.name}</span>
                    </div>
                    <div className="col-span-4 text-right font-bold text-green-400">
                      {player.totalScore} PTS
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
