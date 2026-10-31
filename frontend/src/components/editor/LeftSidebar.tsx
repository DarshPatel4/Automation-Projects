'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import {
  Boxes,
  Layers,
  Palette,
  Sparkles,
  Type,
  Layout,
  Square,
  Image as ImageIcon,
  MousePointerClick,
  Columns,
  Grid,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Plus,
  GripVertical,
  ShieldCheck,
  Cpu,
  Zap,
  BarChart3,
  Star,
  Quote,
  SplitSquareVertical,
  Minus,
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

  // Drag start for adding a new element from catalog
  const handleDragStartCatalog = (
    e: React.DragEvent,
    componentType: string,
    defaultProps: Record<string, any> = {},
    defaultStyles: Record<string, any> = {}
  ) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        type: 'ADD_CATALOG_NODE',
        componentType,
        defaultProps,
        defaultStyles,
      })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Click to add into currently selected container or root
  const handleAddElement = (
    type: string,
    props: Record<string, any> = {},
    styles: Record<string, any> = {}
  ) => {
    const parentId =
      selectedNodeId &&
      (nodes[selectedNodeId]?.type === 'Container' ||
        nodes[selectedNodeId]?.type === 'Section' ||
        nodes[selectedNodeId]?.type === 'Body')
        ? selectedNodeId
        : 'root';

    addNode(parentId, type, props, styles);
  };

  // AI Section generator with high-craft human layout patterns
  const handleGenerateSection = () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);

    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      const parentId = 'root';

      if (promptLower.includes('pricing')) {
        const secId = addNode(parentId, 'Section', {}, {
          display: 'block',
          backgroundColor: '#0c1220',
          padding: { top: '90px', right: '24px', bottom: '90px', left: '24px' },
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.06)',
          borderStyle: 'solid',
        });
        const containerId = addNode(secId, 'Container', {}, {
          maxWidth: '1200px',
          margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '36px',
        });
        addNode(containerId, 'Heading', { content: 'Predictable, Usage-Based Pricing', level: 2 }, {
          fontSize: '36px',
          fontWeight: '800',
          color: '#ffffff',
          textAlign: 'center',
          letterSpacing: '-0.8px',
        });
        addNode(containerId, 'Paragraph', { content: 'Deploy immediately on our developer tier. Transparent scaling limits with no hidden surcharges.' }, {
          fontSize: '16px',
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: '620px',
        });
        const gridId = addNode(containerId, 'Container', {}, {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '28px',
          width: '100%',
        });

        // 3 Pricing Tiers
        [
          { tier: 'Developer Tier', price: '$0 / mo', desc: 'Up to 100,000 monthly edge worker executions and 5GB shared storage.' },
          { tier: 'Production Team', price: '$89 / mo', desc: 'Unlimited micro-VM requests, 99.99% uptime guarantee, and dedicated telemetry.' },
          { tier: 'Enterprise Scale', price: '$499 / mo', desc: 'Dedicated tenancy, hardware security module isolation, and 24/7 technical architect SLA.' },
        ].forEach((item) => {
          const cardId = addNode(gridId, 'Container', {}, {
            backgroundColor: '#0f172a',
            padding: { top: '36px', right: '28px', bottom: '36px', left: '28px' },
            borderRadius: '16px',
            borderWidth: '1px',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderStyle: 'solid',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          });
          addNode(cardId, 'Heading', { content: item.tier, level: 3 }, { fontSize: '18px', fontWeight: '700', color: '#ffffff' });
          addNode(cardId, 'Heading', { content: item.price, level: 2 }, { fontSize: '32px', fontWeight: '800', color: '#6366f1' });
          addNode(cardId, 'Paragraph', { content: item.desc }, { fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' });
          addNode(cardId, 'Button', { label: 'Get Started' }, {
            backgroundColor: '#6366f1',
            color: '#ffffff',
            padding: { top: '12px', right: '18px', bottom: '12px', left: '18px' },
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
          });
        });
      } else {
        // High craft standard section
        const secId = addNode(parentId, 'Section', {}, {
          display: 'block',
          backgroundColor: '#0c1220',
          padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
        });
        const containerId = addNode(secId, 'Container', {}, {
          maxWidth: '1000px',
          margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        });
        addNode(containerId, 'Heading', { content: aiPrompt, level: 2 }, {
          fontSize: '34px',
          fontWeight: '800',
          color: '#ffffff',
          textAlign: 'center',
          letterSpacing: '-0.7px',
        });
        addNode(containerId, 'Paragraph', { content: 'Engineered with precision layout architecture and zero AI boilerplate. Drag elements onto the canvas or customize styles.' }, {
          fontSize: '16px',
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: '650px',
          lineHeight: '1.6',
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
          className={`flex items-center justify-between py-1.5 pr-2 text-xs cursor-pointer select-none border-b border-slate-800/40 group transition-colors ${
            isSelected
              ? 'bg-indigo-950/60 text-indigo-300 font-semibold'
              : 'hover:bg-slate-800/40 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-[10px] uppercase font-bold text-slate-500">
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
              className="p-1 hover:text-indigo-400"
            >
              {node.hidden ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(nodeId);
              }}
              title={node.locked ? 'Unlock' : 'Lock'}
              className="p-1 hover:text-indigo-400"
            >
              {node.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(nodeId);
              }}
              title="Duplicate"
              className="p-1 hover:text-indigo-400"
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
                className="p-1 hover:text-red-400"
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
    <div className="w-80 border-r border-slate-800 bg-slate-900 flex h-[calc(100vh-3.5rem)] select-none text-slate-200">
      {/* Mini Icon Strip */}
      <div className="w-14 border-r border-slate-800 flex flex-col items-center py-3 gap-2 bg-slate-950">
        {[
          { id: 'elements', icon: Boxes, label: 'Add' },
          { id: 'layers', icon: Layers, label: 'Layers' },
          { id: 'theme', icon: Palette, label: 'Tokens' },
          { id: 'ai', icon: Sparkles, label: 'Synthesize' },
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
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
              <span>Drag any item directly onto the canvas or click to insert.</span>
            </div>

            {/* Layout Containers */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-indigo-400" />
                Layout Containers
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Section', {}, {
                      display: 'block',
                      padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
                      backgroundColor: '#090d16',
                    })
                  }
                  onClick={() =>
                    handleAddElement('Section', {}, {
                      display: 'block',
                      padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
                      backgroundColor: '#090d16',
                    })
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <Layout className="w-4 h-4 text-indigo-400" />
                  Section
                </div>

                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Container', {}, {
                      maxWidth: '1200px',
                      margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
                      padding: { top: '24px', right: '24px', bottom: '24px', left: '24px' },
                    })
                  }
                  onClick={() =>
                    handleAddElement('Container', {}, {
                      maxWidth: '1200px',
                      margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
                      padding: { top: '24px', right: '24px', bottom: '24px', left: '24px' },
                    })
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <Square className="w-4 h-4 text-indigo-400" />
                  Container
                </div>

                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Container', {}, {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '24px',
                      width: '100%',
                    })
                  }
                  onClick={() =>
                    handleAddElement('Container', {}, {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '24px',
                      width: '100%',
                    })
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <Columns className="w-4 h-4 text-indigo-400" />
                  2-Column Grid
                </div>

                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Container', {}, {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '24px',
                      width: '100%',
                    })
                  }
                  onClick={() =>
                    handleAddElement('Container', {}, {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '24px',
                      width: '100%',
                    })
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <Grid className="w-4 h-4 text-indigo-400" />
                  3-Column Grid
                </div>
              </div>
            </div>

            {/* Typography & Core */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                Typography & Vectors
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Heading', { content: 'High Impact Headline', level: 2 }, {
                      fontSize: '36px',
                      fontWeight: '800',
                      color: '#ffffff',
                      letterSpacing: '-0.8px',
                    })
                  }
                  onClick={() =>
                    handleAddElement('Heading', { content: 'High Impact Headline', level: 2 }, {
                      fontSize: '36px',
                      fontWeight: '800',
                      color: '#ffffff',
                      letterSpacing: '-0.8px',
                    })
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <Type className="w-4 h-4 text-indigo-400" />
                  Heading
                </div>

                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Paragraph', { content: 'Articulate your core platform advantage with crisp typography.' }, {
                      fontSize: '16px',
                      lineHeight: '1.65',
                      color: '#94a3b8',
                    })
                  }
                  onClick={() =>
                    handleAddElement('Paragraph', { content: 'Articulate your core platform advantage with crisp typography.' }, {
                      fontSize: '16px',
                      lineHeight: '1.65',
                      color: '#94a3b8',
                    })
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <Minus className="w-4 h-4 text-indigo-400" />
                  Paragraph
                </div>

                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Button', { label: 'Get Started Today', href: '#' }, {
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      padding: { top: '12px', right: '24px', bottom: '12px', left: '24px' },
                      borderRadius: '8px',
                      fontWeight: '600',
                    })
                  }
                  onClick={() =>
                    handleAddElement('Button', { label: 'Get Started Today', href: '#' }, {
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      padding: { top: '12px', right: '24px', bottom: '12px', left: '24px' },
                      borderRadius: '8px',
                      fontWeight: '600',
                    })
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <MousePointerClick className="w-4 h-4 text-indigo-400" />
                  Button
                </div>

                <div
                  draggable
                  onDragStart={(e) =>
                    handleDragStartCatalog(e, 'Icon', { iconName: 'ShieldCheck', size: 24, color: '#34d399' }, {})
                  }
                  onClick={() =>
                    handleAddElement('Icon', { iconName: 'ShieldCheck', size: 24, color: '#34d399' }, {})
                  }
                  className="flex flex-col items-center p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 gap-1.5 transition-all text-center cursor-grab active:cursor-grabbing"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Vector Icon
                </div>
              </div>
            </div>

            {/* Pre-built Architecture Sections */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-indigo-400" />
                Production Blocks
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const secId = addNode('root', 'Section', {}, {
                      backgroundColor: '#0c1220',
                      borderWidth: '1px',
                      borderColor: 'rgba(255, 255, 255, 0.06)',
                      borderStyle: 'solid',
                      padding: { top: '36px', right: '24px', bottom: '36px', left: '24px' },
                    });
                    const contId = addNode(secId, 'Container', {}, {
                      maxWidth: '1200px',
                      margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '24px',
                      textAlign: 'center',
                    });
                    [
                      { val: '99.99%', lbl: 'Core SLA Uptime' },
                      { val: '< 20ms', lbl: 'Global P99 Response' },
                      { val: '500M+', lbl: 'Requests Processed' },
                    ].forEach((st) => {
                      const item = addNode(contId, 'Container', {}, { display: 'flex', flexDirection: 'column', gap: '4px' });
                      addNode(item, 'Heading', { content: st.val, level: 3 }, { fontSize: '32px', fontWeight: '800', color: '#6366f1' });
                      addNode(item, 'Paragraph', { content: st.lbl }, { fontSize: '13px', color: '#64748b' });
                    });
                  }}
                  className="w-full text-left p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    <span>3-Metric Stats Bar</span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                </button>

                <button
                  onClick={() => {
                    const secId = addNode('root', 'Section', {}, {
                      backgroundColor: '#090d16',
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
                    addNode(contId, 'Heading', { content: '"This infrastructure enabled us to deliver sub-millisecond edge APIs without managing servers."', level: 3 }, {
                      fontSize: '24px',
                      fontWeight: '500',
                      color: '#f8fafc',
                    });
                    addNode(contId, 'Paragraph', { content: 'Alex Rivera — Director of Engineering, Vertex Cloud' }, {
                      fontSize: '14px',
                      color: '#818cf8',
                      fontWeight: '600',
                    });
                  }}
                  className="w-full text-left p-3 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/60 text-xs font-semibold text-slate-200 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-indigo-400" />
                    <span>Executive Testimonial</span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeLeftTab === 'layers' && (
          <div className="py-2">
            <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Design System Tokens
              </span>
              <p className="text-xs text-slate-400">
                Centralized token palette cascading across canvas components.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer p-0.5 bg-slate-800"
                  />
                  <input
                    type="text"
                    value={project.theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="flex-1 text-xs font-mono uppercase px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Heading Typography
                </label>
                <select
                  value={project.theme.headingFont}
                  onChange={(e) => updateTheme({ headingFont: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-100 outline-none"
                >
                  <option value="Inter, system-ui, sans-serif">Inter</option>
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                  <option value="Outfit, sans-serif">Outfit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Border Radius Token
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['0px', '8px', '16px'].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateTheme({ borderRadius: r })}
                      className={`text-xs py-2 border rounded-lg font-medium transition-all ${
                        project.theme.borderRadius === r
                          ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300'
                          : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {r === '0px' ? 'Sharp' : r === '8px' ? 'Subtle (8px)' : 'Curved (16px)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI SYNTHESIZE TAB */}
        {activeLeftTab === 'ai' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Architectural Section Synthesizer
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes real, human-grade responsive components using production design principles instead of generic boilerplate.
            </p>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Generate an enterprise 3-tier pricing matrix with SLA badges and feature comparisons..."
                className="w-full text-xs p-3 border border-slate-800 rounded-xl bg-slate-800 text-slate-100 outline-none focus:border-indigo-500 resize-none font-sans"
              />

              <button
                disabled={aiGenerating || !aiPrompt.trim()}
                onClick={handleGenerateSection}
                className="w-full py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiGenerating ? 'Synthesizing Architecture...' : 'Synthesize Section'}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Prompts
              </span>
              <div className="space-y-1.5">
                {[
                  'Enterprise 3-tier usage pricing matrix',
                  'Developer benchmarks comparing latency vs AWS Lambda',
                  'Security compliance SOC-2 and HIPAA badges grid',
                ].map((qp) => (
                  <button
                    key={qp}
                    onClick={() => setAiPrompt(qp)}
                    className="w-full text-left text-xs p-2.5 rounded-lg bg-slate-800/60 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-300 transition-colors"
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
