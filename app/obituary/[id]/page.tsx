'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { ArrowLeft, Quote } from 'lucide-react';

type ObituaryDetail = {
    id: string;
    user_id: string;
    deceased_name: string;
    birth_date: string | null;
    death_date: string | null;
    title: string;
    content: string | null;
    main_image_url: string | null;
    biography_data?: any; // Added to access quote
    timeline_data?: any;
};

import TimelineViewer from '@/components/obituary/TimelineViewer';
import MemoryWall from '@/components/obituary/MemoryWall';



export default function ObituaryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [obituary, setObituary] = useState<ObituaryDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchObituary();
        }
    }, [id]);

    async function fetchObituary() {
        const { data, error } = await supabase
            .from('obituaries')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching obituary:', error);
            alert('기사를 찾을 수 없거나 접근 권한이 없습니다.');
            router.push('/library');
        } else {
            setObituary(data);
        }
        setLoading(false);
    }



    if (loading) return <div className="min-h-screen flex items-center justify-center font-serif">불러오는 중...</div>;
    if (!obituary) return null;

    const quote = obituary.biography_data?.quote;

    return (
        <article className="min-h-screen bg-[#F9F9F9] font-serif pb-32">
            {/* Header Image */}
            <div className="w-full h-[50vh] md:h-[60vh] relative">
                {obituary.main_image_url ? (
                    <img
                        src={obituary.main_image_url}
                        alt={obituary.deceased_name}
                        className="w-full h-full object-cover grayscale brightness-75"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                        사진 없음
                    </div>
                )}

                {/* Navigation Overlay */}
                <div className="absolute top-0 left-0 w-full p-6 z-20">
                    <Link href="/library" className="inline-flex items-center text-white/80 hover:text-white transition-colors bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <ArrowLeft size={18} className="mr-2" /> 목록으로
                    </Link>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-block border border-white/30 px-3 py-1 rounded-full text-xs md:text-sm mb-4 bg-white/10 backdrop-blur-md">
                            메모리얼
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-normal font-['Nanum_Myeongjo']">
                            {obituary.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 font-light">
                            故 {obituary.deceased_name} 님 | {obituary.birth_date} ~ {obituary.death_date}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 bg-white shadow-sm -mt-10 relative z-10 rounded-t-lg">

                {/* Deceased's Quote (Calligraphy Style) */}
                {quote && (
                    <div className="mb-16 text-center px-4 py-8 border-y border-gray-100 bg-gray-50/50">
                        <Quote className="w-8 h-8 mx-auto text-gray-300 mb-4 opacity-50" />
                        <p className="text-2xl md:text-3xl text-gray-800 leading-normal font-['Gowun_Batang'] break-keep">
                            "{quote}"
                        </p>
                    </div>
                )}

                {/* Biography Content */}
                <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-loose whitespace-pre-wrap font-['Nanum_Myeongjo'] mb-20 text-justify">
                    {obituary.content}
                </div>

                {/* Life Timeline Section */}
                {obituary.timeline_data && Array.isArray(obituary.timeline_data) && obituary.timeline_data.length > 0 && (
                    <div className="mb-20">
                        <TimelineViewer events={obituary.timeline_data} />
                    </div>
                )}

                {/* Edit/Delete Controls */}
                {user && (user.id === obituary.user_id || user.email === 'youngjun88@gmail.com') && (
                    <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-100">
                        <button
                            onClick={async () => {
                                if (confirm('정말 삭제하시겠습니까?')) {
                                    const { error } = await supabase.from('obituaries').delete().eq('id', obituary.id);
                                    if (error) alert('삭제 실패: ' + error.message);
                                    else {
                                        router.push('/library');
                                        router.refresh();
                                    }
                                }
                            }}
                            className="px-4 py-2 text-red-500 hover:text-red-700 text-sm"
                        >
                            삭제
                        </button>
                        <button
                            onClick={() => router.push(`/obituary/${obituary.id}/edit`)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                        >
                            수정
                        </button>
                    </div>
                )}
            </div>

            {/* Memory Wall Section */}
            <div className="mt-12">
                {id && <MemoryWall obituaryId={id as string} />}
            </div>
        </article>
    );
}
