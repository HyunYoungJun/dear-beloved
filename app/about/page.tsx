'use client';

import Link from 'next/link';
import { Quote, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="font-serif bg-white">
            {/* 1. Hero Section (Philosophy) */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
                {/* Background Image (Abstract/Soft) */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-40 bg-no-repeat"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1499728603963-bc0922fc7442?q=80&w=2070&auto=format&fit=crop")' }} // Comforting nature/abstract
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-['Nanum_Myeongjo'] leading-tight">
                        모든 삶은<br className="md:hidden" /> 한 권의 책입니다
                    </h1>
                    <div className="w-16 h-1 bg-white/70 mx-auto mb-8"></div>
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto keep-all font-light">
                        Dear˚Beloved는 고인이 세상에 남긴 발자취를 아름다운 문장으로 정리하여,
                        영원히 기억될 수 있는 <strong>'디지털 추모관'</strong>이자 <strong>'생애 기록소'</strong>입니다.
                        단순히 사망 사실을 알리는 부고를 넘어, 고인의 삶과 철학을 품격 있는 기사로 남겨드립니다.
                    </p>
                </div>
            </section>

            {/* 2. How It Works (Steps) */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2 block">Process</span>
                        <h2 className="text-3xl font-bold text-gray-900">서비스 이용 절차</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {/* Step 1 */}
                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 z-10 relative">
                                <span className="text-xl font-bold text-gray-900">1</span>
                            </div>
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gray-200 -z-0"></div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">기본 정보 입력</h3>
                            <p className="text-gray-500 text-sm break-keep">
                                고인의 성함, 약력, 그리고<br />기억하고 싶은 에피소드를<br />간단히 입력합니다.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 z-10 relative">
                                <span className="text-xl font-bold text-gray-900">2</span>
                            </div>
                            <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gray-200 -z-0"></div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">작성 방식 선택</h3>
                            <p className="text-gray-500 text-sm break-keep">
                                AI 즉시 생성, 전문 기자 의뢰,<br />프리미엄 작가 집필 중<br />원하는 방식을 선택하세요.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 z-10 relative">
                                <span className="text-xl font-bold text-gray-900">3</span>
                            </div>
                            <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gray-200 -z-0"></div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">생성 및 검수</h3>
                            <p className="text-gray-500 text-sm break-keep">
                                완성된 글을 확인하고,<br />필요한 부분은 직접 수정하거나<br />추가할 수 있습니다.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg z-10 relative text-white">
                                <CheckCircle2 size={24} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">공유 및 보존</h3>
                            <p className="text-gray-500 text-sm break-keep">
                                완성된 부고 기사를 공유하고,<br />디지털 도서관에 영구히<br />보존합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Service Details (Cards) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2 block">Services</span>
                        <h2 className="text-3xl font-bold text-gray-900">제공 서비스 안내</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Card 1: AI */}
                        <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:border-indigo-100 group flex flex-col h-full">
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Nanum_Myeongjo']">AI에게 맡기기</h3>
                            <ul className="space-y-3 mb-8 text-gray-600 flex-grow">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">•</span> 정중하고 격조 있는 기사 톤앤매너
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">•</span> 키워드 입력 즉시 1분 내 생성
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">•</span> 비용 부담 없는 무료 서비스
                                </li>
                            </ul>
                            <div className="pt-6 border-t border-gray-50">
                                <span className="block text-indigo-600 font-bold text-lg mb-4">무료 / 즉시 완료</span>
                                <Link href="/write" className="block w-full py-3 text-center bg-gray-50 hover:bg-indigo-50 text-indigo-700 font-bold rounded-lg transition-colors">
                                    시작하기
                                </Link>
                            </div>
                        </div>

                        {/* Card 2: Expert */}
                        <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:border-emerald-100 group flex flex-col h-full">
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">✒️</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Nanum_Myeongjo']">전문 기자에게 맡기기</h3>
                            <ul className="space-y-3 mb-8 text-gray-600 flex-grow">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span> 전현직 언론인의 세심한 리라이팅
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span> 사실 관계 확인 및 문장 교정
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span> 뉴스 기사 형식의 완벽한 구성
                                </li>
                            </ul>
                            <div className="pt-6 border-t border-gray-50">
                                <span className="block text-emerald-600 font-bold text-lg mb-4">50,000원~ / 24시간 소요</span>
                                <Link href="/write" className="block w-full py-3 text-center bg-gray-50 hover:bg-emerald-50 text-emerald-700 font-bold rounded-lg transition-colors">
                                    의뢰하기
                                </Link>
                            </div>
                        </div>

                        {/* Card 3: Premium */}
                        <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:border-yellow-100 group flex flex-col h-full">
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">👑</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Nanum_Myeongjo']">프리미엄 전기 작성</h3>
                            <ul className="space-y-3 mb-8 text-gray-600 flex-grow">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span> 전문 작가의 심층 인터뷰 진행
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span> 자서전 수준의 깊이 있는 기록
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span> 책자 제본 및 영구 보존 패키지
                                </li>
                            </ul>
                            <div className="pt-6 border-t border-gray-50">
                                <span className="block text-yellow-600 font-bold text-lg mb-4">별도 문의 / 상담 필요</span>
                                <Link href="/write" className="block w-full py-3 text-center bg-gray-50 hover:bg-yellow-50 text-yellow-700 font-bold rounded-lg transition-colors">
                                    문의하기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Why Us / FAQ */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 font-['Nanum_Myeongjo']">자주 묻는 질문</h2>
                        <p className="text-gray-400">서비스 이용과 관련하여 궁금하신 점을 확인하세요.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Q1 */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
                            <h3 className="text-xl font-bold mb-3 flex items-start gap-3">
                                <span className="text-yellow-500">Q.</span>
                                글솜씨가 없어도 되나요?
                            </h3>
                            <p className="text-gray-300 pl-8 leading-relaxed">
                                걱정 마세요. 고인에 대한 기본적인 정보와 기억나는 키워드만 입력해주시면,
                                Dear˚Beloved의 AI와 전문 작가진이 품격 있는 문장으로 완성해 드립니다.
                            </p>
                        </div>

                        {/* Q2 */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
                            <h3 className="text-xl font-bold mb-3 flex items-start gap-3">
                                <span className="text-yellow-500">Q.</span>
                                부고 기사는 유명인만 쓰는 것 아닌가요?
                            </h3>
                            <p className="text-gray-300 pl-8 leading-relaxed">
                                아닙니다. 평범한 우리 부모님, 가족의 삶도 누군가에게는 위대한 역사입니다.
                                모든 삶은 기록될 가치가 있으며, 기억됨으로써 영원해집니다.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/write" className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg">
                            지금 바로 기록 시작하기 <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
