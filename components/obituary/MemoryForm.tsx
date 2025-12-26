'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadMemoryImage } from '@/lib/storageUtils';
import { Loader2, Image as ImageIcon, Send, Flower2 } from 'lucide-react';

interface MemoryFormProps {
    obituaryId: string;
    onMemoryAdded: () => void;
    onFlowerGiven: () => void;
}

export default function MemoryForm({ obituaryId, onMemoryAdded, onFlowerGiven }: MemoryFormProps) {
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGivingFlower, setIsGivingFlower] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !content.trim()) return;

        setIsSubmitting(true);
        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadMemoryImage(image);
            }

            const { error } = await supabase
                .from('memories')
                .insert({
                    obituary_id: obituaryId,
                    author,
                    content,
                    image_url: imageUrl,
                });

            if (error) throw error;

            // Reset form
            setAuthor('');
            setContent('');
            setImage(null);
            onMemoryAdded();
        } catch (error) {
            console.error('Error submitting memory:', error);
            alert('메시지 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGiveFlower = async () => {
        setIsGivingFlower(true);
        try {
            const { error } = await supabase.rpc('increment_obituary_flower_count', { row_id: obituaryId });
            if (error) throw error;
            onFlowerGiven();
        } catch (error) {
            console.error('Error giving flower:', error);
            alert('헌화에 실패했습니다.');
        } finally {
            setIsGivingFlower(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm border border-[var(--heritage-gold)]/20 p-6 rounded-lg shadow-sm mb-12">
            <h3 className="text-xl font-serif text-[var(--heritage-navy)] mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[var(--heritage-gold)] block rounded-full"></span>
                추모 메시지 남기기
            </h3>

            <div className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="작성자 이름"
                        className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--heritage-navy)] focus:ring-1 focus:ring-[var(--heritage-navy)] transition-colors placeholder:text-gray-400"
                        required
                    />
                </div>

                <div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="따뜻한 추모의 마음을 남겨주세요..."
                        rows={4}
                        className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-[var(--heritage-navy)] focus:ring-1 focus:ring-[var(--heritage-navy)] transition-colors resize-none placeholder:text-gray-400"
                        required
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-4 gap-4 md:gap-0">
                    {/* Image Upload Trigger - Styled as a subtle text link or refined button */}
                    <div className="w-full md:w-auto flex justify-start">
                        <input
                            type="file"
                            id="memory-image"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="memory-image"
                                className={`flex items-center gap-2 px-4 py-2 rounded-[4px] border text-sm cursor-pointer transition-all duration-300 font-medium tracking-wide ${image
                                    ? 'bg-[#0A192F] text-[#C5A059] border-[#0A192F]'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#0A192F] hover:text-[#0A192F]'
                                    }`}
                            >
                                <ImageIcon className="w-4 h-4" />
                                {image ? '사진 선택됨' : '사진 추가'}
                            </label>
                            {image && (
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="text-xs text-red-400 hover:text-red-600 transition-colors underline underline-offset-2"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons: Flower & Submit */}
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={handleGiveFlower}
                            disabled={isGivingFlower}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0A192F] text-[#C5A059] border border-[#0A192F] px-6 py-3 rounded-[4px] hover:bg-[#C5A059] hover:text-[#0A192F] hover:border-[#C5A059] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-serif font-medium tracking-wider shadow-sm"
                        >
                            {isGivingFlower ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Flower2 className="w-4 h-4" />
                            )}
                            헌화하기
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0A192F] text-[#C5A059] border border-[#0A192F] px-8 py-3 rounded-[4px] hover:bg-[#C5A059] hover:text-[#0A192F] hover:border-[#C5A059] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-serif font-medium tracking-wider shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    등록 중...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    메시지 등록
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
