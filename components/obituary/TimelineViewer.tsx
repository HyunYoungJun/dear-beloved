'use client';

import { useEffect, useRef, useState } from 'react';

type TimelineEvent = {
    date: string;
    title: string;
    description?: string;
};

interface TimelineViewerProps {
    events: TimelineEvent[];
}

export default function TimelineViewer({ events }: TimelineViewerProps) {
    if (!events || events.length === 0) return null;

    return (
        <div className="py-16 md:py-24 bg-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative">
                <div className="text-center mb-16">
                    <span className="inline-block w-10 h-1 bg-heritage-gold mb-4"></span>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-heritage-navy">
                        생애 연대표
                    </h3>
                    <p className="text-gray-500 mt-2 text-sm md:text-base font-serif italic">
                        Life Journey
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    {/* Mobile: Left aligned, Desktop: Center aligned */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-ml-[1px]"></div>

                    <div className="space-y-12">
                        {events.map((event, index) => (
                            <TimelineItem key={index} event={event} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
    const itemRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const isEven = index % 2 === 0;

    return (
        <div
            ref={itemRef}
            className={`relative flex flex-col md:flex-row items-center md:justify-between w-full transition-all duration-1000 ease-out transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {/* Dot (Timeline Point) */}
            <div className={`absolute left-4 md:left-1/2 w-4 h-4 bg-heritage-navy rounded-full border-2 border-heritage-gold z-10 md:-ml-2 transform translate-x-[-7px] md:translate-x-0 mt-1 md:mt-0`}></div>

            {/* Content for Desktop Left / Mobile Right */}
            <div className={`w-full pl-12 md:pl-0 md:w-[45%] mb-2 md:mb-0 ${!isEven ? 'md:order-1 md:mr-auto md:text-right' : 'md:order-3 md:ml-auto md:text-left'}`}>
                {/* Date Display */}
                <div className={`inline-block px-3 py-1 bg-heritage-navy text-white text-xs font-bold rounded-full mb-2 shadow-sm
                    ${!isEven ? 'md:mr-0' : 'md:ml-0'}`}>
                    {event.date}
                </div>

                <h4 className="text-lg md:text-xl font-serif font-bold text-gray-900 mb-2">
                    {event.title}
                </h4>

                {event.description && (
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed font-sans">
                        {event.description}
                    </p>
                )}
            </div>

            {/* Spacer for Desktop Grid layout logic handles the other side automatically via width constraints */}
            <div className="hidden md:block md:w-[45%] md:order-2"></div>
        </div>
    );
}
