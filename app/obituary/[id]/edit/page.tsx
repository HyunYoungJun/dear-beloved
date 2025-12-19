'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ObituaryForm from '@/components/obituary/ObituaryForm';
import { useAuth } from '@/components/auth/AuthProvider';

export default function EditObituaryPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [obituary, setObituary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchObituary() {
            if (!id || !user) return;

            const { data, error } = await supabase
                .from('obituaries')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching obituary', error);
                alert('글을 불러오지 못했습니다.');
                router.push('/library');
                return;
            }

            // Check permission
            const isAdmin = user.email === 'youngjun88@gmail.com';
            if (data.user_id !== user.id && !isAdmin) {
                alert('수정 권한이 없습니다.');
                router.push('/library');
                return;
            }

            setObituary(data);
            setLoading(false);
        }
        fetchObituary();
    }, [id, user, router]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <ObituaryForm
            initialData={obituary}
            obituaryId={obituary.id}
            isEditMode={true}
        />
    );
}
