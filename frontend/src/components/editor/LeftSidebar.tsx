'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import {
  Boxes,
  Layers,
  FileCode2,
  FileText,
  Palette,
  Sparkles,
  Type,
  Layout,
  Square,
  Image as ImageIcon,
  MousePointerClick,
  Columns,
  Grid,
  Menu,
  CheckSquare,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Plus,
  Compass,
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const activeLeftTab = useEditorStore((s) => s.activeLeftTab);
  const setActiveLeftTab = useEditorStore((s) => s.setActiveLeftTab);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectNode = useEditorStore((s) => s.selectNode);
  const nodes = useEditorStore((s) => s.getActivePageNodes());
  const project = useEditorStore((s) => s.project);
  const addNode = useEditorStore((s) => s.addNode);
  const deleteNode = useEditorStore((s) => s.deleteNode);
  const duplicateNode = useEditorStore((s) => s.duplicateNode);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const toggleHidden = useEditorStore((s) => s.toggleHidden);
  const updateTheme = useEditorStore((s) => s.updateTheme);
  const previewMode = useEditorStore((s) => s.previewMode);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  if (previewMode) return null;

  // Add component into current selection or root
  const handleAddElement = (type: string, props: Record<string, any> = {}, styles: Record<string, any> = {}) => {
    const parentId = selectedNodeId && nodes[selectedNodeId]?.children ? selectedNodeId : 'root';
    addNode(parentId, type, props, styles);
  };

  // Quick AI Section generator
  const handleGenerateSection = () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);

    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      const parentId = 'root';

      if (promptLower.includes('pricing')) {
        const secId = addNode(parentId, 'Section', {}, {
          display: 'block',
          backgroundColor: '#f8fafc',
          padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
        });
        const containerId = addNode(secId, 'Container', {}, {
          maxWidth: '1100px',
          margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
        });
        addNode(containerId, 'Heading', { content: 'Simple, Transparent Pricing', level: 2 }, {
          fontSize: '36px',
          fontWeight: '800',
          color: '#0f172a',
          textAlign: 'center',
        });
        const gridId = addNode(containerId, 'Container', {}, {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '24px',
          width: '100%',
        });
        // 3 Pricing Cards
        ['Starter ($29/mo)', 'Pro ($79/mo)', 'Enterprise ($199/mo)'].forEach((tier) => {
          const cardId = addNode(gridId, 'Container', {}, {
            backgroundColor: '#ffffff',
            padding: { top: '32px', right: '24px', bottom: '32px', left: '24px' },
            borderRadius: '12px',
            borderWidth: '1px',
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          });
          addNode(cardId, 'Heading', { content: tier, level: 3 }, { fontSize: '20px', fontWeight: '700' });
          addNode(cardId, 'Paragraph', { content: 'All essential features included to scale your business.' }, { fontSize: '14px', color: '#64748b' });
          addNode(cardId, 'Button', { label: 'Get Started' }, {
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            padding: { top: '10px', right: '16px', bottom: '10px', left: '16px' },
            borderRadius: '6px',
            fontWeight: '600',
          });
        });
      } else {
        // Generic generated section
        const secId = addNode(parentId, 'Section', {}, {
          display: 'block',
          backgroundColor: '#ffffff',
          padding: { top: '70px', right: '24px', bottom: '70px', left: '24px' },
        });
        const containerId = addNode(secId, 'Container', {}, {
          maxWidth: '1000px',
          margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        });
        addNode(containerId, 'Heading', { content: `AI Section: ${aiPrompt}`, level: 2 }, {
          fontSize: '32px',
          fontWeight: '700',
          color: '#0f172a',
          textAlign: 'center',
        });
        addNode(containerId, 'Paragraph', { content: 'Generated with platform AI engine. You can customize text, layout, and styling from the properties panel.' }, {
          fontSize: '16px',
          color: '#475569',
          textAlign: 'center',
          maxWidth: '650px',
        });
      }

      setAiGenerating(false);
      setAiPrompt('');
      setActiveLeftTab('layers');
    }, 600);
  };

  // Recursive tree renderer for Layers Panel
  const renderLayerNode = (nodeId: string, depth = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isSelected = selectedNodeId === nodeId;

    return (
      <div key={nodeId} className="flex flex-col">
        <div
          onClick={(e) => {
            e.stopPropagation();
            selectNode(nodeId);
          }}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 text-xs cursor-pointer select-none border-b border-slate-100 dark:border-slate-800/50 group transition-colors ${
            isSelected
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {node.type.slice(0, 3)}
            </span>
            <span className="truncate">{node.name || node.type}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHidden(nodeId);
              }}
              title={node.hidden ? 'Show' : 'Hide'}
              className="p-1 hover:text-indigo-600"
            >
              {node.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(nodeId);
              }}
              title={node.locked ? 'Unlock' : 'Lock'}
              className="p-1 hover:text-indigo-600"
            >
              {node.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(nodeId);
              }}
              title="Duplicate"
              className="p-1 hover:text-indigo-600"
            >
              <Copy className="w-3 h-3" />
            </button>
            {nodeId !== 'root' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(nodeId);
                }}
                title="Delete"
                className="p-1 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {node.children && node.children.map((childId) => renderLayerNode(childId, depth + 1))}
      </div>
    );
  };

  return (
    <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex h-[calc(100vh-3.5rem)] select-none">
      {/* Mini Icon Strip */}
      <div className="w-14 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 gap-2 bg-slate-50 dark:bg-slate-950">
        {[
          { id: 'elements', icon: Boxes, label: 'Elements' },
          { id: 'layers', icon: Layers, label: 'Layers' },
          { id: 'theme', icon: Palette, label: 'Theme' },
          { id: 'ai', icon: Sparkles, label: 'AI Wizard' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeLeftTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLeftTab(tab.id as any)}
              title={tab.label}
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] mt-0.5 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto">
        {/* ELEMENTS TAB */}
        {activeLeftTab === 'elements' && (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Layout Primitives
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleAddElement('Section', {}, {
                      display: 'block',
                      padding: { top: '60px', right: '20px', bottom: '60px', left: '20px' },
                      backgroundColor: '#ffffff',
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <Layout className="w-4 h-4 text-indigo-600" />
                  Section
                </button>

                <button
                  onClick={() =>
                    handleAddElement('Container', {}, {
                      maxWidth: '1100px',
                      margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
                      padding: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <Square className="w-4 h-4 text-indigo-600" />
                  Container
                </button>

                <button
                  onClick={() =>
                    handleAddElement('Container', {}, {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '20px',
                      width: '100%',
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <Columns className="w-4 h-4 text-indigo-600" />
                  2 Columns
                </button>

                <button
                  onClick={() =>
                    handleAddElement('Container', {}, {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '20px',
                      width: '100%',
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <Grid className="w-4 h-4 text-indigo-600" />
                  3 Columns
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Typography & Core
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleAddElement('Heading', { content: 'Dynamic Headline', level: 2 }, {
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#0f172a',
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <Type className="w-4 h-4 text-indigo-600" />
                  Heading
                </button>

                <button
                  onClick={() =>
                    handleAddElement('Paragraph', { content: 'Enter your compelling paragraph content here...' }, {
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#475569',
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Paragraph
                </button>

                <button
                  onClick={() =>
                    handleAddElement('Button', { label: 'Action Button', href: '#' }, {
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      padding: { top: '12px', right: '22px', bottom: '12px', left: '22px' },
                      borderRadius: '8px',
                      fontWeight: '600',
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <MousePointerClick className="w-4 h-4 text-indigo-600" />
                  Button
                </button>

                <button
                  onClick={() =>
                    handleAddElement('Image', {
                      src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
                      alt: 'Visual element',
                    }, {
                      borderRadius: '12px',
                      width: '100%',
                      maxHeight: '400px',
                    })
                  }
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-slate-700 dark:text-slate-200 gap-1.5 transition-all text-center"
                >
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  Image
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Pre-built Blocks
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const secId = addNode('root', 'Section', {}, {
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
                    });
                    const contId = addNode(secId, 'Container', {}, {
                      maxWidth: '800px',
                      margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '20px',
                    });
                    addNode(contId, 'Heading', { content: 'Supercharge Your Workflow', level: 2 }, {
                      fontSize: '36px',
                      fontWeight: '800',
                      color: '#ffffff',
                    });
                    addNode(contId, 'Paragraph', { content: 'Join thousands of innovators creating faster with our visual website engine.' }, {
                      fontSize: '18px',
                      color: '#94a3b8',
                    });
                    addNode(contId, 'Button', { label: 'Get Started Today' }, {
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      padding: { top: '14px', right: '28px', bottom: '14px', left: '28px' },
                      borderRadius: '8px',
                      fontWeight: '600',
                    });
                  }}
                  className="w-full text-left p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/40 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-between"
                >
                  <span>Dark CTA Section</span>
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeLeftTab === 'layers' && (
          <div className="py-2">
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Component Hierarchy
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {Object.keys(nodes).length} nodes
              </span>
            </div>
            <div className="pt-1">{renderLayerNode('root')}</div>
          </div>
        )}

        {/* THEME TAB */}
        {activeLeftTab === 'theme' && (
          <div className="p-4 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Global Design System
              </span>
              <p className="text-xs text-slate-500 mb-4">
                Changes cascade across all components and pages instantly.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={project.theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="flex-1 text-xs font-mono uppercase px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Heading Font Family
                </label>
                <select
                  value={project.theme.headingFont}
                  onChange={(e) => updateTheme({ headingFont: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none"
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                  <option value="Playfair Display, serif">Playfair Display</option>
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Corner Radius Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['0px', '8px', '16px'].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateTheme({ borderRadius: r })}
                      className={`text-xs py-2 border rounded-lg font-medium transition-all ${
                        project.theme.borderRadius === r
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r === '0px' ? 'Sharp' : r === '8px' ? 'Rounded' : 'Curved'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI WIZARD TAB */}
        {activeLeftTab === 'ai' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                AI Section Synthesizer
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Describe any section in natural language. Our AI converts it into pure, fully editable JSON components on your canvas.
            </p>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Generate a modern 3-tier pricing matrix with featured badges and CTA buttons..."
                className="w-full text-xs p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-indigo-500 resize-none"
              />

              <button
                disabled={aiGenerating || !aiPrompt.trim()}
                onClick={handleGenerateSection}
                className="w-full py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiGenerating ? 'Synthesizing Components...' : 'Generate Section'}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Prompts
              </span>
              <div className="space-y-1.5">
                {[
                  '3-tier SaaS pricing comparison table',
                  'Client logos cloud with testimonials',
                  'Frequently asked questions accordion',
                ].map((qp) => (
                  <button
                    key={qp}
                    onClick={() => setAiPrompt(qp)}
                    className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    ✦ {qp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
