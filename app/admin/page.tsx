'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [obituaries, setObituaries] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user || user.email !== 'youngjun88@gmail.com') {
                alert('관리자 권한이 없습니다.');
                router.push('/');
                return;
            }
            fetchObituaries();
        }
    }, [user, loading, router]);

    const fetchObituaries = async () => {
        setIsLoadingData(true);
        const { data, error } = await supabase
            .from('obituaries')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setObituaries(data);
        setIsLoadingData(false);
    };

    const updateFeatureTag = async (id: string, tag: 'today' | 'editor' | null, currentBioData: any) => {
        const newBioData = { ...currentBioData, feature_tag: tag };

        // If setting 'today' or 'editor', we might want to unset others? 
        // For simplicity, we just set this one. But logically we should clear others if they overlap?
        // Let's keep it simple: just update this row.

        const { error } = await supabase
            .from('obituaries')
            .update({ biography_data: newBioData })
            .eq('id', id);

        if (error) {
            alert('업데이트 실패: ' + error.message);
        } else {
            fetchObituaries();
        }
    };

    if (loading || isLoadingData) return <div className="p-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">관리자 페이지 - 기사 관리</h1>
                <Link
                    href="/admin/overseas/create"
                    className="bg-[#0A192F] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#112240] transition-colors flex items-center gap-2"
                >
                    + 해외기사 작성
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
                        <tr>
                            <th className="px-6 py-3">날짜</th>
                            <th className="px-6 py-3">고인</th>
                            <th className="px-6 py-3">제목</th>
                            <th className="px-6 py-3">설정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obituaries.map((item) => {
                            const tag = item.biography_data?.feature_tag;
                            return (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-bold">{item.deceased_name}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{item.title}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => updateFeatureTag(item.id, tag === 'today' ? null : 'today', item.biography_data)}
                                            className={`px-3 py-1 rounded border text-xs font-bold ${tag === 'today' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            오늘의 고인
                                        </button>
                                        <button
                                            onClick={() => updateFeatureTag(item.id, tag === 'editor' ? null : 'editor', item.biography_data)}
                                            className={`px-3 py-1 rounded border text-xs font-bold ${tag === 'editor' ? 'bg-black text-white border-black' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            에디터 픽
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
