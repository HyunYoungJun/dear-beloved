'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { Flower2, BookOpen, Settings, LogOut, ChevronRight } from 'lucide-react';

export default function MyPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'tributes' | 'favorites' | 'history' | 'settings'>('tributes');

    // Data States
    const [totalFlowerCount, setTotalFlowerCount] = useState(0);
    const [myTributes, setMyTributes] = useState<any[]>([]);
    const [readArticles, setReadArticles] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchUserData();
        }
    }, [user, loading, activeTab]); // Re-fetch on tab change if needed, mostly init

    async function fetchUserData() {
        if (!user) return;
        setIsLoadingData(true);

        try {
            // 1. Fetch Total Flower Count & Tributes
            const { data: floralData, error: floralError } = await supabase
                .from('flower_offerings')
                .select('*, obituaries(id, title, deceased_name, main_image_url)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (floralData) {
                setTotalFlowerCount(floralData.length);
                setMyTributes(floralData);
            }

            // 2. Fetch Read Articles (from LocalStorage IDs)
            if (activeTab === 'history') {
                const viewedIds = JSON.parse(localStorage.getItem('viewed_obituaries') || '[]');
                if (viewedIds.length > 0) {
                    const { data: historyData } = await supabase
                        .from('obituaries')
                        .select('id, title, deceased_name, main_image_url, death_date')
                        .in('id', viewedIds);

                    if (historyData) {
                        // Sort by order in viewedIds (recent first)
                        const sortedHistory = viewedIds
                            .map((id: string) => historyData.find(item => item.id === id))
                            .filter(Boolean);
                        setReadArticles(sortedHistory);
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching my page data:', error);
        } finally {
            setIsLoadingData(false);
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">

                {/* 1. Header Profile Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#0A192F] text-[#C5A059] flex items-center justify-center text-3xl font-bold shadow-md">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-[#0A192F] mb-1 font-['Nanum_Myeongjo']">
                            {user.user_metadata?.name || user.email?.split('@')[0]}님
                        </h1>
                        <p className="text-gray-500 text-sm mb-3">{user.email}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] border border-[#C5A059]/20 rounded-full">
                            <Flower2 size={16} className="text-[#C5A059]" />
                            <span className="text-sm font-medium text-[#5A4A32]">
                                지금까지 총 <strong className="text-[#C5A059] text-base">{totalFlowerCount}</strong>번 헌화하셨습니다.
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Tabs Navigation */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('tributes')}
                        className={`flex-1 py-4 text-center font-bold text-sm md:text-base border-b-2 transition-colors ${activeTab === 'tributes'
                            ? 'border-[#0A192F] text-[#0A192F]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        나의 헌화
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-4 text-center font-bold text-sm md:text-base border-b-2 transition-colors ${activeTab === 'history'
                            ? 'border-[#0A192F] text-[#0A192F]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        내가 읽은 기사
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-4 text-center font-bold text-sm md:text-base border-b-2 transition-colors ${activeTab === 'settings'
                            ? 'border-[#0A192F] text-[#0A192F]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        설정
                    </button>
                </div>

                {/* 3. Tab Content */}
                <div className="min-h-[400px]">

                    {/* (1) My Tributes Tab */}
                    {activeTab === 'tributes' && (
                        <div className="space-y-4">
                            {myTributes.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <Flower2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>아직 헌화한 기록이 없습니다.</p>
                                </div>
                            ) : (
                                myTributes.map((item) => (
                                    <Link
                                        href={`/obituary/${item.obituaries.id}`}
                                        key={item.id}
                                        className="block bg-white border border-gray-100 rounded-lg p-5 hover:border-[#C5A059]/50 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                {item.obituaries.main_image_url ? (
                                                    <img src={item.obituaries.main_image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Flower2 size={20} className="text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-[#C5A059] font-bold mb-1">
                                                    {new Date(item.created_at).toLocaleDateString()} 헌화함
                                                </p>
                                                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#C5A059] transition-colors">
                                                    故 {item.obituaries.deceased_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">{item.obituaries.title}</p>
                                            </div>
                                            <ChevronRight className="text-gray-300 group-hover:text-[#C5A059]" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {/* (2) Favorites Tab (NEW) */}
                    {activeTab === 'favorites' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userFavorites.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-gray-400">
                                    <div className="w-12 h-12 mx-auto mb-3 opacity-20 bg-gray-200 rounded-full flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21z" /></svg>
                                    </div>
                                    <p>등록된 '자주 찾는 분'이 없습니다.</p>
                                </div>
                            ) : (
                                userFavorites.map((fav) => (
                                    <Link
                                        href={`/obituary/${fav.obituaries.id}`}
                                        key={fav.id}
                                        className="relative block bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-[#C5A059]/50 hover:shadow-md transition-all group"
                                    >
                                        <div className="h-40 bg-gray-100 relative overflow-hidden">
                                            {fav.obituaries.main_image_url ? (
                                                <img
                                                    src={fav.obituaries.main_image_url}
                                                    alt={fav.obituaries.deceased_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                            {/* Ribbon Overlay */}
                                            <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full shadow-sm text-[#0A192F]">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21z" /></svg>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1 font-['Nanum_Myeongjo'] group-hover:text-[#C5A059] transition-colors">
                                                故 {fav.obituaries.deceased_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                                                {fav.obituaries.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {fav.obituaries.birth_date} ~ {fav.obituaries.death_date}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {/* (2) History Tab */}
                    {activeTab === 'history' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {readArticles.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-gray-400">
                                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>최근 읽은 기사가 없습니다.</p>
                                </div>
                            ) : (
                                readArticles.map((obituary) => (
                                    <Link
                                        href={`/obituary/${obituary.id}`}
                                        key={obituary.id}
                                        className="block bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-[#C5A059]/50 hover:shadow-md transition-all group"
                                    >
                                        <div className="h-40 bg-gray-100 relative overflow-hidden">
                                            {obituary.main_image_url ? (
                                                <img
                                                    src={obituary.main_image_url}
                                                    alt={obituary.deceased_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1 font-['Nanum_Myeongjo'] group-hover:text-[#C5A059] transition-colors">
                                                故 {obituary.deceased_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 h-10 leading-relaxed mb-3">
                                                {obituary.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {obituary.death_date} 별세
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {/* (3) Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">알림 설정</p>
                                        <p className="text-xs text-gray-500">중요한 추모 소식을 받습니다</p>
                                    </div>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" />
                                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full p-6 flex items-center gap-3 hover:bg-red-50 hover:text-red-500 transition-colors text-left group"
                            >
                                <div className="p-2 bg-red-50 rounded-lg text-red-400 group-hover:bg-red-100 group-hover:text-red-500">
                                    <LogOut size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-red-500">로그아웃</p>
                                    <p className="text-xs text-gray-500 group-hover:text-red-300">현재 기기에서 로그아웃합니다</p>
                                </div>
                            </button>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
