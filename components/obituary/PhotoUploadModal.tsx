'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadMemoryImage } from '@/lib/storageUtils';
import { Loader2, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    obituaryId: string;
    onUploadSuccess: () => void;
}

export default function PhotoUploadModal({ isOpen, onClose, obituaryId, onUploadSuccess }: PhotoUploadModalProps) {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [contributor, setContributor] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !contributor.trim()) return;

        setIsUploading(true);
        try {
            // 1. Upload to 'memorial_album' bucket
            // Assuming `uploadMemoryImage` handles 'memories' bucket, we might need a custom path or reuse it if logic permits.
            // For now, let's use a direct upload logic for 'memorial_album' to be safe/specific.
            const fileExt = image.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${obituaryId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('memorial_album')
                .upload(filePath, image);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('memorial_album')
                .getPublicUrl(filePath);

            // 2. Insert into album_photos table
            const { error: dbError } = await supabase
                .from('album_photos')
                .insert({
                    obituary_id: obituaryId,
                    image_url: publicUrl,
                    contributor_name: contributor,
                    description: description,
                });

            if (dbError) throw dbError;

            onUploadSuccess();
            handleClose();
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert('사진 등록에 실패했습니다: ' + (error.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setImage(null);
        setPreviewUrl(null);
        setContributor('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden relative font-serif">
                {/* Header */}
                <div className="bg-[#0A192F] p-4 flex items-center justify-between border-b border-[#C5A059]/30">
                    <h3 className="text-[#C5A059] text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        추모 앨범 사진 추가
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleUpload} className="p-6 space-y-5">

                    {/* Image Preview / Input */}
                    <div className="relative w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center overflow-hidden hover:border-[#C5A059] transition-colors group">
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => { setImage(null); setPreviewUrl(null); }}
                                    className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 group-hover:text-[#C5A059]">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                <span className="text-sm">클릭하여 사진 선택</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required
                                />
                            </label>
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#0A192F] mb-1">작성자</label>
                            <input
                                type="text"
                                value={contributor}
                                onChange={(e) => setContributor(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                                placeholder="성함을 입력해주세요"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#0A192F] mb-1">추억 설명 (선택)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all resize-none"
                                placeholder="사진에 담긴 소중한 추억을 이야기해주세요..."
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isUploading || !image}
                            className="w-full bg-[#0A192F] text-[#C5A059] border border-[#0A192F] py-3 rounded-[4px] font-bold text-sm tracking-widest hover:bg-[#C5A059] hover:text-[#0A192F] hover:border-[#C5A059] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    업로드 중...
                                </>
                            ) : (
                                '등록하기'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
