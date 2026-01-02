'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';

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
            <header className="fixed top-0 z-50 w-full transition-all duration-300 border-b border-[#C5A059]/30 md:bg-white/80 md:backdrop-blur-md bg-[#0A192F] py-2 md:py-0">
                <div className="container mx-auto flex h-auto md:h-16 items-center justify-between px-4 md:px-6 relative">

                    {/* Mobile Menu Button - High Z-Index to prevent overlap */}
                    <button
                        className="md:hidden z-[60] text-[#C5A059] focus:outline-none absolute left-4 top-1/2 -translate-y-1/2 p-2"
                        onClick={toggleMenu}
                        aria-label="Open Menu"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Logo - Centered on Mobile */}
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center z-50 w-full md:w-auto md:block pointer-events-none md:pointer-events-auto"
                        onClick={closeMenu}
                    >
                        <span className="text-xl md:text-2xl font-bold tracking-tight font-serif text-[#C5A059] md:text-[#0A192F] pointer-events-auto">
                            Dear˚Beloved
                        </span>
                        <span className="md:hidden text-[10px] text-[#C5A059] font-serif tracking-tight mt-0.5 opacity-90 pointer-events-auto">
                            생애 마지막 선물, 메모리얼 리포트
                        </span>
                    </Link>

                    {/* Search Icon - Absolute Right on Mobile */}
                    <button
                        className="md:hidden z-[60] text-[#C5A059] focus:outline-none absolute right-4 top-1/2 -translate-y-1/2 p-2"
                        aria-label="Search"
                    >
                        <Search size={24} />
                    </button>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[var(--heritage-navy)] font-serif">
                        <Link href="/" className="hover:text-[var(--heritage-gold)] transition-colors">
                            홈
                        </Link>
                        <Link href="/about" className="hover:text-[var(--heritage-gold)] transition-colors">
                            서비스소개
                        </Link>
                        <div className="relative group h-full flex items-center">
                            <span className="hover:text-[var(--heritage-gold)] transition-colors cursor-pointer py-4">
                                메모리얼 리포트
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="bg-[#FDFBF7] border border-[#C5A059]/20 shadow-xl rounded-sm py-2 min-w-[240px] flex flex-col">
                                    <Link
                                        href="/write"
                                        className="px-6 py-3.5 text-[#0A192F] text-sm hover:text-[var(--heritage-gold)] hover:bg-[#0A192F]/5 transition-colors border-b border-[#C5A059]/10 text-center font-medium"
                                    >
                                        메모리얼 기사 의뢰
                                    </Link>
                                    <Link
                                        href="/write"
                                        className="px-6 py-3.5 text-[#0A192F] text-sm hover:text-[var(--heritage-gold)] hover:bg-[#0A192F]/5 transition-colors text-center font-medium"
                                    >
                                        나의 메모리얼 리포트 미리쓰기
                                    </Link>
                                </div>
                            </div>
                        </div>
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

            {/* Mobile Full Screen Menu Overlay (Drawer) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={closeMenu}
                    ></div>

                    {/* Drawer Content */}
                    <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

                        {/* Drawer Header with Close Button */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <span className="text-lg font-serif font-bold text-[#0A192F]">MENU</span>
                            <button
                                onClick={closeMenu}
                                className="p-2 text-gray-500 hover:text-[#0A192F] transition-colors"
                                aria-label="Close Menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 font-serif">
                            <Link href="/" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-800 hover:text-[#C5A059]">
                                홈
                            </Link>
                            <Link href="/about" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-800 hover:text-[#C5A059]">
                                서비스 소개
                            </Link>
                            <Link href="/write" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-800 hover:text-[#C5A059]">
                                메모리얼 기사 의뢰
                            </Link>
                            <Link href="/write" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-800 hover:text-[#C5A059]">
                                나의 리포트 미리쓰기
                            </Link>
                            <Link href="/library" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-800 hover:text-[#C5A059]">
                                인물 도서관
                            </Link>
                            <Link href="/family" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-800 hover:text-[#C5A059]">
                                가족 아카이브
                            </Link>
                            <Link href="/anchor/create" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-purple-700 font-medium">
                                앵커 콘텐츠
                            </Link>
                            {user && user.email === 'youngjun88@gmail.com' && (
                                <Link href="/admin" onClick={closeMenu} className="flex items-center justify-between py-3 border-b border-gray-50 text-red-600 font-medium">
                                    관리자
                                </Link>
                            )}

                            {/* User Section */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                {loading ? (
                                    <div className="w-full h-10 bg-gray-100 animate-pulse rounded" />
                                ) : user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#0A192F] text-[#C5A059] flex items-center justify-center font-bold">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{user.email?.split('@')[0]}님</span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full py-2.5 text-center text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="block w-full py-3 text-center bg-[#0A192F] text-white rounded shadow-sm hover:bg-[#112240] transition-colors font-medium"
                                    >
                                        로그인
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
