'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !nickname) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        if (password.length < 6) {
            alert('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: nickname, // 'name' standard claim for full name/nickname
                    },
                },
            });

            if (error) throw error;

            alert('가입이 완료되었습니다!\n로그인 상태로 메인 페이지로 이동합니다.');
            router.push('/');
            router.refresh(); // Refresh Auth State
        } catch (error: any) {
            console.error('Signup error:', error);
            alert('회원가입 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류'));
        } finally {
            setLoading(false);
        }
    };

    const handleKakaoLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Kakao login error:', error);
            alert('카카오 로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center py-16 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10 border border-gray-100">

                {/* Header Phase */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A192F] mb-3 font-['Nanum_Myeongjo']">
                        환영합니다
                    </h1>
                    <p className="text-gray-500 text-lg">
                        소중한 기억을 함께 나누는 공간,<br />
                        <span className="font-bold text-[#C5A059]">Dear˚Beloved</span> 입니다.
                    </p>
                </div>

                {/* Kakao Login Section - Senior Friendly (Large Button) */}
                <button
                    onClick={handleKakaoLogin}
                    className="w-full py-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] rounded-lg font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-3 mb-8"
                >
                    {/* SVG Icon for Kakao (Simplified Speech Bubble) */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C6.477 3 2 6.477 2 10.765C2 13.627 3.868 16.126 6.666 17.425C6.48 18.061 5.097 20.67 5.097 20.67C5.097 20.67 7.643 19.566 10.04 17.934C10.67 17.994 11.325 18.029 12 18.029C17.523 18.029 22 14.552 22 10.265C22 5.977 17.523 3 12 3Z" />
                    </svg>
                    카카오로 3초 만에 시작하기
                </button>

                {/* Divider */}
                <div className="relative flex py-5 items-center mb-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">또는 이메일로 가입하기</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleEmailSignup} className="space-y-6">

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-bold text-base md:text-lg">이메일</label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-lg transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-bold text-base md:text-lg">비밀번호</label>
                        <input
                            type="password"
                            placeholder="6자 이상 입력해주세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-lg transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-bold text-base md:text-lg">비밀번호 확인</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 한 번 더 입력해주세요"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-lg transition-all ${confirmPassword && password !== confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                                }`}
                            required
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-bold text-base md:text-lg">닉네임 (활동명)</label>
                        <input
                            type="text"
                            placeholder="추모관에서 사용할 이름을 입력해주세요"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-lg transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 text-center bg-[#0A192F] text-white rounded-lg text-lg font-bold shadow-md hover:bg-[#112240] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '가입 처리 중...' : '회원가입 완료'}
                    </button>

                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="text-[#C5A059] font-bold hover:underline">
                            로그인하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
