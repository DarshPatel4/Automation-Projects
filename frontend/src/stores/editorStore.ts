import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { WebsiteProject, ComponentNode, Breakpoint, ComponentStyle, GlobalTheme, PageDocument } from '../types/builder';
import { defaultProject } from '../constants/defaultProject';

interface EditorState {
  project: WebsiteProject;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeBreakpoint: Breakpoint;
  zoom: number;
  previewMode: boolean;
  activeLeftTab: 'elements' | 'layers' | 'pages' | 'theme' | 'templates' | 'ai' | 'code';
  activeStyleTab: 'layout' | 'style' | 'typography' | 'spacing' | 'advanced';
  saveStatus: 'saved' | 'saving' | 'unsaved';

  // History for Undo / Redo
  history: Record<string, ComponentNode>[];
  historyIndex: number;

  // Actions
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setBreakpoint: (bp: Breakpoint) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  togglePreview: () => void;
  setActiveLeftTab: (tab: EditorState['activeLeftTab']) => void;
  setActiveStyleTab: (tab: EditorState['activeStyleTab']) => void;

  // Tree manipulation
  getActivePageNodes: () => Record<string, ComponentNode>;
  updateNodeProps: (nodeId: string, props: Record<string, any>) => void;
  updateNodeStyles: (nodeId: string, styles: Partial<ComponentStyle>, breakpoint?: Breakpoint) => void;
  updateNodeName: (nodeId: string, name: string) => void;
  toggleLock: (nodeId: string) => void;
  toggleHidden: (nodeId: string) => void;
  addNode: (parentId: string, type: string, defaultProps?: Record<string, any>, defaultStyles?: ComponentStyle, index?: number) => string;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => string | null;
  reorderChildren: (parentId: string, startIndex: number, endIndex: number) => void;
  moveNode: (nodeId: string, newParentId: string, targetIndex?: number) => void;

  // Theme & Pages
  updateTheme: (newTheme: Partial<GlobalTheme>) => void;
  addPage: (title: string, slug: string) => void;
  switchPage: (pageId: string) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  pushHistory: (nodes: Record<string, ComponentNode>) => void;

  // Publish / Export
  setPublished: (published: boolean) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: defaultProject,
  selectedNodeId: 'hero-title',
  hoveredNodeId: null,
  activeBreakpoint: 'desktop',
  zoom: 100,
  previewMode: false,
  activeLeftTab: 'elements',
  activeStyleTab: 'style',
  saveStatus: 'saved',

  history: [defaultProject.pages[0].nodes],
  historyIndex: 0,

  selectNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  setBreakpoint: (bp) => set({ activeBreakpoint: bp }),
  setZoom: (zoomOrFn) => set((state) => ({
    zoom: Math.min(200, Math.max(25, typeof zoomOrFn === 'function' ? zoomOrFn(state.zoom) : zoomOrFn)),
  })),
  togglePreview: () => set((state) => ({ previewMode: !state.previewMode, selectedNodeId: null })),
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  setActiveStyleTab: (tab) => set({ activeStyleTab: tab }),

  getActivePageNodes: () => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];
    return activePage.nodes;
  },

  pushHistory: (nodes) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(nodes)));
    if (newHistory.length > 40) newHistory.shift();
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      saveStatus: 'unsaved',
    });
  },

  updateNodeProps: (nodeId, props) => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const newNodes = { ...activePage.nodes };
    newNodes[nodeId] = {
      ...newNodes[nodeId],
      props: { ...newNodes[nodeId].props, ...props },
    };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages } });
    get().pushHistory(newNodes);
  },

  updateNodeStyles: (nodeId, styles, breakpoint) => {
    const { project, activeBreakpoint } = get();
    const targetBreakpoint = breakpoint || activeBreakpoint;
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const node = activePage.nodes[nodeId];
    const newNodes = { ...activePage.nodes };

    if (targetBreakpoint === 'desktop') {
      newNodes[nodeId] = {
        ...node,
        styles: {
          ...node.styles,
          base: { ...node.styles.base, ...styles },
        },
      };
    } else {
      newNodes[nodeId] = {
        ...node,
        styles: {
          ...node.styles,
          responsive: {
            ...node.styles.responsive,
            [targetBreakpoint]: {
              ...(node.styles.responsive?.[targetBreakpoint] || {}),
              ...styles,
            },
          },
        },
      };
    }

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages } });
    get().pushHistory(newNodes);
  },

  updateNodeName: (nodeId, name) => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const newNodes = {
      ...activePage.nodes,
      [nodeId]: { ...activePage.nodes[nodeId], name },
    };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages } });
  },

  toggleLock: (nodeId) => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const node = activePage.nodes[nodeId];
    const newNodes = {
      ...activePage.nodes,
      [nodeId]: { ...node, locked: !node.locked },
    };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages } });
  },

  toggleHidden: (nodeId) => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const node = activePage.nodes[nodeId];
    const newNodes = {
      ...activePage.nodes,
      [nodeId]: { ...node, hidden: !node.hidden },
    };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages } });
  },

  addNode: (parentId, type, defaultProps = {}, defaultStyles = {}, index) => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage) return '';

    const newId = `node_${type.toLowerCase()}_${nanoid(6)}`;
    const newNode: ComponentNode = {
      id: newId,
      type,
      name: `${type}`,
      parentId,
      children: [],
      props: defaultProps,
      styles: {
        base: defaultStyles,
      },
    };

    const newNodes = { ...activePage.nodes, [newId]: newNode };
    const parentNode = newNodes[parentId];
    if (parentNode) {
      const updatedChildren = [...parentNode.children];
      if (typeof index === 'number') {
        updatedChildren.splice(index, 0, newId);
      } else {
        updatedChildren.push(newId);
      }
      newNodes[parentId] = { ...parentNode, children: updatedChildren };
    }

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages }, selectedNodeId: newId });
    get().pushHistory(newNodes);
    return newId;
  },

  deleteNode: (nodeId) => {
    const { project } = get();
    if (nodeId === 'root') return; // Cannot delete root
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const newNodes = { ...activePage.nodes };
    const parentId = newNodes[nodeId].parentId;

    // Helper to recursively collect all descendant IDs
    const collectDescendants = (id: string, list: string[]) => {
      const children = newNodes[id]?.children || [];
      for (const childId of children) {
        list.push(childId);
        collectDescendants(childId, list);
      }
    };

    const nodesToRemove = [nodeId];
    collectDescendants(nodeId, nodesToRemove);

    nodesToRemove.forEach((id) => delete newNodes[id]);

    if (parentId && newNodes[parentId]) {
      newNodes[parentId] = {
        ...newNodes[parentId],
        children: newNodes[parentId].children.filter((cid) => cid !== nodeId),
      };
    }

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({
      project: { ...project, pages: updatedPages },
      selectedNodeId: parentId || 'root',
    });
    get().pushHistory(newNodes);
  },

  duplicateNode: (nodeId) => {
    const { project } = get();
    if (nodeId === 'root') return null;
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return null;

    const sourceNode = activePage.nodes[nodeId];
    const parentId = sourceNode.parentId;
    if (!parentId || !activePage.nodes[parentId]) return null;

    const newNodes = { ...activePage.nodes };

    // Deep clone subtree with newly minted IDs
    const cloneSubtree = (srcId: string, newParent: string | null): string => {
      const src = activePage.nodes[srcId];
      const clonedId = `node_${src.type.toLowerCase()}_${nanoid(6)}`;
      const clonedNode: ComponentNode = {
        ...JSON.parse(JSON.stringify(src)),
        id: clonedId,
        name: `${src.name || src.type} (Copy)`,
        parentId: newParent,
        children: [],
      };
      newNodes[clonedId] = clonedNode;

      for (const childId of src.children) {
        const clonedChildId = cloneSubtree(childId, clonedId);
        clonedNode.children.push(clonedChildId);
      }
      return clonedId;
    };

    const duplicateId = cloneSubtree(nodeId, parentId);
    const parent = newNodes[parentId];
    const srcIndex = parent.children.indexOf(nodeId);
    const updatedChildren = [...parent.children];
    updatedChildren.splice(srcIndex + 1, 0, duplicateId);
    newNodes[parentId] = { ...parent, children: updatedChildren };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({
      project: { ...project, pages: updatedPages },
      selectedNodeId: duplicateId,
    });
    get().pushHistory(newNodes);
    return duplicateId;
  },

  reorderChildren: (parentId, startIndex, endIndex) => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[parentId]) return;

    const parent = activePage.nodes[parentId];
    const newChildren = [...parent.children];
    const [moved] = newChildren.splice(startIndex, 1);
    newChildren.splice(endIndex, 0, moved);

    const newNodes = {
      ...activePage.nodes,
      [parentId]: { ...parent, children: newChildren },
    };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages } });
    get().pushHistory(newNodes);
  },

  moveNode: (nodeId, newParentId, targetIndex) => {
    const { project } = get();
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId] || !activePage.nodes[newParentId]) return;

    const node = activePage.nodes[nodeId];
    const oldParentId = node.parentId;
    if (!oldParentId) return;

    const newNodes = { ...activePage.nodes };

    // Remove from old parent
    if (newNodes[oldParentId]) {
      newNodes[oldParentId] = {
        ...newNodes[oldParentId],
        children: newNodes[oldParentId].children.filter((id) => id !== nodeId),
      };
    }

    // Insert into new parent
    const targetParent = newNodes[newParentId];
    const newChildren = [...targetParent.children];
    if (typeof targetIndex === 'number' && targetIndex >= 0) {
      newChildren.splice(targetIndex, 0, nodeId);
    } else {
      newChildren.push(nodeId);
    }

    newNodes[newParentId] = { ...targetParent, children: newChildren };
    newNodes[nodeId] = { ...node, parentId: newParentId };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({ project: { ...project, pages: updatedPages }, selectedNodeId: nodeId });
    get().pushHistory(newNodes);
  },

  updateTheme: (newTheme) => {
    const { project } = get();
    set({
      project: {
        ...project,
        theme: { ...project.theme, ...newTheme },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  addPage: (title, slug) => {
    const { project } = get();
    const newPageId = `page_${nanoid(8)}`;
    const rootId = `root_${nanoid(4)}`;

    const newPage: PageDocument = {
      id: newPageId,
      title,
      slug,
      rootNodeId: rootId,
      nodes: {
        [rootId]: {
          id: rootId,
          type: 'Body',
          name: `${title} Body`,
          parentId: null,
          children: [],
          props: {},
          styles: {
            base: {
              display: 'block',
              minHeight: '100vh',
              backgroundColor: project.theme.backgroundColor,
              color: project.theme.textColor,
              fontFamily: project.theme.fontFamily,
              padding: { top: '32px', right: '24px', bottom: '32px', left: '24px' },
            },
          },
        },
      },
    };

    set({
      project: {
        ...project,
        pages: [...project.pages, newPage],
        activePageId: newPageId,
      },
      selectedNodeId: rootId,
    });
  },

  switchPage: (pageId) => {
    const { project } = get();
    const targetPage = project.pages.find((p) => p.id === pageId);
    if (!targetPage) return;

    set({
      project: { ...project, activePageId: pageId },
      selectedNodeId: targetPage.rootNodeId,
      history: [targetPage.nodes],
      historyIndex: 0,
    });
  },

  undo: () => {
    const { history, historyIndex, project } = get();
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const previousNodes = history[newIndex];
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage) return;

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: previousNodes } : p
    );

    set({
      project: { ...project, pages: updatedPages },
      historyIndex: newIndex,
    });
  },

  redo: () => {
    const { history, historyIndex, project } = get();
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const nextNodes = history[newIndex];
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage) return;

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: nextNodes } : p
    );

    set({
      project: { ...project, pages: updatedPages },
      historyIndex: newIndex,
    });
  },

  setPublished: (published) => {
    const { project } = get();
    set({
      project: {
        ...project,
        published,
        publishedAt: published ? new Date().toISOString() : undefined,
      },
    });
  },
}));
