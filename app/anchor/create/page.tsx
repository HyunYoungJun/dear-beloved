'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { uploadObituaryImage } from '@/lib/storageUtils';
import { useAuth } from '@/components/auth/AuthProvider';
import { Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateAnchorContentPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        deceased_name: '',
        category: '',
        birth_date: '',
        death_date: '',
        title: '',
        content: '',
        country: '', // New field for Overseas
    });

    const [isOverseas, setIsOverseas] = useState(false); // Toggle state

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('로그인이 필요합니다.');
        if (!formData.deceased_name) return alert('고인의 성함을 입력해주세요.');
        if (!formData.title) return alert('제목을 입력해주세요.');
        if (!formData.content) return alert('내용을 입력해주세요.');

        // Conditional validation
        if (isOverseas && !formData.country) return alert('국가를 입력해주세요.');
        if (!isOverseas && !formData.category) return alert('카테고리를 선택해주세요.');

        setLoading(true);

        try {
            let main_image_url = null;
            if (imageFile) {
                main_image_url = await uploadObituaryImage(imageFile);
            }

            const { error } = await supabase
                .from('obituaries')
                .insert({
                    user_id: user.id,
                    deceased_name: formData.deceased_name,
                    birth_date: formData.birth_date || null,
                    death_date: formData.death_date || null,
                    category: isOverseas ? 'overseas' : (formData.category || null),
                    title: formData.title,
                    content: formData.content,
                    service_type: isOverseas ? 'overseas' : 'anchor', // Special type
                    is_public: true, // Always public
                    main_image_url,
                    // Store country if overseas
                    biography_data: isOverseas ? { country: formData.country } : {},
                });

            if (error) throw error;

            alert(isOverseas ? '해외 추모기사가 등록되었습니다.' : '앵커 콘텐츠가 등록되었습니다.');
            router.push(isOverseas ? '/overseas' : '/library');
            router.refresh();

        } catch (error: any) {
            console.error('Error creating anchor content:', error);
            alert('오류 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 px-4 font-serif">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> 홈으로 돌아가기
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">앵커 콘텐츠 작성</h1>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-bold">Admin Feature</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Checkbox for Overseas */}
                    <div className="flex items-center gap-3 p-4 bg-[#0A192F]/5 rounded-lg border border-[#0A192F]/10 mb-6">
                        <input
                            type="checkbox"
                            id="isOverseas"
                            checked={isOverseas}
                            onChange={(e) => setIsOverseas(e.target.checked)}
                            className="w-5 h-5 text-[#0A192F] rounded focus:ring-[#0A192F]"
                        />
                        <label htmlFor="isOverseas" className="font-bold text-[#0A192F] cursor-pointer select-none">
                            해외추모기사 작성 (Check for Overseas Obituary)
                        </label>
                    </div>
                    {/* 0. Basic Info */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">기본 정보</h3>

                        {/* Deceased Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">고인 성함</label>
                            <input
                                type="text"
                                name="deceased_name"
                                value={formData.deceased_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                placeholder="예: 김수환"
                                required
                            />
                        </div>

                        {/* Conditional Fields */}
                        {isOverseas ? (
                            // Country Field for Overseas
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">국가 (Country)</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                    placeholder="예: USA, France"
                                    required={isOverseas}
                                />
                            </div>
                        ) : (
                            // Category Field for Normal Anchor
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">분류 선택</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                    required={!isOverseas}
                                >
                                    <option value="">카테고리 선택</option>
                                    <option value="politics">정치·공무</option>
                                    <option value="economy">경제·경영</option>
                                    <option value="culture">문화·예술</option>
                                    <option value="society">가족·사회</option>
                                </select>
                            </div>
                        )}

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">생년월일</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">임종일</label>
                                <input
                                    type="date"
                                    name="death_date"
                                    value={formData.death_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 1. Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">기사 제목 (Title)</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none"
                            placeholder="예: 시대의 어른, 김수환 추기경을 기리며"
                            required
                        />
                    </div>

                    {/* 2. Content */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">기사 내용 (Content)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={15}
                            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none resize-none leading-relaxed"
                            placeholder="전체 기사 내용을 이곳에 입력해주세요."
                            required
                        />
                    </div>

                    {/* 3. Photo */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">사진 등록 (Photo)</label>
                        <input
                            type="file"
                            id="anchor-photo-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="anchor-photo-upload"
                            className="cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 text-white rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 mt-8"
                    >
                        {loading ? '저장 중...' : '콘텐츠 등록하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
