'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavBar() {
    const pathname = usePathname();

    const tabs = [
        { name: '기사 작성 (앵커/해외)', href: '/admin/create', activePatterns: ['/admin/create', '/anchor/create', '/admin/overseas/create'] },
        { name: '오늘의 고인 / 에디터 픽', href: '/admin', activePatterns: ['/admin'], exact: true },
        { name: '고인의 명언 관리', href: '/admin/quotes', activePatterns: ['/admin/quotes'] },
        { name: '모든 콘텐츠', href: '/admin/contents', activePatterns: ['/admin/contents'] },
    ];

    const isActiveTab = (tab: { href: string, activePatterns: string[], exact?: boolean }) => {
        if (tab.exact && pathname === tab.href) return true;
        if (!tab.exact && tab.activePatterns.some(pattern => pathname.startsWith(pattern))) return true;
        return false;
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center h-16 gap-8">
                    <Link href="/" className="flex items-center gap-2 mr-4 hover:opacity-80 transition-opacity">
                        <span className="font-bold text-[#0A192F] text-lg font-['Malgun_Gothic']">
                            Dear˚Beloved Admin
                        </span>
                    </Link>
                    <div className="flex h-full overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const isActive = isActiveTab(tab);
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`
                                        inline-flex items-center px-4 border-b-2 text-sm font-medium h-full transition-colors whitespace-nowrap font-['Malgun_Gothic']
                                        ${isActive
                                            ? 'border-[#0A192F] text-[#0A192F]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
