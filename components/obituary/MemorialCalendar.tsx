'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { differenceInDays, parseISO, addYears, getYear, isToday as isTodayFns } from 'date-fns';
import Link from 'next/link'; // 링크 기능을 위해 추가

export default function MemorialCalendar() {
    const [memorials, setMemorials] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMemorials() {
            const { data, error } = await supabase
                .from('obituaries')
                .select('id, deceased_name, death_date, main_image_url')
                .not('death_date', 'is', null);

            if (error) return;

            const processed = data.map((item) => {
                const today = new Date();
                const deathDate = parseISO(item.death_date);
                const nextAnniversary = isTodayFns(new Date(getYear(today), deathDate.getMonth(), deathDate.getDate()))
                    ? new Date(getYear(today), deathDate.getMonth(), deathDate.getDate())
                    : (new Date(getYear(today), deathDate.getMonth(), deathDate.getDate()) < today
                        ? addYears(new Date(getYear(today), deathDate.getMonth(), deathDate.getDate()), 1)
                        : new Date(getYear(today), deathDate.getMonth(), deathDate.getDate()));

                return {
                    ...item,
                    daysLeft: differenceInDays(nextAnniversary, today),
                    anniversaryCount: getYear(nextAnniversary) - getYear(deathDate)
                };
            })
                .sort((a, b) => a.daysLeft - b.daysLeft)
                .slice(0, 6);

            setMemorials(processed);
            setLoading(false);
        }
        fetchMemorials();
    }, []);

    useEffect(() => {
        if (memorials.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 2) % (Math.ceil(memorials.length / 2) * 2));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [memorials.length]);

    if (loading || memorials.length === 0) return <div className="h-full bg-[#FDFBF7] animate-pulse" />;

    const visibleItems = memorials.slice(currentIndex % memorials.length, (currentIndex % memorials.length) + 2);

    return (
        <div className="bg-[#FDFBF7] border border-[#C5A059]/20 rounded-sm p-6 h-full flex flex-col justify-between relative overflow-hidden">
            <div className="text-[10px] tracking-[0.3em] text-[#C5A059]/40 font-serif mb-4 uppercase text-right">
                Memorial Calendar
            </div>

            <div className="flex-1 flex flex-col gap-8">
                {visibleItems.map((item) => (
                    // 카드 전체에 링크 적용
                    <Link
                        key={item.id}
                        href={`/obituary/${item.id}`}
                        className="flex items-center gap-6 group cursor-pointer hover:bg-black/[0.02] transition-colors p-2 -m-2 rounded-sm"
                    >
                        {/* 고인 사진: 크기를 2배로 확대 (w-32 h-40) */}
                        <div className="relative shrink-0">
                            <img
                                src={item.main_image_url || '/placeholder.png'}
                                className="w-32 h-40 object-cover border border-[#C5A059]/30 rounded-sm shadow-sm transition-transform group-hover:scale-[1.02]"
                            />
                            <div className="absolute -top-2 -left-2 scale-100">
                                {item.daysLeft === 0 ? (
                                    <span className="bg-[#C5A059] text-white text-[10px] px-2 py-0.5 font-bold shadow-sm">오늘 기일</span>
                                ) : (
                                    <span className="bg-white border border-[#C5A059] text-[#C5A059] text-[10px] px-2 py-0.5 font-bold shadow-sm">
                                        D-{item.daysLeft}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 정보 영역 */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[#C5A059] text-xs font-bold tracking-wider mb-1">{item.anniversaryCount}주기 추모일</p>
                            <h3 className="text-xl font-bold text-[#0A192F] truncate mb-2">故 {item.deceased_name}</h3>
                            <p className="text-sm text-gray-500 font-light">기일 도래까지 {item.daysLeft}일 남았습니다.</p>
                            <span className="mt-3 inline-block text-[10px] text-[#C5A059] border-b border-[#C5A059]/30 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                추모 페이지로 이동 →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-4 flex justify-center gap-1.5">
                {Array.from({ length: Math.ceil(memorials.length / 2) }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === Math.floor(currentIndex / 2) ? 'bg-[#C5A059] w-4' : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
