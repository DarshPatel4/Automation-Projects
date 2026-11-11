import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { WebsiteProject, ComponentNode, Breakpoint, ComponentStyle, GlobalTheme, PageDocument, DatabaseConfig, CMSCollection, ClickAction } from '../types/builder';
import { defaultProject } from '../constants/defaultProject';
import { TEMPLATES_REGISTRY } from '../constants/templates';
import { THEME_PRESETS } from '../constants/themePresets';

interface EditorState {
  project: WebsiteProject;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeBreakpoint: Breakpoint;
  zoom: number;
  previewMode: boolean;
  activeLeftTab: 'elements' | 'layers' | 'pages' | 'theme' | 'templates' | 'ai' | 'code' | 'database';
  activeStyleTab: 'layout' | 'style' | 'typography' | 'spacing' | 'advanced' | 'actions';
  saveStatus: 'saved' | 'saving' | 'unsaved';
  nudgeInfo: { text: string; visible: boolean } | null;
  showShortcutsModal: boolean;
  activeModal: { title: string; content: string } | null;
  activeToast: { title: string; type: 'success' | 'info' | 'error' } | null;

  // History for Undo / Redo
  history: Record<string, ComponentNode>[];
  historyIndex: number;

  // Actions
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setBreakpoint: (bp: Breakpoint) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  togglePreview: () => void;
  toggleShortcutsModal: () => void;
  setActiveModal: (modal: { title: string; content: string } | null) => void;
  showToast: (title: string, type?: 'success' | 'info' | 'error') => void;
  executeNodeAction: (action?: ClickAction) => void;
  setNudgeInfo: (info: { text: string; visible: boolean } | null) => void;
  setActiveLeftTab: (tab: EditorState['activeLeftTab']) => void;
  setActiveStyleTab: (tab: EditorState['activeStyleTab']) => void;
  updateDbConfig: (config: Partial<DatabaseConfig>) => void;
  addCmsCollection: (collection: CMSCollection) => void;
  loadProject: (project: WebsiteProject) => void;
  loadTemplate: (templateId: string) => boolean;

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
  reorderSibling: (nodeId: string, direction: 'prev' | 'next') => void;
  moveNode: (nodeId: string, newParentId: string, targetIndex?: number) => void;
  nudgeNode: (nodeId: string, direction: 'up' | 'down' | 'left' | 'right', step: number) => void;

  // Theme & Pages
  updateTheme: (newTheme: Partial<GlobalTheme>) => void;
  applyThemePreset: (presetId: 'obsidian' | 'swiss' | 'editorial' | 'emerald' | 'nordic') => void;
  addPage: (title: string, slug: string, template?: 'blank' | 'about' | 'contact' | 'pricing') => string;
  deletePage: (pageId: string) => void;
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
  nudgeInfo: null,
  showShortcutsModal: false,
  activeModal: null,
  activeToast: null,

  history: [defaultProject.pages[0].nodes],
  historyIndex: 0,

  selectNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  setBreakpoint: (bp) => set({ activeBreakpoint: bp }),
  setZoom: (zoomOrFn) => set((state) => ({
    zoom: Math.min(200, Math.max(25, typeof zoomOrFn === 'function' ? zoomOrFn(state.zoom) : zoomOrFn)),
  })),
  togglePreview: () => set((state) => ({ previewMode: !state.previewMode, selectedNodeId: null })),
  toggleShortcutsModal: () => set((state) => ({ showShortcutsModal: !state.showShortcutsModal })),
  setActiveModal: (modal) => set({ activeModal: modal }),
  showToast: (title, type = 'success') => {
    set({ activeToast: { title, type } });
    setTimeout(() => {
      if (get().activeToast?.title === title) {
        set({ activeToast: null });
      }
    }, 4000);
  },
  executeNodeAction: async (action) => {
    if (!action || action.type === 'none') return;
    const { switchPage, showToast, setActiveModal, project } = get();

    switch (action.type) {
      case 'navigate_page': {
        if (action.openInNewTab && action.targetPageSlug) {
          window.open(action.targetPageSlug, '_blank');
        } else if (action.targetPageId) {
          switchPage(action.targetPageId);
          const target = project.pages.find((p) => p.id === action.targetPageId);
          showToast(`Navigated to ${target?.title || 'Page'}`, 'info');
        }
        break;
      }

      case 'webhook': {
        if (!action.webhookUrl) return;
        showToast('Dispatching Webhook request...', 'info');
        try {
          const res = await fetch(action.webhookUrl, {
            method: action.webhookMethod || 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(action.webhookHeaders || {}),
            },
            body: action.webhookMethod === 'POST'
              ? JSON.stringify(action.webhookPayload || { event: 'button_click', timestamp: new Date().toISOString() })
              : undefined,
          });
          if (res.ok || res.status < 400) {
            showToast(action.successMessage || 'Webhook executed successfully! (Status 200 OK)', 'success');
          } else {
            showToast(`Webhook responded with status ${res.status}`, 'error');
          }
        } catch (err: any) {
          showToast(`Webhook dispatched (${err.message || 'CORS / offline'})`, 'info');
        }
        break;
      }

      case 'scroll_anchor': {
        if (action.anchorNodeId) {
          const el = document.getElementById(action.anchorNodeId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showToast(`Scrolled to #${action.anchorNodeId}`, 'info');
          }
        }
        break;
      }

      case 'external_url': {
        if (action.url) {
          window.open(action.url, action.openInNewTab ? '_blank' : '_self');
        }
        break;
      }

      case 'open_modal': {
        setActiveModal({
          title: action.modalTitle || 'Interactive Dialog',
          content: action.modalContent || 'This is an interactive dialog window triggered by your click action.',
        });
        break;
      }

      case 'cms_submit': {
        showToast(action.successMessage || `Submission saved to CMS collection [${action.collectionName || 'Default'}]`, 'success');
        break;
      }

      case 'cart_action': {
        showToast(`Added ${action.productId || 'Item'} ($${action.productPrice || 0}) to cart!`, 'success');
        break;
      }
    }
  },
  setNudgeInfo: (info) => set({ nudgeInfo: info }),
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  setActiveStyleTab: (tab) => set({ activeStyleTab: tab }),

  updateDbConfig: (config) =>
    set((state) => ({
      project: {
        ...state.project,
        dbConfig: {
          ...(state.project.dbConfig || {
            engine: 'sqlite',
            is_inbuilt: true,
            status: 'connected',
          }),
          ...config,
        },
      },
    })),

  addCmsCollection: (collection) =>
    set((state) => ({
      project: {
        ...state.project,
        collections: [...(state.project.collections || []), collection],
      },
    })),

  loadProject: (newProject) => {
    const activePage = newProject.pages.find((p) => p.id === newProject.activePageId) || newProject.pages[0];
    set({
      project: newProject,
      selectedNodeId: activePage?.rootNodeId || 'root',
      history: [activePage?.nodes || {}],
      historyIndex: 0,
      saveStatus: 'saved',
    });
  },

  loadTemplate: (templateId) => {
    const tmpl = TEMPLATES_REGISTRY.find((t) => t.id === templateId);
    if (!tmpl) return false;

    const newProject: WebsiteProject = {
      id: `proj_${Date.now()}`,
      name: tmpl.title,
      slug: tmpl.slug,
      siteType: tmpl.siteType,
      subdomain: tmpl.slug,
      dbConfig: tmpl.dbConfig,
      collections: tmpl.collections,
      theme: tmpl.theme,
      pages: [
        {
          id: 'page_home_01',
          title: 'Home',
          slug: '/',
          isHome: true,
          rootNodeId: 'root',
          nodes: tmpl.nodes,
        },
      ],
      activePageId: 'page_home_01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
    };

    get().loadProject(newProject);
    return true;
  },

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

  reorderSibling: (nodeId, direction) => {
    const { project } = get();
    if (nodeId === 'root') return;
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const node = activePage.nodes[nodeId];
    const parentId = node.parentId;
    if (!parentId || !activePage.nodes[parentId]) return;

    const parent = activePage.nodes[parentId];
    const children = [...parent.children];
    const currentIndex = children.indexOf(nodeId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= children.length) return;

    const [moved] = children.splice(currentIndex, 1);
    children.splice(targetIndex, 0, moved);

    const newNodes = {
      ...activePage.nodes,
      [parentId]: { ...parent, children },
    };

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    const hudText = direction === 'prev'
      ? `▲ Moved Up (${targetIndex + 1} of ${children.length})`
      : `▼ Moved Down (${targetIndex + 1} of ${children.length})`;

    set({
      project: { ...project, pages: updatedPages },
      nudgeInfo: { text: hudText, visible: true },
    });
    get().pushHistory(newNodes);
  },

  nudgeNode: (nodeId, direction, step) => {
    const { project, activeBreakpoint } = get();
    if (nodeId === 'root') return;
    const activePage = project.pages.find((p) => p.id === project.activePageId);
    if (!activePage || !activePage.nodes[nodeId]) return;

    const node = activePage.nodes[nodeId];
    const isDesktop = activeBreakpoint === 'desktop';
    const currentStyles = isDesktop
      ? (node.styles.base || {})
      : { ...(node.styles.base || {}), ...(node.styles.responsive?.[activeBreakpoint] || {}) };

    let hudText = '';
    const updatedStyles: Partial<ComponentStyle> = {};

    if (currentStyles.position === 'absolute' || currentStyles.position === 'fixed') {
      const currentTop = parseInt(currentStyles.top || '0', 10);
      const currentLeft = parseInt(currentStyles.left || '0', 10);

      if (direction === 'up') {
        const next = currentTop - step;
        updatedStyles.top = `${next}px`;
        hudText = `▲ Position Top: ${next}px`;
      } else if (direction === 'down') {
        const next = currentTop + step;
        updatedStyles.top = `${next}px`;
        hudText = `▼ Position Top: ${next}px`;
      } else if (direction === 'left') {
        const next = currentLeft - step;
        updatedStyles.left = `${next}px`;
        hudText = `◄ Position Left: ${next}px`;
      } else if (direction === 'right') {
        const next = currentLeft + step;
        updatedStyles.left = `${next}px`;
        hudText = `► Position Left: ${next}px`;
      }
    } else {
      const currentMargin = currentStyles.margin || {};
      const currentTop = parseInt(currentMargin.top || '0', 10);
      const currentLeft = parseInt(currentMargin.left || '0', 10);

      if (direction === 'up') {
        const next = currentTop - step;
        updatedStyles.margin = { ...currentMargin, top: `${next}px` };
        hudText = `▲ Margin-Top: ${next}px`;
      } else if (direction === 'down') {
        const next = currentTop + step;
        updatedStyles.margin = { ...currentMargin, top: `${next}px` };
        hudText = `▼ Margin-Top: ${next}px`;
      } else if (direction === 'left') {
        const next = currentLeft - step;
        updatedStyles.margin = { ...currentMargin, left: `${next}px` };
        hudText = `◄ Margin-Left: ${next}px`;
      } else if (direction === 'right') {
        const next = currentLeft + step;
        updatedStyles.margin = { ...currentMargin, left: `${next}px` };
        hudText = `► Margin-Left: ${next}px`;
      }
    }

    const newNodes = { ...activePage.nodes };
    if (isDesktop) {
      newNodes[nodeId] = {
        ...node,
        styles: {
          ...node.styles,
          base: { ...node.styles.base, ...updatedStyles },
        },
      };
    } else {
      newNodes[nodeId] = {
        ...node,
        styles: {
          ...node.styles,
          responsive: {
            ...node.styles.responsive,
            [activeBreakpoint]: {
              ...(node.styles.responsive?.[activeBreakpoint] || {}),
              ...updatedStyles,
            },
          },
        },
      };
    }

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: newNodes } : p
    );

    set({
      project: { ...project, pages: updatedPages },
      nudgeInfo: { text: hudText, visible: true },
    });
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

  applyThemePreset: (presetId) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const { project } = get();
    const updatedTheme = { ...project.theme, ...preset.theme };

    // Apply background and text color to active page root node
    const activePage = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];
    const rootNode = activePage.nodes[activePage.rootNodeId];
    let updatedNodes = { ...activePage.nodes };

    if (rootNode) {
      updatedNodes[activePage.rootNodeId] = {
        ...rootNode,
        styles: {
          ...rootNode.styles,
          base: {
            ...rootNode.styles.base,
            backgroundColor: preset.theme.backgroundColor,
            color: preset.theme.textColor,
            fontFamily: preset.theme.fontFamily,
          },
        },
      };
    }

    const updatedPages = project.pages.map((p) =>
      p.id === activePage.id ? { ...p, nodes: updatedNodes } : p
    );

    set({
      project: {
        ...project,
        theme: updatedTheme,
        pages: updatedPages,
        updatedAt: new Date().toISOString(),
      },
    });
    get().pushHistory(updatedNodes);
  },

  addPage: (title, slug, template = 'blank') => {
    const { project } = get();
    const newPageId = `page_${nanoid(8)}`;
    const rootId = `root_${nanoid(4)}`;

    const pageNodes: Record<string, ComponentNode> = {
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
          },
        },
      },
    };

    if (template === 'about') {
      const secId = `sec_${nanoid(4)}`;
      const contId = `cont_${nanoid(4)}`;
      const hId = `h_${nanoid(4)}`;
      const pId = `p_${nanoid(4)}`;

      pageNodes[rootId].children = [secId];
      pageNodes[secId] = {
        id: secId,
        type: 'Section',
        name: 'About Section',
        parentId: rootId,
        children: [contId],
        props: {},
        styles: {
          base: {
            display: 'block',
            padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
          },
        },
      };
      pageNodes[contId] = {
        id: contId,
        type: 'Container',
        name: 'Content Container',
        parentId: secId,
        children: [hId, pId],
        props: {},
        styles: {
          base: {
            maxWidth: '900px',
            margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          },
        },
      };
      pageNodes[hId] = {
        id: hId,
        type: 'Heading',
        name: 'About Heading',
        parentId: contId,
        children: [],
        props: { content: `About ${title}`, level: 1 },
        styles: {
          base: {
            fontSize: '44px',
            fontWeight: '800',
            color: project.theme.textColor,
            letterSpacing: '-1px',
          },
        },
      };
      pageNodes[pId] = {
        id: pId,
        type: 'Paragraph',
        name: 'About Description',
        parentId: contId,
        children: [],
        props: {
          content: 'We craft high-performance digital products built on uncompromising engineering standards and human-centered design principles.',
        },
        styles: {
          base: {
            fontSize: '18px',
            lineHeight: '1.7',
            color: project.theme.secondaryColor || '#94a3b8',
          },
        },
      };
    } else if (template === 'contact') {
      const secId = `sec_${nanoid(4)}`;
      const contId = `cont_${nanoid(4)}`;
      const hId = `h_${nanoid(4)}`;
      const pId = `p_${nanoid(4)}`;
      const btnId = `btn_${nanoid(4)}`;

      pageNodes[rootId].children = [secId];
      pageNodes[secId] = {
        id: secId,
        type: 'Section',
        name: 'Contact Section',
        parentId: rootId,
        children: [contId],
        props: {},
        styles: {
          base: {
            display: 'block',
            padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
          },
        },
      };
      pageNodes[contId] = {
        id: contId,
        type: 'Container',
        name: 'Form Container',
        parentId: secId,
        children: [hId, pId, btnId],
        props: {},
        styles: {
          base: {
            maxWidth: '640px',
            margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: { top: '40px', right: '32px', bottom: '40px', left: '32px' },
            borderRadius: project.theme.borderRadius || '12px',
            borderWidth: '1px',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderStyle: 'solid',
          },
        },
      };
      pageNodes[hId] = {
        id: hId,
        type: 'Heading',
        name: 'Contact Heading',
        parentId: contId,
        children: [],
        props: { content: 'Get in Touch', level: 2 },
        styles: {
          base: {
            fontSize: '32px',
            fontWeight: '700',
            color: project.theme.textColor,
          },
        },
      };
      pageNodes[pId] = {
        id: pId,
        type: 'Paragraph',
        name: 'Contact Subtitle',
        parentId: contId,
        children: [],
        props: {
          content: 'Have a question or looking to build together? Drop us a message below.',
        },
        styles: {
          base: {
            fontSize: '15px',
            color: project.theme.secondaryColor || '#94a3b8',
          },
        },
      };
      pageNodes[btnId] = {
        id: btnId,
        type: 'Button',
        name: 'Submit Button',
        parentId: contId,
        children: [],
        props: {
          label: 'Send Inquiry',
          action: {
            type: 'webhook',
            webhookUrl: 'https://api.nexus-studio.dev/v1/inbound-leads',
            webhookMethod: 'POST',
            showSuccessToast: true,
            successMessage: 'Thank you! Your inquiry has been dispatched to our engineering desk.',
          },
        },
        styles: {
          base: {
            backgroundColor: project.theme.primaryColor || '#6366f1',
            color: '#ffffff',
            padding: { top: '14px', right: '28px', bottom: '14px', left: '28px' },
            borderRadius: project.theme.borderRadius || '8px',
            fontWeight: '600',
            fontSize: '14px',
          },
        },
      };
    } else if (template === 'pricing') {
      const secId = `sec_${nanoid(4)}`;
      const contId = `cont_${nanoid(4)}`;
      const hId = `h_${nanoid(4)}`;

      pageNodes[rootId].children = [secId];
      pageNodes[secId] = {
        id: secId,
        type: 'Section',
        name: 'Pricing Section',
        parentId: rootId,
        children: [contId],
        props: {},
        styles: {
          base: {
            display: 'block',
            padding: { top: '80px', right: '24px', bottom: '80px', left: '24px' },
          },
        },
      };
      pageNodes[contId] = {
        id: contId,
        type: 'Container',
        name: 'Pricing Container',
        parentId: secId,
        children: [hId],
        props: {},
        styles: {
          base: {
            maxWidth: '1100px',
            margin: { top: '0', right: 'auto', bottom: '0', left: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          },
        },
      };
      pageNodes[hId] = {
        id: hId,
        type: 'Heading',
        name: 'Pricing Heading',
        parentId: contId,
        children: [],
        props: { content: 'Transparent Pricing Plans', level: 1 },
        styles: {
          base: {
            fontSize: '40px',
            fontWeight: '800',
            color: project.theme.textColor,
            textAlign: 'center',
          },
        },
      };
    }

    const newPage: PageDocument = {
      id: newPageId,
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      rootNodeId: rootId,
      nodes: pageNodes,
    };

    set({
      project: {
        ...project,
        pages: [...project.pages, newPage],
        activePageId: newPageId,
      },
      selectedNodeId: rootId,
      history: [pageNodes],
      historyIndex: 0,
    });

    return newPageId;
  },

  deletePage: (pageId) => {
    const { project } = get();
    if (project.pages.length <= 1) return; // Keep at least one page

    const remainingPages = project.pages.filter((p) => p.id !== pageId);
    const newActivePage = remainingPages[0];

    set({
      project: {
        ...project,
        pages: remainingPages,
        activePageId: newActivePage.id,
      },
      selectedNodeId: newActivePage.rootNodeId,
      history: [newActivePage.nodes],
      historyIndex: 0,
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
