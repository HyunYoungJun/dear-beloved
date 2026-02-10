'use client';

import { ObituaryProvider } from './context/ObituaryContext';

export default function ObituaryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ObituaryProvider>
            {children}
        </ObituaryProvider>
    );
}
