'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ArrowLeft, Check, X, Search, Quote } from 'lucide-react';

type ObituaryQuote = {
    id: string;
    deceased_name: string;
    death_date: string | null;
    biography_data: {
        quote?: string;
        is_quote_featured?: boolean;
        [key: string]: any;
    };
    created_at: string;
};

export default function QuoteAdminPage() {
    const [quotes, setQuotes] = useState<ObituaryQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchQuotes();
    }, []);

    async function fetchQuotes() {
        setLoading(true);
        // Fetch all obituaries that have biography_data (potential quotes)
        const { data, error } = await supabase
            .from('obituaries')
            .select('id, deceased_name, death_date, biography_data, created_at')
            .not('biography_data', 'is', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quotes:', error);
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
        } else {
            // Filter client-side for those that actually have a quote string
            const validQuotes = data?.filter((item: any) =>
                item.biography_data?.quote && item.biography_data.quote.trim().length > 0
            ) || [];
            setQuotes(validQuotes);
        }
        setLoading(false);
    }

    const toggleFeatured = async (id: string, currentStatus: boolean, biographyData: any) => {
        setSaving(id);
        const newStatus = !currentStatus;

        // Update local state immediately for responsiveness
        setQuotes(prev => prev.map(q =>
            q.id === id
                ? { ...q, biography_data: { ...q.biography_data, is_quote_featured: newStatus } }
                : q
        ));

        // Update DB
        const updatedBio = { ...biographyData, is_quote_featured: newStatus };
        const { error } = await supabase
            .from('obituaries')
            .update({ biography_data: updatedBio })
            .eq('id', id);

        if (error) {
            console.error('Error updating quote status:', error);
            alert('상태 업데이트 실패');
            // Revert on error
            setQuotes(prev => prev.map(q =>
                q.id === id
                    ? { ...q, biography_data: { ...q.biography_data, is_quote_featured: currentStatus } }
                    : q
            ));
        }
        setSaving(null);
    };

    const filteredQuotes = quotes.filter(q =>
        q.deceased_name.includes(searchTerm) ||
        q.biography_data.quote?.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#F9F9F9] p-6 lg:p-12 font-['Malgun_Gothic']">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> 홈으로 돌아가기
                        </Link>
                        <h1 className="text-3xl font-bold text-[#0A192F]">명언 콘텐츠 관리</h1>
                        <p className="text-gray-500 mt-1">메인 페이지에 노출할 고인의 명언을 선택하세요.</p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="이름 또는 명언 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C5A059]"
                        />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">데이터를 불러오는 중...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuotes.map((item) => {
                            const isFeatured = item.biography_data.is_quote_featured === true;

                            return (
                                <div
                                    key={item.id}
                                    className={`bg-white rounded-lg border transition-all duration-300 relative overflow-hidden group
                                        ${isFeatured ? 'border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/20' : 'border-gray-200 hover:border-gray-300'}
                                    `}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#0A192F]">故 {item.deceased_name}</h3>
                                                <p className="text-xs text-gray-400">
                                                    {item.death_date ? new Date(item.death_date).getFullYear() : ''} 별세
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => toggleFeatured(item.id, isFeatured, item.biography_data)}
                                                disabled={saving === item.id}
                                                className={`
                                                    w-10 h-6 rounded-full transition-colors relative
                                                    ${isFeatured ? 'bg-[#C5A059]' : 'bg-gray-200'}
                                                `}
                                            >
                                                <div className={`
                                                    absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform
                                                    ${isFeatured ? 'translate-x-4' : 'translate-x-0'}
                                                `}></div>
                                            </button>
                                        </div>

                                        <div className="relative bg-[#FDFBF7] p-4 rounded border border-[#C5A059]/10">
                                            <Quote className="w-4 h-4 text-[#C5A059]/40 mb-2" />
                                            <p className="text-gray-700 leading-relaxed break-keep line-clamp-4">
                                                {item.biography_data.quote}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    {isFeatured && (
                                        <div className="bg-[#C5A059] text-white text-[10px] font-bold px-3 py-1 text-center w-full">
                                            메인 페이지 노출 중
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredQuotes.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
                                검색 결과가 없거나 등록된 명언이 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
