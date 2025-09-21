#!/usr/bin/env node

/**
 * Localization Validation Script
 * 
 * Validates translation files for:
 * - File existence
 * - JSON validity
 * - Key consistency
 * - Empty translations
 * - Duplicate keys
 */

const fs = require('fs');
const path = require('path');

class LocalizationValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.supportedLocales = ['en', 'ru', 'es']; // Could be loaded from config
        this.langPath = path.join(__dirname, '..', 'resources', 'lang');
    }

    log(message, type = 'info') {
        const icons = {
            info: '📝',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        console.log(`${icons[type]} ${message}`);
    }

    addError(message) {
        this.errors.push(message);
    }

    addWarning(message) {
        this.warnings.push(message);
    }

    validateFileExistence() {
        this.log('Checking translation file existence...');
        
        for (const locale of this.supportedLocales) {
            const filePath = path.join(this.langPath, `${locale}.json`);
            if (!fs.existsSync(filePath)) {
                this.addError(`Missing translation file for locale '${locale}': ${filePath}`);
            }
        }
    }

    validateJsonSyntax() {
        this.log('Validating JSON syntax...');
        
        const translations = {};
        
        for (const locale of this.supportedLocales) {
            const filePath = path.join(this.langPath, `${locale}.json`);
            
            if (!fs.existsSync(filePath)) {
                continue; // Already reported in validateFileExistence
            }
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const parsed = JSON.parse(content);
                translations[locale] = parsed;
            } catch (error) {
                this.addError(`Invalid JSON in ${locale}.json: ${error.message}`);
            }
        }
        
        return translations;
    }

    validateKeyConsistency(translations) {
        this.log('Checking key consistency...');
        
        const locales = Object.keys(translations);
        if (locales.length === 0) return;
        
        const masterLocale = locales[0];
        const masterKeys = Object.keys(translations[masterLocale]);
        
        for (const locale of locales.slice(1)) {
            const currentKeys = Object.keys(translations[locale]);
            
            // Missing keys
            const missingKeys = masterKeys.filter(key => !currentKeys.includes(key));
            missingKeys.forEach(key => {
                this.addError(`Key '${key}' exists in ${masterLocale}.json but missing in ${locale}.json`);
            });
            
            // Extra keys
            const extraKeys = currentKeys.filter(key => !masterKeys.includes(key));
            extraKeys.forEach(key => {
                this.addWarning(`Key '${key}' exists in ${locale}.json but missing in ${masterLocale}.json`);
            });
        }
    }

    validateEmptyTranslations(translations) {
        this.log('Checking for empty translations...');
        
        for (const [locale, keys] of Object.entries(translations)) {
            for (const [key, value] of Object.entries(keys)) {
                if (typeof value === 'string' && value.trim() === '') {
                    this.addError(`Empty translation for key '${key}' in ${locale}.json`);
                }
            }
        }
    }

    validateDuplicateKeys() {
        this.log('Checking for duplicate keys...');
        
        for (const locale of this.supportedLocales) {
            const filePath = path.join(this.langPath, `${locale}.json`);
            
            if (!fs.existsSync(filePath)) {
                continue;
            }
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const keyMatches = content.match(/"([^"]+)"\s*:/g);
                
                if (keyMatches) {
                    const keys = keyMatches.map(match => match.match(/"([^"]+)"/)[1]);
                    const keyCount = {};
                    
                    keys.forEach(key => {
                        keyCount[key] = (keyCount[key] || 0) + 1;
                    });
                    
                    Object.entries(keyCount).forEach(([key, count]) => {
                        if (count > 1) {
                            this.addError(`Duplicate key '${key}' found ${count} times in ${locale}.json`);
                        }
                    });
                }
            } catch (error) {
                // JSON parsing errors already handled in validateJsonSyntax
            }
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 LOCALIZATION VALIDATION REPORT');
        console.log('='.repeat(60));
        
        if (this.errors.length > 0) {
            this.log('\n🚨 ERRORS:', 'error');
            this.errors.forEach(error => console.log(`  • ${error}`));
        }
        
        if (this.warnings.length > 0) {
            this.log('\n⚠️  WARNINGS:', 'warning');
            this.warnings.forEach(warning => console.log(`  • ${warning}`));
        }
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            this.log('\nAll localization files are valid!', 'success');
            this.log(`Locales checked: ${this.supportedLocales.join(', ')}`);
        }
        
        console.log('\n' + '='.repeat(60));
        console.log(`Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
        console.log('='.repeat(60));
        
        return this.errors.length === 0;
    }

    validate() {
        this.log('🔍 Starting localization validation...\n');
        
        this.validateFileExistence();
        
        if (this.errors.length === 0) {
            const translations = this.validateJsonSyntax();
            
            if (this.errors.length === 0) {
                this.validateKeyConsistency(translations);
                this.validateEmptyTranslations(translations);
                this.validateDuplicateKeys();
            }
        }
        
        return this.generateReport();
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new LocalizationValidator();
    const isValid = validator.validate();
    process.exit(isValid ? 0 : 1);
}

module.exports = LocalizationValidator;
