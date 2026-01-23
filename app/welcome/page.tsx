'use client';

import Link from 'next/link';
import IncenseIcon from '@/components/obituary/IncenseIcon';

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-center">

            {/* Minimal Incense Icon - Reused Component */}
            <div className="mb-8">
                <IncenseIcon isBurning={true} />
            </div>

            {/* Gratitude Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A192F] mb-4 font-['Nanum_Myeongjo'] leading-tight">
                함께 마음을 나누어 주셔서<br />감사합니다
            </h1>

            {/* Divider */}
            <div className="w-16 h-[2px] bg-[#C5A059] my-6 opacity-60"></div>

            {/* Promise Section */}
            <div className="mb-12 max-w-lg">
                <h2 className="text-xl md:text-2xl font-bold text-[#0A192F] mb-4">
                    건강한 추모 문화를 위한 약속
                </h2>
                <div className="text-gray-600 text-lg md:text-xl leading-relaxed space-y-2 break-keep">
                    <p>
                        고인에 대한 깊은 존중과<br />
                        따뜻한 위로가 머무는 공간이 되기를 희망합니다.
                    </p>
                    <p>
                        서로에게 힘이 되는 소중한 말 한마디로<br />
                        아름다운 배웅의 길을 함께해 주세요.
                    </p>
                </div>
            </div>

            {/* Go to Home Button */}
            <Link
                href="/"
                className="w-full max-w-xs py-5 bg-[#0A192F] text-white text-xl font-bold rounded-lg shadow-lg hover:bg-[#112240] transition-all transform hover:-translate-y-1"
            >
                추모 기사 보러 가기
            </Link>

        </div>
    );
}
