'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { ComponentStyle, ClickAction, ActionType } from '../../types/builder';
import { availableIcons } from '../ui/LucideIcon';
import {
  SlidersHorizontal,
  Type,
  Maximize2,
  Palette,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Layers,
  ArrowRight,
  Square,
  ShieldCheck,
  Zap,
  MousePointerClick,
  Globe,
  Webhook,
  FileCode,
  ArrowUpRight,
  Anchor,
  ShoppingBag,
  Database,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Check,
  Loader2,
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const nodes = useEditorStore((s) => s.getActivePageNodes());
  const activeStyleTab = useEditorStore((s) => s.activeStyleTab);
  const setActiveStyleTab = useEditorStore((s) => s.setActiveStyleTab);
  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const previewMode = useEditorStore((s) => s.previewMode);
  const project = useEditorStore((s) => s.project);
  const addPage = useEditorStore((s) => s.addPage);

  const updateNodeProps = useEditorStore((s) => s.updateNodeProps);
  const updateNodeStyles = useEditorStore((s) => s.updateNodeStyles);
  const updateNodeName = useEditorStore((s) => s.updateNodeName);

  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTemplate, setNewPageTemplate] = useState<'blank' | 'about' | 'contact' | 'pricing'>('about');
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<{ ok: boolean; status: number; text: string } | null>(null);

  if (previewMode) return null;

  const node = selectedNodeId ? nodes[selectedNodeId] : null;

  if (!node) {
    return (
      <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center text-center text-slate-400 select-none">
        <Square className="w-10 h-10 mb-3 stroke-[1.5] text-slate-300" />
        <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
          No Element Selected
        </h4>
        <p className="text-xs text-slate-400 max-w-[200px]">
          Click on any element in the canvas or layers tree to customize properties and styling.
        </p>
      </div>
    );
  }

  // Get current styles for the active breakpoint
  const currentStyles: ComponentStyle = {
    ...(node.styles?.base || {}),
    ...(node.styles?.responsive?.[activeBreakpoint] || {}),
  };

  const handleStyleChange = (key: keyof ComponentStyle, value: any) => {
    updateNodeStyles(node.id, { [key]: value }, activeBreakpoint);
  };

  const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', val: string) => {
    const currentPadding = currentStyles.padding || {};
    handleStyleChange('padding', { ...currentPadding, [side]: val });
  };

  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', val: string) => {
    const currentMargin = currentStyles.margin || {};
    handleStyleChange('margin', { ...currentMargin, [side]: val });
  };

  const currentAction: ClickAction = node.props?.action || { type: 'none' };

  const handleActionChange = (updates: Partial<ClickAction>) => {
    const merged: ClickAction = { ...currentAction, ...updates };
    updateNodeProps(node.id, { action: merged });
  };

  const handleCreateAndLinkPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const slug = newPageSlug.trim() || `/${newPageTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const createdPageId = addPage(newPageTitle.trim(), slug, newPageTemplate);
    handleActionChange({
      type: 'navigate_page',
      targetPageId: createdPageId,
      targetPageSlug: slug,
    });
    setShowNewPageForm(false);
    setNewPageTitle('');
    setNewPageSlug('');
  };

  const handleTestWebhook = async () => {
    if (!currentAction.webhookUrl) return;
    setTestingWebhook(true);
    setWebhookTestStatus(null);
    try {
      const res = await fetch(currentAction.webhookUrl, {
        method: currentAction.webhookMethod || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentAction.webhookHeaders || {}),
        },
        body: currentAction.webhookMethod === 'POST' ? JSON.stringify(currentAction.webhookPayload || { test: true, timestamp: Date.now() }) : undefined,
      });
      setWebhookTestStatus({ ok: res.ok, status: res.status, text: res.statusText || (res.ok ? 'OK' : 'Error') });
    } catch (err: any) {
      setWebhookTestStatus({ ok: false, status: 0, text: err.message || 'Network / CORS request failed' });
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Node Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 uppercase">
              {node.type}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[130px]">
              {node.name || node.type}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Breakpoint: <b className="capitalize text-indigo-600">{activeBreakpoint}</b>
          </span>
        </div>
      </div>

      {/* Style Section Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950/50">
        {[
          { id: 'style', label: 'Design' },
          { id: 'layout', label: 'Layout' },
          { id: 'typography', label: 'Text' },
          { id: 'spacing', label: 'Spacing' },
          { id: 'actions', label: 'Actions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStyleTab(tab.id as any)}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition-all ${
              activeStyleTab === tab.id
                ? 'border-indigo-600 text-indigo-600 font-semibold bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ELEMENT CONTENT & PROPS (Always accessible at top) */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Element Properties
          </span>

          {/* Heading Props */}
          {node.type === 'Heading' && (
            <>
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                  Text Content
                </label>
                <textarea
                  rows={2}
                  value={node.props?.content || ''}
                  onChange={(e) => updateNodeProps(node.id, { content: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-slate-600 dark:text-slate-300 font-medium">
                  Heading Tag
                </label>
                <select
                  value={node.props?.level || 2}
                  onChange={(e) => updateNodeProps(node.id, { level: Number(e.target.value) })}
                  className="p-1 border rounded dark:bg-slate-800 dark:border-slate-700"
                >
                  {[1, 2, 3, 4, 5, 6].map((l) => (
                    <option key={l} value={l}>
                      H{l}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Paragraph Props */}
          {node.type === 'Paragraph' && (
            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                Content
              </label>
              <textarea
                rows={3}
                value={node.props?.content || ''}
                onChange={(e) => updateNodeProps(node.id, { content: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>
          )}

          {/* Button Props */}
          {node.type === 'Button' && (
            <>
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={node.props?.label || ''}
                  onChange={(e) => updateNodeProps(node.id, { label: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none"
                />
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveStyleTab('actions')}
                  className="w-full py-1.5 px-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center justify-between hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Click Action: <b className="capitalize">{currentAction.type.replace('_', ' ')}</b></span>
                  </span>
                  <span className="text-[10px] underline font-medium">Configure</span>
                </button>
              </div>
            </>
          )}

          {/* Image Props */}
          {node.type === 'Image' && (
            <>
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={node.props?.src || ''}
                  onChange={(e) => updateNodeProps(node.id, { src: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                  Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={node.props?.alt || ''}
                  onChange={(e) => updateNodeProps(node.id, { alt: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none"
                />
              </div>
            </>
          )}

          {/* Icon Props */}
          {node.type === 'Icon' && (
            <div className="space-y-3">
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                  Vector Icon Name
                </label>
                <select
                  value={node.props?.iconName || 'Layers'}
                  onChange={(e) => updateNodeProps(node.id, { iconName: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none"
                >
                  {availableIcons.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                  Icon Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={node.props?.color || '#ffffff'}
                    onChange={(e) => updateNodeProps(node.id, { color: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={node.props?.color || '#ffffff'}
                    onChange={(e) => updateNodeProps(node.id, { color: e.target.value })}
                    className="flex-1 p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-600 dark:text-slate-300 font-medium">
                    Icon Size
                  </label>
                  <span className="font-mono text-slate-400">{node.props?.size || 20}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="64"
                  value={node.props?.size || 20}
                  onChange={(e) => updateNodeProps(node.id, { size: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: DESIGN & STYLING */}
        {activeStyleTab === 'style' && (
          <div className="space-y-4">
            {/* Background Color */}
            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={currentStyles.backgroundColor || ''}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  placeholder="#ffffff or transparent"
                  className="flex-1 p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
                />
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-slate-600 dark:text-slate-300 font-medium">
                  Corner Radius
                </label>
                <span className="font-mono text-slate-400">{currentStyles.borderRadius || '0px'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(currentStyles.borderRadius || '0')}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Border Width & Color */}
            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-300 font-medium block">
                Border
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Width (e.g. 1px)"
                  value={currentStyles.borderWidth || ''}
                  onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                  className="p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
                />
                <input
                  type="text"
                  placeholder="Color (#e2e8f0)"
                  value={currentStyles.borderColor || ''}
                  onChange={(e) => {
                    handleStyleChange('borderColor', e.target.value);
                    if (!currentStyles.borderStyle) handleStyleChange('borderStyle', 'solid');
                  }}
                  className="p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
                />
              </div>
            </div>

            {/* Shadow Presets */}
            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1.5">
                Box Shadow
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'None', val: 'none' },
                  { label: 'Subtle', val: '0 1px 3px 0 rgba(0,0,0,0.1)' },
                  { label: 'Elevated', val: '0 10px 25px -5px rgba(0,0,0,0.1)' },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleStyleChange('boxShadow', s.val)}
                    className="p-1.5 border rounded text-[11px] text-center hover:border-indigo-500 font-medium"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LAYOUT */}
        {activeStyleTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1.5">
                Display Engine
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['block', 'flex', 'grid'].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleStyleChange('display', d)}
                    className={`py-1.5 border rounded text-xs capitalize font-medium ${
                      currentStyles.display === d
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {currentStyles.display === 'flex' && (
              <>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1.5">
                    Direction
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStyleChange('flexDirection', 'row')}
                      className={`p-1.5 border rounded text-xs ${
                        currentStyles.flexDirection === 'row' ? 'border-indigo-600 bg-indigo-50' : ''
                      }`}
                    >
                      Horizontal (Row)
                    </button>
                    <button
                      onClick={() => handleStyleChange('flexDirection', 'column')}
                      className={`p-1.5 border rounded text-xs ${
                        currentStyles.flexDirection === 'column' ? 'border-indigo-600 bg-indigo-50' : ''
                      }`}
                    >
                      Vertical (Column)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1.5">
                    Align Items
                  </label>
                  <select
                    value={currentStyles.alignItems || 'stretch'}
                    onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                    className="w-full p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="stretch">Stretch</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1.5">
                    Justify Content
                  </label>
                  <select
                    value={currentStyles.justifyContent || 'flex-start'}
                    onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                    className="w-full p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="space-between">Space Between</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                Gap Between Children
              </label>
              <input
                type="text"
                placeholder="e.g. 16px or 1.5rem"
                value={currentStyles.gap || ''}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                className="w-full p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB 3: TYPOGRAPHY */}
        {activeStyleTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                Font Size
              </label>
              <input
                type="text"
                placeholder="e.g. 18px or 2.5rem"
                value={currentStyles.fontSize || ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                Font Weight
              </label>
              <select
                value={currentStyles.fontWeight || '400'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extrabold (800)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyles.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={currentStyles.color || ''}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="flex-1 p-1.5 border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1.5">
                Alignment
              </label>
              <div className="flex border rounded overflow-hidden">
                {[
                  { id: 'left', icon: AlignLeft },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight },
                  { id: 'justify', icon: AlignJustify },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.id}
                      onClick={() => handleStyleChange('textAlign', a.id)}
                      className={`flex-1 p-2 flex justify-center hover:bg-slate-100 ${
                        currentStyles.textAlign === a.id ? 'bg-indigo-50 text-indigo-600' : ''
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPACING (Visual Box Model) */}
        {activeStyleTab === 'spacing' && (
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Box Model (Margin & Padding)
            </span>

            {/* Outer: Margin Box */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 relative">
              <span className="text-[10px] font-bold text-amber-700 uppercase absolute top-1 left-2">
                Margin
              </span>
              <div className="flex flex-col items-center gap-1.5">
                <input
                  type="text"
                  placeholder="0px"
                  value={currentStyles.margin?.top || ''}
                  onChange={(e) => handleMarginChange('top', e.target.value)}
                  className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                />
                <div className="flex items-center justify-between w-full px-2">
                  <input
                    type="text"
                    placeholder="0px"
                    value={currentStyles.margin?.left || ''}
                    onChange={(e) => handleMarginChange('left', e.target.value)}
                    className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                  />

                  {/* Inner: Padding Box */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-2.5 relative my-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase absolute top-1 left-2">
                      Padding
                    </span>
                    <div className="flex flex-col items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="0px"
                        value={currentStyles.padding?.top || ''}
                        onChange={(e) => handlePaddingChange('top', e.target.value)}
                        className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                      <div className="flex items-center gap-4 px-2">
                        <input
                          type="text"
                          placeholder="0px"
                          value={currentStyles.padding?.left || ''}
                          onChange={(e) => handlePaddingChange('left', e.target.value)}
                          className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">Center</span>
                        <input
                          type="text"
                          placeholder="0px"
                          value={currentStyles.padding?.right || ''}
                          onChange={(e) => handlePaddingChange('right', e.target.value)}
                          className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="0px"
                        value={currentStyles.padding?.bottom || ''}
                        onChange={(e) => handlePaddingChange('bottom', e.target.value)}
                        className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="0px"
                    value={currentStyles.margin?.right || ''}
                    onChange={(e) => handleMarginChange('right', e.target.value)}
                    className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
                <input
                  type="text"
                  placeholder="0px"
                  value={currentStyles.margin?.bottom || ''}
                  onChange={(e) => handleMarginChange('bottom', e.target.value)}
                  className="w-14 text-center py-0.5 border rounded bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACTIONS & WORKFLOWS */}
        {activeStyleTab === 'actions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Click Actions & Workflows
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentAction.type !== 'none' ? 'Active' : 'Idle'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure what happens when a user clicks on this element in both static and dynamic sites.
            </p>

            {/* Action Type Dropdown */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Trigger Action Type
              </label>
              <select
                value={currentAction.type}
                onChange={(e) => handleActionChange({ type: e.target.value as ActionType })}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
              >
                <option value="none">None (Standard Display Only)</option>
                <option value="navigate_page">Navigate to Page (Internal Routing)</option>
                <option value="webhook">Trigger Webhook / API Endpoint</option>
                <option value="scroll_anchor">Scroll to Anchor / Section ID</option>
                <option value="external_url">Open External URL</option>
                <option value="open_modal">Open Modal Dialog / Popup</option>
                <option value="cms_submit">Submit Form to Database (CMS Collection)</option>
                <option value="cart_action">E-Commerce Add to Cart / Checkout</option>
              </select>
            </div>

            {/* 1. Page Navigation Config */}
            {currentAction.type === 'navigate_page' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Destination Page
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewPageForm(!showNewPageForm)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Setup New Page
                  </button>
                </div>

                {/* Inline New Page Setup Form */}
                {showNewPageForm && (
                  <form onSubmit={handleCreateAndLinkPage} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-2.5 shadow-sm">
                    <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Setup New Page
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pricing, Case Studies, Contact"
                        value={newPageTitle}
                        onChange={(e) => {
                          setNewPageTitle(e.target.value);
                          if (!newPageSlug || newPageSlug.startsWith('/')) {
                            setNewPageSlug(`/${e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                          }
                        }}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        placeholder="/pricing"
                        value={newPageSlug}
                        onChange={(e) => setNewPageSlug(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Initial Template
                      </label>
                      <select
                        value={newPageTemplate}
                        onChange={(e) => setNewPageTemplate(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent outline-none"
                      >
                        <option value="about">About Us & Mission</option>
                        <option value="contact">Contact & Inquiry Form</option>
                        <option value="pricing">3-Tier Pricing Matrix</option>
                        <option value="blank">Blank Clean Canvas</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                      >
                        Create & Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewPageForm(false)}
                        className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <select
                  value={currentAction.targetPageId || ''}
                  onChange={(e) => {
                    const target = project.pages.find((p) => p.id === e.target.value);
                    handleActionChange({
                      targetPageId: e.target.value,
                      targetPageSlug: target?.slug,
                    });
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="">Select Target Page...</option>
                  {project.pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.slug})
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <input
                    type="checkbox"
                    checked={!!currentAction.openInNewTab}
                    onChange={(e) => handleActionChange({ openInNewTab: e.target.checked })}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Open page in new browser tab</span>
                </label>
              </div>
            )}

            {/* 2. Webhook Config */}
            {currentAction.type === 'webhook' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Webhook className="w-4 h-4 text-indigo-500" />
                  <span>Webhook API Dispatcher</span>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://hooks.zapier.com/... or /api/v1/webhook"
                    value={currentAction.webhookUrl || ''}
                    onChange={(e) => handleActionChange({ webhookUrl: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      HTTP Method
                    </label>
                    <select
                      value={currentAction.webhookMethod || 'POST'}
                      onChange={(e) => handleActionChange({ webhookMethod: e.target.value as any })}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Success Toast
                    </label>
                    <label className="flex items-center gap-2 h-8 text-xs text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={currentAction.showSuccessToast !== false}
                        onChange={(e) => handleActionChange({ showSuccessToast: e.target.checked })}
                        className="accent-indigo-600 rounded"
                      />
                      <span>Show notification</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Success Toast Message
                  </label>
                  <input
                    type="text"
                    placeholder="Webhook executed successfully!"
                    value={currentAction.successMessage || ''}
                    onChange={(e) => handleActionChange({ successMessage: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                {/* Test Webhook Button & Live Feedback */}
                <div className="pt-1">
                  <button
                    type="button"
                    disabled={testingWebhook || !currentAction.webhookUrl}
                    onClick={handleTestWebhook}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                  >
                    {testingWebhook ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching Test Request...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Test Webhook Call</span>
                      </>
                    )}
                  </button>

                  {webhookTestStatus && (
                    <div
                      className={`mt-2 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5 ${
                        webhookTestStatus.ok
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                          : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                      }`}
                    >
                      {webhookTestStatus.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      )}
                      <span>
                        Status: <b>{webhookTestStatus.status}</b> — {webhookTestStatus.text}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Scroll Anchor Config */}
            {currentAction.type === 'scroll_anchor' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Anchor className="w-4 h-4 text-indigo-500" />
                  <span>Smooth Scroll Anchor</span>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Target Section / Element
                  </label>
                  <select
                    value={currentAction.anchorNodeId || ''}
                    onChange={(e) => handleActionChange({ anchorNodeId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="">Select element to scroll to...</option>
                    {Object.values(nodes)
                      .filter((n) => n.id !== 'root' && (n.type === 'Section' || n.type === 'Container' || n.type === 'Heading'))
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          #{n.id} — {n.name || n.type}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* 4. External URL Config */}
            {currentAction.type === 'external_url' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <ExternalLink className="w-4 h-4 text-indigo-500" />
                  <span>External Destination</span>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Destination Web URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={currentAction.url || ''}
                    onChange={(e) => handleActionChange({ url: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={currentAction.openInNewTab !== false}
                    onChange={(e) => handleActionChange({ openInNewTab: e.target.checked })}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Open in new tab (target="_blank")</span>
                </label>
              </div>
            )}

            {/* 5. Modal Dialog Config */}
            {currentAction.type === 'open_modal' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Interactive Popup Modal</span>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Modal Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule a Product Walkthrough"
                    value={currentAction.modalTitle || ''}
                    onChange={(e) => handleActionChange({ modalTitle: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Modal Content / Body
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter message or prompt shown inside the dialog overlay."
                    value={currentAction.modalContent || ''}
                    onChange={(e) => handleActionChange({ modalContent: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none resize-none font-sans"
                  />
                </div>
              </div>
            )}

            {/* 6. CMS / Database Submission Config */}
            {currentAction.type === 'cms_submit' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Database className="w-4 h-4 text-purple-500" />
                  <span>CMS Database Submission</span>
                </div>

                {project.siteType === 'dynamic' ? (
                  <>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Target Collection
                      </label>
                      <select
                        value={currentAction.collectionName || ''}
                        onChange={(e) => handleActionChange({ collectionName: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                      >
                        <option value="">Select Database Collection...</option>
                        {(project.collections || []).map((col) => (
                          <option key={col.id} value={col.name}>
                            {col.label} ({col.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Success Message
                      </label>
                      <input
                        type="text"
                        placeholder="Submission saved to database!"
                        value={currentAction.successMessage || ''}
                        onChange={(e) => handleActionChange({ successMessage: e.target.value })}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 space-y-2">
                    <p>This project is currently marked as a <b>Static Website</b> (no database attached).</p>
                    <button
                      type="button"
                      onClick={() => {
                        useEditorStore.setState((s) => ({
                          project: {
                            ...s.project,
                            siteType: 'dynamic',
                            dbConfig: {
                              engine: 'sqlite',
                              is_inbuilt: true,
                              status: 'connected',
                              latency_ms: 2,
                            },
                          },
                        }));
                      }}
                      className="w-full py-1 text-xs font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      Enable Inbuilt Database
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 7. E-Commerce Cart Action */}
            {currentAction.type === 'cart_action' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  <span>E-Commerce Cart / Checkout</span>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Product Identifier / SKU
                  </label>
                  <input
                    type="text"
                    placeholder="prod_solis_chair"
                    value={currentAction.productId || ''}
                    onChange={(e) => handleActionChange({ productId: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    placeholder="120"
                    value={currentAction.productPrice || ''}
                    onChange={(e) => handleActionChange({ productPrice: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

