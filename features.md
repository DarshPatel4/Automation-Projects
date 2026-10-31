# Platform Features Tracker (`features.md`)

This document tracks all features planned, currently in development, and implemented in the No-Code Website Builder SaaS Platform. Whenever new features are introduced or added to the platform, update this file accordingly.

---

## 1. Feature Status Summary

| Status Indicator | Meaning |
| :--- | :--- |
| 🟢 **Implemented** | Built, verified, and available in the current codebase |
| 🟡 **In Progress** | Currently under active development |
| 🔵 **Planned** | Detailed in specification, scheduled for implementation |
| ⚪ **Backlog** | Future enhancement candidate |

---

## 2. Core Modules & Feature Registry

### Module 1: Authentication & User Management
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| AUTH-001 | User Email/Password Registration | Sign up with email validation and encrypted password hashing | 🔵 Planned | Phase 1 |
| AUTH-002 | JWT Session Management | Stateless secure authentication via DRF SimpleJWT | 🔵 Planned | Phase 1 |
| AUTH-003 | Google OAuth Integration | Single sign-on with Google accounts | 🔵 Planned | Phase 1 |
| AUTH-004 | Password Reset Flow | Tokenized email password reset workflow | 🔵 Planned | Phase 1 |
| AUTH-005 | Role-Based Access Control | Granular roles: Owner, Admin, Editor, Viewer | 🔵 Planned | Phase 1 |

---

### Module 2: Dashboard & Project Management
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| DASH-001 | Website Projects Grid | View all user websites with status indicators (Draft, Published) | 🔵 Planned | Phase 1 |
| DASH-002 | Create Website Modal | Choice of starting from Blank, Template, or AI Prompt | 🔵 Planned | Phase 1 |
| DASH-003 | Project Duplicate & Clone | Clone existing projects with all pages and asset links | 🔵 Planned | Phase 1 |
| DASH-004 | Project Rename & Archive | Soft-delete, archive, and name management | 🔵 Planned | Phase 1 |
| DASH-005 | Storage & Plan Quota Usage | Real-time usage indicators for assets and active sites | 🔵 Planned | Phase 1 |

---

### Module 3: Visual Canvas & Drag-and-Drop Engine
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| DND-001 | Component Tree Schema Engine | Normalized JSON tree representation of nodes and relationships | 🔵 Planned | Phase 1 |
| DND-002 | Sidebar to Canvas Drag-and-Drop | Drag new elements into the canvas with drop indicator highlights | 🔵 Planned | Phase 1 |
| DND-003 | In-Canvas Reordering | Reorder siblings and move elements across parent containers | 🔵 Planned | Phase 1 |
| DND-004 | Element Selection & Multi-Select | Single and multi-selection with bounding boxes and action handles | 🔵 Planned | Phase 1 |
| DND-005 | Transform & Resize Handles | 8-point interactive resize handles with aspect ratio lock | 🔵 Planned | Phase 2 |
| DND-006 | Rulers & Smart Guides | Distance measurement markers and snap-to-grid alignment guides | 🔵 Planned | Phase 2 |
| DND-007 | Undo / Redo History Stack | Immutable state snapshot stack with keyboard shortcut bindings | 🔵 Planned | Phase 2 |
| DND-008 | Keyboard Shortcuts Engine | Copy (`Ctrl+C`), Paste (`Ctrl+V`), Duplicate (`Ctrl+D`), Delete (`Del`) | 🔵 Planned | Phase 2 |
| DND-009 | Context Menu Actions | Right-click menu for rapid element operations | 🔵 Planned | Phase 2 |

---

### Module 4: Top Toolbar & Viewport Controls
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| TOOL-001 | Viewport Mode Switcher | Switch between Desktop (1440px), Tablet (768px), Mobile (375px) | 🔵 Planned | Phase 1 |
| TOOL-002 | Zoom & Pan Navigation | Canvas zoom (25% - 200%) and spacebar drag panning | 🔵 Planned | Phase 1 |
| TOOL-003 | Save Status Indicator | Live save state (Saved, Saving, Unsaved changes) | 🔵 Planned | Phase 1 |
| TOOL-004 | Live Preview Mode | Fullscreen interactive preview without editor chrome | 🔵 Planned | Phase 1 |
| TOOL-005 | Publish Action Menu | Deploy to subdomain, custom domain, or trigger code export | 🔵 Planned | Phase 1 |

---

### Module 5: Component Library (Basic, Layout, Navigation, Media)
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| COMP-001 | Typography Components | Heading (H1-H6), Paragraph, Rich Text Block | 🔵 Planned | Phase 2 |
| COMP-002 | Media Components | Responsive Image, Video Player, YouTube/Vimeo embed, Audio | 🔵 Planned | Phase 2 |
| COMP-003 | Action & UI Components | Button, Link, Icon (Lucide), Divider, Spacer | 🔵 Planned | Phase 2 |
| COMP-004 | Layout Containers | Section, Container, Flex Row/Col, CSS Grid, 2/3/4 Column splits | 🔵 Planned | Phase 2 |
| COMP-005 | Navigation Primitives | Navbar, Mobile Drawer Menu, Mega Menu, Breadcrumbs, Footer | 🔵 Planned | Phase 2 |
| COMP-006 | Interactive Widgets | Accordion, Tabs, Modal/Popup, Carousel, Lightbox, Counters | 🔵 Planned | Phase 3 |
| COMP-007 | Pre-built Business Blocks | Hero variants, Features, Testimonials, Team, Pricing tables, FAQs | 🔵 Planned | Phase 3 |

---

### Module 6: Properties Inspector & Styling Engine
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| PROP-001 | Layout & Flexbox/Grid Controls | Direction, alignment, justify, wrap, gap, column configuration | 🔵 Planned | Phase 2 |
| PROP-002 | Spacing Visual Box Model | Interactive margin and padding editor with 4-side controls | 🔵 Planned | Phase 2 |
| PROP-003 | Typography Controls | Font family, size, weight, line-height, letter-spacing, alignment | 🔵 Planned | Phase 2 |
| PROP-004 | Color & Gradient Picker | Solid colors, multi-stop linear/radial gradients, opacity | 🔵 Planned | Phase 2 |
| PROP-005 | Borders, Radii & Shadows | Rounded corners, border styles, box shadow presets | 🔵 Planned | Phase 2 |
| PROP-006 | Responsive Overrides Engine | Breakpoint-specific style overrides without duplicating DOM | 🔵 Planned | Phase 2 |
| PROP-007 | Global Design System Tokens | Global palette, font tokens, and automatic cascade updates | 🔵 Planned | Phase 3 |

---

### Module 7: Layers & Page Management
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| LAY-001 | Tree-View Layers Panel | Hierarchical visual tree with node expansion and selection | 🔵 Planned | Phase 2 |
| LAY-002 | Layer Reordering & Reparenting | Drag nodes within layer tree to change nesting/order | 🔵 Planned | Phase 2 |
| LAY-003 | Lock, Hide, Rename Layers | Lock modifications, toggle canvas visibility, custom naming | 🔵 Planned | Phase 2 |
| PAGE-001 | Multi-Page Manager | Create, duplicate, reorder, delete, and manage page routes | 🔵 Planned | Phase 2 |
| PAGE-002 | Page SEO Settings | Title, meta description, canonical URL, OpenGraph thumbnail | 🔵 Planned | Phase 2 |

---

### Module 8: Media & Asset Manager
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| ASSET-001 | Media Upload Dropzone | Direct file upload with thumbnail generation | 🔵 Planned | Phase 3 |
| ASSET-002 | Asset Organization | Folders, search by filename, filter by MIME type | 🔵 Planned | Phase 3 |
| ASSET-003 | Image Optimization | Auto WebP/AVIF generation and responsive source sets | 🔵 Planned | Phase 3 |
| ASSET-004 | S3 / Cloudinary Storage | Cloud storage provider abstraction | 🔵 Planned | Phase 3 |

---

### Module 9: Animation & Micro-Interactions
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| ANIM-001 | Transition Presets | Fade, Slide, Zoom, Scale, Rotate, Bounce | 🔵 Planned | Phase 4 |
| ANIM-002 | Interaction Triggers | On Page Load, On Hover, On Click, On Scroll Into View | 🔵 Planned | Phase 4 |
| ANIM-003 | Timing & Easing Controls | Duration, delay, curve (ease-in, ease-out, spring) | 🔵 Planned | Phase 4 |

---

### Module 10: Dynamic CMS & Collections
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| CMS-001 | Schema Builder | Define custom collections and field types | 🔵 Planned | Phase 4 |
| CMS-002 | Content Item Management | Add, edit, publish, draft, and delete collection records | 🔵 Planned | Phase 4 |
| CMS-003 | Dynamic Data Binding | Bind canvas elements to CMS fields via mustache syntax | 🔵 Planned | Phase 4 |
| CMS-004 | Dynamic Collection Lists | Repeating cards and grids fed by CMS collections | 🔵 Planned | Phase 4 |

---

### Module 11: Form Builder & Automation
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| FORM-001 | Visual Form Assembly | Combine form inputs, radios, checkboxes, and submit triggers | 🔵 Planned | Phase 4 |
| FORM-002 | Client & Server Validation | Required checks, regex validation, email format verification | 🔵 Planned | Phase 4 |
| FORM-003 | Submissions Inbox | Database storage, submission viewer, CSV download | 🔵 Planned | Phase 4 |
| FORM-004 | Email Notifications & Webhooks | Send alert emails on submission, post payload to external webhook | 🔵 Planned | Phase 4 |

---

### Module 12: AI Website Generator Module
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| AI-001 | Prompt-to-Website Engine | Natural language description to multi-page JSON component tree | 🔵 Planned | Phase 5 |
| AI-002 | Prompt-to-Section Engine | In-editor prompt to insert customized sections | 🔵 Planned | Phase 5 |
| AI-003 | AI Copywriting & Text Assistant | Rephrase, expand, shorten, or generate headings and copy | 🔵 Planned | Phase 5 |
| AI-004 | AI SEO Meta Assistant | Automatic generation of SEO titles and descriptions | 🔵 Planned | Phase 5 |
| AI-005 | Token & Quota Tracking | Track AI token usage per user subscription | 🔵 Planned | Phase 5 |

---

### Module 13: Code Editor & Developer Mode
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| CODE-001 | Monaco Custom CSS Editor | Page-level and site-level custom CSS with autocomplete | 🔵 Planned | Phase 5 |
| CODE-002 | Custom JavaScript Injection | Head and body script injection executed safely in sandboxed iframe | 🔵 Planned | Phase 5 |
| CODE-003 | Inspect Element JSON | Live view of selected element's JSON schema | 🔵 Planned | Phase 5 |
| CODE-004 | Clean Code Export | Download production-ready standalone HTML/CSS/JS or Next.js ZIP | 🔵 Planned | Phase 5 |

---

### Module 14: E-Commerce Store Engine
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| ECOM-001 | Product Catalog Management | Products, categories, variants (size/color), SKU, inventory | 🔵 Planned | Phase 6 |
| ECOM-002 | Shopping Cart Drawer | Dynamic slide-out cart with quantity updates and subtotal | 🔵 Planned | Phase 6 |
| ECOM-003 | Checkout Integration | Razorpay / Cashfree / Stripe payment gateway flow | 🔵 Planned | Phase 6 |
| ECOM-004 | Orders & Fulfillment Admin | Order status management, invoice generation, customer history | 🔵 Planned | Phase 6 |

---

### Module 15: Website Publishing & Domain Engine
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| PUB-001 | Static Build Compiler | Converts JSON component tree into minified static HTML/CSS/JS | 🔵 Planned | Phase 6 |
| PUB-002 | Subdomain Hosting | Instant live deployment at `sitename.platform.com` | 🔵 Planned | Phase 6 |
| PUB-003 | Custom Domain & SSL | CNAME verification, automated Let's Encrypt / Cloudflare SSL | 🔵 Planned | Phase 6 |
| PUB-004 | Version History & Rollback | Save named checkpoints and revert published site to prior version | 🔵 Planned | Phase 6 |

---

### Module 16: Subscriptions & Billing
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| BILL-001 | Tiered Subscription Plans | Free, Pro, and Business tiers with differentiated quotas | 🔵 Planned | Phase 7 |
| BILL-002 | Payment Gateway Integration | Stripe Billing / Razorpay Subscriptions integration | 🔵 Planned | Phase 7 |
| BILL-003 | Usage Meters & Invoices | Track custom domains, AI tokens, and export permissions | 🔵 Planned | Phase 7 |

---

### Module 17: Platform Admin Dashboard
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| ADM-001 | User & Tenant Management | Search, suspend, activate user accounts and teams | 🔵 Planned | Phase 7 |
| ADM-002 | Website Oversight & Moderation | View all tenant sites, review abuse reports, unpublish sites | 🔵 Planned | Phase 7 |
| ADM-003 | Template Marketplace Curation | Add, review, publish, and categorize public templates | 🔵 Planned | Phase 7 |
| ADM-004 | System Metrics & Health | Monitor publishing workers, queue latency, and storage usage | 🔵 Planned | Phase 7 |

---

## 3. Change Log of New Features
*Record new features as they are incorporated into the platform.*

| Date | Feature ID | Feature Name | Author | Notes |
| :--- | :--- | :--- | :--- | :--- |
| 2026-11-01 | SPEC-001 | Comprehensive Architecture & Feature Tracker Setup | Antigravity | Initialized baseline specifications in `Plan.md` and `features.md` |

