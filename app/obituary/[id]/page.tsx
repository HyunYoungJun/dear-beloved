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

// 1. Custom White Chrysanthemum SVG Component (Detailed based on user reference)
const WhiteChrysanthemum = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 512 512"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Stem and Leaves */}
        <path d="M266.8 335.5c-7.9 0-16.1 4.5-23.3 9.4-4.8 3.3-17.7 13.6-17.7 13.6l-2.4 2 1.8 2.6c5.8 8.1 19.3 22.7 32.2 22.7 8.1 0 16.4-5.6 19.1-7.7 2.1-1.6 4.3-3.6 6.5-5.6.8-.7 1.5-1.4 2.2-2.1.8-.8 2.3-1.9 2.1-3.2-.2-1.4-1.6-2.2-2.7-2.9-2.2-1.5-4.4-3.1-6.6-4.7-3.4-2.4-6.8-4.8-10.2-7.3-1-1.1-1.1-2.2-2.1-3.3-1.5-1.5-1.6-3.1-1.6-5.3 0-1.5.3-2.9.5-4.3l2.2-3.9z" />
        <path d="M245.2 384.9c-10.8 12.1-25.1 21.6-40.4 26.6-5.4 1.8-11 3.1-16.7 3.5-3.6.3-7.2.1-10.7-.7-1.1-.3-2.2-.7-3.2-1.2-1.5-.7-1.5-2.6-.9-3.9 1-2.1 2.8-3.7 4.7-4.9 6.8-4.4 14.5-6.9 22.2-9 4.3-1.2 8.7-2.1 13.1-2.6 1.4-.2 2.8-.2 4.2-.1 1.7.1 2.7-1.4 1.8-2.8-1.7-2.7-3.9-5.1-6.2-7.4-4.6-4.5-9.8-8.2-15.3-11.5-2.8-1.6-5.6-3.1-8.5-4.5-1.2-.6-2.5-1.2-3.8-1.6-1.5-.5-2.5 1-2.2 2.4.3 1.3 1 2.5 1.7 3.7 1.2 2 2.7 3.9 4.1 5.7 2.1 2.6 4.3 5.3 6.1 8.2.8 1.2.6 2.8-.5 3.7-1.4 1-3.1 1.2-4.7 1-4.7-.6-9.3-2.3-13.6-4.5-3.1-1.6-6.1-3.4-8-6.3-1-1.5-.7-3.5.7-4.6 1.6-1.3 3.6-1.6 5.5-1.7 5.1-.4 10.2.6 15 2.5 2.8 1.1 5.4 2.6 7.8 4.6 1.1.9 2.7.6 3.5-.5.7-1.1.4-2.5-.5-3.4-3.1-2.9-6.9-4.7-11.1-5.7-4.1-1-8.3-1.1-12.4-.2-2.1.4-4.2 1.1-6.2 2-1.7.8-3.4 2.2-3.6 4.1-.2 1.8 .9 3.5 2.1 4.9 3.3 3.8 7.3 6.7 11.9 8.9 2.5 1.2 5.1 2.2 7.7 3.1 1.3.4 2.1 1.9 1.5 3.2-.5 1.1-1.6 1.7-2.8 1.8-6.3.3-12.6-1.3-18.4-3.9-2.9-1.3-5.6-3-8.1-5-1.9-1.5-2.8-3.8-2.6-6.2.2-2.3 1.8-4.3 3.9-5.3 4.8-2.2 9.9-3.2 15.1-2.8 5 .4 9.8 1.9 14.3 4.3 1.2.7 2.7.6 3.7-.4.9-1 1-2.5.4-3.6-2.7-5.4-7.4-9.5-13.1-11.3-3.6-1.1-7.4-1.4-11.1-.7-1.9.3-3.7.9-5.5 1.8-1.9.9-3.6 2.4-4.5 4.3-.9 1.8-.7 4 .4 5.7 3.9 5.8 9.3 10.4 15.6 13.2 4.1 1.8 8.4 3 12.8 3.7.8.1 1.6 0 2.3-.3 1.9-5.1 8-16.7 9.1-18.8 2.2-4.1 4.6-7.8 8.1-11.3 6.7-6.5 15.7-10.4 25.4-10.4 5.9 0 11.7 1.5 16.9 4.3 1.5.8 2.5 2.3 2.5 4 0 1.2-.5 2.3-1.4 3.1z" />
        <path d="M264.4 338.2c1.7 5.1 3.5 10.2 5.3 15.3 1.3 3.7 2.6 7.4 3.9 11.1.3.8.5 1.7.8 2.5 1.7 5.1 3.9 10 6.6 14.6 2.7 4.7 6.1 8.9 10.2 12.5 1.1 1 2.2 1.9 3.4 2.8 2 1.5 4.7.7 5.7-1.6.9-2.2.1-4.7-1.7-6.1-3.6-2.9-6.6-6.5-9-10.5-2.5-4.2-4.4-8.8-5.8-13.5-.7-2.3-1.3-4.7-1.9-7-1.2-4.7-2.4-9.4-3.5-14.1-.3-1.4-.7-2.7-1-4.1-.3-1.2-1.9-1.3-2.6-.3-.6.6-1.1 1.3-1.7 1.9-.3.3-.6.6-.9.9-1.9 2-3.9 4.1-5.8 6.1-2.9 3.1-5.7 6.3-8.3 9.6-.5.7-1.1 1.4-1.6 2.1 2.7 2.1 5.3 3.9 7.9 5.8z" />
        {/* Flower Head */}
        <path d="M256 120c-55.2 0-100 44.8-100 100 0 24.3 8.7 46.7 23.2 64.2 11.5 13.9 26.6 24.6 44 30.6 9.8 3.4 20.4 5.2 31.4 5.2 55.2 0 100-44.8 100-100S311.2 120 256 120zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" fillOpacity="0.2" />
        <path d="M256 148c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zM304 220c0 8.8-7.2 16-16 16s-16-7.2-16-16 7.2-16 16-16 16 7.2 16 16zM208 220c0 8.8-7.2 16-16 16s-16-7.2-16-16 7.2-16 16-16 16 7.2 16 16zM256 268c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16z" />
        <path d="M256 188c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm0 48c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z" />
        <path d="M298.5 168.6c-4.2-7.3-13.6-9.8-20.9-5.6-7.3 4.2-9.8 13.6-5.6 20.9 4.2 7.3 13.6 9.8 20.9 5.6 7.3-4.2 9.9-13.6 5.6-20.9zM213.5 168.6c-4.2 7.3-1.7 16.7 5.6 20.9 7.3 4.2 16.7 1.7 20.9-5.6 4.2-7.3 1.7-16.7-5.6-20.9-7.3-4.2-16.6-1.7-20.9 5.6zM213.5 271.4c4.2 7.3 13.6 9.8 20.9 5.6 7.3-4.2 9.8-13.6 5.6-20.9-4.2-7.3-13.6-9.8-20.9-5.6-7.3 4.2-9.9 13.6-5.6 20.9zM298.5 271.4c4.2-7.3 1.7-16.7-5.6-20.9-7.3-4.2-16.7-1.7-20.9 5.6-4.2 7.3-1.7 16.7 5.6 20.9 7.3 4.2 16.6 1.7 20.9-5.6z" />
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
                                    className="w-[120px] h-[160px] object-cover border-2 border-[#C5A059] rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] filter brightness-105 animate-in fade-in duration-1000"
                                />
                                {/* Optional: Corner accent can be added here if needed */}
                            </div>
                        ) : (
                            <div className="w-[120px] h-[160px] bg-[#112240] border-2 border-[#C5A059] rounded-sm flex items-center justify-center text-[#C5A059]/50 text-xs shadow-lg">
                                <span className="font-serif">No Photo</span>
                            </div>
                        )}

                        {/* Flower Badge & Interaction */}
                        <div className="absolute -bottom-4 -right-1 z-20">
                            <button
                                onClick={handleFlowerGiven}
                                className="group relative flex items-center bg-[#0A192F] pl-2.5 pr-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-[#C5A059] transition-all duration-300 hover:scale-105 hover:bg-[#112240] cursor-pointer overflow-hidden"
                            >
                                <WhiteChrysanthemum className="w-4 h-4 text-white drop-shadow-md" />
                                <span className="ml-1.5 text-xs font-bold text-white font-serif tabular-nums tracking-wide">
                                    {obituary.flower_count?.toLocaleString() || 0}
                                </span>

                                {/* Hover Reveal Text */}
                                <div className="w-0 overflow-hidden group-hover:w-auto group-hover:pl-2 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                    <span className="text-[10px] text-[#C5A059] font-bold tracking-tight">헌화하기</span>
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
