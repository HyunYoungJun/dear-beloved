'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Users, PenTool, Star, FileText, ArrowRight, Globe } from 'lucide-react';

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

    const MENU_CARDS = [
        {
            title: "기사/콘텐츠 작성",
            description: "앵커 브리핑 및 해외 추모 기사 등 새로운 콘텐츠를 작성합니다.",
            icon: PenTool,
            links: [
                { label: "앵커 기사 작성", href: "/anchor/create" },
                { label: "해외 추모 기사", href: "/admin/overseas/create", icon: Globe }
            ]
        },
        {
            title: "추천 콘텐츠 관리",
            description: "메인 화면의 '오늘의 고인' 및 '에디터 픽'을 선정하고 관리합니다.",
            icon: Star,
            links: [
                { label: "오늘의 고인 / Pick 설정", href: "/admin/create" }
            ]
        },
        {
            title: "전체 기사 관리",
            description: "등록된 모든 추모 기사를 조회하고 수정하거나 삭제합니다.",
            icon: FileText,
            links: [
                { label: "전체 기사 목록", href: "/admin/contents" }
            ]
        },
        {
            title: "회원 관리 및 권한",
            description: "전체 회원 목록을 조회하고 관리자 권한을 부여하거나 활동을 제어합니다.",
            icon: Users,
            links: [
                { label: "회원 리스트 이동", href: "/admin/users" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A192F] text-white p-6 md:p-12 font-['Pretendard']">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-[#C5A059]/30 pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#C5A059] font-['Nanum_Myeongjo'] mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 font-light">
                        Dear˚Beloved 서비스 통합 관리 센터
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MENU_CARDS.map((card, index) => (
                        <div
                            key={index}
                            className="bg-[#112240] border border-[#C5A059]/20 p-8 rounded-lg hover:border-[#C5A059]/50 transition-all duration-300 flex flex-col shadow-lg"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 shrink-0 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059]">
                                    <card.icon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">
                                        {card.title}
                                    </h2>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-700/50">
                                {card.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className="group flex items-center justify-between p-3 rounded bg-[#0A192F]/50 hover:bg-[#C5A059] hover:text-[#0A192F] text-gray-300 transition-all font-medium text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            {link.icon && <link.icon size={14} />}
                                            {link.label}
                                        </div>
                                        <ArrowRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
