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

            {/* Mobile Full Screen Menu Overlay (Redesigned: Left Side Drawer) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={closeMenu}
                    ></div>

                    {/* Drawer Content - Sliding from LEFT */}
                    <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col font-sans">

                        {/* 1. Header: Search & Close */}
                        <div className="p-5 border-b border-gray-100 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-bold text-[#0A192F]">MENU</span>
                                <button onClick={closeMenu} className="p-2 -mr-2 text-gray-400 hover:text-[#0A192F]">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Search Bar - Prominent */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="찾으시는 분의 성함을 입력하세요"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#C5A059] transition-colors"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* 2. User Info (Top of Menu) */}
                        <div className="px-5 py-4 bg-[#FDFBF7] border-b border-[#C5A059]/10">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#0A192F] text-[#C5A059] flex items-center justify-center font-bold text-lg shadow-sm border border-[#C5A059]/30">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-[#0A192F] leading-tight">
                                            {user.user_metadata?.name || user.email?.split('@')[0]}님
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">오늘도 소중한 분을 기억합니다.</p>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" onClick={closeMenu} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        <Search size={20} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-900">로그인이 필요합니다</p>
                                        <p className="text-xs text-[#C5A059] mt-1 font-medium">서비스 이용을 위해 로그인해주세요</p>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* 3. Categorized Menu (Scrollable) */}
                        <nav className="flex-1 overflow-y-auto px-5 py-2 space-y-6">

                            {/* Category 1: 기록 아카이브 */}
                            <section>
                                <h3 className="text-xs font-extra-bold text-gray-400 uppercase tracking-wider mb-3 mt-4">기록 아카이브</h3>
                                <ul className="space-y-1">
                                    <li>
                                        <Link href="/family" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="p-1.5 bg-gray-100 rounded-md text-gray-500 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-colors">
                                                <Menu size={18} />
                                            </span>
                                            <span className="text-base font-medium">가족 아카이브</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/library" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="p-1.5 bg-gray-100 rounded-md text-gray-500 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-colors">
                                                <Search size={18} />
                                            </span>
                                            <span className="text-base font-medium">인물도서관</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/overseas" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="p-1.5 bg-gray-100 rounded-md text-gray-500 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-colors">
                                                <Search size={18} />
                                            </span>
                                            <span className="text-base font-medium">해외 추모기사</span>
                                        </Link>
                                    </li>
                                </ul>
                            </section>

                            {/* Category 2: 서비스 안내 */}
                            <section>
                                <h3 className="text-xs font-extra-bold text-gray-400 uppercase tracking-wider mb-3">서비스 안내</h3>
                                <ul className="space-y-1">
                                    <li>
                                        <Link href="/about" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="text-base font-medium pl-2">Dear˚Beloved 소개</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="text-base font-medium pl-2">이용 가이드</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="text-base font-medium pl-2">공지사항</span>
                                        </Link>
                                    </li>
                                </ul>
                            </section>

                            {/* Category 3: 고객 지원 */}
                            <section className="pb-8">
                                <h3 className="text-xs font-extra-bold text-gray-400 uppercase tracking-wider mb-3">고객 지원</h3>
                                <ul className="space-y-1">
                                    <li>
                                        <Link href="#" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="text-base font-medium pl-2">1:1 문의</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/mypage" onClick={closeMenu} className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <span className="text-base font-medium pl-2">추모기사 의뢰 현황</span>
                                        </Link>
                                    </li>
                                </ul>
                            </section>
                        </nav>

                        {/* 4. Footer: Logout & Settings */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                            {user ? (
                                <button onClick={handleLogout} className="flex items-center gap-2 hover:text-[#C5A059] transition-colors font-medium">
                                    로그아웃
                                </button>
                            ) : (
                                <Link href="/login" onClick={closeMenu} className="flex items-center gap-2 hover:text-[#C5A059] transition-colors font-medium">로그인</Link>
                            )}

                            <div className="flex items-center gap-4">
                                <Link href="/mypage" onClick={closeMenu} className="hover:text-[#0A192F]">설정</Link>
                                {/* SNS Placeholders */}
                                <div className="flex gap-2 opacity-50">
                                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
