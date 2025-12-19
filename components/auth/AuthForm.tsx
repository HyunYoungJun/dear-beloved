'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'login' | 'signup';

export default function AuthForm({ mode }: { mode: AuthMode }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('회원가입 확인 메일을 발송했습니다. 이메일을 확인해주세요.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-center text-gray-900">
                {mode === 'login' ? '로그인' : '회원가입'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        placeholder="admin@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {loading ? '처리 중...' : (mode === 'login' ? '로그인하기' : '가입하기')}
                </button>
            </form>

            <div className="text-center text-sm text-gray-500">
                {mode === 'login' ? (
                    <>
                        계정이 없으신가요?{' '}
                        <Link href="/signup" className="text-gray-900 font-medium hover:underline">
                            회원가입
                        </Link>
                    </>
                ) : (
                    <>
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="text-gray-900 font-medium hover:underline">
                            로그인
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
