'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { ArrowLeft, Quote } from 'lucide-react';

type ObituaryDetail = {
    id: string;
    user_id: string;
    deceased_name: string;
    birth_date: string | null;
    death_date: string | null;
    title: string;
    content: string | null;
    main_image_url: string | null;
    biography_data?: any; // Added to access quote
};

type Comment = {
    id: string;
    writer_name: string;
    writer_relationship: string;
    content: string;
    created_at: string;
};

export default function ObituaryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [obituary, setObituary] = useState<ObituaryDetail | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    // Comment Form State
    const [commentForm, setCommentForm] = useState({
        writer_name: '',
        writer_relationship: '',
        content: '',
    });
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        if (id) {
            fetchObituary();
            fetchComments();
        }
    }, [id]);

    async function fetchObituary() {
        const { data, error } = await supabase
            .from('obituaries')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching obituary:', error);
            alert('부고를 찾을 수 없거나 접근 권한이 없습니다.');
            router.push('/library');
        } else {
            setObituary(data);
        }
        setLoading(false);
    }

    async function fetchComments() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('obituary_id', id)
            .order('created_at', { ascending: false });

        if (data) {
            setComments(data);
        }
    }

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentForm.writer_name || !commentForm.writer_relationship || !commentForm.content) {
            return alert('이름, 관계, 내용을 모두 입력해주세요.');
        }

        setIsSubmittingComment(true);
        const { error } = await supabase
            .from('comments')
            .insert({
                obituary_id: id,
                writer_name: commentForm.writer_name,
                writer_relationship: commentForm.writer_relationship,
                content: commentForm.content,
            });

        if (error) {
            alert('추모의 글 등록 실패: ' + error.message);
        } else {
            alert('소중한 추모의 글이 등록되었습니다.');
            setCommentForm({ writer_name: '', writer_relationship: '', content: '' });
            fetchComments();
        }
        setIsSubmittingComment(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-serif">불러오는 중...</div>;
    if (!obituary) return null;

    const quote = obituary.biography_data?.quote;

    return (
        <article className="min-h-screen bg-[#F9F9F9] font-serif pb-32">
            {/* Header Image */}
            <div className="w-full h-[50vh] md:h-[60vh] relative">
                {obituary.main_image_url ? (
                    <img
                        src={obituary.main_image_url}
                        alt={obituary.deceased_name}
                        className="w-full h-full object-cover grayscale brightness-75"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                        사진 없음
                    </div>
                )}

                {/* Navigation Overlay */}
                <div className="absolute top-0 left-0 w-full p-6 z-20">
                    <Link href="/library" className="inline-flex items-center text-white/80 hover:text-white transition-colors bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <ArrowLeft size={18} className="mr-2" /> 목록으로
                    </Link>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-block border border-white/30 px-3 py-1 rounded-full text-xs md:text-sm mb-4 bg-white/10 backdrop-blur-md">
                            부고(訃告)
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-normal font-['Nanum_Myeongjo']">
                            {obituary.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 font-light">
                            故 {obituary.deceased_name} 님 | {obituary.birth_date} ~ {obituary.death_date}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 bg-white shadow-sm -mt-10 relative z-10 rounded-t-lg">

                {/* Deceased's Quote (Calligraphy Style) */}
                {quote && (
                    <div className="mb-16 text-center px-4 py-8 border-y border-gray-100 bg-gray-50/50">
                        <Quote className="w-8 h-8 mx-auto text-gray-300 mb-4 opacity-50" />
                        <p className="text-2xl md:text-3xl text-gray-800 leading-normal font-['Gowun_Batang'] break-keep">
                            "{quote}"
                        </p>
                    </div>
                )}

                {/* Biography Content */}
                <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-loose whitespace-pre-wrap font-['Nanum_Myeongjo'] mb-20 text-justify">
                    {obituary.content}
                </div>

                {/* Edit/Delete Controls */}
                {user && (user.id === obituary.user_id || user.email === 'youngjun88@gmail.com') && (
                    <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-100">
                        <button
                            onClick={async () => {
                                if (confirm('정말 삭제하시겠습니까?')) {
                                    const { error } = await supabase.from('obituaries').delete().eq('id', obituary.id);
                                    if (error) alert('삭제 실패: ' + error.message);
                                    else {
                                        router.push('/library');
                                        router.refresh();
                                    }
                                }
                            }}
                            className="px-4 py-2 text-red-500 hover:text-red-700 text-sm"
                        >
                            삭제
                        </button>
                        <button
                            onClick={() => router.push(`/obituary/${obituary.id}/edit`)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                        >
                            수정
                        </button>
                    </div>
                )}
            </div>

            {/* Tribute/Comments Section */}
            <div className="max-w-2xl mx-auto mt-12 px-6">
                <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 font-['Nanum_Myeongjo'] flex items-center gap-2">
                        <span className="w-1 h-8 bg-gray-900 block"></span>
                        추모의 글 남기기
                    </h3>

                    <form onSubmit={handleCommentSubmit} className="mb-12 bg-gray-50 p-6 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">작성자 성함</label>
                                <input
                                    type="text"
                                    value={commentForm.writer_name}
                                    onChange={(e) => setCommentForm({ ...commentForm, writer_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded focus:border-gray-900 outline-none text-sm"
                                    placeholder="성함을 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">고인과의 관계</label>
                                <input
                                    type="text"
                                    value={commentForm.writer_relationship}
                                    onChange={(e) => setCommentForm({ ...commentForm, writer_relationship: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded focus:border-gray-900 outline-none text-sm"
                                    placeholder="예: 가족, 친구, 직장동료"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 mb-1">추모 메시지</label>
                            <textarea
                                value={commentForm.content}
                                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-gray-900 outline-none resize-none text-sm"
                                rows={3}
                                placeholder="따뜻한 위로와 추모의 마음을 전해주세요."
                                required
                            />
                        </div>
                        <div className="text-right">
                            <button
                                type="submit"
                                disabled={isSubmittingComment}
                                className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm font-bold disabled:opacity-50"
                            >
                                {isSubmittingComment ? '등록 중...' : '추모의 글 등록'}
                            </button>
                        </div>
                    </form>

                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-400 py-8 text-sm">아직 등록된 추모의 글이 없습니다.</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">{comment.writer_name}</span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{comment.writer_relationship}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
