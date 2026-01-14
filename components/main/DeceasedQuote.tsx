'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ObituarySummary = {
    id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    death_date: string | null;
    birth_date?: string | null;
    biography_data?: any;
    content: string | null;
    created_at: string;
};

interface DeceasedQuoteProps {
    items: ObituarySummary[];
}

export default function DeceasedQuote({ items }: DeceasedQuoteProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotation
    useEffect(() => {
        if (!items || items.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [items]);

    const hasData = items && items.length > 0;
    const currentItem = hasData ? items[currentIndex] : null;

    if (!hasData || !currentItem || !currentItem.biography_data?.quote) {
        return (
            <div className="h-full min-h-[300px] bg-[#F9F9F9] rounded-lg flex items-center justify-center text-gray-400 text-sm">
                <p>등록된 명언이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#C5A059] pl-3 uppercase mb-4 text-[#0A192F]">
                고인의 명언
            </h2>

            <div className="flex-1 relative overflow-hidden rounded-lg bg-[#FDFBF7] border border-[#C5A059]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.id} // Key change triggers animation
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0"
                    >
                        <Link href={`/obituary/${currentItem.id}`} className="block h-full w-full group">
                            <div className="p-8 h-full flex flex-col items-center justify-center text-center relative z-10">
                                <Quote className="absolute top-6 left-6 w-8 h-8 text-[#C5A059]/20" />

                                {/* Photo */}
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#C5A059]/30 p-1 mb-6 group-hover:border-[#C5A059] transition-colors">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                                        {currentItem.main_image_url ? (
                                            <img
                                                src={currentItem.main_image_url}
                                                alt={currentItem.deceased_name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center leading-tight">No Image</div>
                                        )}
                                    </div>
                                </div>

                                {/* Quote */}
                                <div className="mb-6 relative w-full">
                                    <p className="text-lg md:text-xl text-[#0A192F] font-medium leading-relaxed break-keep relative z-10 font-['Malgun_Gothic'] line-clamp-3">
                                        "{currentItem.biography_data.quote}"
                                    </p>
                                </div>

                                {/* Name */}
                                <div className="mt-auto">
                                    <p className="text-sm text-[#C5A059] font-bold tracking-widest uppercase">
                                        故 {currentItem.deceased_name}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        {currentItem.death_date ? new Date(currentItem.death_date).getFullYear() : ''} 별세
                                    </p>
                                </div>

                                <Quote className="absolute bottom-6 right-6 w-8 h-8 text-[#C5A059]/20 rotate-180" />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#C5A059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </Link>
                    </motion.div>
                </AnimatePresence>

                {/* Indicators (only if multiple) */}
                {items.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {items.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#C5A059] w-3' : 'bg-[#C5A059]/30'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
