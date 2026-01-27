'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { ArrowLeft, Quote, Flower2 } from 'lucide-react';

import CandleIcon from '@/components/obituary/CandleIcon';
import IncenseIcon from '@/components/obituary/IncenseIcon';
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
    incense_count?: number;
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

    const [flowerCount, setFlowerCount] = useState(0);
    const [hasGivenFlower, setHasGivenFlower] = useState(false);

    useEffect(() => {
        if (id) {
            fetchObituary();
            fetchFlowerData();

            // Save to LocalStorage for "History"
            const viewed = JSON.parse(localStorage.getItem('viewed_obituaries') || '[]');
            if (!viewed.includes(id)) {
                // Prepend new ID, keep max 20
                const newViewed = [id, ...viewed].slice(0, 20);
                localStorage.setItem('viewed_obituaries', JSON.stringify(newViewed));
            }
        }
    }, [id, user?.id]);

    // Realtime Subscription for Flowers
    useEffect(() => {
        if (!id) return;

        const channel = supabase
            .channel(`flower_offerings_${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'flower_offerings',
                    filter: `memorial_id=eq.${id}`
                },
                (payload) => {
                    // console.log('Realtime flower added:', payload);
                    setFlowerCount((prev) => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    async function fetchFlowerData() {
        // 1. Fetch Total Count from flower_offerings table
        const { count, error } = await supabase
            .from('flower_offerings')
            .select('*', { count: 'exact', head: true })
            .eq('memorial_id', id);

        if (!error && count !== null) {
            setFlowerCount(count);
        }

        // 2. Check if current user has already given (and log history)
        if (user) {
            const { data: myData, error: myError } = await supabase
                .from('flower_offerings')
                .select('id')
                .eq('memorial_id', id)
                .eq('user_id', user.id)
                .maybeSingle();

            if (!myError && myData) {
                setHasGivenFlower(true);
            } else {
                setHasGivenFlower(false);
            }

            // 3. Log Reading History
            await supabase
                .from('reading_history')
                .upsert(
                    { user_id: user.id, obituary_id: id },
                    { onConflict: 'user_id, obituary_id' }
                );
        } else {
            setHasGivenFlower(false);
        }
    }

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
            // console.log('Fetched obituary:', data); 
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
            }

            setFeaturedImage(displayImage);
        }
        setLoading(false);
    }

    const handleFlowerGiven = async () => {
        if (!user) {
            if (confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
                router.push('/login');
            }
            return;
        }

        if (hasGivenFlower) {
            showToastMessage('이미 마음을 전하셨습니다.');
            return;
        }

        // Optimistic UI update (Note: Realtime might also trigger, but we prevent double count via "hasGiven" check or just accept it syncs)
        // Actually, if we rely on Realtime, we might not need to increment manually, OR distinct user ID check prevents double add.
        // However, specifically for the acting user, instant feedback is better.
        // But since we have Realtime running, it will increment count "again" if we are not careful?
        // No, Realtime triggers for everyone. If I insert, I get an event.
        // So I should EITHER increment manually AND ignore my own realtime event, OR just wait for realtime.
        // Waiting for realtime might feel slow.
        // Best practice: Optimistic update, but if Realtime comes, ensure we don't double count?
        // Simple approach: The Realtime event comes from DB. 
        // If I update optimistically (+1), then Realtime comes (+1), it becomes (+2).
        // FIX: The simplest way for "Count" is relying on Realtime solely for the number, but updating button state immediately.
        // OR: Increment optimistically, but when Realtime comes, check if it's ME.
        // Payload has 'user_id'. match with `user.id`.
        // Let's rely on Realtime for the count increment to avoid complexity, 
        // UNLESS latency is high. 
        // Given the requirement "Show Realtime", let's update button immediately but leave count to Realtime? 
        // User requested "Click -> Persistent". 
        // Let's do: Optimistic "Button State" (Gold), but Count waits for Realtime?
        // Actually, most users prefer instant number change.
        // Let's keep optimistic count, but I need to filter out MY own event in subscription?
        // Or deeper: Realtime event is "INSERT". 
        // Let's just handle it in UI: setHasGivenFlower(true) immediately.
        // For count: let's increment optimistically.
        // In the subscription, we can check `if (payload.new.user_id !== user.id) setFlowerCount...` 
        // BUT Subscription is defined inside useEffect, accessing `user` might be stale or complex dep.
        // SIMPLER: Just depend on Realtime for the COUNT. It's fast enough usually.
        // But for "Review", keeping optimistic is safer for UX.
        // Let's stick to: Optimistic local update. And ignore the Realtime event IF it matches me?
        // Actually, dealing with "stale closure" of `user` in useEffect is tricky.
        // Let's just increment in Realtime subscription, and NOT increment in handleFlowerGiven.
        // Wait, if Realtime fails?
        // Let's do: handleFlowerGiven -> Insert DB.
        // Realtime -> hears Insert -> increments count.
        // So I will remove `setFlowerCount(prev => prev + 1)` from handleFlowerGiven.
        // I will only set `setHasGivenFlower(true)` there.

        setHasGivenFlower(true);

        // Debug: Log the payload
        console.log('Attempting to give flower:', { memorial_id: id, user_id: user.id });

        const { data, error } = await supabase
            .from('flower_offerings')
            .insert({ memorial_id: id, user_id: user.id })
            .select(); // Select to see returned data

        if (error) {
            console.error('Flower Insert Error details:', error);
            // Revert on error
            setHasGivenFlower(false);

            if (error.code === '23505') { // Unique violation
                showToastMessage('이미 마음을 전하셨습니다.');
                setHasGivenFlower(true);
            } else {
                showToastMessage('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } else {
            console.log('Flower Insert Success:', data);
            // Success
            showToastMessage('소중한 마음이 기록되었습니다.');
            // Note: Realtime subscription will handle the count increment.
        }
    };

    // State for Candle
    const [candleState, setCandleState] = useState<{ active: boolean; opacity: number }>({ active: false, opacity: 1 });
    const [candleCount, setCandleCount] = useState(0);

    // State for Incense
    const [incenseCount, setIncenseCount] = useState(0);
    const [isIncenseBurning, setIsIncenseBurning] = useState(false);

    // State for Favorites toogle
    const [isFavorite, setIsFavorite] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Initial Load Logic
    useEffect(() => {
        if (obituary) {
            setCandleCount(obituary.candle_count || 0);
            updateCandleState(obituary.last_candle_lit_at);
            setIncenseCount(obituary.incense_count || 0);
        }
        checkFavoriteStatus();
    }, [obituary, user?.id]);

    async function checkFavoriteStatus() {
        if (!user || !id) return;
        const { data } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('article_id', id)
            .single();
        if (data) setIsFavorite(true);
    }

    const toggleFavorite = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (isFavorite) {
            // Remove
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('article_id', id);

            if (!error) {
                setIsFavorite(false);
                showToastMessage("등록이 해제되었습니다.");
            }
        } else {
            // Add
            const { error } = await supabase
                .from('user_favorites')
                .insert({ user_id: user.id, article_id: id });

            if (!error) {
                setIsFavorite(true);
                showToastMessage("자주 찾는 분으로 등록되었습니다.");
            }
        }
    };

    const showToastMessage = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

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
        }
    };

    const handleIncenseClick = async () => {
        if (isIncenseBurning) return; // Prevent spamming while burning

        setIsIncenseBurning(true);
        setIncenseCount(prev => prev + 1);

        // Reset burning state after 15 seconds
        setTimeout(() => {
            setIsIncenseBurning(false);
        }, 15000);

        // DB Update
        const { error } = await supabase
            .from('obituaries')
            .update({
                incense_count: (incenseCount || 0) + 1
            })
            .eq('id', id);

        if (error) {
            console.error('Failed to burn incense:', error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center ">불러오는 중...</div>;
    if (!obituary) return null;

    const quote = obituary.biography_data?.quote;

    return (
        <article className="min-h-screen bg-[#F9F9F9]  pb-32">
            {/* 1. Header Section: Deep Navy Background, Flex Layout */}
            <header className="w-full bg-[#0A192F] py-12 px-6 shadow-md border-b border-[#C5A059]/20">
                <div className="max-w-[850px] mx-auto flex flex-col md:flex-row items-stretch gap-8 md:gap-10">

                    {/* Left: Photo Section (20%) */}
                    {/* Centered, 85% of previous size approximately */}
                    <div className="md:w-[20%] shrink-0 flex items-center justify-center">
                        <div className="relative w-[140px] md:w-full aspect-[3/4] bg-[#112240] border-[3px] border-[#C5A059] shadow-[0_10px_40px_rgba(0,0,0,0.4)] rounded-sm overflow-hidden group">
                            {featuredImage ? (
                                <img
                                    key={featuredImage}
                                    src={featuredImage}
                                    alt={obituary.deceased_name}
                                    className="w-full h-full object-cover filter brightness-105 animate-in fade-in duration-1000 group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#C5A059]/50 text-xs shadow-lg font-serif">
                                    <span className="">No Photo</span>
                                </div>
                            )}
                            {/* Inner Border Line */}
                            <div className="absolute inset-2 border border-[#C5A059]/20 pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Right: Info & Actions (80%) - Vertical Split */}
                    <div className="md:w-[80%] flex flex-col justify-between min-h-full gap-6 md:gap-0">

                        {/* Right Top: Info (Title, Name) */}
                        <div className="flex flex-col items-start text-left pt-2">
                            <div className="flex items-center gap-3 mb-4 justify-start w-full">
                                <span className="px-2 py-0.5 border border-[#C5A059]/60 text-[#C5A059] text-[10px] font-bold tracking-[0.2em] rounded-sm uppercase">
                                    In Loving Memory
                                </span>
                                <Link href="/library" className="inline-flex items-center text-gray-400 hover:text-[#C5A059] transition-colors text-xs font-medium group ml-auto md:ml-0">
                                    <ArrowLeft size={12} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
                                    목록으로 돌아가기
                                </Link>
                            </div>

                            <h1
                                className="text-2xl md:text-3xl font-bold font-['Nanum_Myeongjo'] mb-3 leading-snug break-keep animate-fade-loop"
                                style={{ color: '#C5A059' }}
                            >
                                {obituary.title}
                            </h1>

                            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 pb-4 border-b border-[#C5A059]/10 w-full">
                                <span className="text-xl md:text-2xl text-white font-medium">
                                    故 {obituary.deceased_name}
                                </span>
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-light tracking-wide opacity-80 pb-1">
                                    <span>{obituary.birth_date}</span>
                                    <span className="text-[#C5A059]/50">•</span>
                                    <span>{obituary.death_date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Bottom: Actions Row (Flower, Incense, Candle, Favorite) */}
                        {/* Aligned to bottom of Left Photo */}
                        <div className="w-full grid grid-cols-4 gap-2 md:gap-4 mt-auto">

                            {/* 1. Flower */}
                            <button
                                onClick={handleFlowerGiven}
                                disabled={hasGivenFlower}
                                className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-all group duration-500
                                    ${hasGivenFlower
                                        ? 'border-2 border-[#FFD700] bg-[#0A192F]/40 shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-default'
                                        : 'border border-[#C5A059]/10 hover:bg-[#112240] cursor-pointer'}`}
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative">
                                    <div className={`absolute inset-0 rounded-full transition-colors ${hasGivenFlower ? 'bg-[#FFD700]/10 border border-[#FFD700]/30' : 'bg-white/5 border border-gray-400/60 group-hover:bg-white/10'}`}></div>
                                    <img
                                        src="/chrysanthemum-tribute.png"
                                        alt="Flower Tribute"
                                        className={`w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-700
                                            ${hasGivenFlower ? 'brightness-[1.2] sepia-[1] saturate-[3] hue-rotate-[5deg]' : 'opacity-90 group-hover:opacity-100 group-hover:scale-110'}`}
                                    />
                                </div>
                                <div className="text-center">
                                    <div className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 transition-colors duration-500 ${hasGivenFlower ? 'text-[#FFD700]' : 'text-[#C5A059]'}`}>
                                        {hasGivenFlower ? '헌화 완료' : '헌화하기'}
                                    </div>
                                    <div className={`text-sm md:text-base font-mono font-bold transition-colors ${hasGivenFlower ? 'text-[#FFD700]' : 'text-white'}`}>
                                        {flowerCount.toLocaleString()}
                                    </div>
                                </div>
                            </button>

                            {/* 2. Incense */}
                            <button
                                onClick={handleIncenseClick}
                                className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-[#112240] transition-all group border border-[#C5A059]/10"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-white/5 rounded-full border border-gray-400/60 group-hover:bg-white/10 transition-colors"></div>
                                    <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center overflow-visible">
                                        <div className="scale-[0.8] origin-center -translate-y-1">
                                            <IncenseIcon isBurning={isIncenseBurning} />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[#C5A059] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5">분향하기</div>
                                    <div className="text-white text-sm md:text-base font-mono font-bold">{incenseCount.toLocaleString()}</div>
                                </div>
                            </button>

                            {/* 3. Candle */}
                            <button
                                onClick={handleCandleClick}
                                className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-[#112240] transition-all group border border-[#C5A059]/10"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-white/5 rounded-full border border-gray-400/60 group-hover:bg-white/10 transition-colors"></div>
                                    <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center">
                                        <div className="scale-100 origin-center">
                                            <CandleIcon isOn={candleState.active} opacity={candleState.opacity} />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[#C5A059] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5">촛불켜기</div>
                                    <div className="text-white text-sm md:text-base font-mono font-bold">{candleCount.toLocaleString()}</div>
                                </div>
                            </button>

                            {/* 4. Favorites */}
                            <button
                                onClick={toggleFavorite}
                                className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-[#112240] transition-all group border border-[#C5A059]/10
                                    ${isFavorite ? 'bg-[#C5A059]/5' : ''}`}
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative">
                                    {/* White Circle Background */}
                                    <div className={`absolute inset-0 rounded-full transition-colors ${isFavorite ? 'bg-[#C5A059]' : 'bg-white group-hover:bg-gray-200'}`}></div>

                                    {/* Ribbon Icon */}
                                    <div className="relative z-10 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill={isFavorite ? "#0A192F" : "#000000"} /* Black when inactive, Dark Navy when active(gold bg) */
                                            stroke="none"
                                        >
                                            <path d="M4.5 3h15a.5.5 0 0 1 .5.5v18a.5.5 0 0 1-.8.4l-7.2-5.4-7.2 5.4A.5.5 0 0 1 4.5 21.5v-18a.5.5 0 0 1 .5-.5Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 ${isFavorite ? 'text-[#C5A059]' : 'text-gray-400 group-hover:text-[#C5A059]'}`}>
                                        {isFavorite ? '등록됨' : '자주찾기'}
                                    </div>
                                    <div className="text-transparent text-sm md:text-base font-mono font-bold">-</div>
                                </div>
                            </button>

                        </div>

                    </div>
                </div>
            </header>

            {/* Toast Notification */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0A192F]/95 text-white px-6 py-3 rounded-full shadow-xl transition-all duration-300 flex items-center gap-3 border border-[#C5A059]/30 backdrop-blur-md ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]"></div>
                <span className="font-medium text-sm tracking-wide">{toastMessage}</span>
            </div>

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
