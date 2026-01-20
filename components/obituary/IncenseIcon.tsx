'use client';

import { motion } from 'framer-motion';

interface IncenseIconProps {
    isBurning: boolean;
    className?: string;
}

export default function IncenseIcon({ isBurning, className = "" }: IncenseIconProps) {
    return (
        <div className={`relative ${className} flex items-center justify-center`} style={{ width: '54px', height: '54px' }}>
            {/* Incense Burner Photo - Adjusted Size (85% of 64px ≈ 54.4px) */}
            <img
                src="/incense-burner-clean.png"
                alt="Incense Burner"
                className="w-full h-full object-contain drop-shadow-md"
            />

            {/* Ember (Red tip when burning) - Positioned at tip of sticks in photo */}
            {isBurning && (
                <motion.div
                    className="absolute top-[28%] left-[50%] -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full blur-[1px] shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    animate={{ opacity: [0.6, 1, 0.6], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}

            {/* White Winding Smoke Animation */}
            {isBurning && (
                <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 pointer-events-none w-[100px] h-[200px] overflow-visible flex justify-center items-end">
                    {/* Multiple smoke particles for winding effect */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 0, x: 0, scale: 0.2, filter: 'blur(2px)' }}
                            animate={{
                                opacity: [0, 0.6, 0.4, 0], // Smooth fade in/out
                                y: -160, // Rise high
                                x: [
                                    0,
                                    (i % 2 === 0 ? 15 : -15) + (Math.random() * 10 - 5), // Winding movement
                                    (i % 2 === 0 ? -10 : 10),
                                    (i % 2 === 0 ? 5 : -5)
                                ],
                                scale: [0.3, 1.5, 3], // Start small, expand
                                filter: ['blur(2px)', 'blur(5px)', 'blur(8px)'] // Soften as it rises
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2, // Varied duration
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5, // Continuous stream
                            }}
                            className="absolute bottom-[35px] w-2 h-8 rounded-full bg-white/60" // Elongated initial shape for stream look
                            style={{
                                mixBlendMode: 'screen',
                                background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
