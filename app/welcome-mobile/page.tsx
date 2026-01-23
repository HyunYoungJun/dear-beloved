'use client';

import Link from 'next/link';
import IncenseIcon from '@/components/obituary/IncenseIcon';

export default function WelcomeMobilePage() {
    return (
        <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-between p-6 text-center text-[#FDFDFD]">

            <div className="flex-1 flex flex-col items-center justify-center w-full">
                {/* Visual Emphasis: Incense Icon */}
                <div className="mb-10 scale-125">
                    <IncenseIcon isBurning={true} />
                </div>

                {/* Message: High Readability */}
                <h1 className="text-3xl font-bold font-['Nanum_Myeongjo'] leading-tight mb-8 drop-shadow-sm">
                    귀한 인연,<br />
                    함께해주셔서<br />
                    감사합니다
                </h1>

                {/* Info Section: Respect & Warmth */}
                <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-inner">
                    <ul className="space-y-4 text-left">
                        <li className="flex items-start gap-4">
                            <span className="text-2xl mt-0.5">🙏</span>
                            <div>
                                <h3 className="text-lg font-bold text-[#C5A059] mb-1">정중한 예우</h3>
                                <p className="text-base text-gray-200 leading-snug">
                                    고인과 유족을 위해 따뜻한 마음으로 예우를 갖춰주세요.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-2xl mt-0.5">🕯️</span>
                            <div>
                                <h3 className="text-lg font-bold text-[#C5A059] mb-1">따뜻한 소통</h3>
                                <p className="text-base text-gray-200 leading-snug">
                                    추모의 글을 남기며 서로에게 위로가 되어주세요.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Action: Mobile Optimized Button */}
            <div className="w-full pb-safe mt-8">
                <Link
                    href="/"
                    className="flex items-center justify-center w-full h-[56px] bg-[#C5A059] hover:bg-[#b08d4a] text-[#0A192F] text-xl font-bold rounded-2xl shadow-lg transition-colors active:scale-[0.98]"
                >
                    추모 기사 보러 가기
                </Link>
            </div>

        </div>
    );
}
