'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { ArrowLeft, Quote, Flower2 } from 'lucide-react';

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
    flower_count: number;
};

import TimelineViewer from '@/components/obituary/TimelineViewer';
import MemoryWall from '@/components/obituary/MemoryWall';
import FamilyTree from '@/components/obituary/FamilyTree';
import MemorialAlbum from '@/components/obituary/MemorialAlbum';

export default function ObituaryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [obituary, setObituary] = useState<ObituaryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
            console.log('Fetched obituary:', data); // Debugging
            setObituary(data);
        }
        setLoading(false);
    }

    const handleFlowerGiven = () => {
        if (obituary) {
            setObituary({
                ...obituary,
                flower_count: (obituary.flower_count || 0) + 1
            });
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-serif">불러오는 중...</div>;
    if (!obituary) return null;

    const quote = obituary.biography_data?.quote;

    return (
        <article className="min-h-screen bg-[#F9F9F9] font-serif pb-32">
            {/* 1. Header Section: Deep Navy Background, Flex Layout */}
            <header className="w-full bg-[#0A192F] py-12 px-6 shadow-md border-b border-[#C5A059]/20">
                <div className="max-w-[850px] mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">

                    {/* Left: Passport Style Photo (Fixed 120x160px) */}
                    <div className="shrink-0 relative group">
                        {obituary.main_image_url ? (
                            <div className="relative">
                                <img
                                    src={obituary.main_image_url}
                                    alt={obituary.deceased_name}
                                    className="w-[120px] h-[160px] object-cover border-2 border-[#C5A059] rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] filter brightness-105"
                                />
                                {/* Optional: Corner accent can be added here if needed */}
                            </div>
                        ) : (
                            <div className="w-[120px] h-[160px] bg-[#112240] border-2 border-[#C5A059] rounded-sm flex items-center justify-center text-[#C5A059]/50 text-xs shadow-lg">
                                <span className="font-serif">No Photo</span>
                            </div>
                        )}

                        {/* Flower Badge Positioned relative to photo */}
                        <div className="absolute -bottom-3 -right-3 bg-white px-2.5 py-1 rounded-full shadow-lg border border-[#C5A059]/20 flex items-center gap-1.5 z-10">
                            <Flower2 className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]/20" />
                            <span className="text-xs font-bold text-[#0A192F] font-serif tabular-nums">
                                {obituary.flower_count?.toLocaleString() || 0}
                            </span>
                        </div>
                    </div>

                    {/* Right: Information */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0 pt-2">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-0.5 border border-[#C5A059]/60 text-[#C5A059] text-[10px] font-bold tracking-[0.2em] rounded-sm uppercase">
                                In Loving Memory
                            </span>
                            <Link href="/library" className="inline-flex items-center text-gray-400 hover:text-[#C5A059] transition-colors text-xs font-medium group">
                                <ArrowLeft size={12} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
                                목록으로 돌아가기
                            </Link>
                        </div>

                        <h1
                            className="text-2xl md:text-4xl font-bold font-['Nanum_Myeongjo'] mb-3 leading-snug break-keep animate-fade-loop"
                            style={{ color: '#C5A059' }}
                        >
                            {obituary.title}
                        </h1>

                        <div className="space-y-1.5">
                            <p className="text-lg md:text-xl text-[#C5A059] font-medium font-serif">
                                故 {obituary.deceased_name}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base text-gray-300 font-light tracking-wide opacity-80 font-serif">
                                <span>{obituary.birth_date}</span>
                                <span className="text-[#C5A059]/50">•</span>
                                <span>{obituary.death_date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Content Section: White Background, Constrained Width */}
            <div className="max-w-[850px] mx-auto bg-white shadow-sm -mt-0 relative z-10 min-h-[600px]">

                <div className="px-6 py-12 md:px-12 md:py-16">
                    {/* Deceased's Quote */}
                    {quote && (
                        <div className="mb-14 text-center px-8 py-10 border-y border-[#C5A059]/15 bg-[#FDFBF7]">
                            <Quote className="w-5 h-5 mx-auto text-[#C5A059] mb-5 opacity-60" />
                            <p className="text-xl md:text-2xl text-[#0A192F] leading-relaxed font-['Gowun_Batang'] break-keep">
                                "{quote}"
                            </p>
                        </div>
                    )}

                    {/* Biography Content / Article Body */}
                    <div className="relative mb-20">
                        <div className="prose prose-lg prose-slate max-w-none text-gray-700 leading-[2.2] whitespace-pre-wrap font-['Nanum_Myeongjo'] text-justify">
                            {obituary.content}

                            {/* Example of how an embedded image would look within content if user adds one (rendered by prose) */}
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent my-16"></div>

                    {/* Life Timeline Section */}
                    {obituary.timeline_data && Array.isArray(obituary.timeline_data) && obituary.timeline_data.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-10">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                <h3 className="text-xl font-serif font-bold text-[#0A192F] tracking-widest">LIFE JOURNEY</h3>
                                <span className="w-8 h-[1px] bg-[#C5A059] md:hidden"></span>
                            </div>
                            <TimelineViewer events={obituary.timeline_data} />
                        </div>
                    )}

                    {/* Family Archives */}
                    <div className="mb-10">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-10">
                            <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                            <h3 className="text-xl font-serif font-bold text-[#0A192F] tracking-widest">FAMILY TREE</h3>
                            <span className="w-8 h-[1px] bg-[#C5A059] md:hidden"></span>
                        </div>
                        <FamilyTree obituaryId={obituary.id} />
                    </div>

                    {/* NEW: Memorial Album Section */}
                    <div className="mb-10 w-full">
                        <MemorialAlbum
                            obituaryId={obituary.id}
                            isUploadOpen={isUploadModalOpen}
                            onUploadClose={() => setIsUploadModalOpen(false)}
                        />
                    </div>

                    {/* Edit/Delete Controls - Sub Actions */}
                    {user && (user.id === obituary.user_id || user.email === 'youngjun88@gmail.com') && (
                        <div className="flex flex-col md:flex-row justify-end gap-3 pt-10 mt-12 border-t border-[#C5A059]/10">
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
                                className="w-full md:w-auto px-6 py-2.5 bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 hover:text-red-500 transition-all duration-300 text-xs font-medium rounded-[4px] tracking-widest uppercase"
                            >
                                삭제하기
                            </button>
                            <button
                                onClick={() => router.push(`/obituary/${obituary.id}/edit`)}
                                className="w-full md:w-auto px-8 py-2.5 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059]/20 hover:text-[#0A192F] transition-all duration-300 text-xs font-bold font-serif tracking-widest uppercase rounded-[4px]"
                            >
                                <span className="mr-2">EDIT</span> 수정하기
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Memory Wall */}
            <div className="max-w-[850px] mx-auto">
                <div className="mt-8 bg-white shadow-sm p-6 md:p-10 border-t border-gray-100">
                    <MemoryWall
                        obituaryId={obituary.id}
                        onFlowerGiven={handleFlowerGiven}
                        onOpenAlbumUpload={() => setIsUploadModalOpen(true)}
                    />
                </div>
            </div>

        </article>
    );
}
