'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ObituaryCard from '@/components/obituary/ObituaryCard';
import Link from 'next/link';

type ObituarySummary = {
    id: string;
    user_id: string;
    deceased_name: string;
    title: string;
    main_image_url: string | null;
    death_date: string | null;
    biography_data: any;
};

export default function OverseasPage() {
    const [obituaries, setObituaries] = useState<ObituarySummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchObituaries();
    }, []);

    async function fetchObituaries() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('obituaries')
                .select('*')
                .eq('service_type', 'overseas') // Strict filtering for Overseas
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching overseas obituaries:', error);
            } else {
                setObituaries(data || []);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#F9F9F9] min-h-[calc(100vh-64px)] py-12 px-4 md:px-8 font-serif">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-[#0A192F] mb-3">해외 추모기사</h1>
                    <p className="text-gray-500">전 세계의 기억해야 할 인물들의 이야기를 전합니다.</p>
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
                            <div key={obituary.id} className="group relative">
                                <ObituaryCard
                                    id={obituary.id}
                                    authorId={obituary.user_id}
                                    deceasedName={obituary.deceased_name}
                                    title={obituary.title}
                                    imageUrl={obituary.main_image_url}
                                    deathDate={obituary.death_date}
                                />
                                {/* Country Tag Overlay */}
                                {obituary.biography_data?.country && (
                                    <div className="absolute top-3 right-3 bg-[#0A192F]/90 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider shadow-sm z-10">
                                        {obituary.biography_data.country}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                        <p className="text-gray-500">등록된 해외 추모기사가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
