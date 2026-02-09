import React, { useState } from 'react';
import { supabase, SERVER_URL, ANON_KEY } from '../utils/supabaseClient';
import { Shield, User, Mail, Lock, Loader } from 'lucide-react';

export const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        onLogin(data.session);
      } else {
        // Sign up requires the ANON_KEY to pass the Supabase Gateway check
        const response = await fetch(`${SERVER_URL}/signup`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ANON_KEY}`
          },
          body: JSON.stringify(formData)
        });
        
        let data;
        const text = await response.text();
        
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse server response:", text);
          throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}`);
        }
        
        if (!response.ok) {
          throw new Error(data.error || data.message || `Signup failed with status ${response.status}`);
        }

        // Auto login after signup
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) throw loginError;
        onLogin(loginData.session);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-green-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
            <Shield className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white font-mono">
            {isLogin ? 'SYSTEM_ACCESS' : 'NEW_OPERATIVE'}
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm">
            {isLogin ? 'Enter credentials to access mainframe.' : 'Register to begin training.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-sm font-mono break-words">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Codename"
                className="w-full bg-black border border-gray-700 rounded p-3 pl-10 text-white focus:border-green-500 focus:outline-none font-mono"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-black border border-gray-700 rounded p-3 pl-10 text-white focus:border-green-500 focus:outline-none font-mono"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-gray-700 rounded p-3 pl-10 text-white focus:border-green-500 focus:outline-none font-mono"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded font-mono transition-colors flex items-center justify-center"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : (isLogin ? 'AUTHENTICATE' : 'INITIALIZE')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-gray-400 hover:text-green-400 text-sm font-mono underline"
          >
            {isLogin ? 'Need an account? Register' : 'Already have credentials? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
