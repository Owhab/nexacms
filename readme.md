-----

## Product Requirements Document: NexaCMS

**Version:** 1.1
**Date:** June 27, 2025

-----

## 1\. Introduction

### 1.1 Purpose

This document outlines the requirements for NexaCMS, a modern, robust, scalable, and secure Content Management System (CMS) with a Shopify-like page builder interface. The primary goal is to empower users of varying permission levels to easily create, manage, and publish content-rich websites without requiring extensive technical knowledge, focusing on a visual drag-and-drop experience for page composition.

### 1.2 Scope

NexaCMS will consist of two main components:

1.  **Admin Dashboard (CMS Backend):** A secure web application for **content administrators, editors, and other defined roles** to manage pages, sections, media, users, and global settings.
2.  **Storefront/Public-Facing Website (CMS Frontend):** A dynamic rendering engine that displays the content created and managed through the Admin Dashboard to end-users.

This PRD focuses on the core functionalities of a page builder CMS. E-commerce functionalities (product management, cart, checkout, payments) are explicitly *out of scope* for this version.

### 1.3 Target Audience

  * Small to medium businesses requiring a flexible and easy-to-use website builder.
  * Marketing teams needing to quickly launch landing pages or content hubs.
  * Designers and developers looking for a headless CMS with a powerful visual editor for their clients.
  * Content creators without coding experience.

### 1.4 Goals

  * **Empowerment:** Enable non-technical users to build and manage sophisticated web pages, with appropriate access levels for different roles.
  * **Flexibility:** Offer a wide range of customizable content sections.
  * **Speed:** Accelerate website creation and content updates.
  * **Performance:** Deliver fast-loading pages on the public-facing site.
  * **Security:** Protect user data and prevent unauthorized access based on roles and permissions.
  * **Scalability:** Support growth in content volume and user traffic.
  * **Modern UX:** Provide an intuitive and delightful user experience in the page builder.

### 1.5 Non-Goals

  * E-commerce product catalog, shopping cart, checkout, payment gateway integration.
  * Advanced CRM features.
  * Multi-language support (localization/internationalization beyond content).
  * Built-in analytics beyond basic page views.
  * User-generated content (comments, forums).

## 2\. User Stories

### 2.1 Admin Users (Content Creators/Editors/Admins)

  * **Page Management:**
      * As an **Admin**, I want to create a new page so I can start building new content.
      * As an **Editor**, I want to create a new page so I can start building new content.
      * As an **Admin** or **Editor**, I want to define a page's URL slug, so it's SEO-friendly and accessible.
      * As an **Admin** or **Editor**, I want to set a page's SEO title and description, so it ranks well in search engines.
      * As an **Editor**, I want to save a page as a **Draft** so I can continue working on it later or submit for review.
      * As an **Admin**, I want to change a page's status (**Draft, Published, Scheduled**) so I can control its visibility.
      * As an **Admin**, I want to delete a page, so I can remove outdated content.
      * As an **Admin** or **Editor**, I want to duplicate an existing page, so I can quickly create similar content.
  * **Page Builder (Sections):**
      * As an **Admin** or **Editor**, I want to see a library of available content sections, so I know what I can add to my page.
      * As an **Admin** or **Editor**, I want to drag and drop sections onto my page, so I can easily arrange content.
      * As an **Admin** or **Editor**, I want to reorder sections on a page, so I can adjust the layout.
      * As an **Admin** or **Editor**, I want to delete a section from a page, so I can remove unwanted elements.
      * As an **Admin** or **Editor**, I want to click on a section on the canvas to edit its properties, so I can customize its appearance and content.
      * As an **Admin** or **Editor**, I want a rich text editor within text-based sections, so I can format my content effectively.
      * As an **Admin** or **Editor**, I want to select images from the media library or upload new ones for image-based sections.
      * As an **Admin** or **Editor**, I want to preview my page in real-time as I make changes, so I can see how it will look to visitors.
  * **Media Management:**
      * As an **Admin** or **Editor**, I want to upload image files to the CMS, so I can use them in my pages.
      * As an **Admin** or **Editor**, I want to view all uploaded media in a centralized library, so I can easily find and reuse assets.
      * As an **Admin**, I want to delete media files from the library, so I can manage storage.
      * As an **Admin** or **Editor**, I want to associate alt text with images for accessibility and SEO.
  * **User Management:**
      * As an **Admin**, I want to create, edit, and delete other admin users, so I can manage team access.
      * As an **Admin**, I want to assign roles (e.g., Admin, Editor, Viewer) to users, so I can control their permissions.
  * **Settings:**
      * As an **Admin**, I want to configure global site settings (e.g., site name, logo), so they apply across the entire website.
  * **Security:**
      * As any CMS user, I want to log in securely, so only authorized users can access the CMS.
      * As any CMS user, I want to change my password.

### 2.2 Public Website Visitors

  * As a visitor, I want to view web pages quickly and without errors.
  * As a visitor, I want to see a well-structured and visually appealing website.
  * As a visitor, I want page content to be accessible and readable on various devices (responsive design).

## 3\. Functional Requirements

### 3.1 Core CMS Functionality

#### 3.1.1 Page Management

  * **FR-1.1.1:** The system SHALL allow **`ADMIN` and `EDITOR`** users to create new pages.
  * **FR-1.1.2:** Each page SHALL have a unique, editable URL slug (e.g., `/about-us`, `/contact`).
  * **FR-1.1.3:** Pages SHALL support SEO metadata: Title, Description, Keywords.
  * **FR-1.1.4:** Pages SHALL have a status: `DRAFT`, `PUBLISHED`, `SCHEDULED`.
  * **FR-1.1.5:** The system SHALL allow **`ADMIN` and `EDITOR`** users to save pages as `DRAFT` for later editing.
  * **FR-1.1.6:** The system SHALL allow **`ADMIN`** users to `PUBLISH` pages immediately, making them live on the storefront.
  * **FR-1.1.7:** The system SHALL allow **`ADMIN`** users to `SCHEDULE` pages for future publication at a specific date/time.
  * **FR-1.1.8:** The system SHALL allow **`ADMIN` and `EDITOR`** users to edit existing pages.
  * **FR-1.1.9:** The system SHALL allow **`ADMIN`** users to delete pages.
  * **FR-1.1.10:** The system SHALL list all pages in the admin dashboard with their title, slug, status, and last modified date, accessible to **`ADMIN` and `EDITOR`**. **`VIEWER`** users can only view.

#### 3.1.2 Page Builder (Sections)

  * **FR-1.2.1:** The system SHALL provide a library of pre-defined, reusable content "sections" (e.g., Hero, Image & Text, Call to Action, Testimonials, Rich Text Block, Spacer, Video Embed).
  * **FR-1.2.2:** Each section template SHALL have a unique identifier and configurable properties (props).
  * **FR-1.2.3:** The page editor SHALL display a visual representation of the page, composed of its sections, accessible to **`ADMIN` and `EDITOR`**.
  * **FR-1.2.4:** **`ADMIN` and `EDITOR`** users SHALL be able to add new sections to a page from the section library.
  * **FR-1.2.5:** **`ADMIN` and `EDITOR`** users SHALL be able to reorder sections on a page using drag-and-drop or similar intuitive mechanism.
  * **FR-1.2.6:** **`ADMIN` and `EDITOR`** users SHALL be able to delete individual sections from a page.
  * **FR-1.2.7:** When a section is selected, an intuitive properties panel SHALL appear, allowing **`ADMIN` and `EDITOR`** users to edit its content and style properties.
  * **FR-1.2.8:** The properties panel SHALL dynamically render appropriate input fields based on the section's defined props (e.g., text input for heading, rich text editor for body, image selector for images, color picker for background color, dropdown for layout variations).
  * **FR-1.2.9:** Rich text input fields SHALL provide basic formatting options (bold, italic, lists, links, headings).
  * **FR-1.2.10:** The page editor SHALL provide a real-time visual preview of changes made to sections.

#### 3.1.3 Media Management

  * **FR-1.3.1:** The system SHALL allow **`ADMIN` and `EDITOR`** users to upload image files (JPG, PNG, WebP, GIF) to the media library.
  * **FR-1.3.2:** Each uploaded image SHALL have associated metadata (filename, URL, alt text, upload date).
  * **FR-1.3.3:** The system SHALL provide a centralized media library accessible from the admin dashboard and within section property editors for **`ADMIN` and `EDITOR`**. **`VIEWER`** users can only view the library.
  * **FR-1.3.4:** The media library SHALL display thumbnails of images.
  * **FR-1.3.5:** **`ADMIN` and `EDITOR`** users SHALL be able to select existing images from the media library for use in page sections.
  * **FR-1.3.6:** The system SHALL allow **`ADMIN`** users to delete images from the media library.
  * **FR-1.3.7:** The system SHALL handle image optimization (resizing, compression) on upload or dynamically on delivery for performance.

#### 3.1.4 User Management (Admin Dashboard)

  * **FR-1.4.1:** The system SHALL support the following user roles:
      * **`ADMIN`**: Full access to all CMS features, including user management, settings, and publishing content.
      * **`EDITOR`**: Can create, edit, and manage pages and media, but cannot publish content or manage users/settings. Can save pages as `DRAFT`.
      * **`VIEWER`**: Can only view pages, media, and settings within the Admin Dashboard (read-only access). Cannot make any changes.
  * **FR-1.4.2:** Users with **`ADMIN`** role SHALL be able to create, view, edit, and delete other admin users.
  * **FR-1.4.3:** Users with **`ADMIN`** role SHALL be able to assign roles to other users.
  * **FR-1.4.4:** All user passwords SHALL be securely hashed and salted.
  * **FR-1.4.5:** The user management interface SHALL only be accessible to **`ADMIN`** users.

#### 3.1.5 Global Settings

  * **FR-1.5.1:** The system SHALL allow **`ADMIN`** users to configure global site settings (e.g., site title, default favicon, default logo, primary brand color).
  * **FR-1.5.2:** These global settings SHALL be accessible by the storefront application.
  * **FR-1.5.3:** The settings interface SHALL only be accessible to **`ADMIN`** users for modification. **`VIEWER`** users can view these settings.

### 3.2 Public-Facing Website (Storefront) Functionality

  * **FR-2.1:** The storefront SHALL dynamically render pages based on their URL slug.
  * **FR-2.2:** The storefront SHALL fetch page content (sections and their props) from the CMS API.
  * **FR-2.3:** The storefront SHALL render appropriate React components for each section type, using the `props` data for customization.
  * **FR-2.4:** The storefront SHALL be fully responsive and adapt to various screen sizes (desktop, tablet, mobile).
  * **FR-2.5:** The storefront SHALL implement client-side routing for smooth navigation between pages.
  * **FR-2.6:** Pages with a `DRAFT` status SHALL NOT be accessible on the public storefront.
  * **FR-2.7:** Pages with a `SCHEDULED` status SHALL only become accessible on the public storefront at their designated `publishedAt` time.
  * **FR-2.8:** The storefront SHALL display appropriate SEO metadata (title, description) based on the page's configuration.

## 4\. Non-Functional Requirements

### 4.1 Performance

  * **NFR-4.1.1 (Admin Dashboard):** Page load times in the Admin Dashboard SHALL be under 2 seconds for typical data sets.
  * **NFR-4.1.2 (Storefront):** Public-facing pages SHALL achieve a Core Web Vitals LCP (Largest Contentful Paint) score of under 2.5 seconds.
  * **NFR-4.1.3 (Storefront):** Public-facing pages SHALL achieve a Core Web Vitals FID (First Input Delay) score of under 100 milliseconds.
  * **NFR-4.1.4 (Storefront):** Public-facing pages SHALL achieve a Core Web Vitals CLS (Cumulative Layout Shift) score of under 0.1.
  * **NFR-4.1.5:** Image loading on the storefront SHALL be optimized (lazy loading, responsive images).
  * **NFR-4.1.6:** API response times SHALL be consistently under 200ms for read operations and under 500ms for write operations under normal load.

### 4.2 Scalability

  * **NFR-4.2.1:** The backend API SHALL be designed to horizontally scale to handle increased concurrent users and data volume.
  * **NFR-4.2.2:** The database (PostgreSQL) SHALL be optimized with appropriate indexing for common queries.
  * **NFR-4.2.3:** The frontend (Next.js) SHALL leverage SSR/SSG capabilities where appropriate to improve performance and reduce server load for content that changes infrequently.
  * **NFR-4.2.4:** Media storage SHALL be extensible to handle large volumes of uploaded files (e.g., integration with S3-compatible storage).

### 4.3 Security

  * **NFR-4.3.1:** All communication between frontend and backend SHALL be over HTTPS.
  * **NFR-4.3.2:** User authentication SHALL use industry-standard practices (e.g., JWTs with secure storage).
  * **NFR-4.3.3:** Passwords SHALL be securely hashed using a strong, modern algorithm (e.g., bcrypt) with a high cost factor.
  * **NFR-4.3.4:** The API SHALL implement **role-based access control (RBAC)** to ensure users can only access resources and perform actions authorized by their role.
  * **NFR-4.3.5:** All user inputs (frontend and backend) SHALL be properly validated and sanitized to prevent XSS, SQL injection, and other common vulnerabilities.
  * **NFR-4.3.6:** The system SHALL implement rate limiting on authentication endpoints to mitigate brute-force attacks.
  * **NFR-4.3.7:** The system SHALL include robust error handling to avoid exposing sensitive information in error messages.
  * **NFR-4.3.8:** Sensitive configuration data (e.g., database credentials, API keys) SHALL be stored securely using environment variables.

### 4.4 Usability & User Experience (UX)

  * **NFR-4.4.1:** The Admin Dashboard SHALL be intuitive and easy to navigate for users with varying technical proficiencies.
  * **NFR-4.4.2:** The page builder interface SHALL be highly visual and provide clear feedback on user actions.
  * **NFR-4.4.3:** Error messages and success notifications SHALL be clear, concise, and actionable.
  * **NFR-4.4.4:** The entire CMS (admin and storefront) SHALL be fully responsive and usable across different devices and screen sizes.
  * **NFR-4.4.5:** The design SHALL be clean, modern, and aesthetically pleasing, leveraging Tailwind CSS and Shadcn UI principles.

### 4.5 Reliability & Maintainability

  * **NFR-4.5.1:** The system SHALL have comprehensive unit and integration tests covering critical functionalities.
  * **NFR-4.5.2:** The codebase SHALL adhere to consistent coding standards (ESLint, Prettier).
  * **NFR-4.5.3:** Database schema changes SHALL be managed via migrations (Prisma Migrate).
  * **NFR-4.5.4:** Logging SHALL be implemented to track system events and errors, aiding in debugging and monitoring.
  * **NFR-4.5.5:** Dependencies SHALL be regularly updated to patch security vulnerabilities and utilize latest features.

### 4.6 Technology Stack

  * **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL.
  * **Frontend:** React, Next.js, Tailwind CSS, Shadcn UI.
  * **Authentication:** JWT.
  * **File Storage:** Local disk storage initially, with clear path for S3-compatible cloud storage.
  * **Rich Text Editor:** A robust, open-source rich text editor component (e.g., TinyMCE, Tiptap, BlockNote).
  * **Drag & Drop:** A React-compatible drag-and-drop library (e.g., `dnd-kit`, `react-beautiful-dnd`).

## 5\. System Architecture (High-Level)

  * **Client (Admin Dashboard):** Next.js application (React, Shadcn UI, Tailwind CSS)
      * Communicates with the Backend API via RESTful calls.
      * Manages UI state for the page builder.
  * **Client (Storefront):** Next.js application (React, Tailwind CSS)
      * Fetches page data from the Backend API.
      * Dynamically renders React components based on section definitions.
      * Utilizes Next.js features like SSR/SSG for performance.
  * **Backend API:** Node.js (Express.js)
      * Exposes RESTful endpoints for CRUD operations on pages, sections, media, users, settings.
      * Handles authentication (JWT), **authorization (RBAC based on roles)**.
      * Manages file uploads.
      * Communicates with the database via Prisma.
  * **Database:** PostgreSQL
      * Stores all structured data (pages, sections, users, media metadata, settings).
  * **File Storage:** Local file system (for images), with future consideration for S3-compatible cloud storage (AWS S3, DigitalOcean Spaces, MinIO).

<!-- end list -->

```mermaid
graph TD
    A[Admin Dashboard - Next.js/React] -->|REST API (Auth, RBAC)| B(Backend API - Node.js/Express)
    C[Storefront - Next.js/React] -->|REST API| B

    B --> D[PostgreSQL Database]
    B --> E[File Storage - Local/S3]
```

## 6\. Data Model (High-Level Prisma Schema)

```
// schema.prisma (conceptual)
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  role         UserRole  @default(EDITOR) // Default role for new admin users
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  Media        Media[]
}

enum UserRole {
  ADMIN   // Full access: user management, publishing, settings, content creation/editing, media deletion
  EDITOR  // Content management: create, edit pages/sections, upload media. Cannot publish, manage users/settings, or delete media.
  VIEWER  // Read-only access to all admin dashboard content (pages, media, settings)
}

model Page {
  id            String         @id @default(uuid())
  title         String
  slug          String         @unique // e.g., /about-us
  status        PageStatus     @default(DRAFT)
  seoTitle      String?
  seoDescription String?
  seoKeywords   String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  publishedAt   DateTime?
  sections      PageSection[]
}

enum PageStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
}

model SectionTemplate {
  id             String        @id @unique // e.g., "HeroSection", "ImageTextBlock"
  name           String        @unique // Human-readable name
  componentName  String        @unique // Maps to React component name on frontend
  defaultProps   Json          // Default JSON structure for props
  description    String?
  PageSection    PageSection[]
}

model PageSection {
  id                String          @id @default(uuid())
  pageId            String
  sectionTemplateId String
  order             Int             // Order of section on the page
  props             Json            // JSON blob for section-specific config (e.g., { "heading": "Welcome", "imageUrl": "..." })
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  page              Page            @relation(fields: [pageId], references: [id], onDelete: Cascade)
  sectionTemplate   SectionTemplate @relation(fields: [sectionTemplateId], references: [id])

  @@unique([pageId, order]) // Ensure unique order per page
}

model Media {
  id         String   @id @default(uuid())
  url        String   @unique
  altText    String?
  type       MediaType
  uploadedBy String
  uploader   User     @relation(fields: [uploadedBy], references: [id])
  createdAt  DateTime @default(now())
}

enum MediaType {
  IMAGE
  VIDEO
  DOCUMENT
}

model Setting {
  id    String @id @default(uuid())
  key   String @unique
  value String // JSON string if value is complex
}
```

## 7\. Future Considerations / Phase 2 Features

  * **Version History/Revisions:** Ability to revert pages to previous saved states.
  * **Content Approval Workflow:** For `EDITOR` to submit `DRAFT` pages for `ADMIN` review before publishing.
  * **Custom CSS/JS:** Option to add custom code per page or globally (with caution).
  * **Theming Options:** More granular control over fonts, color palettes.
  * **Custom Domain Mapping:** Allow users to connect their own domains.
  * **Forms Builder:** Basic form creation and submission management.
  * **Multi-language Support:** For both admin and storefront content.
  * **Webhooks:** To trigger external services on content changes.
  * **SSG/Revalidation:** More sophisticated Next.js SSG with on-demand revalidation for static content.
  * **Content Types:** Beyond pages, allow custom content types (e.g., blog posts, testimonials).
  * **Integration with Third-Party Analytics:** Simplified setup for Google Analytics, etc.

## 8\. Development Timeline (High-Level Estimate)

  * **Phase 1: Foundation (4-6 weeks)**
      * Backend: Core APIs (Auth, Users with Roles, Pages, SectionTemplates, Media), Basic Prisma setup, DB schema.
      * Frontend: Admin Dashboard layout, Login/Auth flow, Page Listing with role-based visibility.
  * **Phase 2: Page Builder Core (6-8 weeks)**
      * Backend: `PageSection` CRUD, JSON `props` handling, **RBAC enforcement on Page and Media APIs**.
      * Frontend: Page Editor canvas, Section Library, Drag-and-drop, Basic Properties Panel, Media integration in editor, Storefront dynamic renderer, **UI elements disabled/hidden based on user role**.
  * **Phase 3: Refinement & Non-Functional (3-4 weeks)**
      * Backend: Image optimization, advanced API validation, logging.
      * Frontend: Rich text editor integration, responsive design polish, SEO settings in UI, **fine-tuning role-based UI/UX**.
      * Testing: Extensive unit/integration tests, **security tests for RBAC**.
      * Deployment: Initial CI/CD setup, production deployment.
  * **Phase 4: Polish & Small Enhancements (2 weeks)**
      * UX/UI tweaks, bug fixes, final review.

**Total Estimated Time:** 15-20 weeks (approx. 4-5 months) for a fully functional v1.0. This is a robust estimate for a small dedicated team.

## 9\. Success Metrics

  * **User Adoption:** Number of pages created and published across different roles.
  * **User Satisfaction:** Feedback on ease of use of the page builder for each role.
  * **Performance:** Achieving target Core Web Vitals scores for public pages.
  * **Stability:** Low bug count, high uptime.
  * **Security Audits:** Passing basic security checks, **especially on role-based access control**.

-----