'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Heart, Send, Calendar } from 'lucide-react';
// import { format } from 'date-fns';

interface PhotoDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    photo: any; // Using any for simplicity in rapid prototype, ideally proper type
    onUpdate: () => void; // Trigger refresh in parent
}

export default function PhotoDetailModal({ isOpen, onClose, photo, onUpdate }: PhotoDetailModalProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [author, setAuthor] = useState('');
    const [missYouCount, setMissYouCount] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [isLiked, setIsLiked] = useState(false); // Local state for visual feedback

    useEffect(() => {
        if (isOpen && photo) {
            fetchComments();
            setMissYouCount(photo.miss_you_count || 0);
            setIsLiked(false);
        }
    }, [isOpen, photo]);

    if (!isOpen || !photo) return null;

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('photo_comments')
            .select('*')
            .eq('photo_id', photo.id)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setComments(data);
        }
    };

    const handleMissYou = async () => {
        // Optimistic update
        const newCount = missYouCount + 1;
        setMissYouCount(newCount);
        setIsLiked(true);

        // Update DB
        const { error } = await supabase
            .from('album_photos')
            .update({ miss_you_count: newCount })
            .eq('id', photo.id);

        if (error) {
            console.error('Error updating count:', error);
            setMissYouCount(missYouCount); // Revert
        } else {
            onUpdate(); // Refresh parent list in background
            setTimeout(() => setIsLiked(false), 1000); // Reset animation effect after 1s
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !author.trim()) return;

        setIsSending(true);
        const { error } = await supabase
            .from('photo_comments')
            .insert({
                photo_id: photo.id,
                content: newComment,
                author: author
            });

        if (error) {
            alert('댓글 등록 실패');
        } else {
            setNewComment('');
            fetchComments();
        }
        setIsSending(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-serif">
            {/* Close Button (Absolute) */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[60] text-white/50 hover:text-white transition-colors"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="w-full h-full max-w-6xl bg-[#0A192F] md:rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl">

                {/* Visual Section (Image) */}
                <div className="flex-1 bg-black flex items-center justify-center relative group">
                    <img
                        src={photo.image_url}
                        alt="Memorial"
                        className="max-w-full max-h-full object-contain"
                    />

                    {/* Floating Miss You Button on Mobile/Desktop */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                        <button
                            onClick={handleMissYou}
                            className={`pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${isLiked
                                ? 'bg-[#C5A059] text-[#0A192F]'
                                : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-[#C5A059] hover:text-[#0A192F] hover:border-transparent'
                                }`}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current animate-ping' : ''}`} />
                            <span className="font-bold text-lg">{missYouCount}명이 그리워해요</span>
                        </button>
                    </div>
                </div>

                {/* Info & Comments Section */}
                <div className="w-full md:w-[400px] flex flex-col bg-[#FDFDFD] border-l border-[#C5A059]/20">

                    {/* Header Info */}
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#0A192F] flex items-center justify-center text-[#C5A059] font-bold text-sm">
                                {photo.contributor_name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-[#0A192F] text-sm">{photo.contributor_name}님의 추억</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(photo.created_at).toISOString().split('T')[0].replace(/-/g, '.')}
                                </p>
                            </div>
                        </div>
                        {photo.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mt-3 pl-1 border-l-2 border-[#C5A059]/30">
                                {photo.description}
                            </p>
                        )}
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {comments.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                아직 남겨진 추억의 글이 없습니다.
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-[#0A192F]">{comment.author}</span>
                                        <span className="text-[10px] text-gray-300">
                                            {new Date(comment.created_at).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 break-words">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Comment Form */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="작성자 이름"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="text-xs bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#C5A059]"
                                required
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="따뜻한 한마디를 남겨주세요..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#C5A059]"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="bg-[#0A192F] text-[#C5A059] p-2 rounded hover:bg-[#C5A059] hover:text-[#0A192F] transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
