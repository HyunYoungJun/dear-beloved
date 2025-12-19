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
  service_type: string | null;
  category: string | null; // Added category
  content: string | null;
  created_at: string;
  biography_data: any;
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

        {/* Hero Headline */}
        {headline && (
          <section className="mb-20 border-b-2 border-gray-900 pb-12">
            <Link href={`/obituary/${headline.id}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="aspect-[16/10] overflow-hidden bg-gray-200 relative">
                {headline.main_image_url && (
                  <img
                    src={headline.main_image_url}
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                )}
                <span className="absolute top-0 left-0 bg-red-700 text-white text-xs font-bold px-3 py-1 uppercase">
                  Top Story
                </span>
              </div>
              <div className="flex flex-col justify-center h-full">
                <div className="flex gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  <span>{new Date(headline.created_at).toLocaleDateString()}</span>
                  <span>/</span>
                  <span>{headline.category ? categoryNames[headline.category] || headline.category : 'Obituary'}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6 group-hover:underline decoration-2 underline-offset-4">
                  {headline.title}
                </h2>
                <p className="text-lg text-gray-600 font-serif italic leading-relaxed line-clamp-3">
                  "{headline.biography_data?.quote || headline.content?.substring(0, 100) || "고인의 삶을 기억합니다."}"
                </p>
              </div>
            </Link>
          </section>
        )}

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
