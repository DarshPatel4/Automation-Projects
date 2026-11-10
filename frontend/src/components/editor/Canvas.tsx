'use client';

import React, { useEffect } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { ComponentNode } from '../../types/builder';
import { RenderNode } from '../../builder-components/RenderNode';
import { ChevronRight, Keyboard, X, Move, Layers, Copy, Trash2, Undo2, Redo2, HelpCircle } from 'lucide-react';

export const Canvas: React.FC = () => {
  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const zoom = useEditorStore((s) => s.zoom);
  const previewMode = useEditorStore((s) => s.previewMode);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectNode = useEditorStore((s) => s.selectNode);
  const deleteNode = useEditorStore((s) => s.deleteNode);
  const duplicateNode = useEditorStore((s) => s.duplicateNode);
  const nudgeNode = useEditorStore((s) => s.nudgeNode);
  const reorderSibling = useEditorStore((s) => s.reorderSibling);
  const nudgeInfo = useEditorStore((s) => s.nudgeInfo);
  const showShortcutsModal = useEditorStore((s) => s.showShortcutsModal);
  const toggleShortcutsModal = useEditorStore((s) => s.toggleShortcutsModal);
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

  // Keyboard navigation & canvas manipulation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in form inputs or editable content
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Toggle shortcuts modal: ? key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
      }

      // Escape key: close modal, select parent, or deselect
      if (e.key === 'Escape') {
        if (showShortcutsModal) {
          toggleShortcutsModal();
          return;
        }
        if (selectedNodeId && selectedNodeId !== 'root') {
          const parentId = nodes[selectedNodeId]?.parentId;
          selectNode(parentId || null);
        } else {
          selectNode(null);
        }
        return;
      }

      // Delete / Backspace: delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId && selectedNodeId !== 'root') {
        e.preventDefault();
        deleteNode(selectedNodeId);
        return;
      }

      // Duplicate: Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        if (selectedNodeId && selectedNodeId !== 'root') {
          e.preventDefault();
          duplicateNode(selectedNodeId);
        }
        return;
      }

      // Arrow keys: 1px / 10px nudging and sibling reordering
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (!selectedNodeId || selectedNodeId === 'root') return;

        // Ctrl + ArrowUp / ArrowDown -> reorder sibling
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            reorderSibling(selectedNodeId, 'prev');
            return;
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            reorderSibling(selectedNodeId, 'next');
            return;
          }
        }

        // Standard or Shift nudge
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dirMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
          ArrowUp: 'up',
          ArrowDown: 'down',
          ArrowLeft: 'left',
          ArrowRight: 'right',
        };
        const dir = dirMap[e.key];
        if (dir) {
          nudgeNode(selectedNodeId, dir, step);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedNodeId,
    nodes,
    showShortcutsModal,
    toggleShortcutsModal,
    selectNode,
    deleteNode,
    duplicateNode,
    nudgeNode,
    reorderSibling,
  ]);

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
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleShortcutsModal();
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Shortcuts</span>
              <kbd className="px-1 py-0.2 bg-slate-300 dark:bg-slate-800 text-[10px] rounded font-mono">?</kbd>
            </button>
            <span>Zoom: {zoom}%</span>
          </div>
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

      {/* Floating Canva-style Nudge HUD Toast */}
      {nudgeInfo && nudgeInfo.visible && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-150">
          <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-mono font-medium px-4 py-2 rounded-full shadow-2xl border border-slate-700/60 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{nudgeInfo.text}</span>
          </div>
        </div>
      )}

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

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={toggleShortcutsModal}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  Canva-Style Keyboard Shortcuts
                </h3>
              </div>
              <button
                onClick={toggleShortcutsModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm max-h-[70vh] overflow-y-auto">
              {/* Precision Nudging */}
              <div>
                <h4 className="font-semibold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5" />
                  Object Movement & Alignment
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Nudge element 1px</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">↑</kbd>
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">↓</kbd>
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">←</kbd>
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">→</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Nudge element 10px (Fast)</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Shift</kbd>
                      <span className="text-slate-400">+</span>
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Arrow</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Reorder sibling element up / down</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Ctrl / ⌘</kbd>
                      <span className="text-slate-400">+</span>
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">↑ / ↓</kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection & Hierarchy */}
              <div>
                <h4 className="font-semibold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Selection & Navigation
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Select parent container / Deselect</span>
                    <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Show keyboard shortcuts modal</span>
                    <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">?</kbd>
                  </div>
                </div>
              </div>

              {/* Element Actions */}
              <div>
                <h4 className="font-semibold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  Editing & History
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Duplicate element</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Ctrl / ⌘</kbd>
                      <span className="text-slate-400">+</span>
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">D</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">Delete element</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Delete</kbd>
                      <span className="text-slate-400">or</span>
                      <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Backspace</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Undo / Redo</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Ctrl / ⌘</kbd>
                        <span className="text-slate-400">+</span>
                        <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Z</kbd>
                      </div>
                      <span className="text-slate-300">/</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Ctrl / ⌘</kbd>
                        <span className="text-slate-400">+</span>
                        <kbd className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 font-mono">Y</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                onClick={toggleShortcutsModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
