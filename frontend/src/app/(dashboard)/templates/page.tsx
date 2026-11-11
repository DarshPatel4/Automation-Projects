'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Sparkles,
  Layout,
  Eye,
  Search,
  HardDrive,
  Database,
  FileCode2,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  FolderPlus,
  Layers,
} from 'lucide-react';
import { TEMPLATES_REGISTRY, TemplateDefinition } from '../../../constants/templates';
import { WebsiteType } from '../../../types/builder';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'all' | 'dynamic' | 'static'>('all');
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'E-Commerce', 'SaaS', 'Healthcare', 'Portfolio', 'Restaurant', 'Resume'];

  const filtered = TEMPLATES_REGISTRY.filter((t) => {
    const matchesType = selectedType === 'all' || t.siteType === selectedType;
    const matchesCat = selectedCat === 'All' || t.category === selectedCat;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesCat && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    router.push(`/?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
              Template Marketplace
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/storage"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
            <span>Storage Hub</span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            Open Blank Editor
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Marketplace Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production-Grade Architecture Templates</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Pre-Configured Static & Dynamic Templates
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2 leading-relaxed">
              Choose between <strong>Dynamic Websites</strong> (integrated with Inbuilt SQLite database, CMS collections, and product catalogs) or <strong>Static Websites</strong> (zero database overhead, instant CDN edge delivery).
            </p>
          </div>

          {/* Architecture Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Architectures ({TEMPLATES_REGISTRY.length})
            </button>

            <button
              onClick={() => setSelectedType('dynamic')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedType === 'dynamic'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Dynamic (With Inbuilt DB)</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">
                {TEMPLATES_REGISTRY.filter((t) => t.siteType === 'dynamic').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedType('static')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedType === 'static'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Static (View-Only / Jamstack)</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">
                {TEMPLATES_REGISTRY.filter((t) => t.siteType === 'static').length}
              </span>
            </button>
          </div>
        </div>

        {/* Categories & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search templates, tags, or CMS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Thumbnail Header */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={tmpl.thumbnail}
                  alt={tmpl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Architecture Badge */}
                <div className="absolute top-3 right-3">
                  {tmpl.siteType === 'dynamic' ? (
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-purple-900/90 backdrop-blur-sm text-purple-200 border border-purple-700/60 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <Database className="w-3 h-3 text-purple-300" />
                      Dynamic + DB
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-900/90 backdrop-blur-sm text-blue-200 border border-blue-700/60 flex items-center gap-1.5 shadow-sm">
                      <FileCode2 className="w-3 h-3 text-blue-300" />
                      Static View-Only
                    </span>
                  )}
                </div>

                {/* Category Pill */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-slate-900/80 backdrop-blur-md text-white">
                    {tmpl.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>

                  {/* Collections or Static Feature Highlights */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {tmpl.siteType === 'dynamic' && tmpl.collections ? (
                      <div className="text-[11px] text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-purple-600" />
                        <span>Inbuilt DB: {tmpl.collections.map((c) => c.label).join(', ')}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-blue-700 dark:text-blue-300 font-medium flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Zero DB Maintenance • Pure CDN Global Edge Delivery</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tmpl.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleUseTemplate(tmpl.id)}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleUseTemplate(tmpl.id)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Live Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
