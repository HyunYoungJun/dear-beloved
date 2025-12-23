'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, UserPlus, X } from 'lucide-react';

export type FamilyRelationDraft = {
    related_obituary_id: string;
    deceased_name: string;
    main_image_url: string | null;
    relation_type: string; // 'Parent', 'Child', 'Spouse', 'Sibling', 'Other'
};

interface FamilyConnectFormProps {
    relations: FamilyRelationDraft[];
    onChange: (relations: FamilyRelationDraft[]) => void;
}

export default function FamilyConnectForm({ relations, onChange }: FamilyConnectFormProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setIsSearching(true);

        try {
            const { data, error } = await supabase
                .from('obituaries')
                .select('id, deceased_name, main_image_url, death_date, title')
                .ilike('deceased_name', `%${searchTerm}%`)
                .limit(5);

            if (data) {
                setSearchResults(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAdd = (obituary: any, type: string) => {
        // Prevent duplicates
        if (relations.some(r => r.related_obituary_id === obituary.id)) {
            return alert('이미 목록에 추가된 분입니다.');
        }

        const newRelation: FamilyRelationDraft = {
            related_obituary_id: obituary.id,
            deceased_name: obituary.deceased_name,
            main_image_url: obituary.main_image_url,
            relation_type: type
        };
        onChange([...relations, newRelation]);
        // Clear Search
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleRemove = (id: string) => {
        onChange(relations.filter(r => r.related_obituary_id !== id));
    };

    return (
        <div className="space-y-8">
            {/* Search Section */}
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Search size={18} />
                    가족 찾기
                </h3>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="고인의 성함을 입력하세요"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isSearching ? '검색 중...' : '검색'}
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded divide-y divide-gray-100 max-h-60 overflow-y-auto shadow-sm">
                        {searchResults.map((item) => (
                            <div key={item.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                                        {item.main_image_url ? (
                                            <img src={item.main_image_url} alt={item.deceased_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">{item.deceased_name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{item.title}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <select
                                        className="text-xs border border-gray-300 rounded px-1 py-1 outline-none"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleAdd(item, e.target.value);
                                                e.target.value = ''; // Reset select
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>관계 선택</option>
                                        <option value="부모">부모</option>
                                        <option value="자녀">자녀</option>
                                        <option value="배우자">배우자</option>
                                        <option value="형제/자매">형제/자매</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Added Relations List */}
            <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">연결된 가족 ({relations.length}명)</h3>

                {relations.length === 0 ? (
                    <div className="text-center py-8 bg-white border border-dashed border-gray-300 rounded text-gray-400 text-sm">
                        등록된 가족이 없습니다.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relations.map((rel) => (
                            <div key={rel.related_obituary_id} className="flex items-center p-3 bg-indigo-50 border border-indigo-100 rounded relative group">
                                <div className="w-12 h-12 rounded-full bg-white overflow-hidden border border-indigo-200 shrink-0">
                                    {rel.main_image_url ? (
                                        <img src={rel.main_image_url} alt={rel.deceased_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <span className="inline-block bg-indigo-200 text-indigo-800 text-[10px] px-1.5 py-0.5 rounded font-bold mb-0.5">
                                        {rel.relation_type}
                                    </span>
                                    <div className="font-bold text-gray-900">{rel.deceased_name}</div>
                                </div>
                                <button
                                    onClick={() => handleRemove(rel.related_obituary_id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
