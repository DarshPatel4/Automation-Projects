'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Plus,
  Sparkles,
  Layout,
  ExternalLink,
  MoreVertical,
  Layers,
  HardDrive,
  Eye,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Trash2,
  Copy,
  Settings,
} from 'lucide-react';

interface WebsiteItem {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  published: boolean;
  pagesCount: number;
  updatedAt: string;
  thumbnail: string;
}

export default function DashboardPage() {
  const [websites, setWebsites] = useState<WebsiteItem[]>([
    {
      id: 'proj_default_01',
      name: 'Apex Landing Page',
      slug: 'apex-landing-page',
      subdomain: 'apex-demo',
      published: true,
      pagesCount: 3,
      updatedAt: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'proj_ecommerce_02',
      name: 'Aura Lifestyle Store',
      slug: 'aura-store',
      subdomain: 'aura-shop',
      published: false,
      pagesCount: 5,
      updatedAt: '2 hours ago',
      thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'proj_portfolio_03',
      name: 'Creative Portfolio',
      slug: 'creative-portfolio',
      subdomain: 'darsh-design',
      published: true,
      pagesCount: 2,
      updatedAt: '1 day ago',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = websites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
              ▲
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
              ApexBuilder
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400">
              Websites
            </Link>
            <Link href="/templates" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Templates
            </Link>
            <Link href="/billing" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Subscription
            </Link>
            <Link href="/settings" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Account Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Pro Plan
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
            DP
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-10 space-y-10">
        {/* Welcome & Create Actions Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back, Darsh 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Manage your websites, build new experiences, or synthesize complete layouts with AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-slate-700 dark:text-slate-200"
            >
              <Layout className="w-4 h-4 text-indigo-600" />
              Browse Templates
            </Link>

            <Link
              href="/editor/new"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Website
            </Link>
          </div>
        </div>

        {/* Quick Creation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/editor/new"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Start from Scratch
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Open a clean, unstyled canvas with complete design freedom and modern layout primitives.
            </p>
          </Link>

          <Link
            href="/templates"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Use a Template
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick from 50+ hand-crafted industry designs across SaaS, E-commerce, Portfolios, and Clinics.
            </p>
          </Link>

          <div
            onClick={() => alert('AI Website Synthesizer wizard: Generates full multi-page component JSON tree from prompt!')}
            className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-md hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold mb-1">
              Synthesize with AI
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Describe your business in plain words. AI creates complete multi-page editable component trees.
            </p>
          </div>
        </div>

        {/* Websites List Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>My Websites</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 font-mono">
                {websites.length}
              </span>
            </h2>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Websites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredWebsites.map((site) => (
              <div
                key={site.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Thumbnail Header */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={site.thumbnail}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {site.published ? (
                      <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500 text-white rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800/80 backdrop-blur-sm text-slate-200 rounded-full shadow-sm">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {site.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 truncate">
                      https://{site.subdomain}.apexbuilder.com
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3">
                      <span>{site.pagesCount} pages</span>
                      <span>•</span>
                      <span>Edited {site.updatedAt}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href="/"
                      className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      Open Studio Editor
                    </Link>

                    <Link
                      href="/"
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                      title="Preview Live"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
