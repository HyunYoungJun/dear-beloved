'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { uploadObituaryImage } from '@/lib/storageUtils';
import { useAuth } from '@/components/auth/AuthProvider';
import { Upload, ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';

export default function CreateOverseasObituaryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        deceased_name: '',
        country: '', // New field
        birth_date: '',
        death_date: '',
        title: '',
        content: '',
    });

    // Admin Check
    useEffect(() => {
        if (!authLoading) {
            if (!user || user.email !== 'youngjun88@gmail.com') {
                alert('관리자만 접근할 수 있습니다.');
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    if (authLoading) return <div className="p-10">Loading...</div>;

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
        if (!formData.country) return alert('국가를 입력해주세요.');
        if (!formData.title) return alert('제목을 입력해주세요.');
        if (!formData.content) return alert('내용을 입력해주세요.');

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
                    category: 'overseas', // Fixed category
                    title: formData.title,
                    content: formData.content,
                    service_type: 'overseas', // Special service type
                    is_public: true, // Always public
                    main_image_url,
                    // Store country in biography_data
                    biography_data: {
                        country: formData.country
                    },
                });

            if (error) throw error;

            alert('해외 추모기사가 등록되었습니다.');
            router.push('/admin'); // Go back to admin dashboard
            router.refresh();

        } catch (error: any) {
            console.error('Error creating overseas obituary:', error);
            alert('오류 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 px-4 font-serif">
            <Link href="/admin" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> 관리자 홈으로
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="text-[#0A192F]" size={24} />
                        해외 추모기사 작성
                    </h1>
                    <span className="bg-[#0A192F] text-white text-xs px-2 py-1 rounded-full font-bold">Admin Only</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 0. Basic Info */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">기본 정보</h3>

                        {/* Deceased Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">고인 성함 (영문/한글)</label>
                            <input
                                type="text"
                                name="deceased_name"
                                value={formData.deceased_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                placeholder="예: Steve Jobs"
                                required
                            />
                        </div>

                        {/* Country - New Field */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">국가 (Country)</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none bg-white"
                                placeholder="예: USA, France, Japan"
                                required
                            />
                        </div>

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
                            placeholder="기사 제목을 입력하세요"
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
                            placeholder="기사 내용을 입력하세요."
                            required
                        />
                    </div>

                    {/* 3. Photo */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">사진 등록 (Photo)</label>
                        <input
                            type="file"
                            id="overseas-photo-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="overseas-photo-upload"
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
                        className="w-full py-4 bg-[#0A192F] text-white rounded-lg font-bold text-lg hover:bg-[#112240] transition-colors disabled:opacity-50 mt-8"
                    >
                        {loading ? '저장 중...' : '해외 추모기사 등록하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
