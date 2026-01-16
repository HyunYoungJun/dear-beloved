'use client';

import { motion } from 'framer-motion';

interface IncenseIconProps {
    isBurning: boolean;
    className?: string;
}

export default function IncenseIcon({ isBurning, className = "" }: IncenseIconProps) {
    return (
        <div className={`relative ${className} flex items-center justify-center`} style={{ width: '48px', height: '48px' }}>
            {/* Incense Burner (Tripod/Bronze Style) - Scaled Up */}
            <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
            >
                {/* Legs */}
                <path d="M6 17L5 20" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M18 17L19 20" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M12 17L12 20" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />

                {/* Bowl */}
                <path
                    d="M4 11C4 11 4 17 12 17C20 17 20 11 20 11"
                    stroke={isBurning ? "#D1D5DB" : "#9CA3AF"}
                    strokeWidth="1.2"
                    fill={isBurning ? "url(#burnerGradient)" : "none"} // Darker fill when burning
                />
                <defs>
                    <linearGradient id="burnerGradient" x1="4" y1="11" x2="20" y2="17" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#374151" />
                        <stop offset="1" stopColor="#111827" />
                    </linearGradient>
                </defs>

                <path d="M4 11H20" stroke="#9CA3AF" strokeWidth="1.2" />

                {/* Sticks */}
                <path d="M12 11V7" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M10 11V8" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M14 11V8" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />

                {/* Ember (Red tip when burning) */}
                {isBurning && (
                    <motion.circle
                        cx="12" cy="7" r="1.5"
                        fill="#EF4444"
                        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </svg>

            {/* Ultra High Quality Smoke Animation */}
            {isBurning && (
                <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 pointer-events-none w-[100px] h-[150px] overflow-visible flex justify-center items-end">
                    {/* Multiple smoke particles for fluid dynamics simulation */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 0, x: 0, scale: 0.2, filter: 'blur(2px)' }}
                            animate={{
                                opacity: [0, 0.3, 0.1, 0],
                                y: -120, // Rise higher
                                x: [
                                    0,
                                    (i % 2 === 0 ? 10 : -10) + (Math.random() * 20 - 10), // Random drift
                                    (i % 2 === 0 ? -15 : 15) // Swirl back
                                ],
                                scale: [0.5, 2.5, 4], // Expand significantly
                                filter: ['blur(2px)', 'blur(8px)', 'blur(15px)'] // Dissolve into air
                            }}
                            transition={{
                                duration: 8 + Math.random() * 4, // Long duration
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 1.5, // Staggered start
                                times: [0, 0.2, 0.8, 1]
                            }}
                            className="absolute bottom-[40px] w-6 h-6 rounded-full bg-blue-100/30 blend-screen"
                            style={{ background: 'radial-gradient(circle, rgba(200,210,230,0.5) 0%, rgba(150,160,180,0) 70%)' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
