'use client';

import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { ComponentStyle } from '../../types/builder';
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
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const nodes = useEditorStore((s) => s.getActivePageNodes());
  const activeStyleTab = useEditorStore((s) => s.activeStyleTab);
  const setActiveStyleTab = useEditorStore((s) => s.setActiveStyleTab);
  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const previewMode = useEditorStore((s) => s.previewMode);

  const updateNodeProps = useEditorStore((s) => s.updateNodeProps);
  const updateNodeStyles = useEditorStore((s) => s.updateNodeStyles);
  const updateNodeName = useEditorStore((s) => s.updateNodeName);

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
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-medium block mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={node.props?.href || ''}
                  onChange={(e) => updateNodeProps(node.id, { href: e.target.value })}
                  placeholder="https:// or #section"
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none font-mono"
                />
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
      </div>
    </aside>
  );
};
