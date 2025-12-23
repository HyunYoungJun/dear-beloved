'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/supabase';
import { Loader2, Quote } from 'lucide-react';
import Image from 'next/image';

type Memory = Database['public']['Tables']['memories']['Row'];

interface MemoryListProps {
    obituaryId: string;
    refreshTrigger: number;
}

export default function MemoryList({ obituaryId, refreshTrigger }: MemoryListProps) {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const { data, error } = await supabase
                    .from('memories')
                    .select('*')
                    .eq('obituary_id', obituaryId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setMemories(data || []);
            } catch (error) {
                console.error('Error fetching memories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemories();
    }, [obituaryId, refreshTrigger]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-[var(--heritage-gold)] animate-spin" />
            </div>
        );
    }

    if (memories.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 font-serif">아직 등록된 추모 메시지가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">첫 번째 메시지를 남겨주세요.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.map((memory) => (
                <div
                    key={memory.id}
                    className="group bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-[var(--heritage-gold)]/30 hover:shadow-md transition-all duration-300"
                >
                    <div className="mb-4">
                        <Quote className="w-6 h-6 text-[var(--heritage-gold)]/40 mb-2" />
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[4.5em]">
                            {memory.content}
                        </p>
                    </div>

                    {memory.image_url && (
                        <div className="mb-4 relative h-48 rounded-md overflow-hidden bg-gray-100">
                            <Image
                                src={memory.image_url}
                                alt="Memory"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="font-bold text-[var(--heritage-navy)] text-sm">
                            {memory.author}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(memory.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
