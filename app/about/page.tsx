'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
    return (
        <div className="font-sans bg-[#F9F8F5] text-[#333333] pb-24">

            {/* 1. Hero Section: Typography Centic & Premium */}
            <section className="relative px-5 pt-16 pb-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A192F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-md mx-auto relative z-10">
                    <span className="block text-[#0A192F] font-bold tracking-widest text-xs uppercase mb-4 opacity-80">
                        About Dear˚Beloved
                    </span>
                    <h1 className="text-4xl font-bold leading-[1.2] text-[#0A192F] mb-6 tracking-tight">
                        모든 삶은<br />
                        <span className="text-[#C5A059]">한 권의 책</span>입니다
                    </h1>
                    <p className="text-[17px] leading-relaxed text-[#555555] font-medium text-justify break-keep">
                        Dear˚Beloved는 고인이 세상에 남긴 발자취를 아름다운 문장으로 정리하여,
                        영원히 기억될 수 있는 <strong>'디지털 추모관'</strong>이자 <strong>'생애 기록소'</strong>입니다.
                        <br /><br />
                        단순히 사망 사실을 알리는 부고를 넘어, 고인의 삶과 철학을 품격 있는 기사로 남겨드립니다.
                    </p>
                </div>
            </section>

            {/* 2. Process Section: Vertical Timeline */}
            <section className="px-5 py-12">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-[#0A192F] mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#0A192F] rounded-full"></span>
                        서비스 이용 절차
                    </h2>

                    <div className="space-y-6 relative pl-4 border-l border-[#0A192F]/10 ml-2">
                        {[
                            { step: '01', title: '기본 정보 입력', desc: '고인의 성함, 약력, 그리고 기억하고 싶은 에피소드를 간단히 입력합니다.' },
                            { step: '02', title: '작성 방식 선택', desc: 'AI 즉시 생성, 전문 기자 의뢰, 프리미엄 작가 집필 중 원하는 방식을 선택하세요.' },
                            { step: '03', title: '생성 및 검수', desc: '완성된 글을 확인하고, 필요한 부분은 직접 수정하거나 추가할 수 있습니다.' },
                            { step: 'Done', title: '공유 및 보존', desc: '완성된 부고 기사를 공유하고, 디지털 도서관에 영구히 보존합니다.', icon: true }
                        ].map((item, idx) => (
                            <div key={idx} className="relative pl-8">
                                <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 border-[#F9F8F5] flex items-center justify-center text-xs font-bold shadow-sm ${item.icon ? 'bg-[#0A192F] text-[#C5A059]' : 'bg-white text-[#0A192F]'}`}>
                                    {item.icon ? <CheckCircle2 size={16} /> : item.step}
                                </div>
                                <h3 className="text-lg font-bold text-[#0A192F] mb-1">{item.title}</h3>
                                <p className="text-[15px] text-[#666666] leading-snug break-keep">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Services Section: Full-width Cards */}
            <section className="px-5 py-12 bg-white">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-[#0A192F] mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#C5A059] rounded-full"></span>
                        제공 서비스
                    </h2>

                    <div className="space-y-6">
                        {/* Card 1 */}
                        <div className="bg-[#F9F8F5] rounded-2xl p-6 shadow-sm border border-[#E5E5E5]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-3xl">🤖</div>
                                <span className="bg-[#0A192F] text-white text-[11px] px-2 py-1 rounded font-bold">FREE</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#0A192F] mb-2">AI에게 맡기기</h3>
                            <p className="text-sm text-[#555] mb-4 leading-relaxed">
                                키워드만 입력하면 1분 안에<br />정중하고 격조 있는 부고 기사가 완성됩니다.
                            </p>
                            <Link href="/write" className="flex items-center justify-center w-full h-12 bg-white border border-[#0A192F]/20 rounded-xl text-[#0A192F] font-bold text-sm hover:bg-[#0A192F] hover:text-white transition-colors">
                                AI 작성 시작하기
                            </Link>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#0A192F] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="text-3xl">✒️</div>
                                <span className="bg-[#C5A059] text-[#0A192F] text-[11px] px-2 py-1 rounded font-bold">BEST</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">전문 기자에게 맡기기</h3>
                            <p className="text-sm text-gray-300 mb-4 leading-relaxed relative z-10">
                                전현직 언론인의 세심한 리라이팅과<br />팩트 체크로 완벽한 기사를 제공합니다.
                            </p>
                            <Link href="/write" className="flex items-center justify-center w-full h-12 bg-[#C5A059] rounded-xl text-[#0A192F] font-bold text-sm hover:bg-white transition-colors relative z-10">
                                전문가 의뢰하기
                            </Link>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E5E5]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-3xl">👑</div>
                                <span className="bg-gray-100 text-gray-500 text-[11px] px-2 py-1 rounded font-bold">PREMIUM</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#0A192F] mb-2">프리미엄 전기 작성</h3>
                            <p className="text-sm text-[#555] mb-4 leading-relaxed">
                                전문 작가의 심층 인터뷰를 통해<br />자서전 수준의 깊이 있는 기록을 남깁니다.
                            </p>
                            <button className="flex items-center justify-center w-full h-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-bold text-sm cursor-not-allowed">
                                준비 중
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FAQ */}
            <section className="px-5 py-16">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-[#0A192F] mb-2">자주 묻는 질문</h2>
                    <p className="text-gray-500 text-sm mb-8">서비스 이용 관련 궁금한 점을 확인하세요.</p>

                    <div className="space-y-3">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]">
                            <h3 className="font-bold text-[#0A192F] text-[15px] mb-2 flex items-start gap-2">
                                <span className="text-[#C5A059] text-lg">Q.</span>
                                글솜씨가 없어도 되나요?
                            </h3>
                            <p className="text-sm text-[#555] pl-6 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                걱정 마세요. 고인에 대한 기본적인 정보와 기억나는 키워드만 입력해주시면, AI와 전문 작가진이 품격 있는 문장으로 완성해 드립니다.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]">
                            <h3 className="font-bold text-[#0A192F] text-[15px] mb-2 flex items-start gap-2">
                                <span className="text-[#C5A059] text-lg">Q.</span>
                                누구나 이용할 수 있나요?
                            </h3>
                            <p className="text-sm text-[#555] pl-6 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                네, 평범한 우리 부모님, 가족의 삶도 누군가에게는 위대한 역사입니다. 모든 삶은 기록될 가치가 있으며, 기억됨으로써 영원해집니다.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link href="/write" className="flex items-center justify-center w-full py-4 bg-[#0A192F] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#112240] transition-colors gap-2">
                            지금 기록 시작하기 <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
