'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Plus,
  Sparkles,
  Layout,
  ExternalLink,
  MoreVertical,
  Layers,
  Folder,
  FolderPlus,
  Briefcase,
  User,
  ShoppingBag,
  Search,
  CheckCircle2,
  Trash2,
  Copy,
  Settings,
  ArrowUpRight,
  X,
  Palette,
  Check,
  ChevronRight,
  FolderCheck,
  FileCode2,
  HardDrive,
  Database,
  Server,
} from 'lucide-react';
import { WebsiteType } from '../../../types/builder';
import { TEMPLATES_REGISTRY } from '../../../constants/templates';

interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

interface WebsiteItem {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  siteType?: WebsiteType;
  workspaceId: string | null;
  published: boolean;
  pagesCount: number;
  updatedAt: string;
  thumbnail: string;
}

const WORKSPACE_ICONS: Record<string, React.ElementType> = {
  Folder,
  Briefcase,
  User,
  ShoppingBag,
  Globe,
  Sparkles,
};

const COLOR_PALETTE = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function DashboardPage() {
  const router = useRouter();

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([
    {
      id: 'ws_client',
      name: 'Client Deliverables',
      slug: 'client-deliverables',
      description: 'Production commercial websites and client deliverables',
      icon: 'Briefcase',
      color: '#6366f1',
    },
    {
      id: 'ws_personal',
      name: 'Personal Brands',
      slug: 'personal-brands',
      description: 'Portfolios, resumes, and personal creator projects',
      icon: 'User',
      color: '#ec4899',
    },
    {
      id: 'ws_ecom',
      name: 'E-Commerce Stores',
      slug: 'ecommerce-stores',
      description: 'Digital storefronts, product catalogs, and checkout funnels',
      icon: 'ShoppingBag',
      color: '#10b981',
    },
  ]);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  // Websites state initialized cleanly from templates
  const [websites, setWebsites] = useState<WebsiteItem[]>([
    {
      id: 'proj_solis_01',
      name: 'Solis DTC Storefront',
      slug: 'solis-storefront',
      subdomain: 'solis-store',
      siteType: 'dynamic',
      workspaceId: 'ws_ecom',
      published: true,
      pagesCount: 4,
      updatedAt: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'proj_kroma_02',
      name: 'Kroma Studio Portfolio',
      slug: 'kroma-studio',
      subdomain: 'kroma-studio',
      siteType: 'static',
      workspaceId: 'ws_personal',
      published: true,
      pagesCount: 3,
      updatedAt: '1 day ago',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDescription, setNewWsDescription] = useState('');
  const [newWsColor, setNewWsColor] = useState('#6366f1');
  const [newWsIcon, setNewWsIcon] = useState('Folder');

  // Create Website State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSiteType, setNewSiteType] = useState<WebsiteType>('dynamic');
  const [creationMode, setCreationMode] = useState<'scratch' | 'template'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES_REGISTRY[0].id);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteSubdomain, setNewSiteSubdomain] = useState('');
  const [newSiteWorkspaceId, setNewSiteWorkspaceId] = useState<string | null>(null);

  const [movingSiteId, setMovingSiteId] = useState<string | null>(null);

  const availableTemplates = TEMPLATES_REGISTRY.filter((t) => t.siteType === newSiteType);

  const handleTypeChange = (type: WebsiteType) => {
    setNewSiteType(type);
    const firstMatching = TEMPLATES_REGISTRY.find((t) => t.siteType === type);
    if (firstMatching) {
      setSelectedTemplateId(firstMatching.id);
      if (!newSiteName || TEMPLATES_REGISTRY.some((t) => t.title === newSiteName)) {
        setNewSiteName(firstMatching.title);
        setNewSiteSubdomain(firstMatching.slug);
      }
    }
  };

  // Compute workspace counts
  const getWorkspaceCount = (wsId: string) => {
    return websites.filter((site) => site.workspaceId === wsId).length;
  };

  // Filtered websites
  const filteredWebsites = websites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.subdomain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWorkspace = activeWorkspaceId === null || site.workspaceId === activeWorkspaceId;
    return matchesSearch && matchesWorkspace;
  });

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  // Handlers
  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    const newWs: WorkspaceItem = {
      id: `ws_${Date.now()}`,
      name: newWsName.trim(),
      slug: newWsName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newWsDescription.trim(),
      icon: newWsIcon,
      color: newWsColor,
    };

    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);
    setShowNewWorkspaceModal(false);
    setNewWsName('');
    setNewWsDescription('');
  };

  const handleCreateWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    const chosenTemplate = creationMode === 'template'
      ? TEMPLATES_REGISTRY.find((t) => t.id === selectedTemplateId)
      : null;

    const newSite: WebsiteItem = {
      id: `proj_${Date.now()}`,
      name: newSiteName.trim(),
      slug: newSiteName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subdomain: newSiteSubdomain.trim() || newSiteName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      siteType: newSiteType,
      workspaceId: newSiteWorkspaceId,
      published: false,
      pagesCount: 1,
      updatedAt: 'Just now',
      thumbnail: chosenTemplate?.thumbnail || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    };

    setWebsites((prev) => [newSite, ...prev]);
    setShowCreateModal(false);

    if (creationMode === 'template' && selectedTemplateId) {
      router.push(`/?template=${selectedTemplateId}`);
    } else {
      router.push('/');
    }
  };

  const handleMoveWebsite = (siteId: string, targetWorkspaceId: string | null) => {
    setWebsites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, workspaceId: targetWorkspaceId } : s))
    );
    setMovingSiteId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Navigation */}
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
            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-bold">
              Websites & Workspaces
            </Link>
            <Link href="/templates" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Templates
            </Link>
            <Link
              href="/storage"
              className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <HardDrive className="w-4 h-4 text-indigo-500" />
              <span>Storage Hub</span>
            </Link>
            <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Visual Editor
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/storage"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Storage & Quotas"
          >
            <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
            <span>60.4 MB / 5 GB</span>
          </Link>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Pro Plan
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
            DP
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Website Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Organize websites into workspace folders, craft static or database-driven experiences, and track storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/storage"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-slate-700 dark:text-slate-200"
            >
              <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Storage & Folders
            </Link>

            <button
              onClick={() => {
                setShowNewWorkspaceModal(true);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-slate-700 dark:text-slate-200"
            >
              <FolderPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              New Workspace
            </button>

            <button
              onClick={() => {
                setCreationMode('scratch');
                setNewSiteType('static');
                setNewSiteName('');
                setNewSiteSubdomain('');
                setNewSiteWorkspaceId(activeWorkspaceId);
                setShowCreateModal(true);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Website
            </button>
          </div>
        </div>

        {/* Quick Launch Cards (From Scratch vs Template vs AI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Start From Scratch */}
          <div
            onClick={() => {
              setCreationMode('scratch');
              setNewSiteType('static');
              setNewSiteName('New Website');
              setNewSiteSubdomain('');
              setNewSiteWorkspaceId(activeWorkspaceId);
              setShowCreateModal(true);
            }}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Start Blank Canvas
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Open a clean slate with complete design freedom, static or dynamic with inbuilt database.
            </p>
          </div>

          {/* Card 2: From Template */}
          <div
            onClick={() => {
              setCreationMode('template');
              setNewSiteType('dynamic');
              setNewSiteName('Nexus Platform');
              setNewSiteSubdomain('');
              setNewSiteWorkspaceId(activeWorkspaceId);
              setShowCreateModal(true);
            }}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Start from Template
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick from hand-crafted SaaS, E-Commerce, and Portfolio templates with vector icons.
            </p>
          </div>

          {/* Card 3: Storage & Directory Hub */}
          <Link
            href="/storage"
            className="p-5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-md hover:shadow-xl transition-all group cursor-pointer block"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold mb-1">
              Storage & Workspaces Hub
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              View storage quotas, manage database connections, and browse individual projects inventory.
            </p>
          </Link>
        </div>

        {/* Workspace Categorization Folders & Websites View */}
        <div className="space-y-6">
          {/* Workspaces Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* All Websites Tab */}
              <button
                onClick={() => setActiveWorkspaceId(null)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  activeWorkspaceId === null
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>All Websites</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-700 text-slate-200 dark:bg-slate-300 dark:text-slate-800 font-mono">
                  {websites.length}
                </span>
              </button>

              {/* Categorized Workspace Tabs */}
              {workspaces.map((ws) => {
                const IconComp = WORKSPACE_ICONS[ws.icon] || Folder;
                const count = getWorkspaceCount(ws.id);
                const isActive = activeWorkspaceId === ws.id;

                return (
                  <button
                    key={ws.id}
                    onClick={() => setActiveWorkspaceId(ws.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isActive ? '#ffffff' : ws.color }}
                    />
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{ws.name}</span>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                        isActive
                          ? 'bg-indigo-800 text-indigo-100'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search websites in workspace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Active Workspace Info Banner (if filtered) */}
          {activeWorkspace && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: activeWorkspace.color }}
                >
                  {React.createElement(WORKSPACE_ICONS[activeWorkspace.icon] || Folder, {
                    className: 'w-5 h-5',
                  })}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Workspace: {activeWorkspace.name}
                  </h3>
                  <p className="text-xs text-slate-500">{activeWorkspace.description}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {filteredWebsites.length} {filteredWebsites.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
          )}

          {/* Websites Grid */}
          {filteredWebsites.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <Folder className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No websites found in this workspace
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Start fresh with a static or dynamic canvas or choose a pre-built template to store here.
              </p>
              <button
                onClick={() => {
                  setCreationMode('scratch');
                  setNewSiteType('static');
                  setNewSiteName('New Website');
                  setNewSiteSubdomain('');
                  setNewSiteWorkspaceId(activeWorkspaceId);
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Create Website in Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredWebsites.map((site) => {
                const siteWorkspace = workspaces.find((w) => w.id === site.workspaceId);

                return (
                  <div
                    key={site.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all flex flex-col group relative"
                  >
                    {/* Thumbnail Header */}
                    <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={site.thumbnail}
                        alt={site.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {/* Architecture Badge */}
                        {site.siteType === 'dynamic' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-900/90 backdrop-blur-sm text-purple-200 border border-purple-700/60 flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <Database className="w-3 h-3 text-purple-300" />
                            Dynamic + DB
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-900/90 backdrop-blur-sm text-blue-200 border border-blue-700/60 flex items-center gap-1 shadow-sm">
                            <FileCode2 className="w-3 h-3 text-blue-300" />
                            Static View
                          </span>
                        )}

                        {site.published ? (
                          <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500 text-white rounded-full shadow-sm flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Live
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-800/80 backdrop-blur-sm text-slate-200 rounded-full shadow-sm">
                            Draft
                          </span>
                        )}
                      </div>

                      {/* Workspace Folder Tag */}
                      {siteWorkspace && (
                        <div className="absolute bottom-3 left-3">
                          <span
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg text-white shadow-sm flex items-center gap-1.5 backdrop-blur-md bg-slate-900/80"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: siteWorkspace.color }}
                            />
                            {siteWorkspace.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {site.name}
                          </h3>
                          <button
                            onClick={() => setMovingSiteId(site.id)}
                            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                            title="Move to Workspace Folder"
                          >
                            <Folder className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 truncate">
                          https://{site.subdomain}.apexbuilder.com
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3">
                          <span>{site.pagesCount} pages</span>
                          <span>•</span>
                          <span>{site.siteType === 'dynamic' ? 'Database CMS' : 'CDN Static'}</span>
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

                        <button
                          onClick={() => setMovingSiteId(site.id)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          title="Change Folder"
                        >
                          <FolderCheck className="w-4 h-4" />
                        </button>

                        <Link
                          href="/"
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          title="Preview Live"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal: Create Workspace Folder */}
      {showNewWorkspaceModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowNewWorkspaceModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  Create Workspace Folder
                </h3>
              </div>
              <button
                onClick={() => setShowNewWorkspaceModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Agency Clients, Personal Brand"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Optional brief notes about this folder..."
                  value={newWsDescription}
                  onChange={(e) => setNewWsDescription(e.target.value)}
                  rows={2}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Folder Color Accent
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewWsColor(color)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                        newWsColor === color ? 'scale-110 ring-2 ring-offset-2 ring-slate-800' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {newWsColor === color && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Folder Icon
                </label>
                <div className="flex items-center gap-2">
                  {Object.keys(WORKSPACE_ICONS).map((iconKey) => {
                    const IconComp = WORKSPACE_ICONS[iconKey];
                    const isSelected = newWsIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setNewWsIcon(iconKey)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewWorkspaceModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Website (Static vs Dynamic with DB, Blank vs Template) */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  Create New Website
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWebsite} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Architecture Choice: Static vs Responsive Dynamic with DB */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  1. Website Architecture & Data Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewSiteType('static')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      newSiteType === 'static'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <FileCode2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>Static Website</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 rounded font-normal">
                          View-Only
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Instant edge hosting, zero database needed. Ideal for marketing landers, portfolios & bios.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSiteType('dynamic')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      newSiteType === 'dynamic'
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Database className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>Dynamic Website</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 rounded font-normal">
                          With DB
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Database for CMS collections, inbound leads, blogs & e-commerce. Inbuilt DB settings included.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Inbuilt DB Configuration preview if Dynamic is selected */}
              {newSiteType === 'dynamic' && (
                <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/60 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-950 dark:text-purple-200">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-purple-600" />
                      Inbuilt Database Provisioning
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Auto-Provisioned
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                    A managed relational database with collections builder (Leads, Testimonials, Products) and visual data binding will be configured automatically for this project.
                  </p>
                </div>
              )}

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  2. Creation Strategy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCreationMode('scratch')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      creationMode === 'scratch'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    <FileCode2 className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Blank Canvas</div>
                      <div className="text-[11px] text-slate-500">From scratch with clean layout primitives</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreationMode('template')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      creationMode === 'template'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    <Layout className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold">From Template</div>
                      <div className="text-[11px] text-slate-500">Hand-crafted SaaS, Agency, or Store</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Template Picker if mode is template */}
              {creationMode === 'template' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Choose Template
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {availableTemplates.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          selectedTemplateId === tmpl.id
                            ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={tmpl.thumbnail}
                            alt={tmpl.title}
                            className="w-12 h-9 rounded object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {tmpl.title}
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {tmpl.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {tmpl.category} • {tmpl.siteType === 'dynamic' ? 'Dynamic + DB' : 'Static View-Only'}
                            </div>
                          </div>
                        </div>
                        {selectedTemplateId === tmpl.id && (
                          <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Website Name & Subdomain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Horizon Cloud"
                    value={newSiteName}
                    onChange={(e) => {
                      setNewSiteName(e.target.value);
                      if (!newSiteSubdomain) {
                        setNewSiteSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    required
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subdomain
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="horizon-cloud"
                      value={newSiteSubdomain}
                      onChange={(e) => setNewSiteSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Target Workspace Folder Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Store in Workspace Folder
                </label>
                <select
                  value={newSiteWorkspaceId || ''}
                  onChange={(e) => setNewSiteWorkspaceId(e.target.value ? e.target.value : null)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                >
                  <option value="">(No folder - General)</option>
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      📁 {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Create & Open Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Move Website to Workspace Folder */}
      {movingSiteId && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setMovingSiteId(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Move to Workspace Folder
                </h3>
              </div>
              <button onClick={() => setMovingSiteId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-2">
              <button
                onClick={() => handleMoveWebsite(movingSiteId, null)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-slate-400" />
                  <span>General (No folder)</span>
                </div>
              </button>

              {workspaces.map((ws) => {
                const IconComp = WORKSPACE_ICONS[ws.icon] || Folder;
                return (
                  <button
                    key={ws.id}
                    onClick={() => handleMoveWebsite(movingSiteId, ws.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ws.color }} />
                      <IconComp className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{ws.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
