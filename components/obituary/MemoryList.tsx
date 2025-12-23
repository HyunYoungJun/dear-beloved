'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/supabase';
import { Loader2, Quote, Flower2 } from 'lucide-react';
import Image from 'next/image';

type Memory = Database['public']['Tables']['memories']['Row'];

interface MemoryListProps {
    obituaryId: string;
    refreshTrigger: number;
}

export default function MemoryList({ obituaryId, refreshTrigger }: MemoryListProps) {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // Track local flower counts for immediate UI feedback
    const [localFlowerCounts, setLocalFlowerCounts] = useState<Record<string, number>>({});

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

                // Initialize local flower counts
                const initialCounts: Record<string, number> = {};
                data?.forEach(m => {
                    initialCounts[m.id] = m.flower_count || 0;
                });
                setLocalFlowerCounts(initialCounts);
            } catch (error) {
                console.error('Error fetching memories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemories();
    }, [obituaryId, refreshTrigger]);

    const handleFlowerClick = async (memoryId: string) => {
        // Optimistic update
        setLocalFlowerCounts(prev => ({
            ...prev,
            [memoryId]: (prev[memoryId] || 0) + 1
        }));

        try {
            const { error } = await supabase.rpc('increment_flower_count', { row_id: memoryId });
            if (error) throw error;
        } catch (error) {
            console.error('Error giving flower:', error);
            // Revert optimistic update on error
            setLocalFlowerCounts(prev => ({
                ...prev,
                [memoryId]: (prev[memoryId] || 0) - 1
            }));
        }
    };

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
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {memories.map((memory) => (
                <div
                    key={memory.id}
                    className="break-inside-avoid bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_0px_rgba(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-[var(--heritage-gold)]/20"
                >
                    <div className="mb-4">
                        <Quote className="w-5 h-5 text-[var(--heritage-gold)]/60 mb-3" />
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed font-['Nanum_Myeongjo']">
                            {memory.content}
                        </p>
                    </div>

                    {memory.image_url && (
                        <div className="mb-5 relative rounded-lg overflow-hidden shadow-sm group">
                            <Image
                                src={memory.image_url}
                                alt="Memory"
                                width={500}
                                height={300}
                                className="w-full h-auto object-cover transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-[var(--heritage-navy)] text-sm font-['Nanum_Myeongjo']">
                                {memory.author}
                            </span>
                            <span className="text-[11px] text-gray-400 mt-0.5">
                                {new Date(memory.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <button
                            onClick={() => handleFlowerClick(memory.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-[var(--heritage-gold)]/10 text-gray-500 hover:text-[var(--heritage-gold)] transition-colors group"
                            title="헌화하기"
                        >
                            <Flower2 className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-active:scale-90" />
                            <span className="text-xs font-medium">
                                {localFlowerCounts[memory.id] || 0}
                            </span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
