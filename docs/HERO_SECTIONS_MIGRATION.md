# Hero Sections Migration Guide

## Overview

This document provides comprehensive guidance for migrating from the legacy hero section system to the new expanded hero sections system with 10 variants.

## Migration Timeline

- **Legacy System**: Single `hero-section` component
- **New System**: 10 specialized hero variants with enhanced functionality
- **Migration Date**: Current deployment
- **Backward Compatibility**: 6 months (until next major version)

## What's New

### 10 Hero Variants

1. **Hero Centered** (`hero-centered`) - Traditional centered layout
2. **Hero Split Screen** (`hero-split-screen`) - Two-column layout
3. **Hero Video** (`hero-video`) - Video background with overlay
4. **Hero Minimal** (`hero-minimal`) - Clean, typography-focused
5. **Hero Feature** (`hero-feature`) - Feature highlighting
6. **Hero Testimonial** (`hero-testimonial`) - Social proof integration
7. **Hero Service** (`hero-service`) - Service-oriented layout
8. **Hero Product** (`hero-product`) - Product showcase
9. **Hero Gallery** (`hero-gallery`) - Image gallery with lightbox
10. **Hero CTA** (`hero-cta`) - Conversion-focused design

### Enhanced Features

- **Dynamic Component Loading**: Improved performance with code splitting
- **Advanced Theme Integration**: CSS variables and responsive design
- **Accessibility Compliance**: ARIA labels, keyboard navigation, screen reader support
- **Performance Optimization**: Lazy loading, WebP support, responsive images
- **Migration Utilities**: Automatic conversion from legacy sections

## Pre-Migration Checklist

### System Requirements

- [ ] Node.js 18+ installed
- [ ] Next.js 14+ configured
- [ ] React 18+ available
- [ ] TypeScript support enabled
- [ ] Tailwind CSS configured

### Database Backup

```sql
-- Create backup of existing sections
CREATE TABLE sections_backup AS 
SELECT * FROM sections WHERE type = 'hero-section';

-- Verify backup
SELECT COUNT(*) FROM sections_backup;
```

### Code Backup

```bash
# Create backup branch
git checkout -b backup/pre-hero-migration
git push origin backup/pre-hero-migration

# Return to main branch
git checkout main
```

## Migration Process

### Step 1: Install Dependencies

```bash
# Install required packages
npm install lucide-react@^0.400.0
npm install @testing-library/react@^16.3.0
npm install vitest@^1.0.4

# Install dev dependencies
npm install --save-dev @types/react@^18.3.3
npm install --save-dev typescript@^5.5.3
```

### Step 2: Run Migration Script

```bash
# Make script executable
chmod +x scripts/deploy-hero-sections.js

# Run deployment preparation
node scripts/deploy-hero-sections.js
```

### Step 3: Database Migration

```sql
-- Run the generated migration script
-- (Located in scripts/migrations/hero-sections-v2-[timestamp].sql)

BEGIN TRANSACTION;

-- Update existing hero sections
UPDATE sections 
SET 
    type = 'hero-centered',
    props = json_set(
        props,
        '$.variant', 'centered',
        '$.version', '2.0.0',
        '$.title', json_extract(props, '$.title'),
        '$.subtitle', json_extract(props, '$.subtitle'),
        '$.primaryButton', json_object(
            'text', json_extract(props, '$.buttonText'),
            'url', json_extract(props, '$.buttonLink'),
            'style', 'primary',
            'size', 'lg'
        )
    )
WHERE type = 'hero-section';

-- Add migration record
INSERT INTO migrations (name, executed_at, version) 
VALUES ('hero_sections_v2', datetime('now'), '2.0.0');

COMMIT;
```

### Step 4: Verify Migration

```bash
# Run tests to verify functionality
npm run test

# Run accessibility tests
npm run test:accessibility

# Build application
npm run build

# Start development server
npm run dev
```

## Property Mapping

### Legacy to New Format

| Legacy Property | New Property | Notes |
|----------------|--------------|-------|
| `title` | `title.text` | Now includes tag specification |
| `subtitle` | `subtitle.text` | Enhanced with semantic tags |
| `buttonText` | `primaryButton.text` | Part of button object |
| `buttonLink` | `primaryButton.url` | Enhanced with target options |
| `backgroundImage` | `background.image.url` | Enhanced media object |
| `textAlign` | `textAlign` | Unchanged |

### Example Migration

**Legacy Format:**
```json
{
  "type": "hero-section",
  "props": {
    "title": "Welcome to Our Site",
    "subtitle": "Amazing experiences await",
    "buttonText": "Get Started",
    "buttonLink": "/signup",
    "backgroundImage": "/hero-bg.jpg",
    "textAlign": "center"
  }
}
```

**New Format:**
```json
{
  "type": "hero-centered",
  "props": {
    "variant": "centered",
    "title": {
      "text": "Welcome to Our Site",
      "tag": "h1"
    },
    "subtitle": {
      "text": "Amazing experiences await",
      "tag": "h2"
    },
    "primaryButton": {
      "text": "Get Started",
      "url": "/signup",
      "style": "primary",
      "size": "lg",
      "target": "_self"
    },
    "background": {
      "type": "image",
      "image": {
        "url": "/hero-bg.jpg",
        "alt": "Hero background",
        "objectFit": "cover"
      }
    },
    "textAlign": "center"
  }
}
```

## Testing Migration

### Unit Tests

```bash
# Test hero components
npm run test -- lib/sections/hero

# Test specific variant
npm run test -- lib/sections/hero/variants/HeroCentered.test.tsx
```

### Integration Tests

```bash
# Test complete integration
npm run test -- lib/sections/hero/integration-test-complete.tsx

# Test registry integration
npm run test -- lib/sections/hero/integration-test-registry.tsx
```

### Manual Testing

1. **Section Library**: Verify all 10 variants appear
2. **Editor Functionality**: Test creating new hero sections
3. **Migration**: Verify existing sections still work
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Test with screen readers

## Troubleshooting

### Common Issues

#### 1. Missing Dependencies

**Error**: `Module not found: Can't resolve 'lucide-react'`

**Solution**:
```bash
npm install lucide-react@^0.400.0
```

#### 2. TypeScript Errors

**Error**: `Property 'variant' does not exist on type`

**Solution**: Update imports to use new types:
```typescript
import { HeroCenteredProps } from '@/lib/sections/hero/types'
```

#### 3. Migration Script Fails

**Error**: `Migration script execution failed`

**Solution**:
1. Check database connection
2. Verify backup exists
3. Run migration in transaction
4. Check for foreign key constraints

#### 4. Build Errors

**Error**: `Build failed with errors`

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Performance Issues

#### Slow Loading

**Symptoms**: Hero sections load slowly

**Solutions**:
1. Enable lazy loading:
```typescript
const HeroCentered = lazy(() => import('./variants/HeroCentered'))
```

2. Optimize images:
```bash
# Convert to WebP
npm install sharp
```

3. Use code splitting:
```typescript
// Dynamic imports in factory
const component = await import(`./variants/${variant}`)
```

## Rollback Procedure

If migration fails, follow these steps:

### 1. Database Rollback

```sql
BEGIN TRANSACTION;

-- Restore from backup
DELETE FROM sections WHERE type LIKE 'hero-%';
INSERT INTO sections SELECT * FROM sections_backup;

-- Remove migration record
DELETE FROM migrations WHERE name = 'hero_sections_v2';

COMMIT;
```

### 2. Code Rollback

```bash
# Switch to backup branch
git checkout backup/pre-hero-migration

# Force push to main (if necessary)
git checkout main
git reset --hard backup/pre-hero-migration
git push --force-with-lease origin main
```

### 3. Verify Rollback

```bash
# Test application
npm run test
npm run build
npm run dev
```

## Post-Migration Tasks

### 1. Update Documentation

- [ ] Update component documentation
- [ ] Create user guides for new variants
- [ ] Update API documentation

### 2. Training

- [ ] Train content editors on new variants
- [ ] Create video tutorials
- [ ] Update help documentation

### 3. Monitoring

- [ ] Monitor performance metrics
- [ ] Track error rates
- [ ] Monitor user adoption

### 4. Cleanup

After 30 days of successful operation:

```sql
-- Remove backup table
DROP TABLE sections_backup;
```

```bash
# Remove backup branch
git branch -D backup/pre-hero-migration
git push origin --delete backup/pre-hero-migration
```

## Support

### Getting Help

- **Documentation**: `/docs/hero-sections/`
- **Issues**: Create GitHub issue with `hero-migration` label
- **Emergency**: Contact development team immediately

### Useful Commands

```bash
# Check migration status
npm run test -- --grep "migration"

# Validate hero sections
node -e "console.log(require('./lib/sections/registry').validateHeroSectionIntegration())"

# Performance check
npm run build -- --analyze
```

## Appendix

### A. Complete Property Schema

See `lib/sections/hero/types.ts` for complete TypeScript definitions.

### B. Migration Script Template

```sql
-- Template for custom migrations
BEGIN TRANSACTION;

-- Your custom migration logic here
UPDATE sections 
SET props = json_set(props, '$.customProperty', 'customValue')
WHERE type = 'hero-centered' AND json_extract(props, '$.customCondition') = 'value';

COMMIT;
```

### C. Testing Checklist

- [ ] All 10 hero variants load correctly
- [ ] Section library shows all variants
- [ ] Existing sections migrated successfully
- [ ] New sections can be created
- [ ] Editors work for all variants
- [ ] Responsive design functions properly
- [ ] Accessibility features work
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Database migration completed

---

**Migration completed on**: [Date]  
**Version**: 2.0.0  
**Contact**: Development Team
## F
inal Verification Commands

```bash
# Verify all hero variants are registered
node -e "console.log(require('./lib/sections/registry').getHeroSections().length)"
# Expected output: 10

# Validate integration
node -e "console.log(require('./lib/sections/registry').validateHeroSectionIntegration())"
# Expected: { isValid: true, errors: [], warnings: [] }

# Check build
npm run build
# Expected: Successful build with no errors

# Run integration tests
npm run test -- lib/sections/hero/integration-test-complete.tsx
# Expected: All tests pass

# Test complete workflow
npm run test -- lib/sections/hero/integration-test-workflow.tsx
# Expected: All workflow steps pass

# Verify cross-browser compatibility
node scripts/test-cross-browser.js
# Expected: Compatibility report generated
```

## Deployment Verification

### Section Library UI Verification
1. **Open Section Library**: Navigate to admin panel and open section library
2. **Filter by Hero**: Select "Hero" category
3. **Verify All Variants**: Confirm all 10 hero variants are displayed:
   - 🎯 Hero Centered
   - 📱 Hero Split Screen  
   - 🎥 Hero Video
   - ✨ Hero Minimal
   - ⚡ Hero Feature
   - 💬 Hero Testimonial
   - 🏢 Hero Service
   - 🛍️ Hero Product
   - 🖼️ Hero Gallery
   - 🎯 Hero CTA
4. **Test Filtering**: Use hero-specific filters to verify categorization
5. **Test Search**: Search for specific variants by name

### Complete Workflow Verification
1. **Select Section**: Choose a hero variant from library
2. **Editor Loading**: Verify editor loads with correct fields
3. **Preview Generation**: Confirm preview updates in real-time
4. **Save Section**: Test saving section configuration
5. **Page Rendering**: Verify section renders correctly on page
6. **Theme Integration**: Test with different themes
7. **Responsive Design**: Test on mobile, tablet, desktop

### Performance Verification
1. **Load Times**: Verify section library loads quickly
2. **Component Loading**: Test dynamic component loading
3. **Image Optimization**: Verify images load efficiently
4. **Cache Performance**: Check factory caching works
5. **Bundle Size**: Confirm no significant size increase

## Post-Deployment Monitoring

### Key Metrics to Monitor
- **Section Creation Rate**: Track usage of new hero variants
- **Performance Metrics**: Monitor page load times and component loading
- **Error Rates**: Watch for any new errors or issues
- **User Adoption**: Track which variants are most popular

### Monitoring Commands
```bash
# Check application health
curl -f http://localhost:3000/api/health

# Monitor error logs
tail -f logs/application.log | grep -i error

# Check database migration status
SELECT * FROM migrations WHERE name = 'hero_sections_v2';
```

---

**Migration completed successfully** ✅  
**All 10 hero variants deployed and operational** 🚀  
**Ready for production use** 🎉