'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HardDrive,
  Database,
  Layers,
  Folder,
  Globe,
  FileCode2,
  Sparkles,
  Upload,
  Search,
  ExternalLink,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  Server,
  Cpu,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Plus,
  FolderPlus,
} from 'lucide-react';
import { WebsiteType } from '../../../types/builder';

interface StorageProjectItem {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  siteType: WebsiteType;
  workspaceName: string;
  workspaceColor: string;
  storageBytes: number;
  pagesCount: number;
  cmsRecordsCount: number;
  dbEngine?: string;
  dbStatus?: string;
  updatedAt: string;
}

interface StorageWorkspaceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  websitesCount: number;
  totalStorageBytes: number;
  createdAt: string;
}

interface AssetItem {
  id: string;
  name: string;
  type: 'image' | 'svg' | 'font' | 'document';
  url: string;
  sizeBytes: number;
  dimensions?: string;
  uploadedAt: string;
}

export default function StoragePage() {
  const [activeTab, setActiveTab] = useState<'workspaces' | 'projects' | 'assets'>('workspaces');
  const [projectTypeFilter, setProjectTypeFilter] = useState<'all' | 'static' | 'dynamic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);

  // Storage Stats
  const quotaLimitBytes = 5 * 1024 * 1024 * 1024; // 5 GB
  const usedStorageBytes = 60.38 * 1024 * 1024; // ~60.4 MB
  const usedPercent = ((usedStorageBytes / quotaLimitBytes) * 100).toFixed(1);

  // Workspaces Data
  const [workspaces] = useState<StorageWorkspaceItem[]>([
    {
      id: 'ws_client',
      name: 'Client Deliverables',
      description: 'Production commercial websites and client deliverables',
      icon: 'Briefcase',
      color: '#6366f1',
      websitesCount: 1,
      totalStorageBytes: 12 * 1024 * 1024,
      createdAt: '2026-11-01',
    },
    {
      id: 'ws_personal',
      name: 'Personal Brands',
      description: 'Portfolios, resumes, and personal creator projects',
      icon: 'User',
      color: '#ec4899',
      websitesCount: 1,
      totalStorageBytes: 380 * 1024,
      createdAt: '2026-11-03',
    },
    {
      id: 'ws_ecom',
      name: 'E-Commerce Stores',
      description: 'Digital storefronts, product catalogs, and checkout funnels',
      icon: 'ShoppingBag',
      color: '#10b981',
      websitesCount: 1,
      totalStorageBytes: 48 * 1024 * 1024,
      createdAt: '2026-11-05',
    },
  ]);

  // Projects Data
  const [projects] = useState<StorageProjectItem[]>([
    {
      id: 'proj_default_01',
      name: 'Nexus Cloud Infrastructure',
      slug: 'nexus-cloud-infrastructure',
      subdomain: 'nexus-cloud',
      siteType: 'dynamic',
      workspaceName: 'Client Deliverables',
      workspaceColor: '#6366f1',
      storageBytes: 12 * 1024 * 1024,
      pagesCount: 3,
      cmsRecordsCount: 20,
      dbEngine: 'Inbuilt SQLite Managed',
      dbStatus: 'connected',
      updatedAt: 'Just now',
    },
    {
      id: 'proj_ecommerce_02',
      name: 'Solis Modern Storefront',
      slug: 'solis-modern-storefront',
      subdomain: 'solis-store',
      siteType: 'dynamic',
      workspaceName: 'E-Commerce Stores',
      workspaceColor: '#10b981',
      storageBytes: 48 * 1024 * 1024,
      pagesCount: 5,
      cmsRecordsCount: 42,
      dbEngine: 'Inbuilt SQLite Managed',
      dbStatus: 'connected',
      updatedAt: '2 hours ago',
    },
    {
      id: 'proj_portfolio_03',
      name: 'Minimal Creator Studio',
      slug: 'minimal-creator-studio',
      subdomain: 'creator-studio',
      siteType: 'static',
      workspaceName: 'Personal Brands',
      workspaceColor: '#ec4899',
      storageBytes: 380 * 1024,
      pagesCount: 2,
      cmsRecordsCount: 0,
      updatedAt: '1 day ago',
    },
  ]);

  // Media Assets Data
  const [assets, setAssets] = useState<AssetItem[]>([
    {
      id: 'asset_01',
      name: 'cloud-server-rack.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
      sizeBytes: 1.2 * 1024 * 1024,
      dimensions: '1920 x 1080',
      uploadedAt: 'Today, 14:20',
    },
    {
      id: 'asset_02',
      name: 'minimal-creator-hero.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
      sizeBytes: 850 * 1024,
      dimensions: '1600 x 900',
      uploadedAt: 'Yesterday',
    },
    {
      id: 'asset_03',
      name: 'solis-lifestyle-lookbook.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
      sizeBytes: 2.4 * 1024 * 1024,
      dimensions: '2400 x 1600',
      uploadedAt: 'Nov 8, 2026',
    },
  ]);

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedAssetId(id);
    setTimeout(() => setCopiedAssetId(null), 2000);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subdomain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = projectTypeFilter === 'all' || p.siteType === projectTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
              Nexus Studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Websites & Workspaces
            </Link>
            <Link href="/templates" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Templates
            </Link>
            <Link
              href="/storage"
              className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-bold"
            >
              <HardDrive className="w-4 h-4" />
              <span>Storage Hub</span>
            </Link>
            <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Visual Editor
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            5 GB Pro Storage
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
            DP
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Title & Storage Quota Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Storage & Workspaces Directory
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Monitor storage consumption, manage workspace folders, and inspect database-driven vs static sites.
              </p>
            </div>

            {/* Quota Progress Meter */}
            <div className="min-w-[280px] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Total Storage Usage</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  {formatBytes(usedStorageBytes)} / 5.0 GB ({usedPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(Number(usedPercent), 2)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Inbuilt SQLite & Media CDN</span>
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Healthy
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-indigo-500" />
                Workspaces
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {workspaces.length} Folders
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-500" />
                Dynamic (With DB)
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {projects.filter((p) => p.siteType === 'dynamic').length} Websites
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                Static (View-Only)
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {projects.filter((p) => p.siteType === 'static').length} Websites
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                Media Assets
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {assets.length} Uploads
              </div>
            </div>
          </div>
        </div>

        {/* Directory Tabs Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('workspaces')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'workspaces'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Workspaces Directory</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">
                {workspaces.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Individual Projects</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'assets'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Media & Assets Vault</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">
                {assets.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter storage inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* TAB 1: WORKSPACES DIRECTORY */}
        {activeTab === 'workspaces' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Categorized Workspace Folders
                </h3>
                <p className="text-xs text-slate-500">
                  Folder organization and aggregate disk consumption across all environments.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                Manage in Dashboard
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: ws.color }}
                      >
                        <Folder className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        {formatBytes(ws.totalStorageBytes)}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-4">
                      {ws.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {ws.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {ws.websitesCount} {ws.websitesCount === 1 ? 'website' : 'websites'}
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      View Folder <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INDIVIDUAL PROJECTS DIRECTORY */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {/* Filter pills: Static vs Dynamic with DB */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProjectTypeFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    projectTypeFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  All Types ({projects.length})
                </button>
                <button
                  onClick={() => setProjectTypeFilter('dynamic')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    projectTypeFilter === 'dynamic'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Database className="w-3 h-3 text-purple-400" />
                  Dynamic (With DB) ({projects.filter((p) => p.siteType === 'dynamic').length})
                </button>
                <button
                  onClick={() => setProjectTypeFilter('static')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    projectTypeFilter === 'static'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FileCode2 className="w-3 h-3 text-blue-400" />
                  Static (View-Only) ({projects.filter((p) => p.siteType === 'static').length})
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                Showing {filteredProjects.length} websites
              </span>
            </div>

            {/* Projects Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Website Project</th>
                      <th className="py-3 px-4">Architecture Type</th>
                      <th className="py-3 px-4">Workspace Folder</th>
                      <th className="py-3 px-4">Pages / CMS</th>
                      <th className="py-3 px-4">Storage Weight</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{p.name}</div>
                          <div className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                            https://{p.subdomain}.apexbuilder.com
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {p.siteType === 'dynamic' ? (
                            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 w-max">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <Database className="w-3 h-3 text-purple-600" />
                              Inbuilt DB Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 w-max">
                              <FileCode2 className="w-3 h-3 text-blue-600" />
                              Static View-Only (No DB)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: p.workspaceColor }}
                            />
                            {p.workspaceName}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                          <div>{p.pagesCount} pages</div>
                          {p.siteType === 'dynamic' && (
                            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                              {p.cmsRecordsCount} CMS records
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {formatBytes(p.storageBytes)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href="/"
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors inline-block"
                          >
                            Open Editor
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA & ASSETS VAULT */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Global Media & Asset Vault
                </h3>
                <p className="text-xs text-slate-500">
                  Uploaded images, vector graphics, and documents distributed across global CDN nodes.
                </p>
              </div>

              <button
                onClick={() => alert('Drag and drop an image onto the uploader box below!')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New Asset
              </button>
            </div>

            {/* Drag & Drop Box */}
            <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-center hover:border-indigo-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Drag and drop your media files here, or browse
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Supports PNG, JPG, WebP, SVG, and PDF up to 25MB each
              </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-900/80 backdrop-blur-sm text-white rounded">
                        {formatBytes(asset.sizeBytes)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {asset.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>{asset.dimensions || 'Vector SVG'}</span>
                        <span>•</span>
                        <span>{asset.uploadedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleCopyLink(asset.url, asset.id)}
                        className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedAssetId === asset.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600">Copied URL!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy CDN URL</span>
                          </>
                        )}
                      </button>

                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        title="View Full File"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

