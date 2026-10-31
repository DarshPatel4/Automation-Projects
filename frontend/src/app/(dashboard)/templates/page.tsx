'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Layout, Eye, Search } from 'lucide-react';

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  pages: number;
}

const templatesData: TemplateItem[] = [
  {
    id: 'tmpl-saas-01',
    title: 'Apex SaaS Modern',
    category: 'SaaS',
    description: 'High-converting dark/light SaaS landing page with pricing, features grid, and metric counters.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    pages: 4,
  },
  {
    id: 'tmpl-portfolio-02',
    title: 'Minimal Creator Studio',
    category: 'Portfolio',
    description: 'Clean typography-first portfolio for designers, developers, and creative agencies.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    pages: 3,
  },
  {
    id: 'tmpl-ecom-03',
    title: 'Luxe Goods Commerce',
    category: 'E-commerce',
    description: 'Minimalist product catalog, cart drawer, checkout workflow, and promotional banner.',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    pages: 5,
  },
  {
    id: 'tmpl-clinic-04',
    title: 'CareWell Clinic',
    category: 'Healthcare',
    description: 'Doctor profiles, appointment booking form, emergency helpline bar, and service tiers.',
    thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    pages: 3,
  },
  {
    id: 'tmpl-food-05',
    title: 'Bistro & Grill Table',
    category: 'Restaurant',
    description: 'Menu categories with price tags, reservation popup, customer testimonials, and location map.',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    pages: 4,
  },
  {
    id: 'tmpl-agency-06',
    title: 'Velocity Growth Agency',
    category: 'Agency',
    description: 'Case study showcases, client logo clouds, interactive FAQ accordion, and audit booking.',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    pages: 4,
  },
];

const categories = ['All', 'SaaS', 'Portfolio', 'E-commerce', 'Healthcare', 'Restaurant', 'Agency'];

export default function TemplatesPage() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = templatesData.filter((t) => {
    const matchesCat = selectedCat === 'All' || t.category === selectedCat;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600" />
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
              Template Marketplace
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          Open Blank Editor
        </Link>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-10 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Crafted for speed, built for conversion
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Choose a responsive template designed to perfection. Every template imports as fully editable drag-and-drop components in your studio.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={tmpl.thumbnail}
                  alt={tmpl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-600/90 backdrop-blur-sm text-white rounded-md shadow-sm">
                    {tmpl.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium block mt-2">
                    {tmpl.pages} fully designed responsive pages
                  </span>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Link
                    href="/"
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    Use This Template
                  </Link>
                  <Link
                    href="/"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                    title="Live Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
