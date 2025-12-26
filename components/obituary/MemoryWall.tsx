'use client';

import { useState } from 'react';
import MemoryForm from './MemoryForm';
import MemoryList from './MemoryList';

interface MemoryWallProps {
    obituaryId: string;
    onFlowerGiven: () => void;
}

export default function MemoryWall({ obituaryId, onFlowerGiven }: MemoryWallProps) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleMemoryAdded = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif text-[var(--heritage-navy)] mb-4">추모의 벽</h2>
                    <p className="text-gray-600 font-light">
                        사랑하는 분과의 소중한 추억을 함께 나누어주세요.<br />
                        따뜻한 마음이 유가족분들에게 큰 위로가 됩니다.
                    </p>
                </div>

                <MemoryForm
                    obituaryId={obituaryId}
                    onMemoryAdded={handleMemoryAdded}
                    onFlowerGiven={onFlowerGiven}
                    onOpenAlbumUpload={onOpenAlbumUpload}
                />

                <div className="mt-16">
                    <MemoryList
                        obituaryId={obituaryId}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            </div>
        </section>
    );
}
