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
      try {
        // Consolidated Batch Query: Fetch recent 200 public obituaries with relation counts
        // Uses * to safely fetch all available columns + relation counts
        // FIX: Use explicit join for flower_offerings to resolve ambiguity (memorial_id fk)
        const { data: allData, error } = await supabase
          .from('obituaries')
          .select('*, flower_offerings!flower_offerings_memorial_id_fkey(count), candle_offerings(count)')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(200);

        if (error) {
          console.error('Error fetching batch data:', error);
          setLoading(false);
          return;
        }

        if (allData) {
          // 1. Recent Obituaries (General Display) - Take top 20
          setRecentObituaries(allData.slice(0, 20));

          // 2. Today's Deceased (Robust Filter: Checks Column OR JSONB)
          let todays = allData.filter((item: any) =>
            item.is_today === true ||
            item.biography_data?.is_today === true ||
            item.biography_data?.feature_tag === 'today'
          );

          // Fallback: If no "Today" items found even after strict check, take the most recent 5 items
          if (todays.length === 0) {
            todays = allData.slice(0, 5);
          }
          setTodayObituaries(todays);

          // 3. Editor's Picks (Robust Filter: Checks Column OR JSONB)
          let picks = allData.filter((item: any) =>
            item.is_editor_pick === true ||
            item.biography_data?.is_editor_pick === true ||
            item.biography_data?.feature_tag === 'editor'
          );

          // Fallback: If no "Editor Picks", take items 5-15 (avoiding overlap if possible)
          if (picks.length === 0) {
            picks = allData.slice(5, 15);
          }
          setEditorPicks(picks);

          // 4. Quotes (Client-side Filter with Fallback)
          const quoted = allData.filter((item: any) =>
            item.biography_data?.quote &&
            item.biography_data.quote.length > 0 &&
            (item.biography_data.is_quote_featured === true || item.biography_data.quote.length > 20)
          );
          // Fallback if no featured quotes found
          if (quoted.length === 0) {
            const fallbackQuote = allData.find((item: any) => item.biography_data?.quote && item.biography_data.quote.length > 5);
            if (fallbackQuote) quoted.push(fallbackQuote);
          }
          setQuoteObituaries(quoted);

          // 5. Overseas Obituaries
          const overseas = allData.filter((item: any) => item.service_type === 'overseas').slice(0, 3);
          setOverseasObituaries(overseas);

          // 6. Categories (Grouping)
          const newCategories: { [key: string]: ObituarySummary[] } = {
            politics: [],
            economy: [],
            culture: [],
            society: [],
          };

          allData.forEach((item: any) => {
            if (item.category && newCategories[item.category]) {
              // Limit to 5 per category to match previous logic logic
              if (newCategories[item.category].length < 5) {
                newCategories[item.category].push(item);
              }
            }
          });
          setCategories(newCategories);
        }
      } catch (err) {
        console.error('Unexpected error in fetchData:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pb-20 pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Skeleton UI for Loading State */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 h-64 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
          <div className="lg:col-span-1 h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="lg:col-span-1 h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="lg:col-span-1 h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
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
