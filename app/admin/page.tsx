'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Users, Shield, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || role !== 'admin') {
                alert('접근 권한이 없습니다.');
                router.push('/');
            }
        }
    }, [user, role, loading, router]);

    if (loading || role !== 'admin') return <div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-[#C5A059]">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0A192F] text-white p-6 md:p-12 font-['Pretendard']">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 border-b border-[#C5A059]/30 pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#C5A059] font-['Nanum_Myeongjo'] mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 font-light">
                        Dear˚Beloved 서비스 통합 관리
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Management Card */}
                    <Link
                        href="/admin/users"
                        className="group bg-[#112240] border border-[#C5A059]/20 p-8 rounded-lg hover:border-[#C5A059] hover:bg-[#1a2f55] transition-all duration-300 flex flex-col justify-between min-h-[200px] shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.1)]"
                    >
                        <div>
                            <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] mb-6 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#C5A059] transition-colors">
                                회원 관리 및 권한 부여
                            </h2>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                전체 회원 목록 조회, 등급 조정(Admin/Sub), 활동 제어 및 강제 탈퇴 처리
                            </p>
                        </div>
                        <div className="mt-6 flex items-center text-[#C5A059] text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                            관리하기 <ArrowRight size={16} className="ml-2" />
                        </div>
                    </Link>

                    {/* Placeholder for future features */}
                    <div className="bg-[#112240]/50 border border-gray-700/50 p-8 rounded-lg flex flex-col justify-between min-h-[200px] opacity-60 cursor-not-allowed">
                        <div>
                            <div className="w-12 h-12 bg-gray-700/30 rounded-full flex items-center justify-center text-gray-500 mb-6">
                                <Shield size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-400 mb-2">
                                콘텐츠 모니터링
                            </h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                (준비 중) 신고된 기사 및 댓글 관리
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
