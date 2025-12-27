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

export default function EditorPick({ data }: { data: ObituarySummary | null }) {
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
                <h3 className="text-xl font-serif font-bold leading-snug mb-3 group-hover:underline cursor-pointer">
                    {data.title}
                </h3>
                <p className="text-sm text-gray-600 font-serif leading-relaxed mb-6 line-clamp-2">
                    {data.content?.substring(0, 100)}...
                </p>
                <div className="aspect-video bg-gray-100 mb-4 overflow-hidden shadow-md">
                    {data.main_image_url ? (
                        <img
                            src={data.main_image_url}
                            alt={data.deceased_name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 text-sm">이미지 없음</div>
                    )}
                </div>
                <h4 className="text-lg font-serif font-bold leading-tight mb-1 group-hover:underline cursor-pointer">
                    {data.deceased_name}
                </h4>
                <div className="text-xs text-gray-400 mb-2">
                    {new Date(data.created_at).toLocaleDateString()}
                </div>
            </div>
        </Link>
    );
}
