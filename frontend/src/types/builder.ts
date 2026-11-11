export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface ComponentStyle {
  // Layout & Display
  display?: 'block' | 'flex' | 'grid' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  gridTemplateColumns?: string;
  gap?: string;

  // Sizing & Box Model
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  padding?: SpacingValue;
  margin?: SpacingValue;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Colors & Backgrounds
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';

  // Borders & Rounded Corners
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';

  // Shadows & Effects
  boxShadow?: string;
  opacity?: number;
  cursor?: string;
  transition?: string;

  // Positioning
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

export type ActionType =
  | 'none'
  | 'navigate_page'
  | 'webhook'
  | 'external_url'
  | 'scroll_anchor'
  | 'open_modal'
  | 'cms_submit'
  | 'cart_action';

export interface ClickAction {
  type: ActionType;
  // Page Navigation
  targetPageId?: string;
  targetPageSlug?: string;
  openInNewTab?: boolean;
  // Webhook
  webhookUrl?: string;
  webhookMethod?: 'POST' | 'GET';
  webhookHeaders?: Record<string, string>;
  webhookPayload?: Record<string, any>;
  showSuccessToast?: boolean;
  successMessage?: string;
  // External URL
  url?: string;
  // Scroll Anchor
  anchorNodeId?: string;
  // Modal
  modalId?: string;
  modalTitle?: string;
  modalContent?: string;
  // CMS Submit
  collectionName?: string;
  fieldsMapping?: Record<string, string>;
  // E-Commerce
  productId?: string;
  productPrice?: number;
}

export interface ComponentNode {
  id: string;
  type: string;                    // e.g. 'Section', 'Heading', 'Button', 'Container', 'Image', etc.
  name?: string;                   // Display name in Layers panel
  parentId: string | null;
  children: string[];              // Ordered child node IDs
  props: Record<string, any> & {
    action?: ClickAction;
  };
  styles: {
    base: ComponentStyle;
    responsive?: Partial<Record<Breakpoint, Partial<ComponentStyle>>>;
    hover?: Partial<ComponentStyle>;
  };
  animations?: {
    type?: string;
    trigger?: 'load' | 'hover' | 'scroll';
    duration?: number;
    delay?: number;
  };
  locked?: boolean;
  hidden?: boolean;
}

export interface PageDocument {
  id: string;
  title: string;
  slug: string;
  isHome?: boolean;
  rootNodeId: string;
  nodes: Record<string, ComponentNode>;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  customCss?: string;
  customHeadScript?: string;
}

export interface GlobalTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor?: string;
  borderColor?: string;
  textColor: string;
  mutedTextColor?: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: string;
  presetId?: 'obsidian' | 'swiss' | 'editorial' | 'emerald' | 'nordic';
}

export type WebsiteType = 'static' | 'dynamic';

export interface DatabaseConfig {
  engine: 'sqlite' | 'postgres' | 'mysql';
  is_inbuilt: boolean;
  status: 'connected' | 'disconnected' | 'error';
  latency_ms?: number;
  database_name?: string;
  host?: string;
  port?: number;
  ssl?: boolean;
  last_tested?: string;
}

export interface CMSField {
  name: string;
  label: string;
  type: 'text' | 'rich-text' | 'image' | 'number' | 'boolean' | 'date';
  required?: boolean;
}

export interface CMSCollection {
  id: string;
  name: string;
  label: string;
  description?: string;
  fields: CMSField[];
  recordsCount?: number;
}

export interface CMSCollectionRecord {
  id: string;
  collectionName: string;
  data: Record<string, any>;
  createdAt: string;
}

export interface MediaAssetItem {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  type: 'image' | 'svg' | 'font' | 'document';
  dimensions?: string;
  uploadedAt: string;
}

export interface StorageSummary {
  totalStorageBytes: number;
  quotaLimitBytes: number;
  storageUsedPercent: number;
  totalWorkspaces: number;
  totalWebsites: number;
  staticWebsites: number;
  dynamicWebsites: number;
  totalCmsRecords: number;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  websitesCount?: number;
  totalStorageBytes?: number;
  createdAt?: string;
}

export interface WebsiteProject {
  id: string;
  name: string;
  slug: string;
  siteType?: WebsiteType;
  subdomain?: string;
  customDomain?: string;
  workspaceId?: string;
  workspaceName?: string;
  storageUsageBytes?: number;
  dbConfig?: DatabaseConfig;
  collections?: CMSCollection[];
  theme: GlobalTheme;
  pages: PageDocument[];
  activePageId: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  publishedAt?: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  projectData: Partial<WebsiteProject>;
}


