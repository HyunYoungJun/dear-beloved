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

            {/* Continuous Thin Winding Smoke Animation */}
            {isBurning && (
                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 pointer-events-none w-[60px] h-[140px] overflow-visible flex justify-center items-end">
                    {/* Continuous stream of thin smoke particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 0, x: 0, scale: 0.5, filter: 'blur(1px)' }}
                            animate={{
                                opacity: [0, 0.8, 0.6, 0], // Stay visible longer
                                y: -120, // Rise steadily
                                x: [
                                    0,
                                    Math.sin(i) * 5 + (Math.random() * 4 - 2), // Winding motion
                                    Math.cos(i) * 8 + (Math.random() * 4 - 2),
                                    Math.sin(i) * 12 + (Math.random() * 4 - 2)
                                ],
                                scale: [1, 1.5, 2.5], // Stay relatively thin, expand slowly
                                filter: ['blur(1px)', 'blur(3px)', 'blur(6px)']
                            }}
                            transition={{
                                duration: 3.5, // Standard duration
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.175, // Very tight spacing for continuous line effect
                            }}
                            className="absolute bottom-[35px] w-[1.5px] h-6 bg-white/80 rounded-full" // Very thin width (1.5px)
                            style={{
                                mixBlendMode: 'screen',
                                background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
