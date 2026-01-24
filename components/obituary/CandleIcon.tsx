'use client';

import { motion } from 'framer-motion';

interface CandleIconProps {
    isOn: boolean;
    opacity?: number;
    className?: string;
}

export default function CandleIcon({ isOn, opacity = 1, className = "" }: CandleIconProps) {
    return (
        <div className={`relative ${className} flex items-end justify-center`}>
            {/* Candle Base (Photo) */}
            <div className="relative w-full h-full flex items-end justify-center">
                <img
                    src="/candle-off.png"
                    alt="Candle"
                    className="h-full object-contain object-bottom drop-shadow-sm"
                    style={{ filter: isOn ? 'brightness(1.1)' : 'brightness(0.8) grayscale(0.5)' }}
                />
            </div>

            {/* Flame Animation (Only visible if isOn) */}
            {isOn && (
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full h-[60%] pointer-events-none flex justify-center items-end pb-[50%]">
                    {/* 1. Outer Glow (Large Blur) */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.4, 0.3], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[150%] h-[150%] bg-orange-500/20 rounded-full blur-xl -translate-y-1/2"
                    />

                    {/* 2. Flame Container (Flicker & Wind) */}
                    <motion.div
                        animate={{
                            scaleY: [1, 1.15, 0.95, 1.05, 1],
                            rotate: [0, 2, -2, 1, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                            times: [0, 0.4, 0.6, 0.8, 1]
                        }}
                        className="relative w-[40%] h-[80%] origin-bottom"
                    >
                        {/* 3. Main Flame Body (Orange Gradient) */}
                        <div
                            className="absolute inset-0 rounded-[50%_50%_35%_35%] bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-200 blur-[1px]"
                            style={{ borderRadius: '50% 50% 40% 40% / 70% 70% 30% 30%' }}
                        />

                        {/* 4. Inner Core (Bright Yellow/White) */}
                        <motion.div
                            animate={{ height: ["60%", "70%", "60%"] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[50%] bg-white rounded-full opacity-90 blur-[2px]"
                            style={{ borderRadius: '50% 50% 40% 40% / 80% 80% 20% 20%' }}
                        />

                        {/* 5. Blue Base (Hot) */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[15%] bg-blue-500/60 rounded-full blur-[2px]" />
                    </motion.div>
                </div>
            )}
        </div>
    );
}
