'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { ArrowLeft, Quote, Flower2 } from 'lucide-react';

import CandleIcon from '@/components/obituary/CandleIcon';
import TimelineViewer from '@/components/obituary/TimelineViewer';
import MemoryWall from '@/components/obituary/MemoryWall';
import FamilyTree from '@/components/obituary/FamilyTree';
import MemorialAlbum from '@/components/obituary/MemorialAlbum';

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
    candle_count?: number;
    last_candle_lit_at?: string;
};

const WhiteChrysanthemum = ({ className }: { className?: string }) => (
    <div className={`${className} rounded-sm overflow-hidden`}>
        <img
            src="/flower-badge-wide.png"
            alt="헌화 배지"
            className="w-full h-full object-cover object-left"
        />
    </div>
);

export default function ObituaryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [obituary, setObituary] = useState<ObituaryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [featuredImage, setFeaturedImage] = useState<string | null>(null); // State for rotated header image
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

            // Feature Photo Rotation Logic
            let displayImage = data.main_image_url;

            // Fetch featured photos
            const { data: featuredData } = await supabase
                .from('album_photos')
                .select('image_url')
                .eq('obituary_id', id)
                .eq('is_featured', true);

            if (featuredData && featuredData.length > 0) {
                const hour = new Date().getHours();
                const index = hour % featuredData.length;
                displayImage = featuredData[index].image_url;
                console.log(`[Rotation] Hour: ${hour}, Count: ${featuredData.length}, Index: ${index}`);
            }

            setFeaturedImage(displayImage);
        }
        setLoading(false);
    }

    const handleFlowerGiven = async () => {
        if (obituary) {
            // Optimistic UI update
            setObituary({
                ...obituary,
                flower_count: (obituary.flower_count || 0) + 1
            });

            // In a real app, you would send this to the server here
            // await supabase.rpc('increment_flower_count', { obituary_id: id });
        }
    };

    // State for Candle
    const [candleState, setCandleState] = useState<{ active: boolean; opacity: number }>({ active: false, opacity: 1 });
    const [candleCount, setCandleCount] = useState(0);

    // Initial Load Logic
    useEffect(() => {
        if (obituary) {
            setCandleCount(obituary.candle_count || 0);
            updateCandleState(obituary.last_candle_lit_at);
        }
    }, [obituary]);

    // Timer Interval to fade/expire candle
    useEffect(() => {
        if (!candleState.active || !obituary?.last_candle_lit_at) return;

        const interval = setInterval(() => {
            updateCandleState(obituary.last_candle_lit_at!);
        }, 60000); // Check every minute (sufficient for 24h scale)

        return () => clearInterval(interval);
    }, [candleState.active, obituary?.last_candle_lit_at]);


    const updateCandleState = (lastLitAt: string | null | undefined) => {
        if (!lastLitAt) {
            setCandleState({ active: false, opacity: 1 });
            return;
        }

        const litTime = new Date(lastLitAt).getTime();
        const now = new Date().getTime();
        const diff = now - litTime;
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (diff < twentyFourHours) {
            // Active
            // Calculate opacity: 1.0 (start) -> 0.2 (near end) -> 0 (expired)
            const remaining = twentyFourHours - diff;
            const ratio = remaining / twentyFourHours;
            // Clamp opacity between 0.2 and 1.0 for visibility, but fade out at very end
            const opacity = Math.max(0.1, ratio);

            setCandleState({ active: true, opacity });
        } else {
            // Expired
            setCandleState({ active: false, opacity: 1 });
        }
    };

    const handleCandleClick = async () => {
        const now = new Date().toISOString();

        // Optimistic Update
        setCandleState({ active: true, opacity: 1 });
        setCandleCount(prev => prev + 1);

        // Propagate state update to use in interval effect
        if (obituary) {
            setObituary({
                ...obituary,
                last_candle_lit_at: now,
                candle_count: (obituary.candle_count || 0) + 1
            });
        }

        // DB Update
        const { error } = await supabase
            .from('obituaries')
            .update({
                last_candle_lit_at: now,
                candle_count: (obituary?.candle_count || 0) + 1
            })
            .eq('id', id);

        if (error) {
            console.error('Failed to light candle:', error);
            // Revert on serious error if needed, but for tribute usually ok to fail silently or alert
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center ">불러오는 중...</div>;
    if (!obituary) return null;

    const quote = obituary.biography_data?.quote;

    return (
        <article className="min-h-screen bg-[#F9F9F9]  pb-32">
            {/* 1. Header Section: Deep Navy Background, Flex Layout */}
            <header className="w-full bg-[#0A192F] py-12 px-6 shadow-md border-b border-[#C5A059]/20">
                <div className="max-w-[850px] mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">

                    {/* Left: Passport Style Photo & Tribute Bar (Aligned) */}
                    <div className="shrink-0 flex flex-col gap-0 w-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                        {/* 1. Photo Section */}
                        <div className="relative w-full h-[320px] bg-[#112240] border-2 border-[#C5A059] border-b-0 rounded-t-sm overflow-hidden group">
                            {featuredImage ? (
                                <img
                                    key={featuredImage}
                                    src={featuredImage}
                                    alt={obituary.deceased_name}
                                    className="w-full h-full object-cover filter brightness-105 animate-in fade-in duration-1000 group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#C5A059]/50 text-xs shadow-lg">
                                    <span className="">No Photo</span>
                                </div>
                            )}
                        </div>

                        {/* 2. Tribute Action Bar (Flower & Candle) */}
                        <div className="w-full h-[50px] bg-[#0A192F] border-2 border-t-0 border-[#C5A059] rounded-b-sm flex items-center relative overflow-hidden">
                            {/* Flower Button (Left) */}
                            <button
                                onClick={handleFlowerGiven}
                                className="flex-1 h-full flex items-center justify-center gap-2 hover:bg-[#112240] transition-colors relative group border-r border-[#C5A059]/20"
                            >
                                <div className="flex flex-col items-center justify-center leading-none">
                                    <Flower2 size={16} className="text-[#C5A059] mb-1 leading-none" />
                                    <span className="text-[#C5A059] text-[9px] font-bold tracking-widest uppercase">헌화하기</span>
                                </div>
                                <span className="text-white text-sm font-bold ml-1 tabular-nums">{obituary.flower_count?.toLocaleString() || 0}</span>
                            </button>

                            {/* Candle Button (Right) */}
                            <button
                                onClick={handleCandleClick}
                                className="flex-1 h-full flex items-center justify-center gap-2 hover:bg-[#112240] transition-colors relative group"
                            >
                                <div className="flex flex-col items-center justify-center leading-none">
                                    <CandleIcon isOn={candleState.active} opacity={candleState.opacity} className="mb-0.5" />
                                    <span className="text-[#C5A059] text-[9px] font-bold tracking-widest uppercase mt-0.5">촛불 켜기</span>
                                </div>
                                <span className="text-white text-sm font-bold ml-1 tabular-nums">{candleCount.toLocaleString()}</span>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-1 transition-opacity"></div>
                            </button>
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
                            <p className="text-lg md:text-xl text-[#C5A059] font-medium ">
                                故 {obituary.deceased_name}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base text-gray-300 font-light tracking-wide opacity-80 ">
                                <span>{obituary.birth_date}</span>
                                <span className="text-[#C5A059]/50">•</span>
                                <span>{obituary.death_date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Life Timeline (Universal - Positioned at Header Area) */}
            {obituary.timeline_data && Array.isArray(obituary.timeline_data) && obituary.timeline_data.length > 0 && (
                <div className="w-full bg-white relative z-20 border-b border-[#C5A059]/10">
                    <TimelineViewer events={obituary.timeline_data} />
                </div>
            )}

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



                    {/* Family Archives */}
                    <div className="mb-10">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-10">
                            <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                            <h3 className="text-xl  font-bold text-[#0A192F] tracking-widest">FAMILY TREE</h3>
                            <span className="w-8 h-[1px] bg-[#C5A059] md:hidden"></span>
                        </div>
                        <FamilyTree obituaryId={obituary.id} />
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
                                className="w-full md:w-auto px-8 py-2.5 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059]/20 hover:text-[#0A192F] transition-all duration-300 text-xs font-bold  tracking-widest uppercase rounded-[4px]"
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
                    />
                </div>
            </div>

            {/* Memorial Album (New Position - Independent Plate) */}
            <div className="max-w-[850px] mx-auto">
                <div className="mt-8">
                    <MemorialAlbum
                        obituaryId={obituary.id}
                        isUploadOpen={isUploadModalOpen}
                        onUploadOpen={() => setIsUploadModalOpen(true)}
                        onUploadClose={() => setIsUploadModalOpen(false)}
                    />
                </div>
            </div>

        </article>
    );
}
