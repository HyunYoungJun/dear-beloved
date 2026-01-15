'use client';

import { motion } from 'framer-motion';

interface CandleIconProps {
    isOn: boolean;
    opacity?: number;
    className?: string;
}

export default function CandleIcon({ isOn, opacity = 1, className = "" }: CandleIconProps) {
    return (
        <div className={`relative ${className} w-6 h-6 flex items-center justify-center`}>
            {/* Candle Base (Stick) */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-0"
            >
                <path
                    d="M12 11V21M12 21C14.2091 21 16 20.1046 16 19V14C16 12.8954 14.2091 12 12 12C9.79086 12 8 12.8954 8 14V19C8 20.1046 9.79086 21 12 21Z"
                    fill={isOn ? "#E5E7EB" : "#9CA3AF"} // Light gray when on, Darker gray when off
                    stroke={isOn ? "#9CA3AF" : "#6B7280"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Wick */}
                <path d="M12 9V11" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            {/* Flame (Only visible if isOn) */}
            {isOn && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: [1, 1.1, 0.95, 1.05, 1],
                        opacity: opacity, // Controlled by 24h timer logic
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-2px]" // Adjust position to sit on wick
                    style={{ pointerEvents: 'none' }}
                >
                    {/* Flame Core */}
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.00001 0C7.00001 0 0.5 8 0.5 13C0.5 16.5 3.5 18 7.00001 18C10.5 18 13.5 16.5 13.5 13C13.5 8 7.00001 0 7.00001 0Z"
                            fill="url(#flameGradient)"
                        />
                        <defs>
                            <radialGradient id="flameGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7 13) rotate(90) scale(5 6.5)">
                                <stop stopColor="#FFF7ED" /> {/* Warm white/yellow center */}
                                <stop offset="0.4" stopColor="#FCD34D" /> {/* Yellow */}
                                <stop offset="0.8" stopColor="#F97316" /> {/* Orange */}
                                <stop offset="1" stopColor="#EF4444" stopOpacity="0.8" /> {/* Reddish outer */}
                            </radialGradient>
                        </defs>
                    </svg>

                    {/* Flame Glow (Outer Blur) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-6 bg-orange-400 rounded-full blur-[8px] opacity-40"></div>
                </motion.div>
            )}
        </div>
    );
}
