'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ObituaryCard from '@/components/obituary/ObituaryCard';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';

type ObituarySummary = {
    id: string;
    user_id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    death_date: string | null;
};

export default function LibraryPage() {
    const [obituaries, setObituaries] = useState<ObituarySummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        category: '',
    });

    // Debounce search/filter execution
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchObituaries();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filters]);

    async function fetchObituaries() {
        setLoading(true);
        try {
            let query = supabase
                .from('obituaries')
                .select('id, user_id, deceased_name, title, main_image_url, death_date')
                .eq('is_public', true)
                .neq('service_type', 'overseas') // Filter out overseas
                .order('created_at', { ascending: false });

            // Basic Search (Name or Title)
            if (searchTerm) {
                // Using 'or' logic needs careful syntax in Supabase
                // query = query.or(`deceased_name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
                // Note: .or() filter should be applied carefully.
                query = query.or(`deceased_name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
            }

            // Advanced Filters
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.startDate) {
                query = query.gte('death_date', filters.startDate);
            }
            if (filters.endDate) {
                query = query.lte('death_date', filters.endDate);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching obituaries:', error);
            } else {
                setObituaries(data || []);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ startDate: '', endDate: '', category: '' });
    };

    return (
        <div className="bg-[#F9F9F9] min-h-[calc(100vh-64px)] py-12 px-4 md:px-8 font-serif">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">인물 도서관</h1>
                        <p className="text-gray-500">기억하고 싶은 소중한 분들의 이야기입니다.</p>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10 transition-all">
                    <div className="relative flex items-center gap-2 mb-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="고인의 성함이나 제목을 검색해보세요"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <button
                            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${isAdvancedOpen
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <SlidersHorizontal size={18} />
                            <span className="hidden md:inline">상세검색</span>
                        </button>
                    </div>

                    {/* Advanced Filters Panel */}
                    <div className={`overflow-hidden transition-all duration-300 ${isAdvancedOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-sm text-gray-700">상세 필터</h3>
                                <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
                                    <X size={12} /> 필터 초기화
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">카테고리</label>
                                    <select
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:border-gray-900 outline-none"
                                    >
                                        <option value="">전체</option>
                                        <option value="politics">정치·공무</option>
                                        <option value="economy">경제·경영</option>
                                        <option value="academia">학계·연구</option>
                                        <option value="culture">문화·예술</option>
                                        <option value="society">가족·사회</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">기간 (시작)</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:border-gray-900 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">기간 (종료)</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:border-gray-900 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                ) : obituaries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {obituaries.map((obituary) => (
                            <ObituaryCard
                                key={obituary.id}
                                id={obituary.id}
                                authorId={obituary.user_id}
                                deceasedName={obituary.deceased_name}
                                title={obituary.title}
                                imageUrl={obituary.main_image_url}
                                deathDate={obituary.death_date}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                        <p className="text-gray-500 mb-4">{searchTerm || filters.category ? '검색 결과가 없습니다.' : '등록된 메모리얼 기사가 없습니다.'}</p>
                        <Link href="/write" className="text-gray-900 underline hover:no-underline font-medium">
                            첫 번째 이야기를 기록해보세요.
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
