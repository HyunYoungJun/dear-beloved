'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { X, AlertTriangle, CheckCircle, HeartHandshake } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export default function WithdrawalModal({ isOpen, onClose, userId }: WithdrawalModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const reasons = [
        "추모 기사나 정보가 충분하지 않아요.",
        "서비스 이용 방법이 너무 어려워요.",
        "알림이 너무 자주 와서 불편해요.",
        "개인정보 유출이 우려돼요.",
        "더 이상 추모 활동을 하지 않게 되었어요.",
        "기타 (직접 입력)"
    ];

    const handleNext = () => {
        if (step === 2 && !reason) {
            alert('탈퇴 사유를 선택해주세요.');
            return;
        }
        setStep(step + 1);
    };

    const handleWithdrawal = async () => {
        if (!confirm('정말 탈퇴하시겠습니까? 돌이킬 수 없습니다.')) return;

        setIsDeleting(true);
        try {
            // 1. Delete user profile (Cascades to other tables if configured in DB, 
            // OR we rely on this to trigger cleanup via Postgres Triggers)
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            // 2. Sign out
            await supabase.auth.signOut();

            alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
            router.push('/');
            router.refresh();

        } catch (error: any) {
            console.error('Withdrawal error:', error);
            alert('탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
                {/* Close Button (Hidden on Step 3 for immersion) */}
                {step < 3 && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                )}

                <div className="p-6 md:p-8">

                    {/* STEP 1: Confirmation */}
                    {step === 1 && (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 font-['Nanum_Myeongjo']">
                                정말 떠나시겠습니까?
                            </h2>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed text-left">
                                탈퇴 시 아래 정보가 <strong className="text-red-500">영구적으로 삭제</strong>되며 복구할 수 없습니다.
                                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
                                    <li>작성하신 모든 추모글 및 댓글</li>
                                    <li>헌화 내역 및 활동 기록</li>
                                    <li>자주 찾는 분 (즐겨찾기) 리스트</li>
                                </ul>
                            </p>
                            <button
                                onClick={handleNext}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                유의사항을 확인했습니다
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Reason Survey */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 font-['Nanum_Myeongjo'] text-center">
                                떠나시는 이유를<br />알려주실 수 있나요?
                            </h2>
                            <div className="space-y-3">
                                {reasons.map((r) => (
                                    <label key={r} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="reason"
                                                value={r}
                                                checked={reason === r}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-5 h-5 border-gray-300 text-gray-900 focus:ring-gray-900"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-700">{r}</span>
                                    </label>
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={!reason}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                다음으로
                            </button>
                        </div>
                    )}

                    {/* STEP 3: Final Farewell (Emotional) */}
                    {step === 3 && (
                        <div className="text-center space-y-8 relative py-4">
                            {/* Background decoration */}
                            <div
                                className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{
                                    backgroundImage: "url('/chrysanthemum-tribute.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    filter: "grayscale(100%)"
                                }}
                            />

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-[#0A192F] font-['Nanum_Myeongjo'] mb-6">
                                    함께해주셔서 감사합니다
                                </h2>

                                <div className="text-gray-600 leading-loose break-keep font-['Nanum_Myeongjo'] text-lg space-y-4">
                                    <p>
                                        당신이 이곳에 남겨주신 소중한 마음들을<br />잊지 않겠습니다.
                                    </p>
                                    <p>
                                        잠시 길을 떠나시더라도,<br />
                                        그리운 이가 보고 싶어<br />
                                        마음 한구석이 허전해지는 날<br />
                                        언제든 다시 찾아주세요.
                                    </p>
                                    <p className="text-[#C5A059] font-bold pt-2">
                                        저희는 변함없는 모습으로<br />이곳에서 기다리고 있겠습니다.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10 pt-4">
                                <button
                                    onClick={handleWithdrawal}
                                    disabled={isDeleting}
                                    className="w-full py-4 bg-[#0A192F] text-white font-bold rounded-xl hover:bg-[#152a4d] transition-colors shadow-lg"
                                >
                                    {isDeleting ? '작별하는 중...' : '정말 탈퇴하겠습니다'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="block w-full text-sm text-gray-400 hover:text-gray-600 underline"
                                >
                                    마음이 바뀌었어요 (취소)
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
}
