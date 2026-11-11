'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEditorStore } from '../../stores/editorStore';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  CloudUpload,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  HardDrive,
  Database,
  ArrowLeft,
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const project = useEditorStore((s) => s.project);
  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const zoom = useEditorStore((s) => s.zoom);
  const previewMode = useEditorStore((s) => s.previewMode);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const history = useEditorStore((s) => s.history);
  const saveStatus = useEditorStore((s) => s.saveStatus);

  const setBreakpoint = useEditorStore((s) => s.setBreakpoint);
  const setZoom = useEditorStore((s) => s.setZoom);
  const togglePreview = useEditorStore((s) => s.togglePreview);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const addPage = useEditorStore((s) => s.addPage);
  const switchPage = useEditorStore((s) => s.switchPage);
  const setPublished = useEditorStore((s) => s.setPublished);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageTemplate, setNewPageTemplate] = useState<'blank' | 'about' | 'contact' | 'pricing'>('about');
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handlePublish = () => {
    setPublished(true);
  };

  const activePage = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.slug}-export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      <header className="h-14 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-4 z-40 select-none shadow-sm">
        {/* Left: Brand & Page Selector */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
            title="Return to Dashboard & Workspaces"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 block leading-tight">
                Nexus Studio
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                Visual Platform
              </span>
            </div>
          </Link>

          {/* Project Name, Type Badge & Storage link */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 max-w-[120px] truncate hidden md:inline">
              {project.name}
            </span>

            {/* Architecture Badge */}
            {project.siteType === 'dynamic' ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Database className="w-2.5 h-2.5 text-purple-600" />
                DB
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Static
              </span>
            )}

            <Link
              href="/storage"
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Storage Hub & Assets"
            >
              <HardDrive className="w-3.5 h-3.5" />
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <select
              value={project.activePageId}
              onChange={(e) => switchPage(e.target.value)}
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-1.5 px-2.5 rounded-md border border-transparent focus:border-indigo-500 outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {project.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.slug})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAddPageDialog(true)}
              title="Add New Page"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-800"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Breakpoints & Undo / Redo */}
        <div className="flex items-center gap-2">
          {/* Breakpoints */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBreakpoint('desktop')}
              title="Desktop View (1440px)"
              className={`p-1.5 rounded-md transition-colors ${
                activeBreakpoint === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setBreakpoint('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-md transition-colors ${
                activeBreakpoint === 'tablet'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setBreakpoint('mobile')}
              title="Mobile View (375px)"
              className={`p-1.5 rounded-md transition-colors ${
                activeBreakpoint === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded-md ${
                canUndo
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className={`p-1.5 rounded-md ${
                canRedo
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 gap-1.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.max(25, z - 10))}
              className="hover:text-indigo-600 p-0.5"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              className="hover:text-indigo-600 p-0.5"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="hover:text-indigo-600 p-0.5 ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Preview, Export & Publish */}
        <div className="flex items-center gap-2">
          {/* Live Preview Button */}
          <button
            onClick={togglePreview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              previewMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            {previewMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Preview
              </>
            )}
          </button>

          {/* Export Code */}
          <button
            onClick={handleExportJson}
            title="Export Clean JSON Schema"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          {/* Publish Button */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            {project.published ? 'Published' : 'Publish'}
          </button>
        </div>
      </header>

      {/* Add Page Modal Dialog */}
      {showAddPageDialog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Create New Page
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new page to your site with pre-built architectural layout or blank canvas.
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. About Us, Contact, Pricing"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Layout Template
                </label>
                <select
                  value={newPageTemplate}
                  onChange={(e) => setNewPageTemplate(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                >
                  <option value="about">About & Mission Template</option>
                  <option value="contact">Contact & Inquiry Form</option>
                  <option value="pricing">3-Tier Pricing Matrix</option>
                  <option value="blank">Blank Clean Canvas</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddPageDialog(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                disabled={!newPageTitle.trim()}
                onClick={() => {
                  const slug = '/' + newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  addPage(newPageTitle.trim(), slug, newPageTemplate);
                  setNewPageTitle('');
                  setShowAddPageDialog(false);
                }}
                className="px-4 py-1.5 text-xs bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Add Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal Dialog */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <CloudUpload className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Publish Website
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Deploy your visual website instantly to global edge CDN with high performance and auto-provisioned SSL.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Free Platform Subdomain
                </span>
                <div className="flex items-center justify-between text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  <span>https://{project.subdomain || 'mysite'}.apexbuilder.com</span>
                  {project.published && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Live
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Custom Domain (Pro/Business)
                </span>
                <input
                  type="text"
                  placeholder="e.g. www.mycompany.com"
                  defaultValue={project.customDomain || ''}
                  className="w-full text-xs font-mono px-2 py-1.5 bg-white dark:bg-slate-900 border rounded border-slate-300 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handlePublish();
                  setShowPublishModal(false);
                }}
                className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Publish Live Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

