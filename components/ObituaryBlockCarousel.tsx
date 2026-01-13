'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ObituarySummary {
    id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    death_date: string | null;
    created_at: string;
    category?: string | null;
}

interface ObituaryBlockCarouselProps {
    obituaries: ObituarySummary[];
    title?: string;
}

export default function ObituaryBlockCarousel({ obituaries, title = "최근 부고" }: ObituaryBlockCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const ITEMS_PER_GROUP = 5;
    const groups = [];
    for (let i = 0; i < obituaries.length; i += ITEMS_PER_GROUP) {
        groups.push(obituaries.slice(i, i + ITEMS_PER_GROUP));
    }

    const nextSlide = () => {
        if (currentIndex < groups.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0); // loop back to start
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(groups.length - 1); // loop to end
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-gray-100 text-gray-900 text-xs font-bold px-2 py-1 border border-gray-300">
                    {title}
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={prevSlide}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-stone-50 border border-stone-100 flex-1 relative overflow-hidden group">
                <div
                    className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {groups.map((group, groupIndex) => (
                        <div key={groupIndex} className="w-full flex-shrink-0 p-4 grid grid-rows-5 gap-3 h-full">
                            {group.map((item) => (
                                <Link
                                    href={`/obituary/${item.id}`}
                                    key={item.id}
                                    className="flex items-center gap-3 group/item hover:bg-white p-2 rounded-lg transition-colors border border-transparent hover:border-gray-100 hover:shadow-sm"
                                >
                                    {/* Thumbnail Image (Fingernail size approx 40px) */}
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                                        {item.main_image_url ? (
                                            <img
                                                src={item.main_image_url}
                                                alt={item.deceased_name}
                                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">No img</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between mb-0.5">
                                            <h4 className="text-sm  font-bold text-gray-900 truncate group-hover/item:text-[var(--heritage-navy)] transition-colors">
                                                {item.deceased_name}
                                            </h4>
                                            <span className="text-[10px] text-gray-400 shrink-0">
                                                {item.death_date ? new Date(item.death_date).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate font-light">
                                            {item.title}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {/* Fill empty spots if last group has fewer than 5 items */}
                            {[...Array(ITEMS_PER_GROUP - group.length)].map((_, i) => (
                                <div key={`empty-${i}`} className="p-2 opacity-0 pointer-events-none">
                                    <div className="h-10"></div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
                {groups.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${currentIndex === idx
                            ? 'bg-[var(--heritage-navy)] w-3'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
