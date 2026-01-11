'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { differenceInDays, parseISO, addYears, getYear, isToday as isTodayFns } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, ArrowUpDown, Calendar } from 'lucide-react';

type MemorialItem = {
    id: string;
    deceased_name: string;
    death_date: string; // ISO string
    main_image_url: string | null;
    birth_date?: string | null;

    // Calculated fields
    daysLeft: number;
    anniversaryCount: number;
    nextAnniversary: Date;
};

export default function MemorialCalendarPage() {
    const [memorials, setMemorials] = useState<MemorialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortMode, setSortMode] = useState<'closest' | 'recent' | 'past'>('closest');

    useEffect(() => {
        async function fetchData() {
            // Fetch all obituaries that have a death date
            const { data, error } = await supabase
                .from('obituaries')
                .select('id, deceased_name, death_date, main_image_url, birth_date')
                .not('death_date', 'is', null)
                .neq('service_type', 'overseas'); // Filter out overseas

            if (data) {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today

                const processed = data.map((item) => {
                    const deathDate = parseISO(item.death_date);
                    deathDate.setHours(0, 0, 0, 0);

                    // Calculate Next Anniversary
                    const currentYear = getYear(today);
                    let nextAnniv = new Date(currentYear, deathDate.getMonth(), deathDate.getDate());

                    // If this year's anniversary has passed (and it's not today), move to next year
                    // Note: If it IS today, we keep it as today.
                    if (nextAnniv < today) {
                        nextAnniv = addYears(nextAnniv, 1);
                    }

                    const daysLeft = differenceInDays(nextAnniv, today);
                    const anniversaryCount = getYear(nextAnniv) - getYear(deathDate);

                    return {
                        ...item,
                        daysLeft,
                        anniversaryCount,
                        nextAnniversary: nextAnniv,
                    };
                });

                setMemorials(processed);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    // Sorting Logic
    const sortedMemorials = [...memorials].sort((a, b) => {
        if (sortMode === 'closest') {
            // Priority: Smallest daysLeft (0 is today, 1 is tomorrow...)
            // Secondary: Recent death date if daysLeft is same?
            if (a.daysLeft === b.daysLeft) {
                return new Date(b.death_date).getTime() - new Date(a.death_date).getTime();
            }
            return a.daysLeft - b.daysLeft;
        } else if (sortMode === 'recent') {
            // Newest death date first
            return new Date(b.death_date).getTime() - new Date(a.death_date).getTime();
        } else {
            // Oldest death date first
            return new Date(a.death_date).getTime() - new Date(b.death_date).getTime();
        }
    });

    if (loading) {
        return <div className="min-h-screen bg-stone-50 flex items-center justify-center text-gray-400">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#C5A059]/30 px-4 py-4 flex items-center justify-between">
                <Link href="/" className="p-2 -ml-2 text-[#0A192F]">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-serif font-bold text-lg text-[#0A192F] tracking-tight">추모 캘린더</h1>
                <div className="w-8" />{/* Spacer for centering */}
            </header>

            {/* Filter / Sort Controls */}
            <div className="px-4 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setSortMode('closest')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${sortMode === 'closest'
                        ? 'bg-[#0A192F] text-white shadow-md'
                        : 'bg-white border border-[#0A192F]/20 text-gray-600'
                        }`}
                >
                    추모일 임박순 ({memorials.length})
                </button>
                <button
                    onClick={() => setSortMode('recent')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${sortMode === 'recent'
                        ? 'bg-[#0A192F] text-white shadow-md'
                        : 'bg-white border border-[#0A192F]/20 text-gray-600'
                        }`}
                >
                    최신순
                </button>
                <button
                    onClick={() => setSortMode('past')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${sortMode === 'past'
                        ? 'bg-[#0A192F] text-white shadow-md'
                        : 'bg-white border border-[#0A192F]/20 text-gray-600'
                        }`}
                >
                    과거순
                </button>
            </div>

            {/* List */}
            <div className="px-4 flex flex-col gap-4">
                {sortedMemorials.map((item, index) => (
                    <Link href={`/obituary/${item.id}`} key={item.id} className="block">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#C5A059]/20 flex gap-4 active:scale-[0.98] transition-transform">
                            {/* Photo */}
                            <div className="w-[80px] h-[100px] shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-inner relative">
                                {item.main_image_url ? (
                                    <img
                                        src={item.main_image_url}
                                        alt={item.deceased_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">No Image</div>
                                )}
                                {/* D-Day Badge on Photo */}
                                <div className="absolute top-0 left-0 w-full text-center">
                                    {item.daysLeft === 0 ? (
                                        <div className="bg-[#C5A059] text-white text-[10px] font-bold py-0.5">Today</div>
                                    ) : item.daysLeft <= 7 ? (
                                        <div className="bg-red-500/90 text-white text-[10px] font-bold py-0.5">D-{item.daysLeft}</div>
                                    ) : (
                                        <div className="bg-black/50 text-white text-[10px] py-0.5">D-{item.daysLeft}</div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[#C5A059] text-xs font-bold tracking-wide uppercase">
                                        {item.anniversaryCount}주기
                                    </span>
                                    {item.daysLeft === 0 && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                </div>

                                <h2 className="text-lg font-bold text-[#0A192F] font-serif mb-1 truncate">
                                    故 {item.deceased_name}
                                </h2>

                                <div className="text-sm text-gray-500 flex flex-col gap-0.5">
                                    <p>
                                        <span className="text-gray-400 text-xs mr-1">기일</span>
                                        {new Date(item.death_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        ({item.birth_date ? getYear(parseISO(item.birth_date)) : '?'} - {getYear(parseISO(item.death_date))})
                                    </p>
                                </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex items-center text-gray-300">
                                <ArrowLeft size={16} className="rotate-180" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {sortedMemorials.length === 0 && (
                <div className="py-20 text-center text-gray-400 text-sm">
                    등록된 추모 정보가 없습니다.
                </div>
            )}
        </main>
    );
}
