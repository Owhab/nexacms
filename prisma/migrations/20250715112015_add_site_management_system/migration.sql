-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'AUTO');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('LTR', 'RTL');

-- CreateEnum
CREATE TYPE "MenuLocation" AS ENUM ('HEADER_PRIMARY', 'HEADER_SECONDARY', 'FOOTER_PRIMARY', 'FOOTER_SECONDARY', 'SIDEBAR');

-- CreateEnum
CREATE TYPE "LinkTarget" AS ENUM ('SELF', 'BLANK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "defaultProps" JSONB NOT NULL,
    "description" TEXT,

    CONSTRAINT "section_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "sectionTemplateId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "props" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "type" "MediaType" NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_config" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'My Website',
    "siteDescription" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#64748b',
    "accentColor" TEXT NOT NULL DEFAULT '#10b981',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "textColor" TEXT NOT NULL DEFAULT '#1f2937',
    "borderColor" TEXT NOT NULL DEFAULT '#e5e7eb',
    "theme" "Theme" NOT NULL DEFAULT 'LIGHT',
    "language" TEXT NOT NULL DEFAULT 'en',
    "direction" "Direction" NOT NULL DEFAULT 'LTR',
    "headerTemplateId" TEXT,
    "footerTemplateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "header_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "header_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_menus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" "MenuLocation" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_items" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "parentId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "pageId" TEXT,
    "target" "LinkTarget" NOT NULL DEFAULT 'SELF',
    "order" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "cssClass" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "context" TEXT,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "section_templates_id_key" ON "section_templates"("id");

-- CreateIndex
CREATE UNIQUE INDEX "section_templates_name_key" ON "section_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "section_templates_componentName_key" ON "section_templates"("componentName");

-- CreateIndex
CREATE UNIQUE INDEX "page_sections_pageId_order_key" ON "page_sections"("pageId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "media_url_key" ON "media"("url");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "navigation_items_menuId_order_key" ON "navigation_items"("menuId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "translations_language_key_key" ON "translations"("language", "key");

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_sectionTemplateId_fkey" FOREIGN KEY ("sectionTemplateId") REFERENCES "section_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_config" ADD CONSTRAINT "site_config_headerTemplateId_fkey" FOREIGN KEY ("headerTemplateId") REFERENCES "header_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_config" ADD CONSTRAINT "site_config_footerTemplateId_fkey" FOREIGN KEY ("footerTemplateId") REFERENCES "footer_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "navigation_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "navigation_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
