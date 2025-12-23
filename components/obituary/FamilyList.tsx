'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Users } from 'lucide-react';

type FamilyMember = {
    id: string; // family_relation id
    relation_type: string;
    obituary: {
        id: string;
        deceased_name: string;
        main_image_url: string | null;
        death_date: string | null;
        title: string;
    }
};

interface FamilyListProps {
    obituaryId: string;
}

export default function FamilyList({ obituaryId }: FamilyListProps) {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFamily() {
            setLoading(true);
            try {
                // 1. Fetch where current obituary is the 'source' (e.g. Current -> [Parent] -> Father)
                const { data: sourceRelations, error: sourceError } = await supabase
                    .from('family_relations')
                    .select(`
                        id,
                        relation_type,
                        related_obituary_id,
                        obituaries!family_relations_related_obituary_id_fkey (
                            id, deceased_name, main_image_url, death_date, title
                        )
                    `)
                    .eq('obituary_id', obituaryId);

                if (sourceError) {
                    console.error("Error fetching source relations:", sourceError);
                }

                // 2. Fetch where current obituary is the 'target' (e.g. Son -> [Child] -> Current)
                // Note: If A is Child of B, A's page might want to show B as Parent.
                // But typically relationships are stored as:
                // obit_id: A (Child), related_id: B (Father), type: "Father"
                // Then on A's page, we look for matches where A is obit_id.
                // If B (Father) adds A (Child), it would be:
                // obit_id: B, related_id: A, type: "Child"
                // To display ALL connections, we might need to query both directions or standardize entry.
                // For now, let's assume bidirectional or smart checking.
                // Let's query both and combine for a complete "Family Network".

                const { data: targetRelations, error: targetError } = await supabase
                    .from('family_relations')
                    .select(`
                        id,
                        relation_type,
                        obituary_id,
                        obituaries!family_relations_obituary_id_fkey (
                            id, deceased_name, main_image_url, death_date, title
                        )
                    `)
                    .eq('related_obituary_id', obituaryId);

                if (targetError) {
                    console.error("Error fetching target relations:", targetError);
                }

                const formattedSource = (sourceRelations || []).map((item: any) => ({
                    id: item.id,
                    relation_type: item.relation_type,
                    obituary: item.obituaries
                }));

                // For reverse relations, we might want to invert the label? 
                // E.g. If relation is "Parent" from A to B. B is Parent of A.
                // If we view A, we see B as "Parent". (Correct)
                // If relation is "Child" from B to A. A is Child of B.
                // If we view A, we verify B as ... "Parent"?
                // The prompt assumes a simple list. Let's just list them.
                // If relation_type is "Husband", reverse might be "Wife" or "Spouse".
                // This logic can be complex. For v1, let's display relevant family members found.
                // We will append a generic "Family" tag or use the stored type for 'target' relations if appropriate,
                // or just display them.
                // Actually, if I am 'related_obituary_id', then 'obituary_id' is my relative.
                // The relation_type stored is "How related_obituary is to obituary_id".
                // e.g. Obit: A, Related: B, Type: "Parent" (B is Parent of A).
                // If I view B, I find row where related=B. Type is "Parent".
                // It means "B is Parent of A". So A is B's child.

                const formattedTarget = (targetRelations || []).map((item: any) => ({
                    id: item.id,
                    relation_type: "가족", // Simplified for reverse lookup unless we implement reverse mapping logic
                    obituary: item.obituaries
                }));

                // Dedup by ID
                const allMembers = [...formattedSource, ...formattedTarget];
                const uniqueMembers = Array.from(new Map(allMembers.map(item => [item.obituary.id, item])).values());

                setFamilyMembers(uniqueMembers);

            } catch (err) {
                console.error("Unexpected error fetching family:", err);
            } finally {
                setLoading(false);
            }
        }

        if (obituaryId) {
            fetchFamily();
        }
    }, [obituaryId]);

    if (!familyMembers.length) return null;

    return (
        <div className="mt-12 pt-8 border-t border-[var(--heritage-gold)]/30">
            <h3 className="text-xl font-serif font-bold text-[var(--heritage-navy)] mb-6 flex items-center gap-2">
                <Users size={20} className="text-[var(--heritage-gold)]" />
                가족 아카이브
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyMembers.map((member) => (
                    <Link href={`/obituary/${member.obituary.id}`} key={member.id} className="block group">
                        <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-lg border border-stone-100 hover:border-[var(--heritage-gold)] transition-colors shadow-sm">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-white shadow-sm shrink-0">
                                {member.obituary.main_image_url ? (
                                    <img
                                        src={member.obituary.main_image_url}
                                        alt={member.obituary.deceased_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col min-w-0">
                                <span className="inline-block bg-[var(--heritage-navy)] text-white text-[10px] px-2 py-0.5 rounded-full w-fit mb-1 font-sans">
                                    {member.relation_type}
                                </span>
                                <h4 className="text-lg font-serif font-bold text-gray-900 leading-none mb-1 group-hover:text-[var(--heritage-navy)] transition-colors truncate">
                                    {member.obituary.deceased_name}
                                </h4>
                                <p className="text-xs text-gray-500 truncate font-light">
                                    {member.obituary.title}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="ml-auto text-gray-300 group-hover:text-[var(--heritage-gold)] transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
