'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type NewsItem = {
    id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    death_date?: string | null;
    created_at: string;
};

interface CategoryNewsRotationProps {
    categories: { [key: string]: NewsItem[] };
}

const CATEGORY_ORDER = ['politics', 'economy', 'culture', 'society'];
const CATEGORY_TITLES: { [key: string]: string } = {
    politics: 'Politics & Public Service',
    economy: 'Economy & Business',
    culture: 'Culture & Arts',
    society: 'Family & Society'
};

export default function CategoryNewsRotation({ categories }: CategoryNewsRotationProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter out empty categories
    const availableCategories = CATEGORY_ORDER.filter(cat => categories[cat] && categories[cat].length > 0);

    useEffect(() => {
        if (availableCategories.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % availableCategories.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [availableCategories.length]);

    if (availableCategories.length === 0) return null;

    const currentCategory = availableCategories[currentIndex];
    const items = categories[currentCategory].slice(0, 4); // Show up to 4 items

    return (
        <div className="lg:hidden w-full mb-8 px-4">
            {/* Header / Indicator */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-[var(--heritage-navy)] tracking-wider uppercase border-l-2 border-[var(--heritage-gold)] pl-2">
                    {CATEGORY_TITLES[currentCategory].split('&')[0]} NEWS
                </h3>
                <div className="flex gap-1">
                    {availableCategories.map((cat, idx) => (
                        <div
                            key={cat}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-[var(--heritage-gold)]' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[320px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {items.map((item) => (
                            <Link href={`/obituary/${item.id}`} key={item.id} className="flex gap-3 group">
                                {/* Thumbnail */}
                                <div className="w-[100px] h-[75px] rounded-lg overflow-hidden shrink-0 relative bg-gray-100 shadow-sm border border-gray-100">
                                    {item.main_image_url ? (
                                        <img
                                            src={item.main_image_url}
                                            alt={item.deceased_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                                    <div>
                                        <h4 className="text-[15px] font-bold text-gray-900 leading-tight mb-1 line-clamp-2 break-keep group-hover:underline decoration-[var(--heritage-gold)] underline-offset-4">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {item.deceased_name && `故 ${item.deceased_name}`}
                                            {item.death_date && ` · ${new Date(item.death_date).getFullYear()}`}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
