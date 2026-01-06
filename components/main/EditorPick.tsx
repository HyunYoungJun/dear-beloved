'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ObituarySummary = {
    id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    death_date: string | null;
    content: string | null;
    created_at: string;
};

export default function EditorPick({ data }: { data: ObituarySummary[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        if (!data || data.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % data.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [data]);

    const handleNext = () => {
        if (!data) return;
        setCurrentIndex((prev) => (prev + 1) % data.length);
    };

    const handlePrev = () => {
        if (!data) return;
        setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    };

    if (!data || data.length === 0) {
        return (
            <div className="p-10 text-center text-gray-400 bg-gray-100 h-full min-h-[300px] flex items-center justify-center rounded-lg">
                등록된 기사가 없습니다.
            </div>
        );
    }

    const currentItem = data[currentIndex];

    return (
        <div className="relative group w-full overflow-hidden bg-white">
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <Link href={`/obituary/${currentItem.id}`} className="block">
                            {/* Image Container */}
                            <div className="aspect-video w-full bg-gray-100 mb-4 overflow-hidden shadow-sm relative rounded-sm">
                                {currentItem.main_image_url ? (
                                    <img
                                        src={currentItem.main_image_url}
                                        alt={currentItem.deceased_name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 text-sm">
                                        No Image
                                    </div>
                                )}
                                {/* Badge Overlay */}
                                <div className="absolute top-3 left-3 bg-[#0A192F] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                    Editor's Pick
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-1">
                                <h3 className="text-xl font-serif font-bold leading-snug mb-2 text-gray-900 group-hover:text-[#0A192F] transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {currentItem.title}
                                </h3>
                                <p className="text-sm text-gray-600 font-sans leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
                                    {currentItem.content?.substring(0, 100)}...
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                    <h4 className="text-sm font-bold text-gray-800">
                                        {currentItem.deceased_name}
                                    </h4>
                                    <span className="text-xs text-gray-400">
                                        {new Date(currentItem.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Hover visible on Desktop, Always visible on mobile if needed or rely on dots) */}
                <button
                    onClick={(e) => { e.preventDefault(); handlePrev(); }}
                    className="absolute top-1/2 -left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); handleNext(); }}
                    className="absolute top-1/2 -right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {data.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#0A192F] w-4' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
