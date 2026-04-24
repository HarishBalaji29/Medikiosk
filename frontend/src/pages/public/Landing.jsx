import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing() {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/login')
    }

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                cursor: 'pointer',
                overflow: 'hidden',
                background: '#000',
            }}
        >
            {/* Full-screen login image */}
            <img
                src="/login-bg.png"
                alt="MediKiosk Login"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    opacity: 1,
                }}
                draggable={false}
            />

            {/* Left-side brand overlay */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '8%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '14px',
                    pointerEvents: 'none',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Logo (Cropped to circle, centered over text) */}
                    <motion.img
                        src="/medikiosk-logo.png"
                        alt="MediKiosk Logo"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.1 }}
                        style={{
                            width: 'clamp(90px, 11vw, 150px)',
                            height: 'clamp(90px, 11vw, 150px)',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            mixBlendMode: 'lighten',
                            filter: 'drop-shadow(0 0 18px rgba(56,200,255,0.7))',
                            userSelect: 'none',
                            pointerEvents: 'none',
                            marginBottom: '6px',
                        }}
                        draggable={false}
                    />

                    {/* Brand name */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        style={{
                            margin: 0,
                            fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                            fontFamily: '"Inter", system-ui, sans-serif',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#ffffff',
                            textShadow: '0 0 30px rgba(56,200,255,0.5), 0 4px 20px rgba(0,0,0,0.8)',
                            lineHeight: 1,
                        }}
                    >
                        Medi<span style={{ color: '#38c8ff' }}>Kiosk</span>
                    </motion.h1>
                </div>

                {/* Divider line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #38c8ff, transparent)',
                        transformOrigin: 'left',
                        borderRadius: '1px',
                    }}
                />

                {/* Catchy tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.7 }}
                    style={{
                        margin: 0,
                        fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)',
                        fontFamily: '"Inter", system-ui, sans-serif',
                        fontWeight: 500,
                        fontStyle: 'italic',
                        color: 'rgba(56, 200, 255, 0.9)',
                        textShadow: '0 0 16px rgba(56,200,255,0.4), 0 2px 10px rgba(0,0,0,0.9)',
                        letterSpacing: '0.04em',
                        lineHeight: 1.5,
                        maxWidth: '380px',
                    }}
                >
                    "Your Health, Our Priority —<br />Smarter Care at Every Step"
                </motion.p>
            </motion.div>

            {/* Bottom "tap anywhere" hint */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '2.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'fadeInUp 1.2s ease both',
                    pointerEvents: 'none',
                }}
            >
                <span
                    style={{
                        color: 'rgba(255,255,255,0.80)',
                        fontSize: '1rem',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                >
                    Tap anywhere to continue
                </span>
                {/* animated chevron */}
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.70)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: 'bounce 1.5s ease-in-out infinite' }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; }
                    50%       { opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(6px); }
                }
            `}</style>
        </div>
    )
}
