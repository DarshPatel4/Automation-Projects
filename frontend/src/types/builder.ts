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

export interface ComponentNode {
  id: string;
  type: string;                    // e.g. 'Section', 'Heading', 'Button', 'Container', 'Image', etc.
  name?: string;                   // Display name in Layers panel
  parentId: string | null;
  children: string[];              // Ordered child node IDs
  props: Record<string, any>;      // Custom props (content, href, src, alt, etc.)
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
  textColor: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  websitesCount?: number;
  createdAt?: string;
}

export interface WebsiteProject {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  customDomain?: string;
  workspaceId?: string;
  workspaceName?: string;
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


