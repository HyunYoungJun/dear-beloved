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
    birth_date?: string | null;
    service_type?: string | null;
    category?: string | null;
    content: string | null;
    created_at: string;
};

const categoryNames: { [key: string]: string } = {
    politics: 'Politics & Public Service',
    economy: 'Economy & Business',
    culture: 'Culture & Arts',
    society: 'Family & Society'
};

export default function FeaturedDeceased({ data }: { data: ObituarySummary[] }) {
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
                등록된 고인이 없습니다.
            </div>
        );
    }

    const currentItem = data[currentIndex];

    return (
        <div className="relative group w-full overflow-hidden bg-white h-full">
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Link href={`/obituary/${currentItem.id}`} className="block h-full">
                            {/* Mobile Label */}
                            <div className="lg:hidden flex items-center gap-2 mb-2">
                                <span className="w-1 h-3.5 bg-[#0A192F]"></span>
                                <span className="text-sm font-bold text-[#0A192F] uppercase tracking-tighter">오늘의 고인</span>
                            </div>

                            {/* Image Container */}
                            <div className="aspect-[4/3] lg:aspect-[4/3] w-full bg-gray-200 mb-4 overflow-hidden relative shadow-sm rounded-sm">
                                {currentItem.main_image_url ? (
                                    <img
                                        src={currentItem.main_image_url}
                                        alt={currentItem.deceased_name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-sm">이미지 없음</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-1 h-full">
                                <h2 className="text-xl lg:text-2xl font-serif font-bold leading-tight mb-2 text-[#0A192F] group-hover:text-blue-900 transition-colors break-keep">
                                    {currentItem.title}
                                </h2>

                                <div className="hidden lg:block text-xs text-gray-400 mb-3 uppercase tracking-wide">
                                    {currentItem.birth_date ? new Date(currentItem.birth_date).getFullYear() : ''}
                                    {currentItem.birth_date ? ' ~ ' : ''}
                                    {currentItem.death_date ? new Date(currentItem.death_date).toLocaleDateString() : ''} | {categoryNames[currentItem.category || 'society'] || currentItem.category}
                                </div>

                                <p className="lg:hidden text-sm text-[#0A192F]/80 font-medium font-serif mt-1">
                                    故 {currentItem.deceased_name}
                                </p>
                                <p className="lg:hidden text-xs text-gray-400 mt-1">
                                    {currentItem.birth_date ? `${new Date(currentItem.birth_date).getFullYear()} ~ ` : ''}
                                    {currentItem.death_date ? new Date(currentItem.death_date).toLocaleDateString() : ''} 별세
                                </p>

                                <p className="text-sm text-gray-600 font-serif leading-relaxed line-clamp-4 lg:line-clamp-4 mt-2 text-justify break-keep">
                                    {currentItem.content?.substring(0, 150) || "고인의 평안한 안식을 빕니다."}...
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.preventDefault(); handlePrev(); }}
                    className="absolute top-[35%] -left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); handleNext(); }}
                    className="absolute top-[35%] -right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6 lg:mt-4">
                {data.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#C5A059] w-4' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
