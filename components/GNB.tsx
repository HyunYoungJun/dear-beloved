'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function GNB() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className="fixed top-0 z-50 w-full transition-all duration-300 border-b border-[#C5A059]/30 md:bg-white/80 md:backdrop-blur-md bg-[#0A192F]">
                <div className="container mx-auto flex h-[60px] md:h-16 items-center justify-between px-4 md:px-6 relative">

                    {/* Mobile Menu Button - Absolute Correct Positioning for Centering Logo */}
                    <button
                        className="md:hidden z-50 text-[#C5A059] focus:outline-none absolute left-4"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo - Centered on Mobile */}
                    <Link
                        href="/"
                        className="text-xl md:text-2xl font-bold tracking-tight font-serif z-50 w-full text-center md:text-left md:w-auto text-[#C5A059] md:text-[#0A192F]"
                        onClick={closeMenu}
                    >
                        Dear˚Beloved
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[var(--heritage-navy)] font-serif">
                        <Link href="/" className="hover:text-[var(--heritage-gold)] transition-colors">
                            홈
                        </Link>
                        <Link href="/about" className="hover:text-[var(--heritage-gold)] transition-colors">
                            서비스소개
                        </Link>
                        <Link href="/write" className="hover:text-[var(--heritage-gold)] transition-colors">
                            메모리얼 기사 의뢰
                        </Link>
                        <Link href="/write" className="hover:text-[var(--heritage-gold)] transition-colors">
                            나의 메모리얼 리포트 미리쓰기
                        </Link>
                        <Link href="/family" className="hover:text-[var(--heritage-gold)] transition-colors">
                            가족아카이브
                        </Link>
                        <Link href="/library" className="hover:text-[var(--heritage-gold)] transition-colors">
                            인물도서관
                        </Link>

                        {loading ? (
                            <div className="w-12 h-4 bg-gray-100 animate-pulse rounded" />
                        ) : user ? (
                            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-[var(--heritage-gold)]/30">
                                <span className="text-gray-500 text-xs truncate max-w-[100px] font-sans">
                                    {user.email?.split('@')[0]}님
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-[var(--heritage-gold)] transition-colors text-sm"
                                >
                                    로그아웃
                                </button>

                                {/* Moved Menu Items */}
                                <div className="flex flex-col gap-1 items-start ml-2 scale-90 origin-left">
                                    <Link href="/anchor/create" className="text-purple-600 hover:text-purple-800 transition-colors font-bold text-[10px] font-sans">
                                        앵커콘텐츠
                                    </Link>
                                    {user.email === 'youngjun88@gmail.com' && (
                                        <Link href="/admin" className="text-red-600 hover:text-red-800 transition-colors font-bold text-[10px] font-sans">
                                            관리자
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="ml-2 hover:text-[var(--heritage-gold)] transition-colors">
                                로그인
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Mobile Full Screen Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-[45] flex flex-col pt-24 px-6 md:hidden animate-in slide-in-from-right-10 duration-200">
                    <nav className="flex flex-col gap-6 text-xl font-medium text-gray-800 font-serif">
                        <Link href="/" onClick={closeMenu} className="border-b border-gray-100 pb-4">
                            홈
                        </Link>
                        <Link href="/about" onClick={closeMenu} className="border-b border-gray-100 pb-4">
                            서비스 소개
                        </Link>
                        <Link href="/write" onClick={closeMenu} className="border-b border-gray-100 pb-4">
                            메모리얼 기사 의뢰
                        </Link>
                        <Link href="/library" onClick={closeMenu} className="border-b border-gray-100 pb-4">
                            인물 도서관
                        </Link>
                        <Link href="/write" onClick={closeMenu} className="border-b border-gray-100 pb-4">
                            나의 메모리얼 리포트 미리쓰기
                        </Link>
                        <Link href="/anchor/create" onClick={closeMenu} className="border-b border-gray-100 pb-4 text-purple-700">
                            앵커 콘텐츠
                        </Link>
                        <Link href="/family" onClick={closeMenu} className="border-b border-gray-100 pb-4">
                            가족 아카이브
                        </Link>
                        {user && user.email === 'youngjun88@gmail.com' && (
                            <Link href="/admin" onClick={closeMenu} className="border-b border-gray-100 pb-4 text-red-600">
                                관리자
                            </Link>
                        )}

                        <div className="mt-4">
                            {loading ? (
                                <div className="w-12 h-4 bg-gray-100 animate-pulse rounded" />
                            ) : user ? (
                                <div className="flex flex-col gap-4">
                                    <span className="text-sm text-gray-500">
                                        {user.email}님 안녕하세요.
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left text-gray-600 hover:text-gray-900"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={closeMenu} className="block text-center bg-gray-900 text-white dev-btn py-3 rounded-lg text-base">
                                    로그인
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
