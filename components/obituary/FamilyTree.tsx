'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

type FamilyMember = {
    id: string; // family_relation id
    relation_role: string; // Normalized role relative to current obituary (Parent, Child, Spouse, Sibling)
    obituary: {
        id: string;
        deceased_name: string;
        main_image_url: string | null;
        death_date: string | null;
        title: string;
    }
};

interface FamilyTreeProps {
    obituaryId: string;
}

export default function FamilyTree({ obituaryId }: FamilyTreeProps) {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFamily() {
            setLoading(true);
            try {
                // 1. Fetch where current obituary is the 'source'
                const { data: sourceRelations } = await supabase
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

                // 2. Fetch where current obituary is the 'target'
                const { data: targetRelations } = await supabase
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

                const normalizedMembers: FamilyMember[] = [];

                // Process Source Relations (Direct mapping)
                sourceRelations?.forEach((item: any) => {
                    normalizedMembers.push({
                        id: item.id,
                        relation_role: item.relation_type, // e.g. "Parent" means they are my Parent
                        obituary: item.obituaries
                    });
                });

                // Process Target Relations (Inverse mapping)
                // If Item says "Parent" pointing to Me, it means Item is my Child.
                // If Item says "Child" pointing to Me, it means Item is my Parent.
                targetRelations?.forEach((item: any) => {
                    let inverseRole = '가족';
                    const type = item.relation_type;
                    if (type === '부모') inverseRole = '자녀';
                    else if (type === '자녀') inverseRole = '부모';
                    else if (type === '배우자') inverseRole = '배우자';
                    else if (type === '형제/자매') inverseRole = '형제/자매';

                    normalizedMembers.push({
                        id: item.id,
                        relation_role: inverseRole,
                        obituary: item.obituaries
                    });
                });

                // Remove duplicates based on obituary ID
                const uniqueMembers = Array.from(new Map(normalizedMembers.map(m => [m.obituary.id, m])).values());

                setFamilyMembers(uniqueMembers);

            } catch (err) {
                console.error("Error fetching family tree:", err);
            } finally {
                setLoading(false);
            }
        }

        if (obituaryId) {
            fetchFamily();
        }
    }, [obituaryId]);

    // Grouping
    const parents = familyMembers.filter(m => m.relation_role === '부모');
    const spouses = familyMembers.filter(m => m.relation_role === '배우자');
    const siblings = familyMembers.filter(m => m.relation_role === '형제/자매');
    const children = familyMembers.filter(m => m.relation_role === '자녀');
    const others = familyMembers.filter(m => !['부모', '배우자', '형제/자매', '자녀'].includes(m.relation_role));

    if (familyMembers.length === 0) return null;

    const NodeCard = ({ member, role }: { member: FamilyMember, role?: string }) => (
        <Link href={`/obituary/${member.obituary.id}`} className="flex flex-col items-center group relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[var(--heritage-gold)] p-1 bg-white mb-2 shadow-sm group-hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] transition-all duration-500">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                    {member.obituary.main_image_url ? (
                        <img
                            src={member.obituary.main_image_url}
                            alt={member.obituary.deceased_name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
            </div>
            <span className="text-[10px] text-[var(--heritage-navy)] font-bold tracking-widest uppercase mb-1 bg-[var(--heritage-gold)]/10 px-2 py-0.5 rounded-full">
                {role || member.relation_role}
            </span>
            <span className="text-sm md:text-base font-serif font-bold text-gray-900 group-hover:text-[var(--heritage-navy)] transition-colors">
                {member.obituary.deceased_name}
            </span>
        </Link>
    );

    return (
        <div className="mt-16 pt-12 border-t border-[var(--heritage-gold)]/30">
            <h3 className="text-2xl font-serif font-bold text-[var(--heritage-navy)] mb-12 text-center flex items-center justify-center gap-3">
                <span className="w-8 h-[1px] bg-[var(--heritage-gold)]"></span>
                가족 아카이브
                <span className="w-8 h-[1px] bg-[var(--heritage-gold)]"></span>
            </h3>

            <div className="relative max-w-4xl mx-auto px-4 min-h-[400px] flex flex-col items-center justify-center gap-12">

                {/* Vertical Line Background */}
                <div className="absolute left-1/2 top-10 bottom-10 w-[1px] bg-[var(--heritage-navy)]/20 -translate-x-1/2 z-0 hidden md:block"></div>

                {/* 1. Parents Level */}
                {parents.length > 0 && (
                    <div className="flex gap-8 md:gap-16 justify-center relative w-full">
                        {parents.map(p => <NodeCard key={p.id} member={p} />)}
                    </div>
                )}

                {/* 2. Middle Level: Spouse - SELF (concept) - Siblings */}
                <div className="flex flex-wrap gap-8 md:gap-12 justify-center items-center relative w-full z-10">
                    {/* Spouses */}
                    {spouses.map(s => <NodeCard key={s.id} member={s} />)}

                    {/* Self Placeholder (Optional, for visual center) */}
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[var(--heritage-navy)] mb-2 ring-4 ring-[var(--heritage-gold)]/20"></div>
                        <span className="text-xs font-serif text-gray-400">故人</span>
                    </div>

                    {/* Siblings */}
                    {siblings.map(sib => <NodeCard key={sib.id} member={sib} />)}

                    {/* Others */}
                    {others.map(o => <NodeCard key={o.id} member={o} />)}
                </div>

                {/* 3. Children Level */}
                {children.length > 0 && (
                    <div className="flex flex-wrap gap-8 md:gap-16 justify-center relative w-full pt-4">
                        {/* Horizontal Line for children branching */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-[var(--heritage-navy)]/20 hidden md:block"></div>
                        {/* Vertical connectors for children */}

                        {children.map(c => (
                            <div key={c.id} className="relative">
                                {/* Small vertical line to connect to horizontal line */}
                                <div className="absolute -top-4 left-1/2 w-[1px] h-4 bg-[var(--heritage-navy)]/20 -translate-x-1/2 hidden md:block"></div>
                                <NodeCard member={c} />
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

