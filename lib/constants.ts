export const CATEGORY_KEYS = ['politics', 'economy', 'academia', 'culture', 'society'] as const;

export type CategoryKey = typeof CATEGORY_KEYS[number];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
    politics: '정치·공무',
    economy: '경제·경영',
    academia: '학계·연구',
    culture: '문화·예술',
    society: '가족·사회',
};

export const CATEGORY_DISPLAY_NAMES_EN: Record<CategoryKey, string> = {
    politics: 'Politics & Public Service',
    economy: 'Economy & Business',
    academia: 'Academia & Research',
    culture: 'Culture & Arts',
    society: 'Family & Society',
};
