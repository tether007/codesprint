
"use client";
import { useState, useEffect, CSSProperties } from 'react'; // Added useState, useEffect
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false); // New state to handle hydration

  useEffect(() => {
    setHasMounted(true); // Triggers once the component is on the client
  }, []);
  
  const handleJoinClick = () => {
    router.push('/auth'); 
  };

  const containerStyle: CSSProperties = {
    backgroundColor: '#000',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1000px',
    position: 'relative',
  };

  const textStyle: CSSProperties = {
    fontSize: 'clamp(5rem, 18vw, 12rem)',
    fontWeight: '900',
    color: '#ff0000',
    fontFamily: '"Impact", "Archivo Black", sans-serif',
    lineHeight: '0.8',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    transform: 'rotateX(20deg) rotateZ(-5deg) skewX(-10deg)',
    filter: 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.7))',
    position: 'relative',
    zIndex: 10,
    marginTop: '-15vh', 
  } as any;

  return (
    <div style={containerStyle}>
      {/* BACKGROUND: Horizontal Red Glitch Streams */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
        {/* Only render random particles after mounting to prevent Hydration Mismatch */}
        {hasMounted && [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ 
              x: '100vw', 
              opacity: [0, 0.6, 0] 
            }}
            transition={{ 
              duration: Math.random() + 8, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random()  
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

        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, #200 0%, transparent 80%)',
            zIndex: -1
          } as any}
        />
      </div>

      {/* THE MAIN TEXT */}
      <motion.div
        initial={{ scale: 2, opacity: 0, rotateY: 90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ position: 'relative' }}
      >
        <h1 style={textStyle}>
          CODE<br />
          <span style={{ color: '#fff', textShadow: '0 0 20px #ff0000' }}>SPRINT</span><span style={{ color: '#888888', textShadow: '0 0 20px #5e0000' }}>4.0</span>
        </h1>
        
        <h1 style={{
          ...textStyle,
          position: 'absolute',
          top: '100%',
          left: 0,
          transform: 'rotateX(180deg) rotateZ(-5deg) skewX(-10deg) translateY(20px)',
          opacity: 0.1,
          background: 'linear-gradient(to bottom, #ff0000, transparent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        } as any}>
          CODE<br />SPRINT
        </h1>
      </motion.div>

      {/* THE CRAZY BUTTON */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{ marginTop: '80px', zIndex: 20 }}
      >
        <motion.button
          onClick={handleJoinClick}
          whileHover={{ 
            scale: 1.1, 
            boxShadow: "0px 0px 40px #ff0000",
            letterSpacing: "0.2em"
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '20px 50px',
            fontSize: '1.2rem',
            fontWeight: '900',
            background: 'transparent',
            color: '#fff',
            border: '2px solid #ff0000',
            textTransform: 'uppercase',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)', 
          } as any}
        >
          <motion.div
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 0, 0, 0.3)',
              zIndex: -1,
            }}
          />
          GET STARTED
        </motion.button>
      </motion.div>

      <div style={{
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 200px #000, inset 0 0 100px rgba(255,0,0,0.3)',
        pointerEvents: 'none'
      } as any} />
    </div>
  );
}