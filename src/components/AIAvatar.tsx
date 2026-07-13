import React from 'react';
import { motion } from 'framer-motion';

interface AIAvatarProps {
  state?: 'idle' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg';
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ state = 'idle', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-9 w-9',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
  };

  const ringSpeed = state === 'thinking' ? 2 : state === 'speaking' ? 3 : 6;

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} select-none pointer-events-none`}>
      {/* Outer Hologram Ambient Glow */}
      <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
        state === 'thinking' 
          ? 'bg-indigo-500/20 scale-110' 
          : state === 'speaking' 
          ? 'bg-emerald-500/20 scale-105' 
          : 'bg-blue-500/10'
      }`} />

      {/* Orbiting Ring 1 (Dotted) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: ringSpeed, ease: "linear" }}
        className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-500 ${
          state === 'thinking' 
            ? 'border-indigo-400/40' 
            : state === 'speaking' 
            ? 'border-emerald-450/40' 
            : 'border-blue-500/25'
        }`}
      />

      {/* Orbiting Ring 2 (Reversed) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: ringSpeed * 1.5, ease: "linear" }}
        className={`absolute -inset-1.5 rounded-full border border-dotted transition-colors duration-500 ${
          state === 'thinking' 
            ? 'border-purple-400/30' 
            : state === 'speaking' 
            ? 'border-teal-400/30' 
            : 'border-emerald-500/20'
        }`}
      />

      {/* Pulsing Core */}
      <motion.div
        animate={state === 'thinking' ? {
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        } : state === 'speaking' ? {
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9]
        } : {
          scale: [1, 1.02, 1],
          opacity: [0.75, 0.85, 0.75]
        }}
        transition={{ repeat: Infinity, duration: state === 'thinking' ? 1.2 : 2.5, ease: "easeInOut" }}
        className={`absolute inset-1.5 rounded-full p-[1.5px] shadow-lg transition-all duration-500 ${
          state === 'thinking'
            ? 'bg-gradient-to-tr from-indigo-600 via-purple-500 to-teal-400 shadow-indigo-500/20'
            : state === 'speaking'
            ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-blue-400 shadow-emerald-500/20'
            : 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 shadow-blue-500/15'
        }`}
      >
        <div className="h-full w-full rounded-full bg-[#090c16] flex items-center justify-center overflow-hidden">
          {/* Holographic Face Shape */}
          <svg viewBox="0 0 100 100" className={`w-[70%] h-[70%] fill-none stroke-current transition-colors duration-500 ${
            state === 'thinking' 
              ? 'text-indigo-400' 
              : state === 'speaking' 
              ? 'text-emerald-400' 
              : 'text-blue-400'
          }`} strokeWidth="3">
            {/* Futuristic Head Outline */}
            <path d="M30,35 C30,22 70,22 70,35 C70,55 60,75 50,75 C40,75 30,55 30,35 Z" strokeOpacity="0.8" />
            
            {/* Eyes */}
            <motion.ellipse 
              cx="41" cy="42" rx="3.5" ry="3.5" 
              animate={state === 'thinking' ? {
                ry: [3.5, 0.5, 3.5],
                rx: [3.5, 3.5, 3.5]
              } : {
                ry: [3.5, 0.5, 3.5]
              }}
              transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 2 }}
              className="fill-current"
            />
            <motion.ellipse 
              cx="59" cy="42" rx="3.5" ry="3.5" 
              animate={state === 'thinking' ? {
                ry: [3.5, 0.5, 3.5],
                rx: [3.5, 3.5, 3.5]
              } : {
                ry: [3.5, 0.5, 3.5]
              }}
              transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 2 }}
              className="fill-current"
            />

            {/* Speaking Mouth Shapes */}
            <motion.path 
              d="M42,57 Q50,57 58,57" 
              animate={state === 'speaking' ? {
                d: [
                  "M42,57 Q50,63 58,57",
                  "M42,57 Q50,51 58,57",
                  "M42,57 Q50,59 58,57"
                ]
              } : state === 'thinking' ? {
                d: "M46,57 H54"
              } : {
                d: "M42,57 Q50,58 58,57"
              }}
              transition={{ repeat: Infinity, duration: 0.35 }}
              strokeLinecap="round"
            />

            {/* HUD Scanline */}
            <motion.line
              x1="22" y1="20" x2="78" y2="20"
              animate={{
                y1: [20, 76, 20],
                y2: [20, 76, 20]
              }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
              strokeOpacity="0.25"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </motion.div>

      {/* Floating Sound Waves (only in speaking state) */}
      {state === 'speaking' && (
        <div className="absolute -bottom-3 flex gap-0.7 items-center justify-center">
          <motion.div animate={{ height: [3, 9, 3] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-emerald-400 rounded-sm" />
          <motion.div animate={{ height: [5, 12, 5] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-0.5 bg-teal-400 rounded-sm" />
          <motion.div animate={{ height: [3, 9, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-emerald-400 rounded-sm" />
        </div>
      )}
    </div>
  );
};
