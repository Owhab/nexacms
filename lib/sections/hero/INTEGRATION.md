# Hero Section Registry Integration

This document explains how all 10 hero section variants are integrated with the main section registry system, including dynamic component loading, categorization, filtering, and migration utilities.

## Overview

The hero section registry integration provides:

1. **Unified Registration**: All hero variants are automatically registered in the main section registry
2. **Dynamic Loading**: Components, editors, and previews are loaded on-demand for performance
3. **Advanced Filtering**: Hero-specific categorization and search capabilities
4. **Migration Support**: Utilities to migrate legacy hero sections to new variants
5. **Validation**: Comprehensive validation and error handling

## Architecture

```
lib/sections/
├── registry.ts                 # Main section registry with hero integration
├── renderer.tsx               # Dynamic component renderer with hero support
└── hero/
    ├── registry.ts            # Hero-specific configurations
    ├── factory.ts             # Dynamic component loading factory
    ├── migration.ts           # Migration utilities
    ├── integration-test-registry.tsx  # Integration test suite
    ├── variants/              # 10 hero variant components
    ├── editors/               # 10 hero editor components
    └── previews/              # 10 hero preview components
```

## Hero Variants

All 10 hero variants are fully integrated:

| Variant | ID | Component | Editor | Preview | Status |
|---------|----|-----------|---------|---------| -------|
| Centered | `hero-centered` | ✅ | ✅ | ✅ | Active |
| Split Screen | `hero-split-screen` | ✅ | ✅ | ✅ | Active |
| Video | `hero-video` | ✅ | ✅ | ✅ | Active |
| Minimal | `hero-minimal` | ✅ | ✅ | ✅ | Active |
| Feature | `hero-feature` | ✅ | ✅ | ✅ | Active |
| Testimonial | `hero-testimonial` | ✅ | ✅ | ✅ | Active |
| Service | `hero-service` | ✅ | ✅ | ✅ | Active |
| Product | `hero-product` | ✅ | ✅ | ✅ | Active |
| Gallery | `hero-gallery` | ✅ | ✅ | ✅ | Active |
| CTA | `hero-cta` | ✅ | ✅ | ✅ | Active |

## Dynamic Component Loading

### Factory Pattern

The `HeroSectionFactory` provides dynamic loading capabilities:

```typescript
// Load components on-demand
const component = await HeroSectionFactory.loadComponent(HeroVariant.GALLERY)
const editor = await HeroSectionFactory.loadEditor(HeroVariant.GALLERY)
const preview = await HeroSectionFactory.loadPreview(HeroVariant.GALLERY)

// Create lazy-loaded React components
const LazyHeroGallery = HeroSectionFactory.createLazyComponent(HeroVariant.GALLERY)
const LazyHeroGalleryEditor = HeroSectionFactory.createLazyEditor(HeroVariant.GALLERY)
```

### Caching and Performance

- **Component Caching**: Loaded components are cached to avoid re-imports
- **Loading Promises**: Prevents duplicate loading requests
- **Preloading**: Critical components can be preloaded for better UX
- **Code Splitting**: Each variant is loaded only when needed

### Error Handling

- **Graceful Fallbacks**: Falls back to base components if specific variants fail
- **Error Boundaries**: Comprehensive error handling with user-friendly messages
- **Development Support**: Clear error messages and debugging information

## Section Library Integration

### Categorization

Hero sections are automatically categorized in the section library:

```typescript
// Get all hero sections
const heroSections = getHeroSections()

// Filter by category tags
const modernHeros = getHeroSectionsByTag('modern')
const businessHeros = getHeroSectionsByTag('business')
const ecommerceHeros = getHeroSectionsByTag('e-commerce')
```

### Advanced Filtering

The section library provides hero-specific filters:

- **All Hero Sections**: Shows all 10 variants
- **Traditional & Centered**: Classic hero layouts
- **Modern Layouts**: Contemporary designs
- **Media & Visual**: Video and gallery variants
- **Minimal & Clean**: Typography-focused designs
- **Business & Service**: Professional layouts
- **E-commerce & Product**: Product showcase variants
- **Conversion & CTA**: Action-oriented designs
- **Social Proof**: Testimonial integration
- **Feature Showcase**: Feature highlighting

### Search Enhancement

Hero-specific search includes:

- **Variant Names**: Search by variant type (e.g., "gallery", "video")
- **Tags**: Search by functionality tags
- **Descriptions**: Full-text search in descriptions
- **Categories**: Search within hero categories

## Migration Utilities

### Legacy Hero Migration

Automatic migration from legacy hero sections:

```typescript
// Migrate legacy hero section
const migrationResult = migrateHeroSection('hero-section', legacyProps)

// Advanced migration with options
const result = migrateLegacyHeroSection(legacyProps, HeroVariant.GALLERY, {
    preserveCustomStyles: true,
    fallbackVariant: HeroVariant.CENTERED,
    validateProps: true
})
```

### Migration Mappings

Pre-configured migration paths:

- **hero-section → hero-centered**: Standard legacy migration
- **legacy-hero → hero-minimal**: Simplified content migration
- **Custom mappings**: Extensible for additional legacy formats

### Recommendations

Smart variant recommendations based on content:

```typescript
const recommendations = getRecommendedVariants(legacyProps)
// Returns: [
//   { variant: 'centered', reason: 'Complete content structure', confidence: 0.9 },
//   { variant: 'split-screen', reason: 'Has background image', confidence: 0.8 }
// ]
```

## Registry Validation

### Comprehensive Validation

The system includes built-in validation:

```typescript
const validation = validateHeroSectionIntegration()
// Returns:
// {
//   isValid: true,
//   errors: [],
//   warnings: [],
//   stats: {
//     totalHeroVariants: 10,
//     activeHeroVariants: 10,
//     registeredVariants: ['hero-centered', 'hero-gallery', ...]
//   }
// }
```

### Validation Checks

- **Variant Registration**: All expected variants are registered
- **Component Availability**: Components, editors, and previews exist
- **Configuration Completeness**: All required configuration fields
- **Migration Mappings**: Legacy migration paths are available
- **Theme Compatibility**: Theme integration is properly configured

## Usage Examples

### Adding a New Hero Section

```typescript
// In your page editor
import { SectionLibrary } from '@/components/admin/SectionLibrary'

function PageEditor() {
    const handleAddSection = (sectionId: string) => {
        // Hero sections are automatically handled
        if (isHeroSection(sectionId)) {
            const config = getHeroSectionConfig(sectionId.replace('hero-', ''))
            // Add section with default props
            addSection(sectionId, config.defaultProps)
        }
    }

    return <SectionLibrary onAddSection={handleAddSection} />
}
```

### Rendering Hero Sections

```typescript
// In your section renderer
import { SectionRenderer } from '@/lib/sections/renderer'

function PageRenderer({ sections }) {
    return (
        <div>
            {sections.map(section => (
                <SectionRenderer
                    key={section.id}
                    sectionId={section.sectionTemplate.id}
                    props={section.props}
                    mode="storefront"
                />
            ))}
        </div>
    )
}
```

### Editing Hero Sections

```typescript
// In your section editor
function SectionEditor({ section, onSave, onCancel }) {
    return (
        <SectionRenderer
            sectionId={section.sectionTemplate.id}
            props={section.props}
            mode="editor"
            onSave={onSave}
            onCancel={onCancel}
        />
    )
}
```

## Performance Considerations

### Code Splitting

Each hero variant is code-split for optimal loading:

```typescript
// Only loads when needed
const HeroGallery = React.lazy(() => import('./variants/HeroGallery'))
```

### Caching Strategy

- **Component Cache**: In-memory caching of loaded components
- **Promise Cache**: Prevents duplicate loading requests
- **Preloading**: Strategic preloading of common variants

### Bundle Optimization

- **Tree Shaking**: Unused variants are excluded from bundles
- **Dynamic Imports**: Components loaded on-demand
- **Shared Dependencies**: Common utilities are shared across variants

## Testing

### Integration Tests

Run the comprehensive integration test:

```typescript
import { HeroRegistryIntegrationTest } from '@/lib/sections/hero/integration-test-registry'

// Renders a complete test suite UI
<HeroRegistryIntegrationTest />
```

### Manual Testing

```bash
# Run the integration test script
node test-registry-integration.js
```

### Test Coverage

- ✅ All 10 variants registered and active
- ✅ Dynamic component loading functional
- ✅ Categorization and filtering working
- ✅ Migration utilities handling legacy sections
- ✅ Theme compatibility properly configured
- ✅ Factory caching optimizing performance

## Troubleshooting

### Common Issues

1. **Component Not Loading**
   - Check if variant exists in `variants/` directory
   - Verify export format in component file
   - Check factory cache and clear if needed

2. **Editor Not Found**
   - Ensure editor exists in `editors/` directory
   - Verify naming convention: `Hero{Variant}Editor`
   - Check editor component exports

3. **Migration Failing**
   - Verify legacy props format
   - Check migration mapping configuration
   - Validate target variant compatibility

### Debug Tools

```typescript
// Check factory cache
console.log(HeroSectionFactory.getCacheStats())

// Validate registry
console.log(validateHeroSectionIntegration())

// Clear cache for development
HeroSectionFactory.clearCache()
```

## Future Enhancements

### Planned Features

- **A/B Testing**: Built-in variant testing capabilities
- **Analytics Integration**: Usage tracking and performance metrics
- **Advanced Theming**: More sophisticated theme customization
- **Template Library**: Pre-configured hero templates
- **AI Recommendations**: Smart variant suggestions based on content

### Extension Points

- **Custom Variants**: Framework for adding new hero types
- **Plugin System**: Third-party hero variant plugins
- **Theme Extensions**: Custom theme integration patterns
- **Migration Plugins**: Custom migration utilities

## Conclusion

The hero section registry integration provides a comprehensive, scalable, and performant system for managing 10 different hero section variants. The system includes:

- ✅ Complete variant registration and activation
- ✅ Dynamic component loading with caching
- ✅ Advanced categorization and filtering
- ✅ Comprehensive migration utilities
- ✅ Robust validation and error handling
- ✅ Performance optimization and code splitting

All requirements for task 13 have been successfully implemented and tested.