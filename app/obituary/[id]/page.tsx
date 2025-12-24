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
    return (
        <article className="min-h-screen bg-[#F9F9F9] font-serif pb-32">
            {/* PC: Book Container / Mobile: Full Width */}
            <div className="md:max-w-[900px] md:mx-auto md:bg-white md:shadow-xl md:my-10 md:overflow-hidden relative transition-all duration-300">

                {/* Header Image Section */}
                <div className="w-full h-[50vh] md:h-auto md:aspect-video relative overflow-hidden group">
                    {obituary.main_image_url ? (
                        <img
                            src={obituary.main_image_url}
                            alt={obituary.deceased_name}
                            className="w-full h-full object-cover grayscale brightness-75 md:brightness-[0.85] transition-transform duration-700 md:group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                            사진 없음
                        </div>
                    )}

                    {/* Navigation Overlay */}
                    <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start">
                        <Link href="/library" className="inline-flex items-center text-white/90 hover:text-white transition-colors bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                            <ArrowLeft size={18} className="mr-2" /> 목록으로
                        </Link>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                        <div className="max-w-3xl mx-auto md:mx-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="inline-block border border-[#C5A059]/50 px-3 py-1 rounded-full text-xs md:text-sm bg-[#0A192F]/80 backdrop-blur-md text-[#C5A059]">
                                    메모리얼
                                </div>

                                {/* Flower Badge */}
                                <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-fade-in-up">
                                    <Flower2 className="w-3.5 h-3.5 text-pink-500 fill-pink-100" />
                                    <span className="text-sm font-bold text-gray-900 font-serif">
                                        {obituary.flower_count?.toLocaleString() || 0}
                                        <span className="text-xs font-normal text-gray-500 ml-0.5">송이</span>
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-normal font-['Nanum_Myeongjo'] text-white drop-shadow-lg">
                                {obituary.title}
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 font-light drop-shadow-md">
                                故 {obituary.deceased_name} 님 | {obituary.birth_date} ~ {obituary.death_date}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 bg-white md:bg-transparent shadow-sm md:shadow-none -mt-10 md:mt-0 relative z-10 rounded-t-lg md:rounded-none">

                    {/* Deceased's Quote (Calligraphy Style) */}
                    {quote && (
                        <div className="mb-16 text-center px-4 py-10 border-y border-[#C5A059]/20 bg-[#FDFBF7]">
                            <Quote className="w-8 h-8 mx-auto text-[#C5A059] mb-4 opacity-70" />
                            <p className="text-2xl md:text-3xl text-[#0A192F] leading-relaxed font-['Gowun_Batang'] break-keep">
                                "{quote}"
                            </p>
                        </div>
                    )}

                    {/* Biography Content with Gold Bar Styling */}
                    <div className="relative mb-20 px-0 md:px-4">
                        {/* Visual Point: Vertical Gold Bar for PC */}
                        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px] bg-[#C5A059]/30 -ml-6"></div>

                        <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-[2.2] whitespace-pre-wrap font-['Nanum_Myeongjo'] text-justify">
                            {obituary.content}
                        </div>
                    </div>

                    {/* Life Timeline Section */}
                    {obituary.timeline_data && Array.isArray(obituary.timeline_data) && obituary.timeline_data.length > 0 && (
                        <div className="mb-20 pt-10 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-1 h-6 bg-[#C5A059] inline-block"></span>
                                <h3 className="text-2xl font-serif font-bold text-[#0A192F]">생애 기록</h3>
                            </div>
                            <TimelineViewer events={obituary.timeline_data} />
                        </div>
                    )}

                    {/* Family Archives (Tree View) - Integrated inside container for PC */}
                    <div className="pt-10 border-t border-gray-100 mb-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-1 h-6 bg-[#C5A059] inline-block"></span>
                            <h3 className="text-2xl font-serif font-bold text-[#0A192F]">가족 관계</h3>
                        </div>
                        <FamilyTree obituaryId={obituary.id} />
                    </div>


                    {/* Edit/Delete Controls (Standardized UI) */}
                    {user && (user.id === obituary.user_id || user.email === 'youngjun88@gmail.com') && (
                        <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-[#C5A059]/20">
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
                                className="px-6 py-2 bg-[#0A192F] border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A192F] transition-colors duration-300 text-sm font-bold font-serif"
                            >
                                삭제
                            </button>
                            <button
                                onClick={() => router.push(`/obituary/${obituary.id}/edit`)}
                                className="px-6 py-2 bg-[#0A192F] border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A192F] transition-colors duration-300 text-sm font-bold font-serif"
                            >
                                수정
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Memory Wall - Kept separate for full width feel or integrated? User said "PC environment layout ... fixed container". Keeping Memory Wall outside might be better for layout, or inside? 
               Usually comments section is distinct. Let's keep it outside the "Book" for now to separate "Content" vs "Community", matches "Article" vs "Comments" pattern. 
               BUT, for a contained book feel, maybe inside is better? 
               The request said "전체 본문 영역" width fixed. 
               I'll move MemoryWall component closer visually but maybe keep it centered. 
               Actually, for a "Digital Archive" book feel, the memory wall is like the guestbook at the end.
               Let's put it in a container following the same width constraint.
            */}
            <div className="md:max-w-[900px] md:mx-auto">
                <div className="mt-10 md:bg-white md:shadow-lg md:p-10 md:rounded-lg">
                    <MemoryWall obituaryId={obituary.id} onFlowerGiven={handleFlowerGiven} />
                </div>
            </div>

        </article>
    );
}
