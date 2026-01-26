'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Users, PenTool, Star, FileText, Globe, ChevronRight } from 'lucide-react';

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

    if (loading || role !== 'admin') return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;

    const MENU_ITEMS = [
        {
            category: "콘텐츠 작성",
            items: [
                { label: "앵커 브리핑 / 국내 기사 작성", href: "/anchor/create", icon: PenTool },
                { label: "해외 추모 기사 작성", href: "/admin/overseas/create", icon: Globe }
            ]
        },
        {
            category: "콘텐츠 관리",
            items: [
                { label: "오늘의 고인 / Editor Pick 선정", href: "/admin/create", icon: Star },
                { label: "전체 기사 목록 및 수정", href: "/admin/contents", icon: FileText }
            ]
        },
        {
            category: "사이트 관리",
            items: [
                { label: "회원 관리 및 권한 설정", href: "/admin/users", icon: Users }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9F9F9] text-[#0A192F] p-4 md:p-12 font-['Pretendard']">
            <div className="max-w-3xl mx-auto">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold font-['Nanum_Myeongjo'] mb-2 text-[#0A192F]">
                        관리자 대시보드
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base">
                        사이트의 주요 기능을 관리합니다.
                    </p>
                </header>

                <div className="space-y-8">
                    {MENU_ITEMS.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {section.category}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {section.items.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#0A192F]/5 flex items-center justify-center text-[#0A192F] group-hover:bg-[#0A192F] group-hover:text-[#C5A059] transition-all">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="font-medium text-lg text-gray-800 group-hover:text-[#0A192F]">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
