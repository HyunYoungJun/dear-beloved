'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const MESSAGES = [
    {
        id: 1,
        content: (
            <span>
                추모는 <span className="text-[#C5A059] font-bold">디어˚빌럽</span>에서
            </span>
        ),
        sub: null
    },
    {
        id: 2,
        content: (
            <div className="flex flex-col items-end">
                <span className="text-sm text-gray-300 font-medium mb-1">대한민국 대표 추모 플랫폼</span>
                <span className="text-xl font-black text-[#C5A059] tracking-tight">Dear˚Beloved</span>
            </div>
        ),
        sub: null
    }
];

export default function BrandPromoBanner({ className = "" }: { className?: string }) {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 3500); // 3.5s interval

        return () => clearInterval(timer);
    }, [isHovered]);

    return (
        <Link
            href="/about"
            className={`relative overflow-hidden bg-[#0F172A] rounded-lg shadow-sm border border-gray-800 flex items-center justify-end px-6 group cursor-pointer transition-colors duration-500 hover:bg-[#152038] hover:border-[#C5A059]/30 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Texture Effect (Subtle) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none"></div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex flex-col text-right"
                >
                    <div className="text-white text-base font-medium font-['Malgun_Gothic']">
                        {MESSAGES[index].content}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Hover Indicator */}
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight size={14} className="text-[#C5A059]" />
            </div>
        </Link>
    );
}
