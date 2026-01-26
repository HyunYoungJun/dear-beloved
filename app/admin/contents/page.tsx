'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Search, ListFilter, Users, ArrowUpDown, CheckSquare, Square } from 'lucide-react';

type ObituarySimple = {
    id: string;
    deceased_name: string;
    death_date: string;
    main_image_url: string | null;
    is_public: boolean;
    created_at: string;
    biography_data: any; // Used for feature flags
};

export default function AdminContentsPage() {
    const [obituaries, setObituaries] = useState<ObituarySimple[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'name_asc' | 'recent_death' | 'past_death'>('recent_death');

    useEffect(() => {
        fetchObituaries();
    }, [sortOrder]);

    const fetchObituaries = async () => {
        setLoading(true);
        let query = supabase.from('obituaries').select('id, deceased_name, death_date, main_image_url, is_public, created_at, biography_data');

        if (sortOrder === 'name_asc') {
            query = query.order('deceased_name', { ascending: true });
        } else if (sortOrder === 'recent_death') {
            query = query.order('death_date', { ascending: false });
        } else if (sortOrder === 'past_death') {
            query = query.order('death_date', { ascending: true });
        } else {
            // Default fallback
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (data) {
            setObituaries(data);
        }
        setLoading(false);
    };

    const toggleFeature = async (id: string, featureType: 'is_today' | 'is_editor_pick', currentValue: boolean) => {
        // Optimistic UI Update
        setObituaries(prev => prev.map(item => {
            if (item.id === id) {
                const newBio = { ...item.biography_data, [featureType]: !currentValue };
                return { ...item, biography_data: newBio };
            }
            return item;
        }));

        // DB Update
        const targetItem = obituaries.find(item => item.id === id);
        if (!targetItem) return;

        const updatedBio = { ...targetItem.biography_data, [featureType]: !currentValue };

        const { error } = await supabase
            .from('obituaries')
            .update({ biography_data: updatedBio })
            .eq('id', id);

        if (error) {
            console.error('Failed to update feature:', error);
            // Revert on error
            setObituaries(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, biography_data: targetItem.biography_data };
                }
                return item;
            }));
            alert('설정 변경에 실패했습니다.');
        }
    };

    // Client-side filtering for search (Simpler for "All Content" unless massive scale)
    const filteredList = obituaries.filter(item =>
        item.deceased_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0A192F] font-['Nanum_Myeongjo'] flex items-center gap-2">
                            <Users size={28} />
                            모든 콘텐츠 관리
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            전체 <strong className="text-[#C5A059]">{filteredList.length}</strong>개의 추모 기사가 등록되어 있습니다.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="이름 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-[200px] focus:ring-1 focus:ring-[#0A192F] focus:border-[#0A192F]"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">
                                <ListFilter size={16} />
                            </div>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as any)}
                                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-[180px] appearance-none bg-white focus:ring-1 focus:ring-[#0A192F] cursor-pointer"
                            >
                                <option value="name_asc">가나다순 (ㄱ-ㅎ)</option>
                                <option value="recent_death">최근 사망일순</option>
                                <option value="past_death">과거 사망일순</option>
                            </select>
                            <ArrowUpDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                {/* Content List Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4 md:col-span-3">고인 정보</div>
                        <div className="col-span-2 text-center md:block hidden">사망년도</div>
                        <div className="col-span-3 md:col-span-2 text-center">오늘의 고인</div>
                        <div className="col-span-3 md:col-span-2 text-center">에디터 픽</div>
                        <div className="col-span-2 md:col-span-2 text-center">상태</div>
                        <div className="hidden md:block md:col-span-1 text-right">관리</div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">데이터를 불러오는 중...</div>
                    ) : filteredList.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">검색 결과가 없습니다.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredList.map((item) => {
                                const isToday = item.biography_data?.is_today === true || item.biography_data?.feature_tag === 'today';
                                const isEditor = item.biography_data?.is_editor_pick === true || item.biography_data?.feature_tag === 'editor';

                                return (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-gray-50 transition-colors group"
                                    >
                                        {/* 1. Profile (Tiny Thumbnail + Name) */}
                                        <Link href={`/obituary/${item.id}`} className="col-span-4 md:col-span-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
                                                {item.main_image_url ? (
                                                    <img src={item.main_image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">👤</div>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 truncate">
                                                {item.deceased_name}
                                            </span>
                                        </Link>

                                        {/* 2. Death Year */}
                                        <div className="col-span-2 text-center text-sm text-gray-600 font-mono md:block hidden">
                                            {item.death_date ? item.death_date.substring(0, 4) : '-'}
                                        </div>

                                        {/* 3. Today's Deceased Checkbox */}
                                        <div className="col-span-3 md:col-span-2 flex justify-center">
                                            <button
                                                onClick={() => toggleFeature(item.id, 'is_today', isToday)}
                                                className={`p-1 rounded transition-colors ${isToday ? 'text-blue-600 hover:text-blue-700' : 'text-gray-300 hover:text-gray-400'}`}
                                            >
                                                {isToday ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </button>
                                        </div>

                                        {/* 4. Editor's Pick Checkbox */}
                                        <div className="col-span-3 md:col-span-2 flex justify-center">
                                            <button
                                                onClick={() => toggleFeature(item.id, 'is_editor_pick', isEditor)}
                                                className={`p-1 rounded transition-colors ${isEditor ? 'text-[#C5A059] hover:text-[#D4AF37]' : 'text-gray-300 hover:text-gray-400'}`}
                                            >
                                                {isEditor ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </button>
                                        </div>

                                        {/* 5. Status Badge */}
                                        <div className="col-span-2 md:col-span-2 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${item.is_public
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.is_public ? '게시 중' : '비공개'}
                                            </span>
                                        </div>

                                        {/* 6. Action */}
                                        <div className="hidden md:block md:col-span-1 text-right">
                                            <Link href={`/obituary/${item.id}`} className="text-xs text-gray-400 group-hover:text-[#C5A059] transition-colors">
                                                상세 →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
