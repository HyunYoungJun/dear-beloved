'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // The Supabase client automatically handles the hash fragment parsing.
        // We just need to wait for the session to be established and then redirect.

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || session) {
                // Successful login, redirect to home
                router.replace('/');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">로그인 중입니다...</p>
            <p className="text-sm text-gray-400 mt-2">잠시만 기다려주세요.</p>
        </div>
    );
}
