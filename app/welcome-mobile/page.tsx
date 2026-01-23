'use client';

import Link from 'next/link';
import IncenseIcon from '@/components/obituary/IncenseIcon';

export default function WelcomeMobilePage() {
    return (
        <div className="relative min-h-screen bg-[#0A192F] flex flex-col items-center justify-between p-6 overflow-hidden text-[#F9F9F9]">

            {/* Background Image with Heavy Overlay for Readability */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none"
                style={{
                    backgroundImage: "url('/chrysanthemum-tribute.png')",
                    filter: "grayscale(100%) brightness(0.7)"
                }}
            />
            <div className="absolute inset-0 z-0 bg-[#0A192F]/85 pointer-events-none"></div>

            {/* Main Content Container - Z-Index to sit above background */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-start w-full pt-12">

                {/* Visual Emphasis: Incense Icon - Clean Top Area */}
                <div className="mb-12 scale-110">
                    <IncenseIcon isBurning={true} />
                </div>

                {/* Message: High Readability & Ample Spacing */}
                <h1 className="text-3xl font-bold font-['Nanum_Myeongjo'] leading-[1.6] mb-12 text-center drop-shadow-md tracking-wide">
                    귀한 인연,<br />
                    함께해주셔서<br />
                    감사합니다
                </h1>

                {/* Info Section: Visually Separated Container */}
                <div className="w-full max-w-sm bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 shadow-lg">
                    <ul className="space-y-6 text-left">
                        <li className="flex items-start gap-5">
                            <span className="text-2xl mt-1 opacity-90">🙏</span>
                            <div>
                                <h3 className="text-xl font-bold text-[#D4AF67] mb-2 tracking-tight">정중한 예우</h3>
                                <p className="text-[17px] text-gray-200 leading-relaxed word-keep">
                                    고인과 유족을 위해 따뜻한 마음으로 예우를 갖춰주세요.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-5">
                            <span className="text-2xl mt-1 opacity-90">🕯️</span>
                            <div>
                                <h3 className="text-xl font-bold text-[#D4AF67] mb-2 tracking-tight">따뜻한 소통</h3>
                                <p className="text-[17px] text-gray-200 leading-relaxed word-keep">
                                    추모의 글을 남기며 서로에게 위로가 되어주세요.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Action: High Contrast Button */}
            <div className="relative z-10 w-full pb-safe mt-6">
                <Link
                    href="/"
                    className="flex items-center justify-center w-full h-[60px] bg-[#C5A059] hover:bg-[#b08d4a] text-[#0A192F] text-[1.2rem] font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
                >
                    시작하기
                </Link>
            </div>

        </div>
    );
}
