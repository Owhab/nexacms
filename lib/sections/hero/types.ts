// Hero Section Types and Interfaces

// Hero variant enumeration
export enum HeroVariant {
    CENTERED = 'centered',
    SPLIT_SCREEN = 'split-screen',
    VIDEO = 'video',
    MINIMAL = 'minimal',
    FEATURE = 'feature',
    TESTIMONIAL = 'testimonial',
    PRODUCT = 'product',
    SERVICE = 'service',
    CTA = 'cta',
    GALLERY = 'gallery'
}

// Theme configuration interface
export interface ThemeConfig {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    borderColor: string
    fontFamily?: string
    borderRadius?: string
}

// Responsive breakpoint configuration
export interface ResponsiveBreakpoint {
    layout: LayoutConfig
    typography: TypographyConfig
    spacing: SpacingConfig
}

export interface LayoutConfig {
    direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    alignment: 'start' | 'center' | 'end' | 'stretch'
    justification: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    gap: string
    padding: string
    margin: string
}

export interface TypographyConfig {
    fontSize: string
    lineHeight: string
    fontWeight: string
    letterSpacing?: string
    textAlign: 'left' | 'center' | 'right' | 'justify'
}

export interface SpacingConfig {
    padding: {
        top: string
        right: string
        bottom: string
        left: string
    }
    margin: {
        top: string
        right: string
        bottom: string
        left: string
    }
}

// Responsive configuration
export interface ResponsiveConfig {
    mobile: ResponsiveBreakpoint
    tablet: ResponsiveBreakpoint
    desktop: ResponsiveBreakpoint
}

// Animation configuration
export interface AnimationConfig {
    enabled: boolean
    type: 'fade' | 'slide' | 'scale' | 'bounce' | 'none'
    duration: number
    delay: number
    easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
}

// Accessibility configuration
export interface AccessibilityConfig {
    ariaLabels: Record<string, string>
    altTexts: Record<string, string>
    keyboardNavigation: boolean
    screenReaderSupport: boolean
    highContrast: boolean
    reducedMotion: boolean
}

// Base hero section props interface
export interface BaseHeroProps {
    id: string
    variant: HeroVariant
    theme: ThemeConfig
    responsive: ResponsiveConfig
    animation?: AnimationConfig
    accessibility: AccessibilityConfig
    className?: string
    style?: React.CSSProperties
}

// Button configuration
export interface ButtonConfig {
    text: string
    url: string
    style: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
    size: 'sm' | 'md' | 'lg' | 'xl'
    icon?: string
    iconPosition: 'left' | 'right'
    target: '_self' | '_blank' | '_parent' | '_top'
    rel?: string
    ariaLabel?: string
}

// Media configuration
export interface MediaConfig {
    id: string
    url: string
    type: 'image' | 'video'
    alt?: string
    caption?: string
    width?: number
    height?: number
    aspectRatio?: string
    objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    loading: 'lazy' | 'eager'
}

// Background configuration
export interface BackgroundConfig {
    type: 'none' | 'color' | 'gradient' | 'image' | 'video'
    color?: string
    gradient?: {
        type: 'linear' | 'radial'
        direction?: string
        colors: Array<{ color: string; stop: number }>
    }
    image?: MediaConfig
    video?: MediaConfig & {
        autoplay: boolean
        loop: boolean
        muted: boolean
        controls: boolean
        poster?: string
    }
    overlay?: {
        enabled: boolean
        color: string
        opacity: number
    }
}

// Text content configuration
export interface TextContent {
    text: string
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
    className?: string
    style?: React.CSSProperties
}

// Feature item for feature-focused variants
export interface FeatureItem {
    id: string
    icon?: string
    title: string
    description: string
    link?: string
    image?: MediaConfig
}

// Testimonial item for testimonial variants
export interface TestimonialItem {
    id: string
    quote: string
    author: string
    company?: string
    role?: string
    avatar?: MediaConfig
    rating?: number
}

// Product item for product variants
export interface ProductItem {
    id: string
    name: string
    description: string
    price?: string
    originalPrice?: string
    currency?: string
    images: MediaConfig[]
    features?: string[]
    badge?: string
    link?: string
}

// Service item for service variants
export interface ServiceItem {
    id: string
    title: string
    description: string
    icon?: string
    image?: MediaConfig
    features?: string[]
    link?: string
}

// Gallery item for gallery variants
export interface GalleryItem {
    id: string
    image: MediaConfig
    caption?: string
    link?: string
}

// Trust badge for service variants
export interface TrustBadge {
    id: string
    name: string
    image: MediaConfig
    link?: string
}

// Editor field types
export enum FieldType {
    TEXT = 'text',
    TEXTAREA = 'textarea',
    RICH_TEXT = 'rich-text',
    SELECT = 'select',
    MULTI_SELECT = 'multi-select',
    BOOLEAN = 'boolean',
    NUMBER = 'number',
    COLOR = 'color',
    IMAGE = 'image',
    VIDEO = 'video',
    URL = 'url',
    BUTTON_GROUP = 'button-group',
    REPEATER = 'repeater',
    SLIDER = 'slider',
    DATE = 'date',
    TIME = 'time'
}

// Editor field configuration
export interface EditorField {
    id: string
    type: FieldType
    label: string
    placeholder?: string
    required: boolean
    validation?: ValidationRule[]
    options?: FieldOption[]
    dependencies?: string[]
    helpText?: string
    defaultValue?: any
    min?: number
    max?: number
    step?: number
}

export interface FieldOption {
    label: string
    value: any
    icon?: string
    disabled?: boolean
}

export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
    value?: any
    message: string
}

// Editor section configuration
export interface EditorSection {
    id: string
    title: string
    fields: EditorField[]
    collapsible: boolean
    defaultExpanded: boolean
    icon?: string
    description?: string
}

// Editor schema
export interface EditorSchema {
    sections: EditorSection[]
    validation: ValidationRule[]
    dependencies: FieldDependency[]
}

export interface FieldDependency {
    field: string
    dependsOn: string
    condition: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater' | 'less'
    value: any
    action: 'show' | 'hide' | 'enable' | 'disable' | 'require'
}

// Hero section configuration for registry
export interface HeroSectionConfig {
    id: string
    variant: HeroVariant
    name: string
    description: string
    icon: string
    category: 'HERO'
    defaultProps: Record<string, any>
    editorSchema: EditorSchema
    previewComponent: string
    editorComponent: string
    tags: string[]
    isActive: boolean
    version: string
    themeCompatibility: ThemeCompatibility
    responsiveSupport: ResponsiveSupport
    requiredFeatures?: string[]
    optionalFeatures?: string[]
}

// Theme compatibility configuration
export interface ThemeCompatibility {
    supportedThemes: Array<'LIGHT' | 'DARK' | 'AUTO'>
    customCSSVariables: CSSVariableMapping[]
    tailwindClasses: TailwindClassMapping[]
    customStyles?: CustomStyleDefinition[]
}

export interface CSSVariableMapping {
    property: string
    cssVariable: string
    fallback: string
    themeKey: keyof ThemeConfig
}

export interface TailwindClassMapping {
    condition: string
    classes: string[]
    responsive: boolean
}

export interface CustomStyleDefinition {
    selector: string
    properties: Record<string, string>
    mediaQuery?: string
}

// Responsive support configuration
export interface ResponsiveSupport {
    breakpoints: Array<'mobile' | 'tablet' | 'desktop'>
    adaptiveLayout: boolean
    responsiveImages: boolean
    responsiveTypography: boolean
}

// Error handling types
export interface ErrorRecovery {
    fallbackContent: FallbackContent
    retryMechanism: RetryConfig
    userNotification: NotificationConfig
    logging: ErrorLogging
}

export interface FallbackContent {
    defaultProps: Record<string, any>
    placeholderImage: string
    errorMessage: string
    recoveryActions: RecoveryAction[]
}

export interface RetryConfig {
    maxAttempts: number
    delay: number
    backoff: 'linear' | 'exponential'
}

export interface NotificationConfig {
    showToUser: boolean
    message: string
    type: 'error' | 'warning' | 'info'
    duration: number
}

export interface ErrorLogging {
    enabled: boolean
    level: 'error' | 'warn' | 'info' | 'debug'
    context: Record<string, any>
}

export interface RecoveryAction {
    label: string
    action: () => void
    type: 'retry' | 'fallback' | 'reload' | 'custom'
}

// Performance monitoring types
export interface PerformanceMetrics {
    renderTime: number
    bundleSize: number
    imageLoadTime: number
    interactionDelay: number
    memoryUsage: number
}

// Component props for each variant (to be extended by specific variants)
export interface HeroCenteredProps extends BaseHeroProps {
    title: TextContent
    subtitle?: TextContent
    description?: TextContent
    primaryButton?: ButtonConfig
    secondaryButton?: ButtonConfig
    background: BackgroundConfig
    textAlign: 'left' | 'center' | 'right'
}

export interface HeroSplitScreenProps extends BaseHeroProps {
    content: {
        title: TextContent
        subtitle?: TextContent
        description?: TextContent
        buttons: ButtonConfig[]
    }
    media: MediaConfig
    layout: 'left' | 'right'
    contentAlignment: 'start' | 'center' | 'end'
    mediaAlignment: 'start' | 'center' | 'end'
    background: BackgroundConfig
}

export interface HeroVideoProps extends BaseHeroProps {
    video: MediaConfig & {
        autoplay: boolean
        loop: boolean
        muted: boolean
        controls: boolean
        poster?: string
    }
    overlay: {
        enabled: boolean
        color: string
        opacity: number
    }
    content: {
        title: TextContent
        subtitle?: TextContent
        description?: TextContent
        buttons: ButtonConfig[]
        position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    }
}

export interface HeroMinimalProps extends BaseHeroProps {
    title: TextContent
    subtitle?: TextContent
    button?: ButtonConfig
    background: BackgroundConfig
    spacing: 'compact' | 'normal' | 'spacious'
}

export interface HeroFeatureProps extends BaseHeroProps {
    title: TextContent
    subtitle?: TextContent
    description?: TextContent
    features: FeatureItem[]
    layout: 'grid' | 'list' | 'carousel'
    columns: 2 | 3 | 4
    background: BackgroundConfig
    primaryButton?: ButtonConfig
}

export interface HeroTestimonialProps extends BaseHeroProps {
    title: TextContent
    subtitle?: TextContent
    testimonials: TestimonialItem[]
    layout: 'single' | 'carousel' | 'grid'
    autoRotate: boolean
    rotationInterval: number
    showRatings: boolean
    background: BackgroundConfig
    primaryButton?: ButtonConfig
}

export interface HeroProductProps extends BaseHeroProps {
    product: ProductItem
    layout: 'left' | 'right' | 'center'
    showGallery: boolean
    showFeatures: boolean
    showPricing: boolean
    background: BackgroundConfig
    primaryButton?: ButtonConfig
    secondaryButton?: ButtonConfig
}

export interface HeroServiceProps extends BaseHeroProps {
    title: TextContent
    subtitle?: TextContent
    description?: TextContent
    services: ServiceItem[]
    trustBadges: TrustBadge[]
    layout: 'grid' | 'list'
    showTrustBadges: boolean
    background: BackgroundConfig
    primaryButton?: ButtonConfig
    contactButton?: ButtonConfig
}

export interface HeroCTAProps extends BaseHeroProps {
    title: TextContent
    subtitle?: TextContent
    description?: TextContent
    primaryButton: ButtonConfig
    secondaryButton?: ButtonConfig
    urgencyText?: TextContent
    benefits?: string[]
    background: BackgroundConfig
    layout: 'center' | 'split'
    showBenefits: boolean
}

export interface HeroGalleryProps extends BaseHeroProps {
    title: TextContent
    subtitle?: TextContent
    gallery: GalleryItem[]
    layout: 'grid' | 'masonry' | 'carousel'
    columns: 2 | 3 | 4 | 5
    showCaptions: boolean
    lightbox: boolean
    autoplay: boolean
    autoplayInterval: number
    background: BackgroundConfig
    primaryButton?: ButtonConfig
}

// Union type for all hero props
export type HeroProps =
    | HeroCenteredProps
    | HeroSplitScreenProps
    | HeroVideoProps
    | HeroMinimalProps
    | HeroFeatureProps
    | HeroTestimonialProps
    | HeroProductProps
    | HeroServiceProps
    | HeroCTAProps
    | HeroGalleryProps

// Editor props interface
export interface HeroEditorProps<T extends HeroProps = HeroProps> {
    props: T
    onSave: (props: T) => void
    onCancel: () => void
    onChange?: (props: Partial<T>) => void
    isLoading?: boolean
    errors?: Record<string, string>
}

// Preview props interface
export type HeroPreviewProps<T extends HeroProps = HeroProps> = T & {
    isPreview?: boolean
    previewMode?: 'mobile' | 'tablet' | 'desktop'
}