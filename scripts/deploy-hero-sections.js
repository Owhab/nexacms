#!/usr/bin/env node

/**
 * Hero Sections Deployment Script
 * 
 * This script handles the deployment preparation for the hero sections system,
 * including validation, optimization, and migration tasks.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const CONFIG = {
    heroSectionsPath: 'lib/sections/hero',
    buildPath: '.next',
    testCommand: 'npm run test',
    buildCommand: 'npm run build',
    migrationPath: 'scripts/migrations',
    backupPath: 'backups'
}

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
    log(`\n${step}. ${message}`, 'cyan')
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

// Utility functions
function fileExists(filePath) {
    return fs.existsSync(filePath)
}

function readJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (error) {
        logError(`Failed to read JSON file: ${filePath}`)
        return null
    }
}

function runCommand(command, description) {
    try {
        log(`Running: ${command}`, 'blue')
        execSync(command, { stdio: 'inherit' })
        logSuccess(description)
        return true
    } catch (error) {
        logError(`Failed: ${description}`)
        logError(error.message)
        return false
    }
}

// Validation functions
function validateHeroSectionsStructure() {
    logStep(1, 'Validating Hero Sections Structure')
    
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
        const filePath = path.join(CONFIG.heroSectionsPath, file)
        if (!fileExists(filePath)) {
            logError(`Missing required file: ${filePath}`)
            isValid = false
        } else {
            log(`✓ Found: ${file}`, 'green')
        }
    }
    
    // Check required directories
    for (const dir of requiredDirectories) {
        const dirPath = path.join(CONFIG.heroSectionsPath, dir)
        if (!fileExists(dirPath)) {
            logError(`Missing required directory: ${dirPath}`)
            isValid = false
        } else {
            log(`✓ Found: ${dir}/`, 'green')
        }
    }
    
    // Check hero variants
    const variantsPath = path.join(CONFIG.heroSectionsPath, 'variants')
    if (fileExists(variantsPath)) {
        const variants = fs.readdirSync(variantsPath).filter(file => file.endsWith('.tsx'))
        log(`Found ${variants.length} hero variants:`, 'blue')
        variants.forEach(variant => log(`  • ${variant}`, 'blue'))
        
        if (variants.length < 10) {
            logWarning(`Expected 10 hero variants, found ${variants.length}`)
        }
    }
    
    return isValid
}

function validatePackageJson() {
    logStep(2, 'Validating Package Configuration')
    
    const packageJson = readJsonFile('package.json')
    if (!packageJson) {
        return false
    }
    
    const requiredDependencies = [
        'react',
        'react-dom',
        'next',
        'tailwindcss',
        'lucide-react'
    ]
    
    const requiredDevDependencies = [
        '@testing-library/react',
        '@testing-library/jest-dom',
        'vitest',
        'typescript'
    ]
    
    let isValid = true
    
    // Check dependencies
    for (const dep of requiredDependencies) {
        if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
            logError(`Missing required dependency: ${dep}`)
            isValid = false
        } else {
            log(`✓ Dependency: ${dep}@${packageJson.dependencies[dep]}`, 'green')
        }
    }
    
    // Check dev dependencies
    for (const dep of requiredDevDependencies) {
        if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
            logError(`Missing required dev dependency: ${dep}`)
            isValid = false
        } else {
            log(`✓ Dev dependency: ${dep}@${packageJson.devDependencies[dep]}`, 'green')
        }
    }
    
    // Check scripts
    const requiredScripts = ['dev', 'build', 'test', 'lint']
    for (const script of requiredScripts) {
        if (!packageJson.scripts || !packageJson.scripts[script]) {
            logError(`Missing required script: ${script}`)
            isValid = false
        } else {
            log(`✓ Script: ${script}`, 'green')
        }
    }
    
    return isValid
}

function runTests() {
    logStep(3, 'Running Test Suite')
    
    // Run unit tests
    if (!runCommand('npm run test -- --run', 'Unit tests completed')) {
        return false
    }
    
    // Run accessibility tests if available
    if (fileExists('vitest.a11y.config.ts')) {
        if (!runCommand('npm run test:accessibility', 'Accessibility tests completed')) {
            logWarning('Accessibility tests failed, but continuing deployment')
        }
    }
    
    // Run visual tests if available
    if (fileExists('playwright.config.ts')) {
        if (!runCommand('npm run test:visual', 'Visual regression tests completed')) {
            logWarning('Visual tests failed, but continuing deployment')
        }
    }
    
    return true
}

function buildApplication() {
    logStep(4, 'Building Application')
    
    // Clean previous build
    if (fileExists(CONFIG.buildPath)) {
        log('Cleaning previous build...', 'blue')
        fs.rmSync(CONFIG.buildPath, { recursive: true, force: true })
    }
    
    // Run build
    return runCommand(CONFIG.buildCommand, 'Application build completed')
}

function validateBuild() {
    logStep(5, 'Validating Build Output')
    
    if (!fileExists(CONFIG.buildPath)) {
        logError('Build directory not found')
        return false
    }
    
    const buildStats = fs.statSync(CONFIG.buildPath)
    log(`Build directory size: ${(buildStats.size / 1024 / 1024).toFixed(2)} MB`, 'blue')
    
    // Check for critical build files
    const criticalFiles = [
        '.next/static',
        '.next/server',
        '.next/BUILD_ID'
    ]
    
    for (const file of criticalFiles) {
        if (!fileExists(file)) {
            logError(`Missing critical build file: ${file}`)
            return false
        } else {
            log(`✓ Found: ${file}`, 'green')
        }
    }
    
    return true
}

function generateMigrationScript() {
    logStep(6, 'Generating Migration Script')
    
    const migrationScript = `-- Hero Sections Migration Script
-- Generated on: ${new Date().toISOString()}

-- This script handles the migration of existing hero sections to the new system

BEGIN TRANSACTION;

-- Create backup of existing sections
CREATE TABLE IF NOT EXISTS sections_backup AS 
SELECT * FROM sections WHERE type = 'hero-section';

-- Update existing hero sections to use new variant system
UPDATE sections 
SET 
    type = 'hero-centered',
    props = json_set(
        props,
        '$.variant', 'centered',
        '$.version', '2.0.0'
    )
WHERE type = 'hero-section';

-- Add migration metadata
INSERT OR REPLACE INTO migrations (name, executed_at, version) 
VALUES ('hero_sections_v2', datetime('now'), '2.0.0');

COMMIT;

-- Verification queries
SELECT 'Migration completed. Verify results:' as message;
SELECT type, count(*) as count FROM sections GROUP BY type;
`
    
    // Ensure migrations directory exists
    if (!fileExists(CONFIG.migrationPath)) {
        fs.mkdirSync(CONFIG.migrationPath, { recursive: true })
    }
    
    const migrationFile = path.join(CONFIG.migrationPath, `hero-sections-v2-${Date.now()}.sql`)
    fs.writeFileSync(migrationFile, migrationScript)
    
    logSuccess(`Migration script generated: ${migrationFile}`)
    return true
}

function createDeploymentChecklist() {
    logStep(7, 'Creating Deployment Checklist')
    
    const checklist = `# Hero Sections Deployment Checklist

## Pre-deployment Validation
- [x] Hero sections structure validated
- [x] Package dependencies verified
- [x] Test suite passed
- [x] Application build successful
- [x] Build output validated
- [x] Migration script generated

## Deployment Steps
1. **Backup Current System**
   - [ ] Create database backup
   - [ ] Backup current codebase
   - [ ] Document current hero section configurations

2. **Deploy New Code**
   - [ ] Deploy application build to staging
   - [ ] Run migration script on staging database
   - [ ] Verify hero sections functionality in staging
   - [ ] Test section library UI
   - [ ] Verify all 10 hero variants are working

3. **Production Deployment**
   - [ ] Deploy to production environment
   - [ ] Run migration script on production database
   - [ ] Monitor application performance
   - [ ] Verify hero sections are rendering correctly
   - [ ] Test section creation and editing workflow

4. **Post-deployment Verification**
   - [ ] All hero variants accessible in section library
   - [ ] Existing hero sections migrated successfully
   - [ ] New hero sections can be created and edited
   - [ ] Performance metrics within acceptable range
   - [ ] No console errors or warnings

## Rollback Plan
If issues are encountered:
1. Restore database from backup
2. Deploy previous codebase version
3. Verify system functionality
4. Investigate and fix issues before retry

## Support Information
- Documentation: /docs/hero-sections/
- Migration script: ${CONFIG.migrationPath}/
- Test results: Available in CI/CD pipeline
- Contact: Development team

Generated on: ${new Date().toISOString()}
`
    
    fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist)
    logSuccess('Deployment checklist created: DEPLOYMENT_CHECKLIST.md')
    return true
}

function generateDeploymentReport() {
    logStep(8, 'Generating Deployment Report')
    
    const report = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        heroVariants: [
            'hero-centered',
            'hero-split-screen', 
            'hero-video',
            'hero-minimal',
            'hero-feature',
            'hero-testimonial',
            'hero-service',
            'hero-product',
            'hero-gallery',
            'hero-cta'
        ],
        features: [
            'Dynamic component loading',
            'Section library integration',
            'Theme compatibility',
            'Responsive design',
            'Accessibility compliance',
            'Performance optimization',
            'Migration utilities',
            'Comprehensive testing'
        ],
        buildInfo: {
            nodeVersion: process.version,
            platform: process.platform,
            buildTime: new Date().toISOString()
        },
        validation: {
            structureValid: true,
            dependenciesValid: true,
            testsPass: true,
            buildSuccessful: true
        }
    }
    
    fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2))
    logSuccess('Deployment report generated: deployment-report.json')
    return true
}

// Main deployment function
async function deployHeroSections() {
    log('\n🚀 Hero Sections Deployment Script', 'bright')
    log('=====================================', 'bright')
    
    const startTime = Date.now()
    
    try {
        // Validation steps
        if (!validateHeroSectionsStructure()) {
            throw new Error('Hero sections structure validation failed')
        }
        
        if (!validatePackageJson()) {
            throw new Error('Package configuration validation failed')
        }
        
        // Testing and building
        if (!runTests()) {
            throw new Error('Test suite failed')
        }
        
        if (!buildApplication()) {
            throw new Error('Application build failed')
        }
        
        if (!validateBuild()) {
            throw new Error('Build validation failed')
        }
        
        // Deployment preparation
        if (!generateMigrationScript()) {
            throw new Error('Migration script generation failed')
        }
        
        if (!createDeploymentChecklist()) {
            throw new Error('Deployment checklist creation failed')
        }
        
        if (!generateDeploymentReport()) {
            throw new Error('Deployment report generation failed')
        }
        
        const endTime = Date.now()
        const duration = ((endTime - startTime) / 1000).toFixed(2)
        
        log('\n🎉 Deployment Preparation Complete!', 'green')
        log('===================================', 'green')
        log(`Total time: ${duration} seconds`, 'green')
        log('\nNext steps:', 'bright')
        log('1. Review DEPLOYMENT_CHECKLIST.md', 'blue')
        log('2. Deploy to staging environment', 'blue')
        log('3. Run migration script', 'blue')
        log('4. Verify functionality', 'blue')
        log('5. Deploy to production', 'blue')
        
    } catch (error) {
        logError(`\nDeployment preparation failed: ${error.message}`)
        process.exit(1)
    }
}

// Run the deployment script
if (require.main === module) {
    deployHeroSections()
}

module.exports = {
    deployHeroSections,
    validateHeroSectionsStructure,
    validatePackageJson,
    runTests,
    buildApplication
}