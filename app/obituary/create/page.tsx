'use client';

import ObituaryForm from '@/components/obituary/ObituaryForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WritePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null; // Redirecting...
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 px-4">
            <ObituaryForm />
        </div>
    );
}
