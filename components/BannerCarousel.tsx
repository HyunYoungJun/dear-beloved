'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        title: "사랑하는 사람의\n마지막 떠나는 길,",
        subtitle: "메모리얼 기사와 함께하세요",
        link: "/write",
        icon: "弔",
        thumbs: "stone"
    },
    {
        id: 2,
        title: "나의 삶을 기록하는\n가장 특별한 방법,",
        subtitle: "나의 메모리얼 리포트 미리쓰기",
        link: "/write",
        icon: "記",
        thumbs: "emerald"
    },
    {
        id: 3,
        title: "품격이 다른 추모,\n영원히 기억될 가치,",
        subtitle: "프리미엄 메모리얼 리포트",
        link: "/write",
        icon: "品",
        thumbs: "slate"
    }
];

const THEMES: Record<string, any> = {
    stone: {
        desktop: "bg-stone-50 hover:bg-stone-100 border-transparent hover:border-gray-200",
        icon: "bg-stone-800 text-white",
        mobile: "bg-stone-100 border-stone-200",
        mobileIcon: "bg-white text-stone-700 border border-stone-100"
    },
    emerald: {
        desktop: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100 hover:border-emerald-200",
        icon: "bg-emerald-700 text-white",
        mobile: "bg-emerald-50 border-emerald-100",
        mobileIcon: "bg-white text-emerald-700 border border-emerald-100"
    },
    slate: {
        desktop: "bg-slate-50 hover:bg-slate-100 border-slate-100 hover:border-slate-200",
        icon: "bg-slate-700 text-white",
        mobile: "bg-slate-50 border-slate-100",
        mobileIcon: "bg-white text-slate-700 border border-slate-100"
    }
};

export default function BannerCarousel({ mobile = false }: { mobile?: boolean }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[current];
    const theme = THEMES[slide.thumbs];

    // Desktop Style
    if (!mobile) {
        return (
            <Link href={slide.link} className={`flex items-center gap-4 group p-4 border rounded-lg transition-all duration-500 w-1/3 min-h-[90px] ${theme.desktop}`}>
                <div key={slide.id + "_icon"} className={`w-10 h-10 rounded-full flex items-center justify-center  font-bold text-lg shrink-0 animate-in fade-in zoom-in duration-500 ${theme.icon}`}>
                    {slide.icon}
                </div>
                <div className="flex flex-col">
                    <span key={slide.id + "_title"} className="text-gray-900  font-bold text-sm leading-tight whitespace-pre-line animate-in slide-in-from-bottom-2 fade-in duration-500">
                        {slide.title}
                    </span>
                    <span key={slide.id + "_sub"} className="text-gray-500 text-xs mt-1 animate-in slide-in-from-bottom-1 fade-in duration-700">
                        {slide.subtitle} <ArrowRight size={10} className="inline ml-1" />
                    </span>
                </div>
            </Link>
        );
    }

    // Mobile Style (Dense & Compact)
    return (
        <Link href={slide.link} key={slide.id + "_mobile"} className={`flex items-center justify-center gap-3 mb-4 py-3 px-6 rounded-full border w-[90%] mx-auto shadow-md active:scale-95 transition-all duration-500 overflow-hidden ${theme.mobile}`}>
            <div key={slide.id + "_mb_icon"} className={`w-8 h-8 rounded-full flex items-center justify-center  font-bold text-sm shrink-0 animate-in fade-in zoom-in duration-500 ${theme.mobileIcon}`}>
                {slide.icon}
            </div>
            <span key={slide.id + "_mb_text"} className="text-sm font-bold text-stone-700 tracking-tight animate-in fade-in slide-in-from-right-10 duration-700 whitespace-nowrap">
                {slide.subtitle || slide.title.replace('\n', ' ')} <ArrowRight size={14} className="inline ml-1" />
            </span>
        </Link>
    );
}
