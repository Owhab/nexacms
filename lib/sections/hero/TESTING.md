# Hero Sections Testing Documentation

This document provides comprehensive information about the testing strategy and implementation for the hero sections expansion feature.

## Overview

The hero sections testing suite includes:

- **Unit Tests**: Individual component and editor testing
- **Integration Tests**: Section registry and theme system testing
- **Visual Regression Tests**: Cross-browser and responsive design testing
- **Accessibility Tests**: WCAG 2.1 AA compliance testing

## Test Structure

```
lib/sections/hero/
├── __tests__/
│   ├── registry.integration.test.ts      # Registry system tests
│   ├── theme.integration.test.tsx        # Theme integration tests
│   └── accessibility.a11y.test.tsx       # Accessibility compliance tests
├── variants/__tests__/
│   ├── HeroCentered.test.tsx            # Unit tests for each variant
│   ├── HeroSplitScreen.test.tsx
│   ├── HeroVideo.test.tsx
│   ├── HeroMinimal.test.tsx
│   ├── HeroFeature.test.tsx
│   ├── HeroTestimonial.test.tsx
│   ├── HeroProduct.test.tsx
│   ├── HeroService.test.tsx
│   ├── HeroCTA.test.tsx
│   └── HeroGallery.test.tsx
└── editors/__tests__/
    ├── HeroCenteredEditor.test.tsx      # Editor component tests
    ├── HeroSplitScreenEditor.test.tsx
    ├── HeroVideoEditor.test.tsx
    ├── HeroMinimalEditor.test.tsx
    ├── HeroFeatureEditor.test.tsx
    ├── HeroTestimonialEditor.test.tsx
    ├── HeroProductEditor.test.tsx
    ├── HeroServiceEditor.test.tsx
    ├── HeroCTAEditor.test.tsx
    └── HeroGalleryEditor.test.tsx

tests/visual/
└── hero-sections.spec.ts                # Visual regression tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm test -- --run lib/sections/hero
```

### Integration Tests
```bash
npm test -- --run lib/sections/hero/__tests__
```

### Accessibility Tests
```bash
npm run test:accessibility
```

### Visual Regression Tests
```bash
npm run test:visual
```

### Test Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Test Categories

### 1. Unit Tests

#### Hero Variant Components
Each hero variant has comprehensive unit tests covering:

- **Rendering**: Proper component rendering with various prop combinations
- **Props Handling**: Correct handling of required and optional props
- **Theme Integration**: Theme application and CSS variable usage
- **Responsive Behavior**: Responsive class application and layout changes
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation
- **Error Handling**: Graceful handling of missing or invalid props

Example test structure:
```typescript
describe('HeroCentered Component', () => {
  describe('Rendering', () => {
    it('renders with required props')
    it('renders all content elements when provided')
    it('applies correct HTML tags to text elements')
  })
  
  describe('Theme Integration', () => {
    it('applies theme colors correctly')
    it('updates when theme changes')
  })
  
  describe('Accessibility', () => {
    it('has proper ARIA labels')
    it('supports keyboard navigation')
    it('has proper heading hierarchy')
  })
})
```

#### Editor Components
Editor tests focus on:

- **Form Rendering**: All form fields and sections display correctly
- **User Interactions**: Form field changes trigger appropriate callbacks
- **Validation**: Client-side validation works correctly
- **Real-time Updates**: Changes reflect in preview immediately
- **Error States**: Validation errors display properly

### 2. Integration Tests

#### Registry System Tests
Tests for the hero section registry system:

- **Configuration Validation**: All sections have proper configuration
- **Component Loading**: Dynamic component imports work correctly
- **Performance**: Registry operations are efficient
- **Error Handling**: Invalid sections handled gracefully

#### Theme Integration Tests
Tests for theme system integration:

- **Theme Application**: Themes apply consistently across variants
- **CSS Variables**: CSS variables are set correctly
- **Responsive Themes**: Theme works across all breakpoints
- **Theme Changes**: Dynamic theme updates work properly

### 3. Visual Regression Tests

Visual tests use Playwright to ensure consistent rendering:

#### Test Coverage
- **All 10 Hero Variants**: Each variant tested individually
- **Multiple Themes**: Default, dark, and high-contrast themes
- **Responsive Design**: Mobile, tablet, and desktop viewports
- **Cross-Browser**: Chrome, Firefox, Safari, and mobile browsers
- **Interactive States**: Hover, focus, and active states
- **Error States**: Missing images, loading states, fallbacks

#### Screenshot Comparison
- Threshold: 0.2 (20% difference allowed)
- Max Diff Pixels: 100 pixels
- Automatic retry on failure
- HTML reports with visual diffs

### 4. Accessibility Tests

Comprehensive accessibility testing ensures WCAG 2.1 AA compliance:

#### Test Areas
- **Semantic HTML**: Proper use of headings, landmarks, and structure
- **ARIA Labels**: Appropriate labeling and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper announcements and context
- **Color Contrast**: Sufficient contrast ratios
- **Focus Management**: Visible focus indicators and logical order
- **Motion Preferences**: Respect for reduced motion settings

#### Tools Used
- **axe-core**: Automated accessibility testing
- **jest-axe**: Integration with testing framework
- **Custom Utilities**: Screen reader simulation and focus testing

## Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ]
})
```

## Mocking Strategy

### Component Mocks
- **MediaPicker**: Simulated file selection and media handling
- **Button**: Simplified button component for testing
- **Next.js Components**: Router, Image, and navigation mocks

### API Mocks
- **Prisma Client**: Database operation mocks
- **File System**: Media upload and storage mocks
- **External APIs**: Third-party service mocks

### Browser APIs
- **IntersectionObserver**: Lazy loading simulation
- **ResizeObserver**: Responsive behavior testing
- **matchMedia**: Media query testing

## Performance Testing

### Metrics Tracked
- **Component Render Time**: Individual component performance
- **Registry Operations**: Section lookup and loading speed
- **Theme Application**: CSS generation and application time
- **Bundle Size**: Impact on application bundle

### Performance Thresholds
- Registry operations: < 100ms for 1000 lookups
- Theme generation: < 50ms for 100 generations
- Component render: < 16ms for 60fps

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Hero Sections Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:accessibility
      - run: npm run test:visual
```

### Test Reports
- **Coverage Reports**: HTML and JSON coverage reports
- **Visual Test Reports**: Playwright HTML reports with screenshots
- **Accessibility Reports**: Detailed WCAG compliance reports

## Best Practices

### Writing Tests
1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Follow AAA pattern consistently
3. **Single Responsibility**: One assertion per test when possible
4. **Mock Appropriately**: Mock external dependencies, not internal logic
5. **Test Behavior**: Focus on user-facing behavior, not implementation

### Maintaining Tests
1. **Update with Changes**: Keep tests current with component changes
2. **Review Coverage**: Regularly check and improve test coverage
3. **Performance Monitoring**: Watch for test performance degradation
4. **Documentation**: Keep test documentation up to date

### Debugging Tests
1. **Isolation**: Run individual tests to isolate issues
2. **Debug Mode**: Use `--inspect` flag for debugging
3. **Screenshots**: Visual tests provide failure screenshots
4. **Verbose Output**: Use `--verbose` for detailed test output

## Coverage Requirements

### Minimum Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Critical Areas (100% Coverage Required)
- Accessibility functions
- Theme integration utilities
- Registry system core functions
- Validation logic

## Troubleshooting

### Common Issues

#### Test Timeouts
```bash
# Increase timeout for slow tests
npm test -- --testTimeout=10000
```

#### Memory Issues
```bash
# Run tests with more memory
node --max-old-space-size=4096 node_modules/.bin/vitest
```

#### Visual Test Failures
```bash
# Update visual baselines
npm run test:visual -- --update-snapshots
```

#### Accessibility Test Failures
```bash
# Run accessibility tests with detailed output
npm run test:accessibility -- --verbose
```

### Getting Help

1. **Check Documentation**: Review this document and inline comments
2. **Run Specific Tests**: Isolate failing tests for debugging
3. **Check CI Logs**: Review continuous integration output
4. **Update Dependencies**: Ensure testing dependencies are current

## Future Enhancements

### Planned Improvements
1. **Performance Benchmarking**: Automated performance regression testing
2. **Cross-Device Testing**: Extended mobile and tablet testing
3. **Internationalization Testing**: Multi-language accessibility testing
4. **Advanced Visual Testing**: Animation and transition testing

### Contributing to Tests

When adding new hero variants or features:

1. **Add Unit Tests**: Create comprehensive unit tests for new components
2. **Update Integration Tests**: Ensure registry and theme tests include new variants
3. **Add Visual Tests**: Include new variants in visual regression suite
4. **Test Accessibility**: Verify WCAG compliance for new features
5. **Update Documentation**: Keep this documentation current

This testing strategy ensures the hero sections expansion maintains high quality, accessibility, and performance standards while providing a robust foundation for future development.