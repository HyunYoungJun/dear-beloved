'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { uploadObituaryImage } from '@/lib/storageUtils';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import WheelDatePicker from '../ui/WheelDatePicker';

const STEPS = [
    { id: 'basics', title: '기본 정보', description: '고인의 성함과 생몰일을 입력해주세요.' },
    { id: 'birth', title: '탄생 및 배경', description: '출생지와 가문 배경에 대해 들려주세요.' },
    { id: 'childhood', title: '유년 시절', description: '성장 과정과 어릴 적 성격은 어떠셨나요?' },
    { id: 'adolescence', title: '청소년기', description: '학창 시절의 추억과 꿈은 무엇이었나요?' },
    { id: 'youth', title: '청년기/대학', description: '대학 생활, 첫 만남, 젊은 날의 도전은요?' },
    { id: 'career', title: '취업/창업', description: '사회 진출과 직업관에 대해 기록해주세요.' },
    { id: 'achievements', title: '주요 업적', description: '가장 자랑스러워 하셨던 순간은 언제인가요?' },
    { id: 'midlife', title: '중장년기', description: '인생 철학, 취미, 봉사 활동 등은 어떠셨나요?' },
    { id: 'family', title: '가족과 사랑', description: '가족에 대한 사랑과 자녀 교육관은요?' },
    { id: 'tribute', title: '영면 및 추모', description: '마지막 순간과 남기신 말씀을 적어주세요.' },
    { id: 'quote', title: '고인의 명언', description: '평소 자주 하시던 말씀이나 좌우명이 있으신가요?' },
    { id: 'review', title: 'AI 전기문 생성', description: '입력하신 내용을 바탕으로 AI가 전기문 초안을 작성합니다.' },
    { id: 'photo', title: '사진 등록', description: '고인을 기억할 수 있는 가장 아름다운 사진을 올려주세요.' },
];

interface ObituaryFormProps {
    initialData?: any;
    obituaryId?: string;
    isEditMode?: boolean;
}

export default function ObituaryForm({ initialData, obituaryId, isEditMode = false }: ObituaryFormProps) {
    const { user } = useAuth();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.main_image_url || null);

    const [serviceType, setServiceType] = useState<'ai' | 'expert' | 'premium' | null>(initialData?.service_type || null);

    // Form State
    const [formData, setFormData] = useState({
        deceased_name: '',
        birth_date: '',
        death_date: '',
        title: '',
        content: '',
        category: '', // Added: Category field

        birth_background: '',
        childhood: '',
        adolescence: '',
        youth: '',
        career: '',
        achievements: '',
        midlife: '',
        family: '',
        tribute: '',
        quote: '',

        is_public: false,
        ...initialData, // Spread initial data to overwrite defaults
        ...initialData?.biography_data, // Spread nested biography_data
    });

    // ... (handleChange, handleImageChange, handleGenerateAI, handleNext, handlePrev)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-bio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setFormData(prev => ({ ...prev, content: result.content }));
            } else {
                alert('AI 생성 실패: ' + result.error);
            }
        } catch (error) {
            console.error('Generation error', error);
            alert('AI 생성 중 오류가 발생했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // ...


    const handleSubmit = async () => {
        if (!user) return alert('로그인이 필요합니다.');
        if (!formData.deceased_name) return alert('고인의 성함을 입력해주세요.');

        setLoading(true);

        try {
            let main_image_url = previewUrl; // Default to existing URL
            if (imageFile) {
                main_image_url = await uploadObituaryImage(imageFile);
            }

            // Pack 10-step data into JSONB
            const biography_data = {
                birth_background: formData.birth_background,
                childhood: formData.childhood,
                adolescence: formData.adolescence,
                youth: formData.youth,
                career: formData.career,
                achievements: formData.achievements,
                midlife: formData.midlife,
                family: formData.family,
                tribute: formData.tribute,
                quote: formData.quote,
            };

            // Auto-generate title if empty (Simple logic for now)
            const finalTitle = formData.title || `${formData.deceased_name}님을 영원히 기억하며`;
            // Use AI generated content if available, otherwise fallback
            const finalContent = formData.content || Object.values(biography_data).filter(Boolean).join('\n\n');

            const payload = {
                deceased_name: formData.deceased_name,
                birth_date: formData.birth_date || null,
                death_date: formData.death_date || null,
                title: finalTitle,
                content: finalContent,
                biography_data: biography_data,
                service_type: serviceType,
                category: formData.category, // Added: Category
                is_public: formData.is_public,
                main_image_url,
            };

            let error;

            if (isEditMode && obituaryId) {
                // UPDATE
                const res = await supabase
                    .from('obituaries')
                    .update(payload)
                    .eq('id', obituaryId);
                error = res.error;
            } else {
                // INSERT
                const res = await supabase
                    .from('obituaries')
                    .insert({
                        user_id: user.id,
                        ...payload
                    });
                error = res.error;
            }

            if (error) throw error;

            if (isEditMode) {
                alert('수정되었습니다.');
                router.push(`/obituary/${obituaryId}`);
            } else {
                router.push('/library');
            }
            router.refresh();

        } catch (error: any) {
            console.error('Error saving obituary:', error);
            alert('오류 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Service Selection Screen (Show only if not editing and serviceType not set)
    if (!serviceType && !isEditMode) {
        return (
            <div className="max-w-4xl mx-auto my-10 px-4">
                <h1 className="text-3xl font-serif font-bold text-center text-gray-900 mb-2">부고 서비스 선택</h1>
                <p className="text-center text-gray-500 mb-12">고인의 마지막 길을 기록할 방식을 선택해 주세요.</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Option 1: AI */}
                    <button
                        onClick={() => setServiceType('ai')}
                        className="p-8 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-900 transition-all text-left flex flex-col h-full"
                    >
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AI에게 맡기기</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                            입력하신 정보를 바탕으로 AI가 즉시 전기문을 작성해 드립니다.
                        </p>
                        <div className="text-indigo-600 font-bold text-sm">무료 / 즉시 생성</div>
                    </button>

                    {/* Option 2: Expert */}
                    <button
                        onClick={() => setServiceType('expert')}
                        className="p-8 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-900 transition-all text-left flex flex-col h-full"
                    >
                        <div className="text-4xl mb-4">✒️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">전문 기자에게 맡기기</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                            전현직 언론인들이 직접 고인의 삶을 취재하고 품격 있는 기사를 작성합니다.
                        </p>
                        <div className="text-emerald-600 font-bold text-sm">유료 / 24시간 소요</div>
                    </button>

                    {/* Option 3: Premium */}
                    <button
                        onClick={() => setServiceType('premium')}
                        className="p-8 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-900 transition-all text-left flex flex-col h-full"
                    >
                        <div className="text-4xl mb-4">👑</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">프리미엄 작성</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                            심층 인터뷰와 전문 에디팅을 통해 자서전 수준의 영구 보존용 기록을 남깁니다.
                        </p>
                        <div className="text-yellow-500 font-bold text-sm">유료 / 상담 필요</div>
                    </button>
                </div>
            </div>
        );
    }

    const stepInfo = STEPS[currentStep];

    return (
        <div className="max-w-2xl mx-auto my-10 font-serif">
            {/* Header with Service Type Badge */}
            <div className="text-center mb-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 
            ${serviceType === 'ai' ? 'bg-indigo-100 text-indigo-800' :
                        serviceType === 'expert' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                    {serviceType === 'ai' ? 'AI 전기문 작성' :
                        serviceType === 'expert' ? '전문 기자 의뢰' :
                            '프리미엄 전기문 작성'}
                </span>
                <h1 className="text-3xl font-serif font-bold text-gray-900">
                    {isEditMode ? '부고 수정' : (serviceType === 'premium' ? '고인의 위대한 삶을 기록합니다' : '부고 작성')}
                </h1>
            </div>

            {/* Step Indicator */}
            <div className="mb-8 overflow-x-auto">
                <div className="flex flex-nowrap md:flex-wrap gap-2 pb-2 md:pb-0">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div
                                key={step.id}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-default whitespace-nowrap
                            ${isCompleted
                                        ? 'text-gray-400 border-gray-100 bg-gray-50' // Completed: Dim
                                        : isCurrent
                                            ? 'text-white bg-gray-900 border-gray-900 font-bold' // Current: Highlighted
                                            : 'text-gray-600 border-gray-200 bg-white' // Future: Visible
                                    }
                        `}
                            >
                                {step.title}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{stepInfo.title}</h2>
                    <p className="text-gray-500 mb-6 font-sans text-sm">{stepInfo.description}</p>

                    <div className="space-y-4">
                        {/* Step 0: Basics */}
                        {stepInfo.id === 'basics' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">고인 성함</label>
                                    <input
                                        type="text"
                                        name="deceased_name"
                                        value={formData.deceased_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none"
                                        placeholder="예: 홍길동"
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">분류 선택</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                    >
                                        <option value="">카테고리를 선택해주세요</option>
                                        <option value="politics">정치·공무</option>
                                        <option value="economy">경제·경영</option>
                                        <option value="culture">문화·예술</option>
                                        <option value="society">가족·사회</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">생년월일</label>
                                        <WheelDatePicker
                                            value={formData.birth_date}
                                            onChange={(date) => setFormData(prev => ({ ...prev, birth_date: date }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">임종일</label>
                                        <WheelDatePicker
                                            value={formData.death_date}
                                            onChange={(date) => setFormData(prev => ({ ...prev, death_date: date }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Steps 1-10: Text Inputs */}
                        {['birth', 'childhood', 'adolescence', 'youth', 'career', 'achievements', 'midlife', 'family', 'tribute', 'quote'].includes(stepInfo.id) && (
                            <textarea
                                name={stepInfo.id === 'birth' ? 'birth_background' : stepInfo.id}
                                value={(formData as any)[stepInfo.id === 'birth' ? 'birth_background' : stepInfo.id]}
                                onChange={handleChange}
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none resize-none leading-relaxed"
                                placeholder="자유롭게 이야기를 들려주세요..."
                                autoFocus
                            />
                        )}

                        {/* AI Review Step */}
                        {stepInfo.id === 'review' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">지금까지 입력하신 정보를 바탕으로 전기문을 생성합니다.</p>
                                    <button
                                        type="button"
                                        onClick={handleGenerateAI}
                                        disabled={isGenerating}
                                        className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 text-sm font-bold transition-colors"
                                    >
                                        {isGenerating ? '생성 중...' : 'AI 초안 만들기'}
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">부고 제목</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none mb-2 font-bold"
                                        placeholder="예: 영원한 별이 되신 홍길동님을 기리며 (비워둘 시 자동 생성)"
                                    />
                                </div>

                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={12}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none resize-none leading-relaxed"
                                    placeholder="AI 생성 버튼을 누르면 이곳에 전기문 초안이 작성됩니다. 내용을 직접 수정하실 수도 있습니다."
                                />
                            </div>
                        )}

                        {/* Photo Step */}
                        {stepInfo.id === 'photo' && (
                            <div className="text-center py-8">
                                <input
                                    type="file"
                                    id="photo-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="cursor-pointer inline-flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="h-full object-contain" />
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                            <span className="text-gray-500">클릭하여 사진 업로드</span>
                                        </>
                                    )}
                                </label>

                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_public"
                                        checked={formData.is_public}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                    />
                                    <label htmlFor="is_public" className="text-gray-700">인물 도서관에 공개하기 (체크 시 모두가 볼 수 있습니다)</label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 font-sans">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded text-gray-600 hover:bg-gray-100 transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                    >
                        <ArrowLeft size={18} />
                        이전
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? '저장 중...' : currentStep === STEPS.length - 1 ? '완료' : '다음'}
                        {currentStep !== STEPS.length - 1 && <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}

