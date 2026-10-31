'use client';

import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { ComponentNode } from '../../types/builder';
import { RenderNode } from '../../builder-components/RenderNode';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

export const Canvas: React.FC = () => {
  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const zoom = useEditorStore((s) => s.zoom);
  const previewMode = useEditorStore((s) => s.previewMode);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectNode = useEditorStore((s) => s.selectNode);
  const nodes = useEditorStore((s) => s.getActivePageNodes());
  const project = useEditorStore((s) => s.project);

  const activePage = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];

  // Viewport width calculation
  const getViewportWidth = () => {
    switch (activeBreakpoint) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    if (!selectedNodeId) return [];
    const crumbs: { id: string; name: string }[] = [];
    let curr: string | null = selectedNodeId;

    while (curr && nodes[curr]) {
      const node: ComponentNode = nodes[curr];
      crumbs.unshift({ id: node.id, name: node.name || node.type });
      curr = node.parentId;
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <main
      className="flex-1 bg-slate-100 dark:bg-slate-950/80 overflow-auto flex flex-col relative"
      onClick={() => {
        if (!previewMode) selectNode('root');
      }}
    >
      {/* Top Canvas Information / Dimensions Bar */}
      {!previewMode && (
        <div className="h-7 bg-slate-200/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 text-[11px] text-slate-500 font-mono select-none">
          <div className="flex items-center gap-2">
            <span>Viewport:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
              {activeBreakpoint} ({getViewportWidth()})
            </span>
          </div>
          <div>Zoom: {zoom}%</div>
        </div>
      )}

      {/* Scalable Canvas Frame */}
      <div className="flex-1 p-6 flex justify-center items-start overflow-auto">
        <div
          style={{
            width: getViewportWidth(),
            maxWidth: activeBreakpoint === 'desktop' ? '1440px' : undefined,
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
            transition: 'width 0.25s ease-in-out, transform 0.15s ease-out',
          }}
          className={`bg-white shadow-xl transition-all rounded-sm overflow-hidden min-h-[85vh] ${
            !previewMode ? 'border border-slate-300 dark:border-slate-800' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {activePage?.rootNodeId && <RenderNode nodeId={activePage.rootNodeId} />}
        </div>
      </div>

      {/* Bottom Breadcrumbs Bar */}
      {!previewMode && breadcrumbs.length > 0 && (
        <div className="h-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center px-4 gap-1 text-[11px] text-slate-500 overflow-x-auto select-none z-20">
          <span className="font-medium text-slate-400 mr-1">Hierarchy:</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectNode(crumb.id);
                }}
                className={`px-1.5 py-0.5 rounded transition-colors truncate max-w-[120px] ${
                  crumb.id === selectedNodeId
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold'
                    : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </main>
  );
};
