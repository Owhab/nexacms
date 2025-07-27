#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that all hero sections are properly deployed and integrated.
 */

const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green')
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow')
}

function logError(message) {
    log(`❌ ${message}`, 'red')
}

function logStep(step, message) {
    log(`\n${step}. ${message}`, 'cyan')
}

function fileExists(filePath) {
    return fs.existsSync(filePath)
}

function verifyHeroSectionsStructure() {
    logStep(1, 'Verifying Hero Sections Structure')

    const heroPath = 'lib/sections/hero'
    const requiredFiles = [
        'types.ts',
        'registry.ts',
        'factory.ts',
        'utils.ts',
        'migration.ts',
        'index.ts'
    ]

    const requiredDirectories = [
        'variants',
        'editors',
        'previews',
        'components',
        'hooks',
        '__tests__'
    ]

    let isValid = true

    // Check required files
    for (const file of requiredFiles) {
        const filePath = path.join(heroPath, file)
        if (fileExists(filePath)) {
            logSuccess(`Found: ${file}`)
        } else {
            logError(`Missing: ${file}`)
            isValid = false
        }
    }

    // Check required directories
    for (const dir of requiredDirectories) {
        const dirPath = path.join(heroPath, dir)
        if (fileExists(dirPath)) {
            logSuccess(`Found: ${dir}/`)
        } else {
            logError(`Missing: ${dir}/`)
            isValid = false
        }
    }

    // Check hero variants
    const variantsPath = path.join(heroPath, 'variants')
    if (fileExists(variantsPath)) {
        const variants = fs.readdirSync(variantsPath).filter(file => file.endsWith('.tsx'))
        log(`Found ${variants.length} hero variants:`, 'blue')
        variants.forEach(variant => log(`  • ${variant}`, 'blue'))

        const expectedVariants = [
            'HeroCentered.tsx',
            'HeroSplitScreen.tsx',
            'HeroVideo.tsx',
            'HeroMinimal.tsx',
            'HeroFeature.tsx',
            'HeroTestimonial.tsx',
            'HeroService.tsx',
            'HeroProduct.tsx',
            'HeroGallery.tsx',
            'HeroCTA.tsx'
        ]

        const missingVariants = expectedVariants.filter(variant => !variants.includes(variant))
        if (missingVariants.length > 0) {
            logWarning(`Missing variants: ${missingVariants.join(', ')}`)
        } else {
            logSuccess('All 10 hero variants found')
        }
    }

    return isValid
}

function verifySectionLibraryUI() {
    logStep(2, 'Verifying Section Library UI')

    const sectionLibraryPath = 'components/admin/SectionLibrary.tsx'

    if (!fileExists(sectionLibraryPath)) {
        logError('Section Library component not found')
        return false
    }

    const content = fs.readFileSync(sectionLibraryPath, 'utf8')

    // Check for hero-specific features
    const checks = [
        { pattern: /getHeroSections/, description: 'Hero sections integration' },
        { pattern: /heroFilter/, description: 'Hero filtering functionality' },
        { pattern: /SECTION_CATEGORIES\.HERO/, description: 'Hero category support' },
        { pattern: /All 10 Hero Variants Available/, description: 'Hero variants preview' },
        { pattern: /heroStats/, description: 'Hero statistics display' }
    ]

    let allChecksPass = true

    for (const check of checks) {
        if (check.pattern.test(content)) {
            logSuccess(check.description)
        } else {
            logError(`Missing: ${check.description}`)
            allChecksPass = false
        }
    }

    return allChecksPass
}

function verifyIntegrationTests() {
    logStep(3, 'Verifying Integration Tests')

    const testFiles = [
        'lib/sections/hero/integration-test-complete.tsx',
        'lib/sections/hero/integration-test-registry.tsx',
        'lib/sections/hero/integration-test-workflow.tsx'
    ]

    let allTestsExist = true

    for (const testFile of testFiles) {
        if (fileExists(testFile)) {
            logSuccess(`Found: ${path.basename(testFile)}`)
        } else {
            logError(`Missing: ${path.basename(testFile)}`)
            allTestsExist = false
        }
    }

    return allTestsExist
}

function verifyCrossBrowserCompatibility() {
    logStep(4, 'Verifying Cross-Browser Compatibility')

    const compatibilityFiles = [
        'cross-browser-compatibility-report.json',
        'webpack-compatibility-config.js',
        '.browserslistrc'
    ]

    let allFilesExist = true

    for (const file of compatibilityFiles) {
        if (fileExists(file)) {
            logSuccess(`Found: ${file}`)
        } else {
            logError(`Missing: ${file}`)
            allFilesExist = false
        }
    }

    // Check compatibility report content
    if (fileExists('cross-browser-compatibility-report.json')) {
        try {
            const report = JSON.parse(fs.readFileSync('cross-browser-compatibility-report.json', 'utf8'))
            if (report.compatibility && report.compatibility.overall) {
                logSuccess(`Compatibility status: ${report.compatibility.overall}`)
            }
        } catch (error) {
            logWarning('Could not parse compatibility report')
        }
    }

    return allFilesExist
}

function verifyDeploymentDocumentation() {
    logStep(5, 'Verifying Deployment Documentation')

    const documentationFiles = [
        'DEPLOYMENT_CHECKLIST.md',
        'docs/HERO_SECTIONS_MIGRATION.md',
        'deployment-report.json'
    ]

    let allDocsExist = true

    for (const file of documentationFiles) {
        if (fileExists(file)) {
            logSuccess(`Found: ${file}`)
        } else {
            logError(`Missing: ${file}`)
            allDocsExist = false
        }
    }

    // Check deployment report
    if (fileExists('deployment-report.json')) {
        try {
            const report = JSON.parse(fs.readFileSync('deployment-report.json', 'utf8'))
            if (report.summary && report.summary.status) {
                logSuccess(`Deployment status: ${report.summary.status}`)
            }
            if (report.heroVariants) {
                logSuccess(`Hero variants documented: ${report.heroVariants.length}`)
            }
        } catch (error) {
            logWarning('Could not parse deployment report')
        }
    }

    return allDocsExist
}

function generateVerificationSummary(results) {
    logStep(6, 'Deployment Verification Summary')

    const totalChecks = Object.keys(results).length
    const passedChecks = Object.values(results).filter(Boolean).length
    const successRate = (passedChecks / totalChecks) * 100

    log('\n📊 Verification Results:', 'bright')
    log(`Passed: ${passedChecks}/${totalChecks} (${successRate.toFixed(1)}%)`)

    for (const [check, passed] of Object.entries(results)) {
        const status = passed ? '✅' : '❌'
        const color = passed ? 'green' : 'red'
        log(`${status} ${check}`, color)
    }

    if (successRate === 100) {
        log('\n🎉 All verification checks passed!', 'green')
        log('✅ Hero sections system is ready for deployment', 'green')
    } else if (successRate >= 80) {
        log('\n⚠️  Most checks passed with minor issues', 'yellow')
        log('🔧 Address remaining issues before deployment', 'yellow')
    } else {
        log('\n❌ Critical issues found', 'red')
        log('🚫 Not ready for deployment', 'red')
    }

    return successRate
}

function runDeploymentVerification() {
    log('\n🔍 Hero Sections Deployment Verification', 'bright')
    log('==========================================', 'bright')

    const startTime = Date.now()

    const results = {
        'Hero Sections Structure': verifyHeroSectionsStructure(),
        'Section Library UI': verifySectionLibraryUI(),
        'Integration Tests': verifyIntegrationTests(),
        'Cross-Browser Compatibility': verifyCrossBrowserCompatibility(),
        'Deployment Documentation': verifyDeploymentDocumentation()
    }

    const successRate = generateVerificationSummary(results)

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)

    log(`\n⏱️  Verification completed in ${duration} seconds`, 'blue')

    // Generate verification report
    const verificationReport = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        verificationResults: results,
        successRate: `${successRate.toFixed(1)}%`,
        duration: `${duration}s`,
        status: successRate === 100 ? 'Ready for Deployment' :
            successRate >= 80 ? 'Minor Issues' : 'Critical Issues',
        recommendations: successRate < 100 ? [
            'Address failed verification checks',
            'Ensure all required files are present',
            'Complete missing documentation',
            'Run tests to verify functionality'
        ] : [
            'Proceed with deployment',
            'Monitor post-deployment metrics',
            'Train content team on new features'
        ]
    }

    fs.writeFileSync('verification-report.json', JSON.stringify(verificationReport, null, 2))
    logSuccess('Verification report saved: verification-report.json')

    return successRate === 100
}

// Run verification
if (require.main === module) {
    const isReady = runDeploymentVerification()
    process.exit(isReady ? 0 : 1)
}

module.exports = {
    runDeploymentVerification,
    verifyHeroSectionsStructure,
    verifySectionLibraryUI,
    verifyIntegrationTests,
    verifyCrossBrowserCompatibility,
    verifyDeploymentDocumentation
}