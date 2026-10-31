'use client';

import React from 'react';
import { useEditorStore } from '../stores/editorStore';
import { ComponentNode, Breakpoint, ComponentStyle } from '../types/builder';
import { cn } from '../utils/cn';
import { Plus, Trash2, Copy, Lock, EyeOff } from 'lucide-react';

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

  const renderChildren = () => {
    return node.children.map((childId) => (
      <RenderNode key={childId} nodeId={childId} />
    ));
  };

  const inlineStyle = computeMergedStyle();

  // Render elements according to component type
  const renderContent = () => {
    switch (node.type) {
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
            className="transition-all active:scale-95"
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
            alt={node.props?.alt || 'Image description'}
            style={inlineStyle}
            className="object-cover max-w-full"
          />
        );
      }

      case 'Divider': {
        return (
          <hr
            style={{
              borderColor: node.props?.color || '#e2e8f0',
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
                className="py-8 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  addNode(nodeId, 'Heading', { content: 'New Heading', level: 2 });
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs font-medium">Empty Container (Click to add element)</span>
              </div>
            ) : (
              renderChildren()
            )}
          </div>
        );
      }
    }
  };

  return (
    <div
      id={nodeId}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative transition-all',
        !previewMode && isHovered && 'outline-1 outline-dashed outline-indigo-400',
        !previewMode && isSelected && 'ring-2 ring-indigo-600 ring-offset-1 z-10'
      )}
    >
      {/* Floating Action Badge for Selected Node */}
      {isSelected && (
        <div className="absolute -top-7 left-0 z-50 flex items-center bg-indigo-600 text-white rounded px-2 py-0.5 text-[11px] font-semibold shadow-md pointer-events-auto gap-2">
          <span>{node.name || node.type}</span>
          <div className="flex items-center gap-1 border-l border-indigo-400 pl-1.5">
            <button
              title="Duplicate"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(nodeId);
              }}
              className="hover:text-indigo-200"
            >
              <Copy className="w-3 h-3" />
            </button>
            {nodeId !== 'root' && (
              <button
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(nodeId);
                }}
                className="hover:text-red-300"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
};
