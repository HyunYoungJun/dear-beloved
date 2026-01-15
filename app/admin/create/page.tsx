'use client';

import Link from 'next/link';
import AdminNavBar from '@/components/admin/AdminNavBar';

export default function AdminCreatePage() {
    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <AdminNavBar />
            <div className="max-w-7xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A192F] font-['Malgun_Gothic']">기사 작성</h1>
                    <p className="text-gray-500 mt-2 font-['Malgun_Gothic']">작성할 기사의 유형을 선택해주세요.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
                    {/* Domestic / Anchor */}
                    <Link
                        href="/anchor/create"
                        className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[300px] text-center"
                    >
                        <div className="w-16 h-16 bg-[#0A192F]/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0A192F] group-hover:text-white transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0A192F] mb-3 font-['Malgun_Gothic'] group-hover:text-[#C5A059] transition-colors">앵커 브리핑 / 국내</h2>
                        <p className="text-gray-500 font-['Malgun_Gothic']">
                            국내 주요 인물의 부고 기사와<br />앵커 브리핑을 작성합니다.
                        </p>
                    </Link>

                    {/* Overseas */}
                    <Link
                        href="/admin/overseas/create"
                        className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[300px] text-center"
                    >
                        <div className="w-16 h-16 bg-[#0A192F]/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0A192F] group-hover:text-white transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0A192F] mb-3 font-['Malgun_Gothic'] group-hover:text-[#C5A059] transition-colors">해외 부고</h2>
                        <p className="text-gray-500 font-['Malgun_Gothic']">
                            해외 주요 인물의 부고 기사를<br />작성합니다.
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
