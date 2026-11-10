'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { ComponentNode, Breakpoint, ComponentStyle } from '../types/builder';
import { LucideIcon } from '../components/ui/LucideIcon';
import { cn } from '../utils/cn';
import { Plus, Trash2, Copy, GripVertical, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Lock, Unlock } from 'lucide-react';

interface RenderNodeProps {
  nodeId: string;
}

export const RenderNode: React.FC<RenderNodeProps> = ({ nodeId }) => {
  const nodes = useEditorStore((s) => s.getActivePageNodes());
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const hoveredNodeId = useEditorStore((s) => s.hoveredNodeId);
  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const previewMode = useEditorStore((s) => s.previewMode);

  const selectNode = useEditorStore((s) => s.selectNode);
  const setHoveredNode = useEditorStore((s) => s.setHoveredNode);
  const deleteNode = useEditorStore((s) => s.deleteNode);
  const duplicateNode = useEditorStore((s) => s.duplicateNode);
  const updateNodeProps = useEditorStore((s) => s.updateNodeProps);
  const addNode = useEditorStore((s) => s.addNode);
  const moveNode = useEditorStore((s) => s.moveNode);
  const reorderSibling = useEditorStore((s) => s.reorderSibling);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const nudgeNode = useEditorStore((s) => s.nudgeNode);

  const [isDragOver, setIsDragOver] = useState(false);

  const node = nodes[nodeId];
  if (!node || node.hidden) return null;

  const isSelected = selectedNodeId === nodeId && !previewMode;
  const isHovered = hoveredNodeId === nodeId && !isSelected && !previewMode;

  // Compute merged styles based on current breakpoint
  const computeMergedStyle = (): React.CSSProperties => {
    const base = node.styles?.base || {};
    const resp = node.styles?.responsive?.[activeBreakpoint] || {};
    const merged: ComponentStyle = { ...base, ...resp };

    const styleObj: React.CSSProperties = {};

    if (merged.display) styleObj.display = merged.display;
    if (merged.flexDirection) styleObj.flexDirection = merged.flexDirection;
    if (merged.flexWrap) styleObj.flexWrap = merged.flexWrap;
    if (merged.justifyContent) styleObj.justifyContent = merged.justifyContent;
    if (merged.alignItems) styleObj.alignItems = merged.alignItems;
    if (merged.gridTemplateColumns) styleObj.gridTemplateColumns = merged.gridTemplateColumns;
    if (merged.gap) styleObj.gap = merged.gap;

    if (merged.width) styleObj.width = merged.width;
    if (merged.minWidth) styleObj.minWidth = merged.minWidth;
    if (merged.maxWidth) styleObj.maxWidth = merged.maxWidth;
    if (merged.height) styleObj.height = merged.height;
    if (merged.minHeight) styleObj.minHeight = merged.minHeight;
    if (merged.maxHeight) styleObj.maxHeight = merged.maxHeight;

    if (merged.padding) {
      if (merged.padding.top) styleObj.paddingTop = merged.padding.top;
      if (merged.padding.right) styleObj.paddingRight = merged.padding.right;
      if (merged.padding.bottom) styleObj.paddingBottom = merged.padding.bottom;
      if (merged.padding.left) styleObj.paddingLeft = merged.padding.left;
    }

    if (merged.margin) {
      if (merged.margin.top) styleObj.marginTop = merged.margin.top;
      if (merged.margin.right) styleObj.marginRight = merged.margin.right;
      if (merged.margin.bottom) styleObj.marginBottom = merged.margin.bottom;
      if (merged.margin.left) styleObj.marginLeft = merged.margin.left;
    }

    if (merged.fontFamily) styleObj.fontFamily = merged.fontFamily;
    if (merged.fontSize) styleObj.fontSize = merged.fontSize;
    if (merged.fontWeight) styleObj.fontWeight = merged.fontWeight;
    if (merged.lineHeight) styleObj.lineHeight = merged.lineHeight;
    if (merged.letterSpacing) styleObj.letterSpacing = merged.letterSpacing;
    if (merged.textAlign) styleObj.textAlign = merged.textAlign;
    if (merged.color) styleObj.color = merged.color;
    if (merged.textDecoration) styleObj.textDecoration = merged.textDecoration;
    if (merged.textTransform) styleObj.textTransform = merged.textTransform;

    if (merged.backgroundColor) styleObj.backgroundColor = merged.backgroundColor;
    if (merged.backgroundImage) styleObj.backgroundImage = `url(${merged.backgroundImage})`;
    if (merged.backgroundSize) styleObj.backgroundSize = merged.backgroundSize;
    if (merged.backgroundPosition) styleObj.backgroundPosition = merged.backgroundPosition;

    if (merged.borderRadius) styleObj.borderRadius = merged.borderRadius;
    if (merged.borderWidth) styleObj.borderWidth = merged.borderWidth;
    if (merged.borderColor) styleObj.borderColor = merged.borderColor;
    if (merged.borderStyle) styleObj.borderStyle = merged.borderStyle;

    if (merged.boxShadow) styleObj.boxShadow = merged.boxShadow;
    if (merged.opacity !== undefined) styleObj.opacity = merged.opacity;
    if (merged.position) styleObj.position = merged.position;
    if (merged.top) styleObj.top = merged.top;
    if (merged.right) styleObj.right = merged.right;
    if (merged.bottom) styleObj.bottom = merged.bottom;
    if (merged.left) styleObj.left = merged.left;
    if (merged.zIndex !== undefined) styleObj.zIndex = merged.zIndex;
    if (merged.overflow) styleObj.overflow = merged.overflow;

    return styleObj;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    selectNode(nodeId);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    setHoveredNode(nodeId);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    setHoveredNode(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (previewMode || node.locked || nodeId === 'root') return;
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'MOVE_NODE', nodeId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (previewMode) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (previewMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      // Dropping an element from the left catalog
      if (data.type === 'ADD_CATALOG_NODE') {
        const targetParentId = (node.type === 'Container' || node.type === 'Section' || node.type === 'Body')
          ? nodeId
          : (node.parentId || 'root');

        addNode(targetParentId, data.componentType, data.defaultProps, data.defaultStyles);
      }
      // Reordering or moving an existing canvas node
      else if (data.type === 'MOVE_NODE') {
        const sourceId = data.nodeId;
        if (sourceId === nodeId) return;

        const targetParentId = (node.type === 'Container' || node.type === 'Section' || node.type === 'Body')
          ? nodeId
          : (node.parentId || 'root');

        moveNode(sourceId, targetParentId);
      }
    } catch (err) {
      console.error('Failed to parse drag drop event:', err);
    }
  };

  const renderChildren = () => {
    return node.children.map((childId) => (
      <RenderNode key={childId} nodeId={childId} />
    ));
  };

  const inlineStyle = computeMergedStyle();

  // Render elements according to component type
  const renderContent = () => {
    switch (node.type) {
      case 'Icon': {
        return (
          <div style={inlineStyle} className="inline-flex items-center justify-center">
            <LucideIcon
              name={node.props?.iconName || 'Layers'}
              size={node.props?.size || 20}
              color={node.props?.color || '#ffffff'}
            />
          </div>
        );
      }

      case 'Heading': {
        const level = node.props?.level || 2;
        const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return (
          <Tag
            style={inlineStyle}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => updateNodeProps(nodeId, { content: (e.currentTarget as HTMLElement).innerText })}
          >
            {node.props?.content || 'Heading Text'}
          </Tag>
        );
      }

      case 'Paragraph': {
        return (
          <p
            style={inlineStyle}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => updateNodeProps(nodeId, { content: (e.currentTarget as HTMLElement).innerText })}
          >
            {node.props?.content || 'Paragraph text goes here...'}
          </p>
        );
      }

      case 'Button': {
        return (
          <button
            type="button"
            style={inlineStyle}
            className="transition-all active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer"
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => updateNodeProps(nodeId, { label: (e.currentTarget as HTMLElement).innerText })}
            onClick={(e) => {
              if (!previewMode) e.preventDefault();
            }}
          >
            {node.props?.label || 'Click Me'}
          </button>
        );
      }

      case 'Link': {
        return (
          <a
            href={previewMode ? (node.props?.href || '#') : undefined}
            style={inlineStyle}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => updateNodeProps(nodeId, { text: (e.currentTarget as HTMLElement).innerText })}
            onClick={(e) => {
              if (!previewMode) e.preventDefault();
            }}
          >
            {node.props?.text || 'Link Text'}
          </a>
        );
      }

      case 'Image': {
        return (
          <img
            src={node.props?.src || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'}
            alt={node.props?.alt || 'Visual element'}
            style={inlineStyle}
            className="object-cover max-w-full"
          />
        );
      }

      case 'Divider': {
        return (
          <hr
            style={{
              borderColor: node.props?.color || 'rgba(255, 255, 255, 0.1)',
              borderTopWidth: node.props?.thickness || '1px',
              ...inlineStyle,
            }}
            className="w-full my-4"
          />
        );
      }

      case 'Spacer': {
        return (
          <div
            style={{
              height: node.props?.height || '32px',
              width: '100%',
              ...inlineStyle,
            }}
          />
        );
      }

      case 'Section':
      case 'Container':
      case 'Body':
      default: {
        return (
          <div style={inlineStyle} className="relative">
            {node.children.length === 0 && !previewMode ? (
              <div
                className="py-8 px-4 border-2 border-dashed border-slate-700/60 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-2 cursor-pointer hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  addNode(nodeId, 'Heading', { content: 'New Section Headline', level: 2 });
                }}
              >
                <Plus className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-semibold">Empty Container — Drag elements here or click to add</span>
              </div>
            ) : (
              renderChildren()
            )}
          </div>
        );
      }
    }
  };

  const isDraggable = !previewMode && !node.locked && nodeId !== 'root';

  return (
    <div
      id={nodeId}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative transition-all',
        !previewMode && isHovered && 'outline-1 outline-dashed outline-indigo-400',
        !previewMode && isSelected && 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 z-10',
        isDragOver && 'ring-2 ring-indigo-400 bg-indigo-950/20'
      )}
    >
      {/* Canva-Style Selection Bounding Box & 8-point handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-md z-30 pointer-events-none" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-md z-30 pointer-events-none" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-md z-30 pointer-events-none" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-md z-30 pointer-events-none" />

          {/* Canva Floating Contextual Action Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 flex items-center bg-slate-900 text-white rounded-lg px-2 py-1 text-[11px] font-semibold shadow-2xl border border-slate-700/80 pointer-events-auto gap-1.5 select-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px] pr-1.5 border-r border-slate-700">
              <GripVertical className="w-3.5 h-3.5 text-indigo-400 cursor-grab" />
              <span className="text-white font-sans font-medium">{node.name || node.type}</span>
            </div>

            {/* Reorder Sibling Up / Down (Canva layer position) */}
            {nodeId !== 'root' && (
              <div className="flex items-center gap-0.5 pr-1 border-r border-slate-700">
                <button
                  type="button"
                  title="Move Up (Ctrl+↑)"
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderSibling(nodeId, 'prev');
                  }}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Move Down (Ctrl+↓)"
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderSibling(nodeId, 'next');
                  }}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Quick Nudge Arrows */}
            {nodeId !== 'root' && (
              <div className="hidden sm:flex items-center gap-0.5 pr-1 border-r border-slate-700">
                <button
                  type="button"
                  title="Nudge Left (← / Shift+← for 10px)"
                  onClick={(e) => {
                    e.stopPropagation();
                    nudgeNode(nodeId, 'left', 5);
                  }}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Nudge Right (→ / Shift+→ for 10px)"
                  onClick={(e) => {
                    e.stopPropagation();
                    nudgeNode(nodeId, 'right', 5);
                  }}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Lock / Unlock */}
            <button
              type="button"
              title={node.locked ? 'Unlock Element' : 'Lock Element'}
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(nodeId);
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
            >
              {node.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
            </button>

            {/* Duplicate */}
            <button
              type="button"
              title="Duplicate (Ctrl+D)"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(nodeId);
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
            >
              <Copy className="w-3 h-3" />
            </button>

            {/* Delete */}
            {nodeId !== 'root' && (
              <button
                type="button"
                title="Delete (Del)"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(nodeId);
                }}
                className="p-1 hover:bg-red-950/60 rounded text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </>
      )}

      {renderContent()}
    </div>
  );
};
