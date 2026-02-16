"use client";
import { useState, useEffect, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Fixes the Hydration error by ensuring random values only run on client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const containerStyle: CSSProperties = {
    backgroundColor: '#000',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'monospace',
  };

  const cardStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    width: 'min(450px, 90vw)',
    padding: '40px',
    background: 'rgba(5, 0, 0, 0.95)',
    border: '1px solid #ff0000',
    clipPath: 'polygon(0% 20px, 20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%)',
    boxShadow: '0 0 50px rgba(255, 0, 0, 0.1)',
  } as any;

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '15px',
    margin: '10px 0',
    background: '#111',
    border: '1px solid #222',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    borderLeft: '4px solid #300', // Dimmer red base
    transition: 'all 0.3s ease',
    fontFamily: 'monospace',
  };

  const btnStyle: CSSProperties = {
    width: '100%',
    padding: '18px',
    marginTop: '25px',
    backgroundColor: '#ff0000',
    color: '#000',
    fontWeight: '900',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
  } as any;

  // Shared animation props for inputs
  const inputAnimate = {
    whileHover: { 
      borderLeft: '4px solid #ff0000',
      backgroundColor: '#161616',
      boxShadow: '0 0 15px rgba(255, 0, 0, 0.1)'
    },
    whileFocus: { 
      borderLeft: '4px solid #ff0000',
      backgroundColor: '#1a1a1a',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
      borderColor: '#444'
    }
  };

  return (
    <div style={containerStyle}>
      {/* BACKGROUND PARTICLES */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {hasMounted && [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: '100vw', opacity: [0, 0.6, 0] }}
            transition={{ 
              duration: Math.random() * 5 + 8, // Calm speed
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`, 
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #ff0000, #fff, transparent)',
              filter: 'blur(1px)',
            } as any}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#ff0000', fontSize: '2rem', fontFamily: 'Impact, sans-serif', textTransform: 'uppercase' }}>
            {isLogin ? 'AUTH_REQUIRED' : 'NEW_IDENT_REG'}
          </h2>
          <div style={{ height: '2px', width: '50px', background: '#fff', marginTop: '5px' }}></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {!isLogin && (
              <motion.input 
                type="text" 
                placeholder="[ HANDLE_NAME ]" 
                style={inputStyle} 
                {...inputAnimate}
              />
            )}

            <motion.input
              type="email"
              placeholder="[ EMAIL_NODE ]"
              style={inputStyle}
              {...inputAnimate}
            />

            <motion.input
              type="password"
              placeholder="[ SECURE_KEY ]"
              style={inputStyle}
              {...inputAnimate}
            />
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#ff0000' }}
              whileTap={{ scale: 0.95 }}
              style={btnStyle}
            >
              {isLogin ? 'ACCESS TERMINAL' : 'INITIALIZE REGISTRY'}
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <motion.p 
          onClick={() => setIsLogin(!isLogin)}
          whileHover={{ color: '#fff' }}
          style={{ 
            color: '#555', 
            textAlign: 'center', 
            marginTop: '30px', 
            fontSize: '0.75rem', 
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '4px'
          } as any}
        >
          {isLogin ? "FIRST SPRINT? CREATE_NEW_IDENTITY" : "ALREADY REGISTERED? BYPASS_TO_LOGIN"}
        </motion.p>
      </motion.div>

      <div style={{
        position: 'absolute',
        bottom: '-10%',
        width: '100%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(255,0,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      } as any} />
    </div>
  );
}