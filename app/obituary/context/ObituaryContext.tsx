'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ObituaryFormData = {
    deceased_name: string;
    birth_date: string;
    death_date: string;
    title: string;
    content: string;
    category: string;

    // Biography fields
    birth_background: string;
    childhood: string;
    adolescence: string;
    youth: string;
    career: string;
    achievements: string;
    midlife: string;
    family: string;
    tribute: string;
    quote: string;

    // Arrays
    family_relations: any[];
    timeline_data: any[];

    is_public: boolean;
};

export type PhotoData = {
    file: File | null;
    preview: string;
    isMain: boolean;
};

interface ObituaryContextType {
    formData: ObituaryFormData;
    setFormData: React.Dispatch<React.SetStateAction<ObituaryFormData>>;

    photos: PhotoData[];
    setPhotos: React.Dispatch<React.SetStateAction<PhotoData[]>>;

    serviceType: 'ai' | 'expert' | 'premium' | null;
    setServiceType: React.Dispatch<React.SetStateAction<'ai' | 'expert' | 'premium' | null>>;

    generatedDraft: string;
    setGeneratedDraft: (content: string) => void;
}

const defaultFormData: ObituaryFormData = {
    deceased_name: '',
    birth_date: '',
    death_date: '',
    title: '',
    content: '',
    category: '',

    birth_background: '',
    childhood: '',
    adolescence: '',
    youth: '',
    career: '',
    achievements: '',
    midlife: '',
    family: '',
    tribute: '',
    quote: '',

    family_relations: [],
    timeline_data: [],

    is_public: false,
};

const ObituaryContext = createContext<ObituaryContextType | undefined>(undefined);

export function ObituaryProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<ObituaryFormData>(defaultFormData);
    const [photos, setPhotos] = useState<PhotoData[]>([]);
    const [serviceType, setServiceType] = useState<'ai' | 'expert' | 'premium' | null>(null);
    const [generatedDraft, setGeneratedDraftState] = useState('');

    const setGeneratedDraft = (content: string) => {
        setGeneratedDraftState(content);
        setFormData(prev => ({ ...prev, content }));
    };

    return (
        <ObituaryContext.Provider value={{
            formData,
            setFormData,
            photos,
            setPhotos,
            serviceType,
            setServiceType,
            generatedDraft,
            setGeneratedDraft
        }}>
            {children}
        </ObituaryContext.Provider>
    );
}

export function useObituaryContext() {
    const context = useContext(ObituaryContext);
    if (context === undefined) {
        throw new Error('useObituaryContext must be used within an ObituaryProvider');
    }
    return context;
}
