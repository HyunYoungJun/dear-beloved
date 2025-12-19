'use client';

import { useEffect, useState } from "react";

interface WheelDatePickerProps {
    value?: string; // YYYY-MM-DD
    onChange: (dateString: string) => void;
}

export default function WheelDatePicker({ value, onChange }: WheelDatePickerProps) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [day, setDay] = useState(today.getDate());

    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-').map(Number);
            if (!isNaN(y)) setYear(y);
            if (!isNaN(m)) setMonth(m);
            if (!isNaN(d)) setDay(d);
        }
    }, [value]);

    const handleChange = (type: 'year' | 'month' | 'day', val: number) => {
        let newYear = year;
        let newMonth = month;
        let newDay = day;

        if (type === 'year') newYear = val;
        if (type === 'month') newMonth = Math.max(1, Math.min(12, val));
        if (type === 'day') newDay = Math.max(1, Math.min(31, val)); // Simplified validation

        // Update local state
        if (type === 'year') setYear(newYear);
        if (type === 'month') setMonth(newMonth);
        if (type === 'day') setDay(newDay);

        // Format to YYYY-MM-DD
        const formattedDate = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
        onChange(formattedDate);
    };

    return (
        <div className="flex gap-2">
            <div className="flex-1">
                <div className="relative">
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => handleChange('year', parseInt(e.target.value) || 1900)}
                        className="w-full px-3 py-3 border border-gray-300 rounded text-center focus:ring-1 focus:ring-gray-900 outline-none appearance-none"
                        placeholder="년"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">년 (Year)</span>
                </div>
            </div>
            <div className="w-24">
                <div className="relative">
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={month}
                        onChange={(e) => handleChange('month', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-3 border border-gray-300 rounded text-center focus:ring-1 focus:ring-gray-900 outline-none"
                        placeholder="월"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">월</span>
                </div>
            </div>
            <div className="w-24">
                <div className="relative">
                    <input
                        type="number"
                        min="1"
                        max="31"
                        value={day}
                        onChange={(e) => handleChange('day', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-3 border border-gray-300 rounded text-center focus:ring-1 focus:ring-gray-900 outline-none"
                        placeholder="일"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">일</span>
                </div>
            </div>
            <style jsx>{`
                /* Hide Spinner Arrows for a cleaner look, but keep wheel functionality */
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    opacity: 1; /* Keep them visible for clicking if user wants? Or hide? User asked for wheel. Browsers usually allow wheel even if hidden. Let's keep native behavior or maybe styled. */
                    /* actually user asked for wheel support. Native number input supports wheel. */
                }
            `}</style>
        </div>
    );
}
