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

            <div className="flex-1 relative overflow-hidden rounded-lg bg-[#FDFBF7] border border-[#C5A059]/20 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-0 md:min-h-[400px]">
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
                            <div className="p-4 md:p-8 h-full flex flex-col md:items-center md:justify-center relative z-10">
                                {/* Desktop Quote Icons (Hidden on Mobile) */}
                                <Quote className="hidden md:block absolute top-6 left-6 w-8 h-8 text-[#C5A059]/20" />

                                {/* MOBILE HEADER: Photo + Info Row */}
                                <div className="flex items-center gap-3 mb-4 md:hidden border-b border-[#C5A059]/10 pb-3">
                                    {/* Mobile Photo */}
                                    <div className="w-12 h-12 rounded-full border border-[#C5A059]/40 p-0.5 shrink-0">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                                            {currentItem.main_image_url ? (
                                                <img
                                                    src={currentItem.main_image_url}
                                                    alt={currentItem.deceased_name}
                                                    className="w-full h-full object-cover grayscale"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">👤</div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Mobile Info */}
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm font-bold text-[#0A192F]">故 {currentItem.deceased_name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-serif">
                                            {currentItem.death_date ? new Date(currentItem.death_date).getFullYear() : ''} 별세
                                        </span>
                                    </div>
                                </div>

                                {/* DESKTOP PHOTO (Center Large) */}
                                <div className="hidden md:block w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#C5A059]/30 p-1 mb-6 group-hover:border-[#C5A059] transition-colors">
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

                                {/* QUOTE CONTENT */}
                                <div className="w-full mb-0 md:mb-6 relative">
                                    {/* Mobile: Sacred Box Style */}
                                    <div className="md:contents block relative p-5 md:p-0 rounded-[4px] border border-[#C5A059]/60 md:border-none bg-gradient-to-b from-[#FFFDF9] to-[#F7F3EA] md:bg-none">

                                        {/* Quote Mark for Mobile Box */}
                                        <Quote className="md:hidden absolute top-3 left-3 w-4 h-4 text-[#C5A059]/40" />

                                        <p className="text-base md:text-xl text-[#0A192F] font-medium leading-relaxed break-keep relative z-10 font-['Nanum_Myeongjo'] md:font-['Malgun_Gothic'] text-center md:text-center pt-2 md:pt-0 line-clamp-4 md:line-clamp-3">
                                            "{currentItem.biography_data.quote}"
                                        </p>
                                    </div>
                                </div>

                                {/* DESKTOP INFO (Bottom Center) */}
                                <div className="hidden md:block mt-auto text-center">
                                    <p className="text-sm text-[#C5A059] font-bold tracking-widest uppercase">
                                        故 {currentItem.deceased_name}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        {currentItem.death_date ? new Date(currentItem.death_date).getFullYear() : ''} 별세
                                    </p>
                                </div>

                                <Quote className="hidden md:block absolute bottom-6 right-6 w-8 h-8 text-[#C5A059]/20 rotate-180" />
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
