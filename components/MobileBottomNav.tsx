'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, PenTool, Info, User, Book } from 'lucide-react';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        // Handle hash links or subpaths if needed, but for now exact match or hash
        return pathname === path.split('#')[0];
    };

    const navItems = [
        { name: '홈', path: '/', icon: Home },
        { name: '인물도서관', path: '/library', icon: Book }, // Replaces About Us
        { name: '기사 의뢰', path: '/write', icon: PenTool, isMain: true }, // Center & Emphasized
        { name: '추모 캘린더', path: '/memorial-calendar', icon: Calendar },
        { name: '마이', path: '/mypage', icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0A192F]/95 backdrop-blur-md border-t border-[#C5A059]/30 flex items-center justify-around z-50 px-2 pb-safe">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                if (item.isMain) {
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className="relative -top-5 flex flex-col items-center justify-center"
                        >
                            <div className="w-14 h-14 bg-[#C5A059] rounded-full shadow-[0_4px_10px_rgba(197,160,89,0.5)] flex items-center justify-center text-[#0A192F] transition-transform active:scale-95">
                                <Icon size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-bold text-[#C5A059] mt-1">{item.name}</span>
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.name}
                        href={item.path}
                        className={`flex flex-col items-center gap-1 p-2 transition-colors ${active ? 'text-[#C5A059]' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
