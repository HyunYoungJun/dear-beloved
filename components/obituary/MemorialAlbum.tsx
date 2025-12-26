'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Heart, Plus, Grid, LayoutGrid } from 'lucide-react';
import PhotoUploadModal from './PhotoUploadModal';
import PhotoDetailModal from './PhotoDetailModal';

interface MemorialAlbumProps {
    obituaryId: string;
    isUploadOpen?: boolean;
    onUploadOpen?: () => void;
    onUploadClose?: () => void;
}

export default function MemorialAlbum({ obituaryId, isUploadOpen, onUploadOpen, onUploadClose }: MemorialAlbumProps) {
    const [photos, setPhotos] = useState<any[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

    useEffect(() => {
        fetchPhotos();
    }, [obituaryId]);

    const fetchPhotos = async () => {
        const { data, error } = await supabase
            .from('album_photos')
            .select('*')
            .eq('obituary_id', obituaryId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPhotos(data);
        }
    };

    return (
        <section className="bg-white shadow-sm p-6 md:p-10 border-t border-gray-100 rounded-lg">
            {/* Header / Menu Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-[#C5A059]/10 gap-4 md:gap-0">
                {/* Title */}
                <h3 className="text-xl font-serif font-bold text-[#C5A059] tracking-widest flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#0A192F] block rounded-full"></span>
                    MEMORIAL ALBUM
                </h3>

                {/* Menu Button Group */}
                <div className="flex items-center gap-2">
                    {/* View Options (Placeholders) */}
                    <button className="flex items-center justify-center w-9 h-9 border border-[#C5A059]/30 text-[#C5A059] rounded hover:bg-[#C5A059]/5 transition-colors" title="크게 보기">
                        <Grid className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center w-9 h-9 border border-[#C5A059]/30 text-[#C5A059] rounded hover:bg-[#C5A059]/5 transition-colors" title="작게 보기">
                        <LayoutGrid className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-6 bg-[#C5A059]/20 mx-1"></div>

                    {/* Add Photo Button (Primary) */}
                    {onUploadOpen && (
                        <button
                            onClick={onUploadOpen}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0A192F] text-[#C5A059] border border-[#C5A059] text-[10px] font-bold tracking-wider uppercase rounded hover:bg-[#C5A059] hover:text-[#0A192F] transition-all shadow-md active:scale-95"
                        >
                            <Plus className="w-3 h-3" />
                            <span>ADD PHOTO</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Content: Grid */}
            <div className="min-h-[200px]">
                {photos.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center bg-[#F9F9F9] rounded border border-dashed border-gray-200">
                        <p className="text-[#0A192F]/60 font-serif text-sm mb-3">등록된 추억이 없습니다.</p>
                        {onUploadOpen && (
                            <button onClick={onUploadOpen} className="text-[#C5A059] text-xs underline hover:text-[#0A192F]">
                                첫 번째 사진을 올려주세요
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 gap-4 space-y-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => setSelectedPhoto(photo)}
                                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded shadow-sm bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={photo.image_url}
                                    alt={photo.description || 'Memorial Photo'}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-[#0A192F]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="text-[#C5A059] flex items-center gap-2 bg-[#0A192F]/80 px-4 py-2 rounded-full border border-[#C5A059]/50">
                                        <Heart className="w-4 h-4 fill-[#C5A059]" />
                                        <span className="font-bold text-sm tracking-widest">{photo.miss_you_count || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {isUploadOpen && onUploadClose && (
                <PhotoUploadModal
                    isOpen={isUploadOpen}
                    onClose={onUploadClose}
                    obituaryId={obituaryId}
                    onUploadSuccess={fetchPhotos}
                />
            )}

            {selectedPhoto && (
                <PhotoDetailModal
                    isOpen={!!selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                    photo={selectedPhoto}
                    onUpdate={fetchPhotos}
                />
            )}
        </section>
    );
}
