import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RegisterVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Missing email. Please register again.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/user/verify-code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, purpose: 'register' }) // ✅ Include purpose here
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/registered-success');
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
        style={{ fontFamily: 'Futura, sans-serif' }}
      >
        <h2 className="text-2xl font-bold text-center text-black">Verify</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="5-letter Code"
          maxLength={5}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring text-center tracking-widest uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full border border-gray-400 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Back to Register
        </button>
      </form>
    </div>
  );
};

export default RegisterVerify;
