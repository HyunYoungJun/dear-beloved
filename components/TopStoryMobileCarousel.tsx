'use client';

import { useState, useRef } from 'react';
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
        <div className="lg:hidden w-full mb-8">
            {/* Header */}
            <div className="px-4 mb-3 flex items-center justify-between">
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
                {items.map((item) => (
                    <Link
                        href={`/obituary/${item.id}`}
                        key={item.id}
                        className="snap-center shrink-0 w-[85vw] md:w-[60vw]"
                    >
                        <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-md">
                            {/* Background Image */}
                            {item.main_image_url ? (
                                <img
                                    src={item.main_image_url}
                                    alt={item.deceased_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                                <span className="text-[10px] text-[var(--heritage-gold)] font-bold tracking-widest mb-2 uppercase">
                                    {categoryNames[item.category || 'society'] || item.category}
                                </span>
                                <h3 className="font-serif font-bold text-xl leading-snug text-white mb-1 break-keep tracking-wide">
                                    {item.title}
                                </h3>
                                <p className="font-serif text-sm text-gray-300">
                                    故 {item.deceased_name}
                                </p>
                            </div>

                            {/* Decorative Border */}
                            <div className="absolute inset-0 border-[0.5px] border-white/20 rounded-lg pointer-events-none"></div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="px-4 mt-5">
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
