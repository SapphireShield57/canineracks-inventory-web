import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisteredSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6 text-center"
        style={{ fontFamily: 'Futura, sans-serif' }}
      >
        <h1 className="text-3xl font-bold text-black">CanineRacks</h1>
        <p className="text-lg text-gray-700">Registered Successfully!</p>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RegisteredSuccess;
