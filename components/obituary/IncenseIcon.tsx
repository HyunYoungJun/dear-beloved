'use client';

import { motion } from 'framer-motion';

interface IncenseIconProps {
    isBurning: boolean;
    className?: string;
}

export default function IncenseIcon({ isBurning, className = "" }: IncenseIconProps) {
    return (
        <div className={`relative ${className} flex items-center justify-center`} style={{ width: '64px', height: '64px' }}>
            {/* Incense Burner Photo */}
            <img
                src="/incense-burner.jpg"
                alt="Incense Burner"
                className="w-full h-full object-contain drop-shadow-md"
            />

            {/* Ember (Red tip when burning) - Positioned at tip of sticks in photo */}
            {isBurning && (
                <motion.div
                    className="absolute top-[20%] left-[50%] -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full blur-[1px] shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}

            {/* Ultra High Quality Smoke Animation */}
            {isBurning && (
                <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 pointer-events-none w-[120px] h-[160px] overflow-visible flex justify-center items-end">
                    {/* Multiple smoke particles for fluid dynamics simulation */}
                    {[...Array(8)].map((_, i) => ( // Increased particle count
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, x: 0, scale: 0.3, filter: 'blur(4px)' }}
                            animate={{
                                opacity: [0, 0.4, 0.2, 0], // Smooth fade in/out
                                y: -140, // Rise higher
                                x: [
                                    0,
                                    (i % 2 === 0 ? 15 : -15) + (Math.random() * 10 - 5), // Wider graceful drift
                                    (i % 2 === 0 ? -10 : 10) // Gentle swirl back
                                ],
                                scale: [0.5, 2.0, 3.5], // Expand significantly as it rises
                                filter: ['blur(4px)', 'blur(10px)', 'blur(20px)'] // Dissolve into air
                            }}
                            transition={{
                                duration: 5 + Math.random() * 3, // Varied duration for natural feel
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.8, // Staggered start
                                times: [0, 0.2, 0.7, 1]
                            }}
                            className="absolute bottom-[25px] w-8 h-8 rounded-full bg-gray-200/40 blend-screen" // Base color of smoke
                            style={{
                                background: 'radial-gradient(circle, rgba(220,225,235,0.6) 0%, rgba(180,185,195,0) 70%)',
                                mixBlendMode: 'screen'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
