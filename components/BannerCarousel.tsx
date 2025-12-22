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
        icon: "弔"
    },
    {
        id: 2,
        title: "나의 삶을 기록하는\n가장 특별한 방법,",
        subtitle: "나의 메모리얼 리포트 미리쓰기",
        link: "/write",
        icon: "記"
    },
    {
        id: 3,
        title: "품격이 다른 추모,\n영원히 기억될 가치,",
        subtitle: "프리미엄 메모리얼 리포트",
        link: "/write", // Assuming generic write link for now, or update if specific page exists
        icon: "品"
    }
];

export default function BannerCarousel({ mobile = false }: { mobile?: boolean }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[current];

    // Desktop Style
    if (!mobile) {
        return (
            <Link href={slide.link} className="flex items-center gap-4 group p-4 border border-transparent hover:border-gray-100 hover:bg-stone-50 rounded-lg transition-all w-1/3 min-h-[90px]">
                <div key={slide.id + "_icon"} className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-serif font-bold text-lg shrink-0 animate-in fade-in zoom-in duration-500">
                    {slide.icon}
                </div>
                <div className="flex flex-col">
                    <span key={slide.id + "_title"} className="text-gray-900 font-serif font-bold text-sm leading-tight whitespace-pre-line animate-in slide-in-from-bottom-2 fade-in duration-500">
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
        <Link href={slide.link} className="flex items-center justify-center gap-2 mb-3 bg-stone-50 py-2 px-3 rounded-full border border-stone-100 w-fit mx-auto shadow-sm active:scale-95 transition-transform">
            <div key={slide.id + "_mb_icon"} className="w-4 h-4 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-serif font-bold text-[10px] animate-in fade-in duration-300">
                {slide.icon}
            </div>
            <span key={slide.id + "_mb_text"} className="text-xs font-bold text-stone-600 tracking-tight animate-in fade-in slide-in-from-bottom-1 duration-500">
                {slide.subtitle || slide.title.replace('\n', ' ')} <ArrowRight size={10} className="inline ml-0.5" />
            </span>
        </Link>
    );
}
