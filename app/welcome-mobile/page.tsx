'use client';

import Link from 'next/link';
import IncenseIcon from '@/components/obituary/IncenseIcon';

export default function WelcomeMobilePage() {
    return (
        <div className="relative min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-between p-6 overflow-hidden text-[#0A192F]">

            {/* Background Texture - Optional, subtle lighter version */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-5 pointer-events-none"
                style={{
                    backgroundImage: "url('/chrysanthemum-tribute.png')",
                    filter: "grayscale(100%) brightness(1.2)"
                }}
            />

            {/* Main Content Container */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full pb-10">

                {/* Visual Emphasis: Incense Icon - Dark Smoke for Light Background */}
                <div className="mb-10 scale-110">
                    <IncenseIcon isBurning={true} smokeColor="gray" />
                </div>

                {/* Message: High Readability - Dark text on Light bg */}
                <h1 className="text-3xl font-bold font-['Nanum_Myeongjo'] leading-[1.6] mb-10 text-center drop-shadow-sm tracking-wide text-[#0A192F]">
                    귀한 인연,<br />
                    함께해주셔서<br />
                    감사합니다
                </h1>

                {/* Info Section: Clean White Card design */}
                <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
                    <ul className="space-y-6 text-left">
                        <li className="flex items-start gap-4">
                            <span className="text-2xl mt-0.5">🙏</span>
                            <div>
                                <h3 className="text-xl font-bold text-[#0A192F] mb-1">정중한 예우</h3>
                                <p className="text-[17px] text-gray-500 leading-relaxed word-keep">
                                    고인과 유족을 위해 따뜻한 마음으로 예우를 갖춰주세요.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-2xl mt-0.5">🕯️</span>
                            <div>
                                <h3 className="text-xl font-bold text-[#0A192F] mb-1">따뜻한 소통</h3>
                                <p className="text-[17px] text-gray-500 leading-relaxed word-keep">
                                    추모의 글을 남기며 서로에게 위로가 되어주세요.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Action: High Emphasis Button */}
            <div className="relative z-10 w-full pb-safe">
                <Link
                    href="/"
                    className="flex items-center justify-center w-full h-[60px] bg-[#C5A059] hover:bg-[#b08d4a] text-[#0A192F] text-[1.2rem] font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] active:shadow-md"
                >
                    시작하기
                </Link>
            </div>

        </div>
    );
}
