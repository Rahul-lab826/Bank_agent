import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080c18] text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 animate-pulse">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-3xl text-white tracking-tight">404</h1>
          <h2 className="font-display font-semibold text-lg text-slate-200">Terminal Route Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            The requested page does not exist on our secure financial node network. Please return to your active digital banking terminal.
          </p>
        </div>

        <div className="pt-2">
          <Button 
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-full justify-center bg-blue-600 hover:bg-blue-500"
          >
            Return to Active Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
