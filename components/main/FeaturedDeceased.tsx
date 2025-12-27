'use client';

import Link from 'next/link';

type ObituarySummary = {
    id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    death_date: string | null;
    service_type?: string | null;
    category?: string | null;
    content: string | null;
    created_at: string;
};

const categoryNames: { [key: string]: string } = {
    politics: 'Politics & Public Service',
    economy: 'Economy & Business',
    culture: 'Culture & Arts',
    society: 'Family & Society'
};

export default function FeaturedDeceased({ data }: { data: ObituarySummary | null }) {
    if (!data) {
        return (
            <div className="p-10 text-center text-gray-400 bg-gray-100 h-full flex items-center justify-center">
                등록된 기사가 없습니다.
            </div>
        );
    }

    return (
        <Link href={`/obituary/${data.id}`} className="block group">
            {/* Desktop Layout (Large Card) */}
            <div className="hidden lg:block">
                <div className="aspect-[4/3] bg-gray-200 mb-4 overflow-hidden relative">
                    {data.main_image_url ? (
                        <img
                            src={data.main_image_url}
                            alt={data.deceased_name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-sm">이미지 없음</div>
                    )}
                </div>
                <h2 className="text-2xl font-serif font-bold leading-tight mb-2 group-hover:underline cursor-pointer text-[#0A192F]">
                    {data.title}
                </h2>
                <div className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
                    {new Date(data.created_at).toLocaleDateString()} | {categoryNames[data.category || 'society'] || data.category}
                </div>
                <p className="text-sm text-gray-600 font-serif leading-relaxed line-clamp-4">
                    {data.content?.substring(0, 150) || "고인의 평안한 안식을 빕니다."}...
                </p>
            </div>
        </Link>
    );
}
