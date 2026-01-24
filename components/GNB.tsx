'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';

export default function GNB() {
    const { user, loading, role } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Navigation Items Structure
    const MENU_ITEMS = [
        { label: '홈', href: '/' },
        { label: '서비스소개', href: '/about' },
        { label: '추모기사 의뢰', href: '/write' }, // Renamed
        {
            label: '아카이브',
            href: '#', // Dropdown trigger
            children: [
                { label: '가족아카이브', href: '/family' },
                { label: '인물도서관', href: '/library' },
            ]
        },
        { label: '추모 캘린더', href: '/memorial-calendar' }, // New
        { label: '해외 추모기사', href: '/overseas' }, // New
    ];

    return (
        <>
            <header className="fixed top-0 z-50 w-full transition-all duration-300 border-b border-[#C5A059]/30 md:bg-white/90 md:backdrop-blur-md bg-[#0A192F] py-2 md:py-0 shadow-sm">
                <div className="container mx-auto flex h-auto md:h-20 items-center justify-between px-4 md:px-8 relative">

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-[60] text-[#C5A059] focus:outline-none absolute left-4 top-1/2 -translate-y-1/2 p-2"
                        onClick={toggleMenu}
                        aria-label="Open Menu"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center z-50 w-full md:w-auto md:block pointer-events-none md:pointer-events-auto"
                        onClick={closeMenu}
                    >
                        <span className="text-xl md:text-3xl font-black tracking-tighter  text-[#C5A059] md:text-[#0A192F] pointer-events-auto">
                            Dear˚Beloved
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2 h-full">
                        {MENU_ITEMS.map((item) => (
                            <div key={item.label} className="relative group h-full flex items-center">
                                {item.children ? (
                                    <>
                                        <button className={`flex items-center gap-1 text-[15px] font-bold  tracking-wide transition-all h-full
                                            ${pathname.startsWith('/archive') ? 'text-[#0A192F]' : 'text-gray-500 hover:text-[#0A192F]'}`}>
                                            {item.label}
                                            <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </button>

                                        {/* Dropdown - Adjusted for better UX */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                            <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-2 min-w-[180px] flex flex-col overflow-hidden ring-1 ring-black/5">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        href={child.href}
                                                        className="px-5 py-3 text-gray-600 text-sm hover:text-[#0A192F] hover:bg-gray-50 transition-colors font-medium text-center"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`relative text-[15px] font-bold  tracking-wide transition-all py-2
                                            ${pathname === item.href ? 'text-[#0A192F]' : 'text-gray-500 hover:text-[#0A192F]'}
                                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C5A059] after:transition-all after:duration-300 hover:after:w-full
                                        `}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Section: User & Search */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Search Icon */}
                        <button className="text-gray-400 hover:text-[#0A192F] transition-colors">
                            <Search size={20} />
                        </button>

                        {loading ? (
                            <div className="w-8 h-8 bg-gray-100 animate-pulse rounded-full" />
                        ) : user ? (
                            <div className="flex items-center gap-4 relative group">
                                <div className="w-9 h-9 rounded-full bg-[#0A192F] text-[#C5A059] flex items-center justify-center font-bold text-sm cursor-pointer border-2 border-transparent hover:border-[#C5A059] transition-all shadow-sm">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>

                                {/* User Dropdown */}
                                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-2 min-w-[200px] flex flex-col ring-1 ring-black/5">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.email?.split('@')[0]}님</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link href="/anchor/create" className="px-4 py-2 text-sm text-purple-600 hover:bg-gray-50 font-medium">
                                            앵커 콘텐츠
                                        </Link>
                                        {role === 'admin' && (
                                            <Link href="/admin" className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-medium">
                                                관리자
                                            </Link>
                                        )}
                                        <Link href="/mypage" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                                            마이페이지
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 text-left font-medium"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/signup" className="text-sm font-bold text-[#0A192F] px-5 py-2 hover:bg-gray-100 rounded-full transition-colors">
                                    회원가입
                                </Link>
                                <Link href="/login" className="text-sm font-bold text-white bg-[#0A192F] px-5 py-2 rounded-full hover:bg-[#112240] transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-200">
                                    로그인
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Search Icon */}
                    <button
                        className="md:hidden z-[60] text-[#C5A059] focus:outline-none absolute right-4 top-1/2 -translate-y-1/2 p-2"
                        aria-label="Search"
                    >
                        <Search size={24} />
                    </button>
                </div>
            </header>

            {/* Mobile Full Screen Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={closeMenu}
                    ></div>
                    <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <span className="text-xl  font-bold text-[#0A192F]">MENU</span>
                            <button onClick={closeMenu} className="p-2 text-gray-400 hover:text-[#0A192F]">
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 ">
                            {MENU_ITEMS.map((item) => (
                                item.children ? (
                                    <div key={item.label} className="py-2 border-b border-gray-50">
                                        <div className="font-bold text-gray-900 mb-2 px-2">{item.label}</div>
                                        <div className="flex flex-col gap-1 pl-4 border-l-2 border-gray-100">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    onClick={closeMenu}
                                                    className="py-2 text-gray-600 hover:text-[#C5A059] text-sm font-medium"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-800 hover:text-[#C5A059] font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                )
                            ))}

                            <div className="mt-4 pt-4">
                                <Link href="/anchor/create" onClick={closeMenu} className="block py-2 text-purple-700 font-bold text-sm">
                                    앵커 콘텐츠
                                </Link>
                                {role === 'admin' && (
                                    <Link href="/admin" onClick={closeMenu} className="block py-2 text-red-600 font-bold text-sm">
                                        관리자
                                    </Link>
                                )}
                            </div>
                        </nav>

                        {/* Mobile User Section */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0A192F] text-[#C5A059] flex items-center justify-center font-bold shadow-md">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#0A192F]">{user.email?.split('@')[0]}님</span>
                                            <span className="text-[10px] text-gray-400">{user.email}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-2.5 text-center text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-red-500 transition-all font-bold shadow-sm"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="block w-full py-3 text-center bg-[#0A192F] text-white rounded-lg shadow-md hover:bg-[#112240] transition-all font-bold"
                                    >
                                        로그인
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={closeMenu}
                                        className="block w-full py-3 text-center bg-white border border-gray-300 text-[#0A192F] rounded-lg hover:bg-gray-50 transition-all font-bold"
                                    >
                                        회원가입
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
