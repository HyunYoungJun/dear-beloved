'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type TopStoryItem = {
    id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    category?: string | null;
    created_at: string;
};

interface TopStoryMobileCarouselProps {
    items: TopStoryItem[];
}

export default function TopStoryMobileCarousel({ items }: TopStoryMobileCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const width = scrollRef.current.offsetWidth;
            const index = Math.round(scrollLeft / width);
            setActiveIndex(index);
        }
    };

    const categoryNames: { [key: string]: string } = {
        politics: 'Politics',
        economy: 'Economy',
        culture: 'Culture',
        society: 'Society'
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="lg:hidden w-full mb-12">
            {/* Header */}
            <div className="px-4 mb-4 flex items-center justify-between">
                <span className="inline-block bg-[var(--heritage-navy)] text-white text-xs font-bold px-2 py-1">TOP STORY</span>
                <span className="text-[10px] text-[var(--heritage-gold)] tracking-widest font-bold">
                    {activeIndex + 1} / {items.length}
                </span>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4"
                style={{ scrollBehavior: 'smooth' }}
            >
                {items.map((item, index) => (
                    <Link
                        href={`/obituary/${item.id}`}
                        key={item.id}
                        className="snap-center shrink-0 w-[85vw] md:w-[60vw]"
                    >
                        <div className="bg-white border-[0.5px] border-gray-200 shadow-sm rounded-lg overflow-hidden h-full flex flex-col">
                            {/* Image (4:5 Ratio preferred by user, or close to it) */}
                            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                {item.main_image_url ? (
                                    <img
                                        src={item.main_image_url}
                                        alt={item.deceased_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
                                )}
                                {/* Category Badge Overlay */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-[var(--heritage-gold)] text-white text-[10px] font-bold px-2 py-1 shadow-sm uppercase tracking-wider">
                                        {categoryNames[item.category || 'society'] || item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1 justify-between bg-white relative">
                                {/* Decorative Corner Line */}
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-[var(--heritage-gold)]/20 rounded-tr-lg m-2"></div>

                                <div>
                                    <h3 className="font-serif font-bold text-xl leading-snug text-gray-900 mb-2 break-keep">
                                        {item.title}
                                    </h3>
                                    <p className="font-serif text-[13px] text-gray-500 mb-4">
                                        故 {item.deceased_name}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-[10px] text-gray-400 tracking-wide font-sans">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-[var(--heritage-navy)] flex items-center gap-1">
                                        Read More
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="px-4 mt-6">
                <div className="w-full h-[2px] bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--heritage-gold)] transition-all duration-300 ease-out"
                        style={{
                            width: `${((activeIndex + 1) / items.length) * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
