import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface ObituaryCardProps {
    id: string;
    authorId: string; // Added authorId
    deceasedName: string;
    title: string;
    imageUrl: string | null;
    deathDate: string | null;
}

export default function ObituaryCard({ id, authorId, deceasedName, title, imageUrl, deathDate }: ObituaryCardProps) {
    const { user } = useAuth();
    const router = useRouter();
    const canEdit = user && (user.id === authorId || user.email === 'youngjun88@gmail.com');

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/obituary/${id}/edit`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('정말 삭제하시겠습니까?')) {
            const { error } = await supabase.from('obituaries').delete().eq('id', id);
            if (error) alert('삭제 실패: ' + error.message);
            else {
                // Simple refresh for now. In a real app, query invalidation is better.
                window.location.reload();
            }
        }
    };

    return (
        <div className="relative group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Link href={`/obituary/${id}`} className="block">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={deceasedName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                            사진 없음
                        </div>
                    )}

                    {/* Admin/Author Buttons */}
                    {canEdit && (
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleEdit}
                                className="p-2 bg-white/90 text-gray-700 rounded-full hover:text-blue-600 hover:bg-white shadow-sm"
                                title="수정"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 bg-white/90 text-gray-700 rounded-full hover:text-red-600 hover:bg-white shadow-sm"
                                title="삭제"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">
                        {deathDate ? new Date(deathDate).toLocaleDateString() : '날짜 미상'}
                    </div>
                    <h3 className="font-serif font-bold text-lg text-gray-900 mb-1 group-hover:text-gray-700">
                        {deceasedName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {title}
                    </p>
                </div>
            </Link>
        </div>
    );
}
