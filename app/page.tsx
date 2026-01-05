'use client';

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
import ObituaryBlockCarousel from '@/components/ObituaryBlockCarousel';
import CategoryNewsRotation from '@/components/CategoryNewsRotation';
import FeaturedDeceased from '@/components/main/FeaturedDeceased';
import MemorialCalendar from '@/components/obituary/MemorialCalendar';
import EditorPick from '@/components/main/EditorPick';

export default function Home() {
  const [headline, setHeadline] = useState<ObituarySummary | null>(null);
  const [todayObituary, setTodayObituary] = useState<ObituarySummary | null>(null);
  const [editorPick, setEditorPick] = useState<ObituarySummary | null>(null);
  const [recentObituaries, setRecentObituaries] = useState<ObituarySummary[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: ObituarySummary[] }>({
    politics: [],
    economy: [],
    culture: [],
    society: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Featured Data (Today & Editor)
      const { data: recentData } = await supabase
        .from('obituaries')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (recentData) {
        // Find Today's Obituary
        const today = recentData.find((item: any) => item.biography_data?.feature_tag === 'today') || recentData[0];
        setTodayObituary(today);

        // Find Editor's Pick (avoid duplicate if possible)
        const editor = recentData.find((item: any) => item.biography_data?.feature_tag === 'editor') ||
          recentData.find((item: any) => item.id !== today?.id) || null;
        setEditorPick(editor);
      }

      // 1-b. Pass all recent data to Block Carousel (excluding Today/Editor if desired, but for now just pass all)
      setRecentObituaries(recentData || []);

      const CATEGORIES = ['politics', 'economy', 'culture', 'society'];
      const newCategories: any = {};

      await Promise.all(CATEGORIES.map(async (cat) => {
        const { data } = await supabase
          .from('obituaries')
          .select('*')
          .eq('is_public', true)
          .eq('category', cat)
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50 font-serif text-gray-400">
        Digital Memorial Archive...
      </div>
    );
  }

  const categoryNames: { [key: string]: string } = {
    politics: 'Politics & Public Service',
    economy: 'Economy & Business',
    culture: 'Culture & Arts',
    society: 'Family & Society'
  };

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900 pb-20 relative">
      {/* Header (Desktop Only) */}
      <div className="border-b border-gray-200 bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">

          {/* Top Row: Memorial Banner - Title - Search (Desktop) */}
          <div className="w-full hidden lg:flex justify-between items-center mb-8 relative">

            {/* Left: Carousel Banner */}
            <BannerCarousel />

            {/* Center: Title */}
            <div className="flex flex-col items-center text-center w-1/3">
              <h1 className="text-3xl lg:text-4xl font-serif font-black tracking-tighter mb-1">Dear˚Beloved</h1>
              <p className="text-gray-400 font-serif italic text-sm">The Daily Memorial Archive</p>
            </div>

            {/* Right: Search */}
            <div className="flex flex-col items-end w-1/3 gap-3">
              <div className="relative w-full max-w-[280px]">
                <input
                  type="text"
                  placeholder="기사 검색"
                  className="w-full text-sm border-b border-gray-300 pb-2 focus:border-black outline-none bg-transparent text-right pr-6"
                />
                <button className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-900">
                  <ArrowRight size={14} />
                </button>
              </div>
              <Link href="/library" className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 uppercase tracking-wider">
                Advanced Seach <ArrowRight size={10} />
              </Link>
            </div>

          </div>



        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* Mobile Top Story Rotation */}
        {loading ? (
          <div className="lg:hidden h-[300px] w-full bg-gray-100 animate-pulse mb-8 rounded-lg"></div>
        ) : (
          <CategoryNewsRotation categories={categories} />
        )}

        {/* Newspaper Style 3-Column Layout */}
        {/* On Mobile, we hide the individual cards inside the grid columns to avoid duplication with the carousel above, 
            OR we assume the user wanted to REPLACE the list view with the carousel. 
            The grid-cols-1 on mobile makes it a vertical stack. 
            We will keep the desktop layout as is (hidden lg:block inner divs) and hide the mobile list divs. 
        */}
        {/* Newspaper Style 3-Column Layout (Refactored) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 border-t-[0.5px] border-[#C5A059] pt-12">

          {/* 1. 오늘의 고인 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#0A192F] pl-3 uppercase">오늘의 고인</h2>
            <FeaturedDeceased data={todayObituary} />
          </div>

          {/* 2. 추모 캘린더 (중앙 배치) */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#C5A059] pl-3 uppercase">추모 캘린더</h2>
            {/* Convert Summary to Obituary interface expected by Calendar if needed, 
                or ensure types match. Calendar expects {id, deceased_name, death_date, main_image_url}. 
                Summary has these fields. */}
            <div className="h-full min-h-[400px]">
              <MemorialCalendar />
            </div>
          </div>

          {/* 3. 에디터 픽 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold tracking-tighter border-l-4 border-[#0A192F] pl-3 uppercase">에디터 픽</h2>
            <EditorPick data={editorPick} />
          </div>

        </section>

        {/* Categories Grid (4 Columns) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t-[0.5px] border-heritage-gold pt-12">
          {['politics', 'economy', 'culture', 'society'].map((cat) => (
            <div key={cat} className="flex flex-col border-t-2 border-heritage-navy pt-4">
              <h3 className="font-sans font-black text-lg text-gray-900 uppercase tracking-widest mb-6 min-h-[50px] flex items-center border-b border-gray-100 pb-2">
                {categoryNames[cat].split('&').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h3>

              <div className="space-y-8">
                {categories[cat].length > 0 ? (
                  categories[cat].map((item) => (
                    <Link href={`/obituary/${item.id}`} key={item.id} className="block group border-b border-gray-100 last:border-0 pb-4 mb-4 lg:border-none lg:pb-0 lg:mb-0">

                      {/* Desktop Layout (Large Card) */}
                      <div className="hidden lg:block">
                        <div className="aspect-video bg-gray-100 mb-3 overflow-hidden relative shadow-sm">
                          {item.main_image_url ? (
                            <img src={item.main_image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={item.deceased_name} />
                          ) : null}
                        </div>
                        <h4 className="font-serif font-bold text-lg leading-snug mb-2 group-hover:text-blue-800 transition-colors">
                          {item.deceased_name}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {item.title}
                        </p>
                        <div className="mt-2 text-xs text-gray-400 uppercase">
                          {item.death_date ? new Date(item.death_date).getFullYear() : ''}
                        </div>
                      </div>

                      {/* Mobile Layout (List Card - Denser) */}
                      <div className="flex lg:hidden gap-3 items-center">
                        <div className="w-[72px] h-[72px] rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                          {item.main_image_url ? (
                            <img src={item.main_image_url} alt={item.deceased_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-stone-50 flex items-center justify-center text-stone-400 text-[10px] text-center p-1">No Img</div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 justify-center h-[72px]">
                          <h4 className="text-[17px] font-serif font-bold leading-tight mb-0.5 group-hover:underline cursor-pointer line-clamp-1 tracking-tight text-gray-900">
                            {item.deceased_name}
                          </h4>
                          <p className="text-[13px] text-gray-500 font-sans leading-snug line-clamp-1 tracking-normal mb-1">
                            {item.title}
                          </p>
                          <div className="text-[10px] text-gray-400 tracking-wide">
                            {item.death_date ? new Date(item.death_date).getFullYear() : ''}
                          </div>
                        </div>
                      </div>

                    </Link>
                  ))
                ) : (
                  <div className="text-gray-300 text-sm py-10 text-center italic">
                    No stories yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

      </div >
    </main >
  );
}
