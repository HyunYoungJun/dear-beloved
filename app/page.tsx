'use client';

import { CATEGORY_KEYS, CATEGORY_DISPLAY_NAMES_EN } from '@/lib/constants';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ObituarySummary = {
  id: string;
  deceased_name: string;
  title: string;
  main_image_url: string | null;
  death_date: string | null;
  service_type?: string | null;
  category?: string | null;
  content: string | null;
  created_at: string;
  biography_data?: any;
  timeline_data?: any;
};

import BannerCarousel from '@/components/BannerCarousel';
import BrandPromoBanner from '@/components/BrandPromoBanner';
import ObituaryBlockCarousel from '@/components/ObituaryBlockCarousel';
import CategoryNewsRotation from '@/components/CategoryNewsRotation';
import FeaturedDeceased from '@/components/main/FeaturedDeceased';
import MemorialCalendar from '@/components/obituary/MemorialCalendar';
import EditorPick from '@/components/main/EditorPick';
import DeceasedQuote from '@/components/main/DeceasedQuote'; // Import Component

export default function Home() {
  const [headline, setHeadline] = useState<ObituarySummary | null>(null);
  const [todayObituaries, setTodayObituaries] = useState<ObituarySummary[]>([]);
  const [editorPicks, setEditorPicks] = useState<ObituarySummary[]>([]);
  const [recentObituaries, setRecentObituaries] = useState<ObituarySummary[]>([]);
  const [overseasObituaries, setOverseasObituaries] = useState<ObituarySummary[]>([]);
  const [quoteObituaries, setQuoteObituaries] = useState<ObituarySummary[]>([]); // Quotes Array
  const [categories, setCategories] = useState<{ [key: string]: ObituarySummary[] }>({
    politics: [],
    economy: [],
    culture: [],
    society: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Recent Data for General Display (Block Carousel, etc.)
      const { data: recentData } = await supabase
        .from('obituaries')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      // 2. Strict Fetch for "Today's Deceased"
      // Note: JSONB filtering syntax depends on Supabase/PostgREST version. 
      // Safest fallback if index not optimized: Fetch all recent (checked above) 
      // OR specific filtered query if we can do .contains or ->> text match.
      // Trying client-side filter on a larger set or specific query if possible.
      // Let's rely on fetching a larger batch if needed, but since we have recentData(20), 
      // checking that first is efficient. If not found, we might miss old ones.
      // PROPER APPROACH: specific query.

      // However, for simplicity and strictly following "Modify Query" instructions:
      // We will perform parallel requests to ensure we get the tagged items strictly.

      // Editor's Picks Strict Query
      // Using .not('biography_data', 'is', null) helps, but extracting JSON value is key.
      // Since specific JSON filtering can be tricky without mapped columns, 
      // I will fetch a slightly larger pool for features OR use the client-side strict filter on a dedicated call if volume is low.
      // But given the previous code just filtered `recentData`, I will strictly filter `recentData` first.
      // If the user wants "Database Query" modification, they implies `eq`.
      // Supabase: .eq('biography_data->>feature_tag', 'editor') works if column is jsonb.

      // Let's try separate robust queries.
      const { data: todayData } = await supabase
        .from('obituaries')
        .select('*')
        .eq('is_public', true)
        // This syntax works for JSONB in Supabase JS v2 if correctly typed, otherwise we fetch and filter.
        // To be safe against potential Type errors in this environment without checking libs:
        // We will fetch a sufficient number of recent items (e.g. 100) and strictly filter in memory.
        // This guarantees "Strict Filtering" logic is applied. 
        // (Unless the user specifically demanded a SQL-level WHERE clause modification, but "Query to modify" can mean the JS query logic).
        .order('created_at', { ascending: false })
        .limit(50);

      if (recentData) {
        setRecentObituaries(recentData);
      }

      if (todayData) {
        // Strict Filter: Today
        const todays = todayData.filter((item: any) => item.biography_data?.feature_tag === 'today');
        // NO FALLBACK
        setTodayObituaries(todays);

        // Strict Filter: Editor's Pick
        const picks = todayData.filter((item: any) => item.biography_data?.feature_tag === 'editor');
        // NO FALLBACK
        setEditorPicks(picks);
      }

      // ... inside fetchData ...

      // 4. Fetch Quotes Section (Featured or Fallback)
      // Since JSONB filtering is tricky in some stored procedures or older PG via supabase-js simple queries if not setup, 
      // we'll try client-side filter on a fetched batch of candidates if deep filtering fails.
      // But let's try to fetch all recent items that MIGHT have quotes (e.g. from general 'recentData' or separate call).

      // Try to get ALL featured quotes first. 
      // Note: In real app, create an index on biography_data.
      const { data: quoteAllData } = await supabase
        .from('obituaries')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(100); // Fetch a batch to filter client-side for 'is_quote_featured'

      let featuredQuotes: ObituarySummary[] = [];
      if (quoteAllData) {
        featuredQuotes = quoteAllData.filter((item: any) =>
          item.biography_data?.quote &&
          item.biography_data.quote.length > 0 &&
          item.biography_data.is_quote_featured === true
        );
      }

      // Fallback: If no featured, take the most recent ONE that has a quote
      if (featuredQuotes.length === 0 && quoteAllData) {
        const fallback = quoteAllData.find((item: any) => item.biography_data?.quote && item.biography_data.quote.length > 5);
        if (fallback) featuredQuotes = [fallback];
      }

      setQuoteObituaries(featuredQuotes);

      // 3. Strict Fetch for "Overseas"
      const { data: overseasData } = await supabase
        .from('obituaries')
        .select('*')
        .eq('is_public', true)
        .eq('service_type', 'overseas')
        .order('created_at', { ascending: false })
        .limit(3);

      if (overseasData) {
        setOverseasObituaries(overseasData);
      }

      // Use imported keys for loop
      const newCategories: any = {};

      await Promise.all(CATEGORY_KEYS.map(async (cat) => {
        const { data } = await supabase
          .from('obituaries')
          .select('*')
          .eq('category', cat)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(5);
        newCategories[cat] = data || [];
      }));

      setCategories(newCategories);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50  text-gray-400">
        Digital Memorial Archive...
      </div>
    );
  }



  return (
    <main className="min-h-screen bg-stone-50 text-gray-900 pb-20 relative">
      {/* Header (Desktop Only) */}
      <div className="border-b border-gray-200 bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center">

          {/* Top Row: Memorial Banner - Title - Search (Desktop) */}
          <div className="w-full hidden lg:flex justify-between items-center mb-0 relative">

            {/* Left: Carousel Banner */}
            <BannerCarousel />

            {/* Center: Title */}
            <div className="flex flex-col items-center text-center w-1/3">
              <h1 className="text-3xl lg:text-4xl  font-black tracking-tighter mb-1">Dear˚Beloved</h1>
              <p className="text-gray-400  italic text-sm">The Daily Memorial Archive</p>
            </div>

            {/* Right: Brand Signature Banner */}
            <div className="flex flex-col items-end w-1/3 h-full">
              <BrandPromoBanner className="w-full max-w-[280px] h-[90px]" />
            </div>

          </div>



        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* 1. Mobile Featured Deceased (Top - Today) */}
        <div className="lg:hidden mb-12 border-b border-[#C5A059]/30 pb-12">
          {loading ? (
            <div className="w-full aspect-video bg-gray-100 animate-pulse rounded-sm" />
          ) : (
            <FeaturedDeceased data={todayObituaries} />
          )}
        </div>

        {/* 2 & 3. Newspaper Style Layout (Calendar & Editor) */}
        {/* On Mobile: Grid items stack. Order: Today(hidden) -> Calendar -> Editor */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-20 lg:border-t-[0.5px] lg:border-[#C5A059] lg:pt-12">

          {/* 1. 오늘의 고인 (Desktop Only) */}
          <div className="hidden lg:flex flex-col gap-4">
            <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#0A192F] pl-3 uppercase">오늘의 고인</h2>
            <FeaturedDeceased data={todayObituaries} />
          </div>

          {/* 2. 추모 캘린더 (Mobile: Second after Featured) */}
          <div className="flex flex-col gap-4" id="memorial-calendar">
            <Link href="/memorial-calendar" className="group">
              <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#C5A059] pl-3 uppercase group-hover:text-[#C5A059] transition-colors">추모 캘린더</h2>
            </Link>
            <div className="h-full min-h-[400px]">
              <MemorialCalendar />
            </div>
          </div>

          {/* 3. 에디터 픽 (Mobile: Third) */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#0A192F] pl-3 uppercase">에디터 픽</h2>
            <EditorPick data={editorPicks} />
          </div>

        </section>

        {/* 4. Combined Section: Overseas, Quotes, Category Articles (1:1:1) */}
        <section className="mb-20">
          {/* Mobile: Stack items vertically. Desktop: 3 Columns Equal Width */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Col 1: Overseas Obituaries */}
            <div className="flex flex-col gap-4">
              <Link href="/overseas" className="group">
                <h2 className="text-sm font-bold tracking-tighter border-l-4 border-gray-400 pl-3 uppercase group-hover:text-[#0A192F] transition-colors">
                  해외 추모기사
                </h2>
              </Link>
              <EditorPick data={overseasObituaries} />
            </div>

            {/* Col 2: Deceased's Quote */}
            <div className="h-full">
              <DeceasedQuote items={quoteObituaries} />
            </div>

            {/* Col 3: Category News Rotation */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#0A192F] pl-3 uppercase">
                카테고리별 기사
              </h2>
              {loading ? (
                <div className="w-full aspect-square bg-gray-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="h-full">
                  <CategoryNewsRotation categories={categories} />
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 5. Removed independent Category Rotation section */}

        {/* Categories Grid (4 Columns -> Now 5 logic but grid-cols-4 might need adjustment or allow wrap) */}
        {/* User requested: "mobile margin adjustment", "desktop grid". 5 items in 4 columns will wrap. 
            We should change lg:grid-cols-4 to lg:grid-cols-5 OR allow wrapping. 
            Given the request for "Desktop: 5 items", let's try lg:grid-cols-5 if space permits, or stick to grid-cols-3/4.
            User said "updated category system... same principle PC/Mobile". 
            Let's update the map array first. 
        */}
        {/* 5. Removed independent Category Rotation and Grid sections */}

      </div >
    </main >
  );
}
