# Hero Sections Deployment Checklist

## Pre-deployment Validation
- [x] Hero sections structure validated
- [x] Section library UI updated with all 10 variants
- [x] Cross-browser compatibility tested
- [x] Integration tests created
- [x] Migration script generated
- [x] Deployment documentation created

## Deployment Steps

### 1. **Backup Current System**
- [ ] Create database backup
  ```sql
  -- Create backup of existing sections
  CREATE TABLE sections_backup AS 
  SELECT * FROM sections WHERE type = 'hero-section';
  
  -- Verify backup
  SELECT COUNT(*) FROM sections_backup;
  ```
- [ ] Backup current codebase
  ```bash
  git checkout -b backup/pre-hero-migration
  git push origin backup/pre-hero-migration
  ```
- [ ] Document current hero section configurations

### 2. **Deploy New Code**
- [ ] Deploy application build to staging
  ```bash
  npm run build
  npm run deploy:staging
  ```
- [ ] Update section templates in database
  ```bash
  npx tsx scripts/update-section-templates.ts
  ```
- [ ] Run migration script on staging database
  ```sql
  -- Run the generated migration script
  -- (Located in scripts/migrations/hero-sections-v2-[timestamp].sql)
  ```
- [ ] Verify hero sections functionality in staging
- [ ] Test section library UI shows all 10 variants
- [ ] Verify all hero variants are working:
  - [ ] Hero Centered (🎯)
  - [ ] Hero Split Screen (📱)
  - [ ] Hero Video (🎥)
  - [ ] Hero Minimal (✨)
  - [ ] Hero Feature (⚡)
  - [ ] Hero Testimonial (💬)
  - [ ] Hero Service (🏢)
  - [ ] Hero Product (🛍️)
  - [ ] Hero Gallery (🖼️)
  - [ ] Hero CTA (🎯)

### 3. **Production Deployment**
- [ ] Deploy to production environment
  ```bash
  npm run deploy:production
  ```
- [ ] Run migration script on production database
- [ ] Monitor application performance
- [ ] Verify hero sections are rendering correctly
- [ ] Test section creation and editing workflow

### 4. **Post-deployment Verification**
- [ ] All hero variants accessible in section library
- [ ] Existing hero sections migrated successfully
- [ ] New hero sections can be created and edited
- [ ] Performance metrics within acceptable range
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility verified
- [ ] Accessibility features working
- [ ] Responsive design functioning properly

## Testing Checklist

### Section Library UI
- [ ] All 10 hero variants displayed
- [ ] Hero-specific filtering works
- [ ] Search functionality includes hero variants
- [ ] Category filtering shows correct counts
- [ ] Quick preview shows all variants

### Complete Workflow Testing
- [ ] Section selection from library works
- [ ] Editor loads for each variant
- [ ] Preview generates correctly
- [ ] Section saves successfully
- [ ] Section renders on page
- [ ] Theme integration works
- [ ] Responsive behavior correct

### Cross-Browser Compatibility
- [ ] Chrome 88+ ✅
- [ ] Firefox 85+ ✅
- [ ] Safari 14+ ✅
- [ ] Edge 88+ ✅
- [ ] Mobile browsers ✅

### Performance Verification
- [ ] Page load times acceptable
- [ ] Component loading optimized
- [ ] Image optimization working
- [ ] Code splitting functional
- [ ] Cache performance good

## Rollback Plan
If issues are encountered:
1. **Database Rollback**
   ```sql
   BEGIN TRANSACTION;
   DELETE FROM sections WHERE type LIKE 'hero-%';
   INSERT INTO sections SELECT * FROM sections_backup;
   DELETE FROM migrations WHERE name = 'hero_sections_v2';
   COMMIT;
   ```
2. **Code Rollback**
   ```bash
   git checkout backup/pre-hero-migration
   git checkout main
   git reset --hard backup/pre-hero-migration
   git push --force-with-lease origin main
   ```
3. **Verify Rollback**
   ```bash
   npm run test
   npm run build
   npm run dev
   ```

## Migration Documentation

### Property Mapping Reference
| Legacy Property | New Property | Notes |
|----------------|--------------|-------|
| `title` | `title.text` | Now includes tag specification |
| `subtitle` | `subtitle.text` | Enhanced with semantic tags |
| `buttonText` | `primaryButton.text` | Part of button object |
| `buttonLink` | `primaryButton.url` | Enhanced with target options |
| `backgroundImage` | `background.image.url` | Enhanced media object |
| `textAlign` | `textAlign` | Unchanged |

### Migration Script Location
- **Path**: `scripts/migrations/hero-sections-v2-[timestamp].sql`
- **Backup**: `sections_backup` table created automatically
- **Verification**: Migration record added to `migrations` table

## Support Information
- **Documentation**: `/docs/HERO_SECTIONS_MIGRATION.md`
- **Integration Tests**: `lib/sections/hero/integration-test-complete.tsx`
- **Workflow Tests**: `lib/sections/hero/integration-test-workflow.tsx`
- **Cross-browser Report**: `cross-browser-compatibility-report.json`
- **Contact**: Development team

## Key Features Deployed
✨ **10 Hero Variants Available**
- Traditional & Centered layouts
- Modern split-screen and video backgrounds
- Minimal and clean designs
- Business and service-oriented layouts
- E-commerce and product showcases
- Conversion-focused CTAs
- Social proof integration
- Feature highlighting
- Gallery and media-rich options

🚀 **Enhanced Functionality**
- Dynamic component loading (fixed React.lazy double-wrapping)
- Section library integration
- Theme compatibility
- Responsive design
- Accessibility compliance
- Performance optimization
- Migration utilities
- Comprehensive testing

## Issues Resolved
✅ **Fixed React.lazy Double-Wrapping Error**
- Resolved "Element type is invalid" error when adding hero sections
- Fixed "Received a promise that resolves to" error
- HeroSectionFactory now loads actual components instead of lazy components
- Section renderer properly wraps components with single React.lazy layer

✅ **Fixed Responsive Classes Destructuring Error**
- Resolved "Cannot destructure property 'mobile' of 'config' as it is undefined" error
- generateResponsiveClasses function now handles undefined config parameter
- Hero sections render correctly even without responsive configuration
- Maintains backward compatibility with existing responsive configs

✅ **Fixed Additional Hero Utils Runtime Errors**
- Resolved "Cannot read properties of undefined (reading 'mobile')" error
- Fixed getResponsiveSpacingClasses function to handle undefined config
- Fixed getResponsiveTypographyClasses function to handle undefined config
- All hero utility functions now use optional chaining and null checks
- Complete elimination of runtime errors related to undefined responsive configs

✅ **Fixed Accessibility Props Runtime Error**
- Resolved "Cannot read properties of undefined (reading 'ariaLabels')" error
- Fixed generateAccessibilityProps function to handle undefined AccessibilityConfig
- Hero sections now render correctly even without accessibility configuration
- Maintains full accessibility support when configuration is provided

✅ **Fixed Site Config Context Provider Error**
- Resolved "useSiteConfig must be used within a SiteConfigProvider" error
- Created useSafeConfig wrapper with try-catch error handling
- Hero sections now work with or without SiteConfigProvider context
- Graceful fallback to default theme when site config is unavailable
- Components can be rendered in isolation for testing and development

✅ **Fixed Aria Label Generation Error**
- Resolved "Cannot read properties of undefined (reading 'replace')" error
- Fixed generateAriaLabel function to handle undefined HeroVariant parameters
- Added null checks and safe string conversion for variant processing
- Hero sections now generate proper accessibility labels in all scenarios
- Maintains semantic HTML structure for screen readers

## Final Verification Commands

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
```

---

**Generated on**: ${new Date().toISOString()}  
**Version**: 2.0.0  
**Status**: Ready for Deployment