'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { differenceInDays, parseISO, addYears, getYear, isToday as isTodayFns } from 'date-fns';

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
                .slice(0, 6); // 2명씩 짝을 맞추기 위해 6명까지 가져옵니다.

            setMemorials(processed);
            setLoading(false);
        }
        fetchMemorials();
    }, []);

    // 5초 간격으로 2명씩 전환 (0,1 -> 2,3 -> 4,5)
    useEffect(() => {
        if (memorials.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 2) % (Math.ceil(memorials.length / 2) * 2));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [memorials.length]);

    if (loading || memorials.length === 0) return <div className="h-full bg-[#FDFBF7] animate-pulse" />;

    // 현재 화면에 보여줄 2명 선택
    const visibleItems = memorials.slice(currentIndex % memorials.length, (currentIndex % memorials.length) + 2);

    return (
        <div className="bg-[#FDFBF7] border border-[#C5A059]/20 rounded-sm p-6 h-full flex flex-col justify-between relative overflow-hidden">
            <div className="text-[10px] tracking-[0.3em] text-[#C5A059]/40 font-serif mb-4 uppercase text-right">
                Memorial Calendar
            </div>

            <div className="flex-1 flex flex-col gap-6">
                {visibleItems.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-5 animate-in fade-in slide-in-from-right-4 duration-700">
                        {/* 고인 사진 */}
                        <div className="relative shrink-0">
                            <img
                                src={item.main_image_url || '/placeholder.png'}
                                className="w-16 h-20 object-cover border border-[#C5A059]/30 rounded-sm"
                            />
                            <div className="absolute -top-2 -left-2 scale-75">
                                {item.daysLeft === 0 ? (
                                    <span className="bg-[#C5A059] text-white text-[9px] px-1.5 py-0.5 font-bold shadow-sm">오늘 기일</span>
                                ) : (
                                    <span className="bg-white border border-[#C5A059] text-[#C5A059] text-[9px] px-1.5 py-0.5 font-bold shadow-sm">
                                        D-{item.daysLeft}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 정보 영역 */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[#C5A059] text-[9px] font-bold tracking-wider">{item.anniversaryCount}주기 추모일</p>
                            <h3 className="text-lg font-bold text-[#0A192F] truncate">故 {item.deceased_name}</h3>
                            <button
                                onClick={() => window.location.href = `/obituary/${item.id}`}
                                className="mt-1 text-[9px] text-[#C5A059] border-b border-[#C5A059]/30 pb-0.5"
                            >
                                추모 페이지로 이동 →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 인디케이터 (2명씩 묶음 기준) */}
            <div className="mt-4 flex justify-center gap-1.5">
                {Array.from({ length: Math.ceil(memorials.length / 2) }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 h-1 rounded-full transition-all ${i === Math.floor(currentIndex / 2) ? 'bg-[#C5A059] w-3' : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
