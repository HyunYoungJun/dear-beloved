'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { differenceInDays, parseISO, addYears, getYear, isToday as isTodayFns } from 'date-fns';

interface Obituary {
    id: string;
    deceased_name: string;
    death_date: string;
    main_image_url: string;
}

export default function MemorialCalendar() {
    const [upcomingMemorials, setUpcomingMemorials] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMemorials() {
            // 1. 수퍼베이스에서 부고 데이터 가져오기
            const { data, error } = await supabase
                .from('obituaries')
                .select('id, deceased_name, death_date, main_image_url')
                .not('death_date', 'is', null);

            if (error) {
                console.error('데이터 호출 오류:', error);
                return;
            }

            // 2. 기일 계산 및 정렬 로직
            const processed = data.map((item) => {
                const today = new Date();
                const deathDate = parseISO(item.death_date);
                const deathYear = getYear(deathDate);

                let nextAnniversary = new Date(getYear(today), deathDate.getMonth(), deathDate.getDate());

                if (nextAnniversary < today && !isTodayFns(nextAnniversary)) {
                    nextAnniversary = addYears(nextAnniversary, 1);
                }

                const daysLeft = differenceInDays(nextAnniversary, today);
                const anniversaryCount = getYear(nextAnniversary) - deathYear;

                return { ...item, daysLeft, anniversaryCount };
            })
                .sort((a, b) => a.daysLeft - b.daysLeft)
                .slice(0, 5);

            setUpcomingMemorials(processed);
            setLoading(false);
        }

        fetchMemorials();
    }, []);

    // 자동 캐러셀 로직 (5초)
    useEffect(() => {
        if (upcomingMemorials.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % upcomingMemorials.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [upcomingMemorials.length]);

    if (loading) return <div className="h-[200px] flex items-center justify-center text-xs text-gray-400">추모 기록을 불러오는 중...</div>;
    if (upcomingMemorials.length === 0) return <div className="h-[200px] flex items-center justify-center text-xs text-gray-400">등록된 추모 일정이 없습니다.</div>;

    const current = upcomingMemorials[currentIndex];

    return (
        <div className="bg-[#FDFBF7] border border-[#C5A059]/20 rounded-sm p-8 h-full flex flex-col justify-center relative overflow-hidden shadow-inner">
            {/* 배경 장식: 경건한 분위기의 로고나 문양 배치 가능 */}
            <div className="absolute top-4 right-6 text-[10px] tracking-[0.3em] text-[#C5A059]/40 font-serif uppercase">
                Memorial Calendar
            </div>

            <div className="flex items-center gap-8 animate-in fade-in slide-in-from-right-4 duration-1000">
                {/* 고인 영정 스타일 사진 */}
                <div className="relative shrink-0">
                    <img
                        src={current.main_image_url || '/placeholder.png'}
                        alt={current.deceased_name}
                        className="w-24 h-32 object-cover border border-[#C5A059]/40 grayscale-[30%] brightness-105 rounded-sm"
                    />
                    {/* 배지 시스템 */}
                    <div className="absolute -top-3 -left-3">
                        {current.daysLeft === 0 ? (
                            <span className="bg-[#C5A059] text-white text-[10px] px-2 py-1 font-bold shadow-md animate-pulse">오늘 기일</span>
                        ) : current.daysLeft === 1 ? (
                            <span className="bg-[#0A192F] text-white text-[10px] px-2 py-1 font-bold">내일 기일</span>
                        ) : (
                            <span className="bg-white border border-[#C5A059] text-[#C5A059] text-[10px] px-2 py-1 font-bold">
                                D-{current.daysLeft}
                            </span>
                        )}
                    </div>
                </div>

                {/* 기일 정보 */}
                <div className="flex-1 space-y-3">
                    <p className="text-[#C5A059] text-xs font-bold tracking-widest font-serif">
                        {current.anniversaryCount}주기 추모일
                    </p>
                    <h3 className="text-2xl font-['Nanum_Myeongjo'] font-bold text-[#0A192F]">
                        故 {current.deceased_name}
                    </h3>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">
                        {current.daysLeft === 0
                            ? "오늘은 고인께서 우리 곁을 떠나신 지 " + current.anniversaryCount + "주기가 되는 날입니다."
                            : "기일 도래까지 " + current.daysLeft + "일 남았습니다. 마음으로 준비해 주세요."}
                    </p>
                    <a href={`/obituary/${current.id}`} className="inline-block text-[10px] text-[#C5A059] font-bold border-b border-[#C5A059]/40 pb-0.5 hover:text-[#0A192F] transition-colors">
                        추모 페이지로 이동 →
                    </a>
                </div>
            </div>

            {/* 캐러셀 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {upcomingMemorials.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-[#C5A059] w-4' : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
