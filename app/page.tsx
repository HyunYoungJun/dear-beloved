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
  category?: string | null; // Added category
  content: string | null;
  created_at: string;
  biography_data?: any;
};

export default function Home() {
  const [headline, setHeadline] = useState<ObituarySummary | null>(null);
  const [categories, setCategories] = useState<{ [key: string]: ObituarySummary[] }>({
    politics: [],
    economy: [],
    culture: [],
    society: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Headline (Latest Anchor/Premium or just latest)
      const { data: headlineData } = await supabase
        .from('obituaries')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setHeadline(headlineData);

      // 2. Fetch data for each category (Limit 3 per category)
      // Note: In production, doing 4 separate requests isn't ideal, but fine for prototype.
      const CATEGORIES = ['politics', 'economy', 'culture', 'society'];
      const newCategories: any = {};

      await Promise.all(CATEGORIES.map(async (cat) => {
        const { data } = await supabase
          .from('obituaries')
          .select('*')
          .eq('is_public', true)
          .eq('category', cat)
          .order('created_at', { ascending: false })
          .limit(3);
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
    <main className="min-h-screen bg-stone-50 text-gray-900 pb-20">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mb-2">Dear˚Beloved</h1>
          <p className="text-gray-500 font-serif italic">The Daily Memorial Archive</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* Newspaper Style 3-Column Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 border-b-2 border-gray-900 pb-12">

          {/* Column 1: Today's Obituary */}
          <div className="flex flex-col border-r border-gray-200 pr-0 lg:pr-8">
            <span className="inline-block bg-red-700 text-white text-xs font-bold px-2 py-1 mb-4 w-fit">오늘의 고인</span>
            <div className="aspect-[4/3] bg-gray-200 mb-4 overflow-hidden">
              {/* Placeholder Image */}
              <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-sm">이미지</div>
            </div>
            <h2 className="text-2xl font-serif font-bold leading-tight mb-2 hover:underline cursor-pointer">
              시대의 지성, 영원한 안식에 들다
            </h2>
            <div className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
              2024.12.19 | 정치&middot;사회
            </div>
            <p className="text-sm text-gray-600 font-serif leading-relaxed line-clamp-4">
              평생을 한국 사회의 민주화와 인권 신장을 위해 헌신했던 김철수 선생님께서 향년 85세를 일기로 별세하셨습니다. 선생님의 뜻을 기리며...
            </p>
          </div>

          {/* Column 2: Editor's Pick */}
          <div className="flex flex-col border-r border-gray-200 pr-0 lg:pr-8">
            <span className="inline-block bg-gray-900 text-white text-xs font-bold px-2 py-1 mb-4 w-fit">에디터 픽</span>
            <h3 className="text-xl font-serif font-bold leading-snug mb-3 hover:underline cursor-pointer">
              [기획] 잊혀진 독립운동가를 찾아서
            </h3>
            <p className="text-sm text-gray-600 font-serif leading-relaxed mb-6">
              우리가 기억해야 할 그러나 역사 속에 묻혀버린 이름들. 그들의 삶을 재조명합니다.
            </p>
            <div className="aspect-video bg-gray-200 mb-4 overflow-hidden">
              <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 text-sm">이미지</div>
            </div>
            <h4 className="text-lg font-serif font-bold leading-tight mb-1 hover:underline cursor-pointer">
              소박했지만 위대했던 삶
            </h4>
            <div className="text-xs text-gray-400 mb-2">
              2024.12.18 | 문화
            </div>
            <p className="text-sm text-gray-600 font-serif leading-relaxed line-clamp-3">
              이름 없는 꽃처럼 살다가신 故 이순자님의 삶이 우리에게 던지는 잔잔한 울림.
            </p>
          </div>

          {/* Column 3: My Tribute */}
          <div className="flex flex-col">
            <span className="inline-block bg-gray-100 text-gray-900 text-xs font-bold px-2 py-1 mb-4 w-fit border border-gray-300">나의 조문</span>

            <div className="bg-stone-50 p-6 border border-stone-100 h-full">
              <p className="text-xs text-gray-400 mb-4">로그인이 필요합니다</p>
              <h3 className="text-lg font-serif font-bold mb-4">
                가장 최근에 남긴 조문
              </h3>
              <div className="space-y-4">
                {/* Mock List Items */}
                <div className="border-b border-gray-200 pb-3">
                  <div className="text-xs text-gray-500 mb-1">2024.12.15</div>
                  <p className="text-sm font-serif text-gray-800 line-clamp-2">
                    "선생님의 가르침을 영원히 잊지 않겠습니다. 편히 쉬세요."
                  </p>
                  <div className="text-xs text-gray-400 mt-1 text-right">- 故 홍길동님께</div>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <div className="text-xs text-gray-500 mb-1">2024.11.30</div>
                  <p className="text-sm font-serif text-gray-800 line-clamp-2">
                    "사랑하는 할머니, 하늘나라에서도 행복하세요."
                  </p>
                  <div className="text-xs text-gray-400 mt-1 text-right">- 故 박막례님께</div>
                </div>
              </div>
              <button className="w-full mt-6 py-2 border border-gray-300 text-xs font-bold uppercase hover:bg-white transition-colors">
                내 기록 더보기
              </button>
            </div>
          </div>

        </section>

        {/* Categories Grid (4 Columns) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {['politics', 'economy', 'culture', 'society'].map((cat) => (
            <div key={cat} className="flex flex-col border-t-4 border-gray-900 pt-4">
              <h3 className="font-sans font-black text-lg text-gray-900 uppercase tracking-widest mb-6 min-h-[50px] flex items-center border-b border-gray-100 pb-2">
                {categoryNames[cat].split('&').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h3>

              <div className="space-y-8">
                {categories[cat].length > 0 ? (
                  categories[cat].map((item) => (
                    <Link href={`/obituary/${item.id}`} key={item.id} className="block group">
                      <div className="aspect-video bg-gray-100 mb-3 overflow-hidden relative">
                        {item.main_image_url ? (
                          <img src={item.main_image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
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

      </div>
    </main>
  );
}
