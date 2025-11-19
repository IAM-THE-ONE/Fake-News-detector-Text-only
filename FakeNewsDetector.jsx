import React, { useState, useEffect } from 'react';
import { Moon, Sun, Shield, LogOut, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

export default function FakeNewsDetector() {
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  // Detection states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedApiKey = localStorage.getItem('openrouter_api_key') || '';
    setTheme(savedTheme);
    setApiKey(savedApiKey);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const saveApiKey = () => {
    localStorage.setItem('openrouter_api_key', apiKey);
    setShowApiInput(false);
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setCurrentUser({ email: loginEmail });
      setIsLoggedIn(true);
      setCurrentPage('detector');
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerName && registerEmail && registerPassword) {
      setCurrentUser({ name: registerName, email: registerEmail });
      setIsLoggedIn(true);
      setCurrentPage('detector');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
    setTitle('');
    setDescription('');
    setResult(null);
  };

  const analyzeNews = async () => {
    if (!title || !description) {
      setError('Please enter both title and description');
      return;
    }

    if (!apiKey) {
      setError('Please set your OpenRouter API key first');
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const combinedText = `${title}. ${description}`;
      
      // Call your backend server instead of Hugging Face
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: combinedText,
          apiKey: apiKey
        })
      });

      if (!response.ok) {
        throw new Error('Server request failed');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Parse the AI response
      const aiResponse = data.result.toLowerCase();
      const isFake = aiResponse.includes('fake') && !aiResponse.includes('not fake');
      
      // Try to extract confidence percentage
      const confidenceMatch = aiResponse.match(/(\d+)%/);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;

      setResult({
        classification: isFake ? "FAKE" : "REAL",
        confidence: confidence,
        reasoning: data.result
      });

    } catch (err) {
      setError(err.message || 'Failed to analyze. Please check your setup and try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900';
  const borderClass = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${bgClass} transition-colors duration-300 flex items-center justify-center p-4`}>
        <div className={`${cardBg} rounded-2xl shadow-2xl p-8 w-full max-w-md`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Shield className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
              <h1 className={`text-2xl font-bold ${textClass}`}>TruthGuard</h1>
            </div>
            <button onClick={toggleTheme} className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCurrentPage('login')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                currentPage === 'login'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                currentPage === 'register'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {currentPage === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClass}`}>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className={`w-full px-4 py-3 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClass}`}>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className={`w-full px-4 py-3 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClass}`}>Full Name</label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClass}`}>Email</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClass}`}>Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRegister(e)}
                  className={`w-full px-4 py-3 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleRegister}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <nav className={`${cardBg} shadow-lg`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
            <h1 className={`text-2xl font-bold ${textClass}`}>TruthGuard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`${textSecondary} text-sm hidden sm:block`}>Welcome, {currentUser?.name || currentUser?.email}</span>
            <button onClick={toggleTheme} className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* API Key Setup Card */}
        {showApiInput && (
          <div className={`${cardBg} rounded-2xl shadow-2xl p-6 mb-6 border-2 border-blue-500`}>
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${textClass}`}>Setup Required: OpenRouter API Key</h3>
                <p className={`${textSecondary} text-sm mb-4`}>
                  To use the fake news detector, you need a free OpenRouter API key:
                </p>
                <ol className={`${textSecondary} text-sm space-y-2 mb-4 list-decimal list-inside`}>
                  <li>Go to <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">openrouter.ai/keys</a></li>
                  <li>Create a new API key (free tier available)</li>
                  <li>Copy and paste it below</li>
                </ol>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                  <button
                    onClick={saveApiKey}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${cardBg} rounded-2xl shadow-2xl p-8`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${textClass}`}>Fake News Detector</h2>
              <p className={`${textSecondary}`}>Enter a news headline and description to analyze its authenticity</p>
            </div>
            {apiKey && (
              <button
                onClick={() => setShowApiInput(!showApiInput)}
                className={`text-sm px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                {showApiInput ? 'Hide' : 'API Key'}
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>News Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="Enter the news headline..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${borderClass} ${inputBg} focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none`}
                placeholder="Enter the news description or summary..."
              />
            </div>

            <button
              onClick={analyzeNews}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                'Analyze News'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className={`mt-8 p-6 rounded-xl ${
              result.classification === 'FAKE' 
                ? 'bg-red-50 border-2 border-red-300' 
                : 'bg-green-50 border-2 border-green-300'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.classification === 'FAKE' ? (
                  <XCircle size={32} className="text-red-600" />
                ) : (
                  <CheckCircle size={32} className="text-green-600" />
                )}
                <div>
                  <h3 className={`text-2xl font-bold ${
                    result.classification === 'FAKE' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {result.classification}
                  </h3>
                  <p className={`text-sm ${
                    result.classification === 'FAKE' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    Confidence: {result.confidence}%
                  </p>
                </div>
              </div>
              <p className={`${
                result.classification === 'FAKE' ? 'text-red-800' : 'text-green-800'
              }`}>
                <strong>Analysis:</strong> {result.reasoning}
              </p>
            </div>
          )}
        </div>

        <div className={`mt-8 ${cardBg} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-lg font-bold mb-3 ${textClass}`}>How it works</h3>
          <ul className={`space-y-2 ${textSecondary} text-sm`}>
            <li>• Uses GPT-4 AI model via OpenRouter for advanced analysis</li>
            <li>• Analyzes linguistic patterns, sensationalism, and credibility indicators</li>
            <li>• Provides confidence score based on AI assessment</li>
            <li>• Powered by OpenRouter's API with free tier access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}