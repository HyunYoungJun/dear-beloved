'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Heart, Plus } from 'lucide-react';
// import Masonry from 'react-masonry-css'; // Removed dependency
import PhotoUploadModal from './PhotoUploadModal';
import PhotoDetailModal from './PhotoDetailModal';

interface MemorialAlbumProps {
    obituaryId: string;
    // We can pass a prop to trigger upload from parent if needed, 
    // but for now this component will manage its state or expose a ref.
    // Actually, distinct upload button logic might reside in MemoryForm, 
    // so we need a way to open this modal from outside. 
    // For now, let's keep the upload modal management internal 
    // and rely on a ref or context, OR simply let the parent `page.tsx` pass down an "isUploadOpen" prop.
    // To simplify: I'll export this component and also a separate provider or just control props.
    // Wait, the user asked to change the button in `MemoryForm`. 
    // So `page.tsx` will likely hold the "isUploadModalOpen" state.
    isUploadOpen?: boolean;
    onUploadClose?: () => void;
}

export default function MemorialAlbum({ obituaryId, isUploadOpen, onUploadClose }: MemorialAlbumProps) {
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
        <section className="py-16 bg-[#FDFDFD]">
            <div className="max-w-[850px] mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                    <h3 className="text-xl font-serif font-bold text-[#0A192F] tracking-widest">MEMORIAL ALBUM</h3>
                    <span className="w-8 h-[1px] bg-[#C5A059] md:hidden"></span>
                </div>

                {/* Grid (CSS Columns Masonry) */}
                {photos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-400 font-serif">아직 사진이 없습니다.<br />고인과의 소중한 추억을 첫 번째로 공유해주세요.</p>
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 gap-4 space-y-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => setSelectedPhoto(photo)}
                                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-md shadow-md bg-white border border-gray-100"
                            >
                                <img
                                    src={photo.image_url}
                                    alt={photo.description || 'Memorial Photo'}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-white flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-white" />
                                        <span className="font-bold">{photo.miss_you_count || 0}</span>
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
                    onUpdate={fetchPhotos} // To refresh miss_you_count
                />
            )}
        </section>
    );
}
