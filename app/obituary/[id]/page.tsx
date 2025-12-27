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

// 1. Custom White Chrysanthemum SVG Component (Re-designed based on reference)
const WhiteChrysanthemum = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Background: Dark Charcoal Circle */}
        <circle cx="16" cy="16" r="16" fill="#333333" />

        {/* Foreground: White Chrysanthemum Silhouette */}
        <path
            fill="#FFFFFF"
            d="M16 5.5C13.2 5.5 10.8 7.2 9.8 9.8C9.2 11.5 9.5 13.2 10.5 14.6C9.8 15.5 9.5 16.8 9.8 18C10.2 19.5 11.2 20.8 12.5 21.5L15 22.8V25H14C13.4 25 13 25.4 13 26C13 26.6 13.4 27 14 27H18C18.6 27 19 26.6 19 26C19 25.4 18.6 25 18 25H17V22.8L19.5 21.5C20.8 20.8 21.8 19.5 22.2 18C22.5 16.8 22.2 15.5 21.5 14.6C22.5 13.2 22.8 11.5 22.2 9.8C21.2 7.2 18.8 5.5 16 5.5ZM16 8C17.5 8 18.8 9 19.2 10.5C19.5 11.8 19 13 18 13.8C18.2 13.2 18.2 12.5 18 11.8C17.6 11.2 16.9 10.8 16.2 10.8H15.8C15.1 10.8 14.4 11.2 14 11.8C13.8 12.5 13.8 13.2 14 13.8C13 13 12.5 11.8 12.8 10.5C13.2 9 14.5 8 16 8ZM16 11.8C16.4 11.8 16.8 12 17 12.4C17.1 12.6 17.1 12.9 17 13.1C16.9 13.4 16.6 13.6 16.3 13.7C16.9 14 17.2 14.6 17.2 15.2C17.2 16.2 16.4 17 15.4 17H16.6C17.6 17 18.4 16.2 18.4 15.2C18.4 14.6 18.1 14 17.6 13.7C17.9 14.1 18.2 14.5 18.2 15C18.2 16.1 17.3 17 16.2 17H15V15.2C15 14.9 15.1 14.6 15.3 14.4L15.6 14.1C15.8 13.9 16 13.8 16.2 13.8H16V11.8Z"
        />
    </svg>
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
                        {featuredImage ? (
                            <div className="relative">
                                <img
                                    key={featuredImage} // Trigger animation on change
                                    src={featuredImage}
                                    alt={obituary.deceased_name}
                                    className="w-[360px] h-[480px] object-cover border-2 border-[#C5A059] rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] filter brightness-105 animate-in fade-in duration-1000"
                                />
                                {/* Optional: Corner accent can be added here if needed */}
                            </div>
                        ) : (
                            <div className="w-[360px] h-[480px] bg-[#112240] border-2 border-[#C5A059] rounded-sm flex items-center justify-center text-[#C5A059]/50 text-xs shadow-lg">
                                <span className="font-serif">No Photo</span>
                            </div>
                        )}

                        {/* Flower Badge & Interaction */}
                        <div className="absolute -bottom-10 -right-2 z-20">
                            <button
                                onClick={handleFlowerGiven}
                                className="group relative flex items-center bg-[#0A192F] pl-8 pr-10 py-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-[#C5A059] transition-all duration-300 hover:scale-105 hover:bg-[#112240] cursor-pointer overflow-hidden"
                            >
                                <WhiteChrysanthemum className="w-12 h-12 text-white drop-shadow-md" />
                                <span className="ml-1.5 text-2xl font-bold text-white font-serif tabular-nums tracking-wide">
                                    {obituary.flower_count?.toLocaleString() || 0}
                                </span>

                                {/* Hover Reveal Text */}
                                <div className="w-0 overflow-hidden group-hover:w-auto group-hover:pl-2 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                    <span className="text-lg text-[#C5A059] font-bold tracking-tight">헌화하기</span>
                                </div>
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
