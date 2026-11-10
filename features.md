# Platform Features Tracker (`features.md`)

This document tracks all features planned, currently in development, and implemented in the No-Code Website Builder SaaS Platform. Whenever new features are introduced or added to the platform, update this file accordingly.

---

## 1. Feature Status Summary

| Status Indicator | Meaning | Count |
| :--- | :--- | :---: |
| 🟢 **Implemented** | Built, verified, and available in the current codebase | **33** |
| 🟡 **In Progress** | Currently under active development | **2** |
| 🔵 **Planned** | Detailed in specification, scheduled for implementation | **30** |
| ⚪ **Backlog** | Future enhancement candidate | **15** |

---

## 2. Core Modules & Feature Registry

### Module 1: Authentication & User Management
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| AUTH-001 | User Email/Password UI | Sign in and register forms with client routing | 🟢 Implemented | Phase 1 |
| AUTH-002 | JWT Session Management | Stateless secure authentication via DRF SimpleJWT | 🟢 Implemented | Phase 1 |
| AUTH-003 | Google / OAuth SSO UI | Social login buttons integrated on auth views | 🟢 Implemented | Phase 1 |
| AUTH-004 | Password Reset Flow | Tokenized email password reset workflow | 🔵 Planned | Phase 2 |
| AUTH-005 | Role-Based Access Control | Granular roles: Owner, Admin, Editor, Viewer | 🔵 Planned | Phase 2 |

---

### Module 2: Dashboard & Project Management
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| DASH-001 | Website Projects Grid | View all user websites with status indicators (Draft, Published) | 🟢 Implemented | Phase 1 |
| DASH-002 | Create Website Options | Choice of starting from Blank, Template, or AI Prompt | 🟢 Implemented | Phase 1 |
| DASH-003 | Project Duplicate & Clone | Clone existing projects with all pages and asset links | 🟢 Implemented | Phase 1 |
| DASH-004 | Project Search & Filter | In-dashboard instant search by site name and status | 🟢 Implemented | Phase 1 |
| WS-001 | Workspace Folders Model & API | Django Workspace model with custom icons, colors, website relations | 🟢 Implemented | Phase 1 |
| WS-002 | Workspace Categorization UI | Create folders, filter websites by folder, and move sites between folders | 🟢 Implemented | Phase 1 |
| TMPL-001 | Unified Website Creation Wizard | 2-step creation flow for Blank vs Templates with Workspace target | 🟢 Implemented | Phase 1 |
| DASH-005 | Storage & Plan Quota Usage | Real-time usage indicators for assets and active sites | 🔵 Planned | Phase 2 |

---

### Module 3: Visual Canvas & Drag-and-Drop Engine
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| DND-001 | Component Tree Schema Engine | Normalized JSON tree representation of nodes and relationships | 🟢 Implemented | Phase 1 |
| DND-002 | Sidebar Component Insertion | 1-click insertion into selected container or root with defaults | 🟢 Implemented | Phase 1 |
| DND-003 | In-Canvas Reordering | Reorder siblings and move elements across parent containers | 🟢 Implemented | Phase 1 |
| DND-004 | Element Selection & Actions | Highlight active element, badge floating controls (duplicate/delete) | 🟢 Implemented | Phase 1 |
| DND-005 | Transform & Resize Handles | 8-point Canva-style bounding box handles with aspect ratio lock | 🟢 Implemented | Phase 1 |
| DND-006 | Rulers & Smart Guides | Distance measurement markers and snap-to-grid alignment guides | 🔵 Planned | Phase 2 |
| DND-007 | Undo / Redo History Stack | 40-step immutable state snapshot stack with keyboard shortcut bindings | 🟢 Implemented | Phase 1 |
| DND-008 | Keyboard Shortcuts Engine | Copy (`Ctrl+C`), Paste (`Ctrl+V`), Undo (`Ctrl+Z`), Redo (`Ctrl+Y`), `?` modal | 🟢 Implemented | Phase 1 |
| DND-009 | Breadcrumbs Hierarchy Bar | Live bottom breadcrumbs allowing easy traversal to parent nodes | 🟢 Implemented | Phase 1 |
| DND-010 | Sidebar-to-Canvas Drag & Drop | Drag elements from catalog directly into sections/containers | 🟢 Implemented | Phase 1 |
| DND-011 | In-Canvas Node Drag & Reparenting | Drag on-canvas nodes to reorder or move across containers | 🟢 Implemented | Phase 1 |
| DND-012 | Arrow Keys Movement & Nudging | 1px nudge, 10px Shift nudge, Ctrl+Arrow sibling reordering, HUD pill | 🟢 Implemented | Phase 1 |
| DND-013 | Canva Floating Contextual Bar | Floating action bar on selected element (Move, Nudge, Lock, Duplicate, Delete) | 🟢 Implemented | Phase 1 |

---

### Module 4: Top Toolbar & Viewport Controls
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| TOOL-001 | Viewport Mode Switcher | Switch between Desktop (1440px), Tablet (768px), Mobile (375px) | 🟢 Implemented | Phase 1 |
| TOOL-002 | Zoom & Scale Controls | Canvas zoom (25% - 200%) and instant 100% reset | 🟢 Implemented | Phase 1 |
| TOOL-003 | Save Status Indicator | Live save state (Saved, Saving, Unsaved changes) | 🟢 Implemented | Phase 1 |
| TOOL-004 | Live Preview Mode | Fullscreen interactive preview without editor chrome | 🟢 Implemented | Phase 1 |
| TOOL-005 | Publish Action Modal | Deploy to subdomain, custom domain, or live instant publish | 🟢 Implemented | Phase 1 |

---

### Module 5: Component Library (Basic, Layout, Navigation, Media)
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| COMP-001 | Typography Components | Heading (H1-H6) and Paragraph with inline text editing | 🟢 Implemented | Phase 1 |
| COMP-002 | Media Components | Responsive Image with alt tags and URL picker | 🟢 Implemented | Phase 1 |
| COMP-003 | Action & UI Components | Button, Link, Divider, Spacer | 🟢 Implemented | Phase 1 |
| COMP-004 | Layout Containers | Section, Container, 2-Column Grid, 3-Column Grid | 🟢 Implemented | Phase 1 |
| COMP-005 | Navigation Primitives | Navbar, Mobile Drawer Menu, Brand Logo, CTA Button | 🟢 Implemented | Phase 1 |
| COMP-006 | Interactive Widgets | Accordion, Tabs, Modal/Popup, Carousel, Lightbox, Counters | 🔵 Planned | Phase 3 |
| COMP-007 | Pre-built Business Blocks | Hero variants, Features 3-Card Grid, Dark CTA, Clean Footer | 🟢 Implemented | Phase 1 |
| COMP-008 | Lucide Vector Icon System | Native SVG icon integration with dynamic size, color, name inspector | 🟢 Implemented | Phase 1 |
| DSGN-001 | Human-Craft Production Design | High-fidelity Linear/Stripe aesthetic, realistic metrics, zero AI emojis | 🟢 Implemented | Phase 1 |

---

### Module 6: Properties Inspector & Styling Engine
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| PROP-001 | Layout & Flexbox/Grid Controls | Direction (Row/Col), Align items, Justify content, Gap | 🟢 Implemented | Phase 1 |
| PROP-002 | Spacing Visual Box Model | Interactive margin and padding editor with 4-side controls | 🟢 Implemented | Phase 1 |
| PROP-003 | Typography Controls | Font size, weight, text color picker, text alignment (4 modes) | 🟢 Implemented | Phase 1 |
| PROP-004 | Color & Background Picker | Background color picker, hex input, opacity | 🟢 Implemented | Phase 1 |
| PROP-005 | Borders, Radii & Shadows | Corner radius slider (0-50px), border width/color, shadow presets | 🟢 Implemented | Phase 1 |
| PROP-006 | Responsive Overrides Engine | Breakpoint-specific style overrides without duplicating DOM | 🟢 Implemented | Phase 1 |
| PROP-007 | Global Design System Tokens | Global palette, font tokens, and automatic cascade updates | 🟢 Implemented | Phase 1 |

---

### Module 7: Layers & Page Management
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| LAY-001 | Tree-View Layers Panel | Hierarchical visual tree with node expansion and selection | 🟢 Implemented | Phase 1 |
| LAY-002 | Layer Duplicate & Delete | Rapid node duplication with automatic ID reminting | 🟢 Implemented | Phase 1 |
| LAY-003 | Lock, Hide, Rename Layers | Lock modifications, toggle canvas visibility, custom naming | 🟢 Implemented | Phase 1 |
| PAGE-001 | Multi-Page Manager | Create, duplicate, reorder, delete, and manage page routes | 🟢 Implemented | Phase 1 |
| PAGE-002 | Page SEO Settings | Title, meta description, canonical URL, OpenGraph thumbnail | 🟢 Implemented | Phase 1 |

---

### Module 8: AI Website Generator Module
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| AI-001 | Prompt-to-Website Engine | Natural language description to multi-page JSON component tree | 🔵 Planned | Phase 2 |
| AI-002 | Prompt-to-Section Engine | In-editor prompt to insert customized sections (Pricing, Features) | 🟢 Implemented | Phase 1 |
| AI-003 | Backend AI Synthesis API | Django REST endpoint generating validated component JSON | 🟢 Implemented | Phase 1 |
| AI-004 | AI SEO Meta Assistant | Automatic generation of SEO titles and descriptions | 🔵 Planned | Phase 2 |

---

### Module 9: Backend Modular Monolith
| Feature ID | Feature Name | Description | Status | Added / Target |
| :--- | :--- | :--- | :---: | :--- |
| BK-001 | Django Project Core & Config | Multi-setting modular monolith with CORS and DRF JWT | 🟢 Implemented | Phase 1 |
| BK-002 | Websites & Pages API | Full REST API with JSONField component trees and publish action | 🟢 Implemented | Phase 1 |
| BK-003 | Templates Marketplace API | Category-filtered template catalog API endpoints | 🟢 Implemented | Phase 1 |
| BK-004 | AI Generator API | Natural language prompt synthesis endpoint | 🟢 Implemented | Phase 1 |

---

## 3. Change Log of New Features

| Date | Feature ID | Feature Name | Author | Notes |
| :--- | :--- | :--- | :--- | :--- |
| 2026-11-01 | SPEC-001 | Master Architecture & Tracking Setup | Antigravity | Created `Plan.md`, `features.md`, and `bugs.md` |
| 2026-11-01 | FE-001 | Visual Studio Canvas & Toolbar | Antigravity | Built responsive canvas with breakpoints, zoom, breadcrumbs |
| 2026-11-01 | FE-002 | Full Inspector & Box Model Engine | Antigravity | Visual margin/padding box model, typography, flex/grid controls |
| 2026-11-01 | FE-003 | Layers Hierarchy & Global Design System | Antigravity | Interactive tree view, lock/hide/duplicate, theme tokens |
| 2026-11-01 | FE-004 | Dashboard & Template Marketplace Pages | Antigravity | Next.js App Router dashboard, templates gallery, auth screens |
| 2026-11-01 | BK-001 | Django Modular Monolith Setup | Antigravity | Websites, Pages, Templates, and AI Generator backend modules |
