#!/bin/bash

echo "Setting up Site Management System..."

# Generate and apply Prisma migrations
echo "Generating Prisma migration..."
npx prisma migrate dev --name add_site_management_system

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Seed default templates and navigation
echo "Seeding default templates..."
npx tsx scripts/seed-templates.ts

echo "Site Management System setup complete!"
echo ""
echo "🎉 You can now:"
echo "1. Visit /admin/settings to configure your site"
echo "2. Customize colors, themes, and layout templates"
echo "3. Set up navigation menus"
echo "4. Configure localization settings"
echo ""
echo "The system includes:"
echo "✅ Global theme management"
echo "✅ Header/Footer templates"
echo "✅ Navigation system"
echo "✅ RTL/LTR support"
echo "✅ Multi-language ready"
echo "✅ Color customization"