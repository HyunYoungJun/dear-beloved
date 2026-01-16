'use client';

import { motion } from 'framer-motion';

interface IncenseIconProps {
    isBurning: boolean;
    className?: string;
}

export default function IncenseIcon({ isBurning, className = "" }: IncenseIconProps) {
    return (
        <div className={`relative ${className} w-6 h-6 flex items-center justify-center`}>
            {/* Incense Burner (Tripod/Bronze Style) */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
            >
                {/* Legs */}
                <path d="M6 17L5 20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M18 17L19 20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 17L12 20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

                {/* Bowl */}
                <path
                    d="M4 11C4 11 4 17 12 17C20 17 20 11 20 11"
                    stroke={isBurning ? "#D1D5DB" : "#9CA3AF"}
                    strokeWidth="1.5"
                    fill={isBurning ? "#4B5563" : "none"} // Darker fill when burning
                />
                <path d="M4 11H20" stroke="#9CA3AF" strokeWidth="1.5" />

                {/* Sticks */}
                <path d="M12 11V7" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 11V8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 11V8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

                {/* Ember (Red tip when burning) */}
                {isBurning && (
                    <circle cx="12" cy="7" r="1" fill="#EF4444" className="animate-pulse" />
                )}
            </svg>

            {/* Smoke Animation */}
            {isBurning && (
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 pointer-events-none w-10 h-20 overflow-visible flex justify-center">
                    {/* Multiple smoke particles for realistic effect */}
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, x: 0, scale: 0.5 }}
                            animate={{
                                opacity: [0, 0.4, 0],
                                y: -30 - (i * 10),
                                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                                scale: 2
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5
                            }}
                            className="absolute bottom-0 w-2 h-2 rounded-full bg-gray-300 blur-sm"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
