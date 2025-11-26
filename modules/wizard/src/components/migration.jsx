import React, { useState, useEffect } from 'react'
import { Button, Container, Label, Checkbox } from '@bsf/force-ui'
import { __, sprintf } from '@wordpress/i18n'
import { setupContext } from '../pages/setup-page'
import { getNonce } from '../utils'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { LoaderPinwheel } from "lucide-react"

const Migration = ({ onComplete, onSkip }) => {
  const { setSetupProgress, selectedLanguageData, setSelectedLanguageData } = React.useContext(setupContext)
  const [migrationData, setMigrationData] = useState(null)
  const [selectedPlugin, setSelectedPlugin] = useState(null) // 'polylang' or 'wpml'
  const [isDetecting, setIsDetecting] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationComplete, setMigrationComplete] = useState(false)
  const [detectionCompleted, setDetectionCompleted] = useState(false)
  const [migrationOptions, setMigrationOptions] = useState({
    migrate_languages: true,
    migrate_translations: true,
    migrate_settings: true,
    migrate_strings: true
  })

  const handleContinue = () => {
    if (onComplete) {
      onComplete()
    } else {
      setSetupProgress("default")
      localStorage.setItem("setupProgress", "default")
    }
  }

  // Check if migration plugin exists (from localized data) to determine if we should show this step
  const hasMigrationData = () => {
    const polylangData = window.lmat_setup?.polylang_detection
    const wpmlData = window.lmat_setup?.wpml_detection
    
    // Check if either plugin is detected
    const hasPolylang = polylangData && typeof polylangData === 'object' && polylangData.has_polylang === true
    const hasWPML = wpmlData && typeof wpmlData === 'object' && wpmlData.has_wpml === true
    
    return hasPolylang || hasWPML
  }

  // Always show the migration step - let users manually detect if needed
  // Only auto-advance if we're absolutely certain there's no migration data
  useEffect(() => {
    // Give it a delay to ensure localized data is fully loaded
    const timer = setTimeout(() => {
      // Only auto-advance if:
      // 1. No migration data detected from localized script
      // 2. User hasn't manually detected anything
      // 3. User hasn't started detecting
      if (!hasMigrationData() && !migrationData && !isDetecting) {
        // Auto-advance to next step if no migration plugin exists
        if (onComplete) {
          onComplete()
        } else {
          handleContinue()
        }
      }
    }, 500) // Longer delay to ensure data is loaded
    
    return () => clearTimeout(timer)
  }, [])

  const checkMigration = async (plugin) => {
    setIsDetecting(true)
    setSelectedPlugin(plugin)
    try {
      const response = await apiFetch({
        path: `lmat/v1/settings/migration/${plugin}/detect`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        }
      })
      const hasKey = plugin === 'polylang' ? 'has_polylang' : 'has_wpml'
      const pluginName = plugin === 'polylang' ? 'Polylang' : 'WPML'
      
      if (response && response[hasKey] === true) {
        setMigrationData(response)
        setDetectionCompleted(true)
        toast.success(sprintf(__('%s data detected successfully.', 'linguator-multilingual-ai-translation'), pluginName))
      } else {
        setMigrationData(null)
        setDetectionCompleted(true)
        toast.error(response?.message || sprintf(__('No %s data found.', 'linguator-multilingual-ai-translation'), pluginName))
      }
    } catch (error) {
      console.error(`Error checking ${plugin}:`, error)
      const pluginName = plugin === 'polylang' ? 'Polylang' : 'WPML'
      toast.error(error?.message || sprintf(__('Failed to detect %s data.', 'linguator-multilingual-ai-translation'), pluginName))
      setMigrationData(null)
      setDetectionCompleted(true)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleMigrate = async () => {
    if (!selectedPlugin) {
      toast.error(__('Please select a plugin to migrate from.', 'linguator-multilingual-ai-translation'))
      return
    }

    setIsMigrating(true)
    try {
      const response = await apiFetch({
        path: `lmat/v1/settings/migration/${selectedPlugin}/migrate`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        },
        body: JSON.stringify(migrationOptions)
      })

      if (response.success) {
        setMigrationComplete(true)
        
        // Refresh languages list
        const languageResponse = await apiFetch({
          path: 'lmat/v1/languages',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce()
          }
        })
        
        if (Array.isArray(languageResponse)) {
          setSelectedLanguageData(languageResponse)
        }
        
        // Save migration status to database
        try {
          await apiFetch({
            path: 'lmat/v1/settings/migration-status',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': getNonce()
            },
            body: JSON.stringify({
              completed: true
            })
          })
        } catch (error) {
          console.error('Failed to save migration status:', error)
        }
        
        // Mark setup as complete to skip remaining steps
        try {
          await apiFetch({
            path: 'lmat/v1/settings/setup-complete',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': getNonce()
            },
            body: JSON.stringify({
              complete: true
            })
          })
        } catch (error) {
          console.error('Failed to mark setup as complete:', error)
        }
        
        toast.success(response.message || __('Migration completed successfully!', 'linguator-multilingual-ai-translation'))
      } else {
        throw new Error(response.message || __('Migration failed', 'linguator-multilingual-ai-translation'))
      }
    } catch (error) {
      console.error('Migration error:', error)
      toast.error(error.message || __('Migration failed. Please try again.', 'linguator-multilingual-ai-translation'))
    } finally {
      setIsMigrating(false)
    }
  }

  const handleSkip = async () => {
    // Save migration status to database
    try {
      await apiFetch({
        path: 'lmat/v1/settings/migration-status',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        },
        body: JSON.stringify({
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to save migration status:', error)
    }
    
    if (onSkip) {
      onSkip()
    } else {
      setSetupProgress("default")
      localStorage.setItem("setupProgress", "default")
    }
  }

  // If migration is already completed, show message and continue button
  if (migrationComplete) {
    return (
      <div className='mx-auto max-w-[600px] p-10 min-h-[40vh] bg-white shadow-sm flex flex-col'>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 text-center">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">{__('Migration Completed Successfully', 'linguator-multilingual-ai-translation')}</h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            {__('Your multilingual plugin data has been successfully migrated to Linguator. You can now continue with the setup.', 'linguator-multilingual-ai-translation')}
          </p>
          <Button
            onClick={() => {
              const adminUrl = window.lmat_setup?.admin_url || ''
              window.location.href = `${adminUrl}admin.php?page=lmat_settings&tab=translation`
            }}
            variant="primary"
            size="md"
          >
            {__('Continue Setup', 'linguator-multilingual-ai-translation')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-[600px] p-10 min-h-[40vh] bg-white shadow-sm flex flex-col'>
      <Container cols="1" containerType='grid'>
      <Container.Item>
        <h1 className='font-bold mb-4'>{__('Migration to Linguator', 'linguator-multilingual-ai-translation')}</h1>
        <p className="mb-6 text-gray-600">
          {__('Migrate your multilingual plugin data (languages, translations, settings, and strings) to Linguator. This process will preserve all your existing multilingual content.', 'linguator-multilingual-ai-translation')}
        </p>
      </Container.Item>

      <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />

      <Container.Item>
        <div className="mb-6">
          <Label size='md' className='font-bold mb-2 text-green-600'>
            {__('Step 1: Select Plugin and Detect Data', 'linguator-multilingual-ai-translation')}
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            {__('First, select the plugin you want to migrate from and check if data exists on your site.', 'linguator-multilingual-ai-translation')}
          </p>
          <div className="flex gap-3 mb-4">
            <Button
              onClick={() => checkMigration('polylang')}
              disabled={isDetecting || isMigrating || (migrationData !== null && selectedPlugin === 'polylang')}
              variant={selectedPlugin === 'polylang' ? "primary" : "outline"}
              size="md"
              icon={isDetecting && selectedPlugin === 'polylang' ? <LoaderPinwheel className="animate-spin" /> : null}
            >
              {isDetecting && selectedPlugin === 'polylang' ? __('Detecting...', 'linguator-multilingual-ai-translation') : __('Detect Polylang', 'linguator-multilingual-ai-translation')}
            </Button>
            <Button
              onClick={() => checkMigration('wpml')}
              disabled={isDetecting || isMigrating || (migrationData !== null && selectedPlugin === 'wpml')}
              variant={selectedPlugin === 'wpml' ? "primary" : "outline"}
              size="md"
              icon={isDetecting && selectedPlugin === 'wpml' ? <LoaderPinwheel className="animate-spin" /> : null}
            >
              {isDetecting && selectedPlugin === 'wpml' ? __('Detecting...', 'linguator-multilingual-ai-translation') : __('Detect WPML', 'linguator-multilingual-ai-translation')}
            </Button>
          </div>
        </div>

        {migrationData && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">
              {selectedPlugin === 'polylang' ? __('Polylang Data Detected:', 'linguator-multilingual-ai-translation') : __('WPML Data Detected:', 'linguator-multilingual-ai-translation')}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {migrationData.languages_count > 0 && (
                <li>{sprintf(__('%d language(s) found', 'linguator-multilingual-ai-translation'), migrationData.languages_count)}</li>
              )}
              {migrationData.posts_count > 0 && (
                <li>{sprintf(__('%d post(s) with language assignments', 'linguator-multilingual-ai-translation'), migrationData.posts_count)}</li>
              )}
              {(migrationData.post_translations > 0 || migrationData.translations_count > 0) && (
                <li>{sprintf(__('%d translation group(s) found', 'linguator-multilingual-ai-translation'), migrationData.post_translations || migrationData.translations_count || 0)}</li>
              )}
              {migrationData.strings_count > 0 && (
                <li>{sprintf(__('%d string translation(s) found', 'linguator-multilingual-ai-translation'), migrationData.strings_count)}</li>
              )}
            </ul>
          </div>
        )}
      </Container.Item>

      {detectionCompleted && migrationData && (
        <>
          <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />

          <Container.Item>
            <div className="mb-6">
              <Label size='md' className='font-bold mb-2 text-green-600'>
                {__('Step 2: Select Migration Options', 'linguator-multilingual-ai-translation')}
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                {sprintf(__('Choose what data you want to migrate from %s. Unchecked items will not be migrated.', 'linguator-multilingual-ai-translation'), selectedPlugin === 'polylang' ? 'Polylang' : 'WPML')}
              </p>
              {!migrationOptions.migrate_languages && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>{__('Note:', 'linguator-multilingual-ai-translation')}</strong> {__('If languages are not migrated, language assignments and translations will also be skipped, as they require languages to exist first.', 'linguator-multilingual-ai-translation')}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <Checkbox
                  label={{
                    heading: __('Migrate Languages', 'linguator-multilingual-ai-translation'),
                    description: sprintf(__('Import all languages configured in %s.', 'linguator-multilingual-ai-translation'), selectedPlugin === 'polylang' ? 'Polylang' : 'WPML')
                  }}
                  checked={migrationOptions.migrate_languages}
                  onChange={() => setMigrationOptions(prev => ({ ...prev, migrate_languages: !prev.migrate_languages }))}
                  size="sm"
                />
                <Checkbox
                  label={{
                    heading: __('Migrate Translations', 'linguator-multilingual-ai-translation'),
                    description: __('Import translation relationships between posts, pages, and terms.', 'linguator-multilingual-ai-translation')
                  }}
                  checked={migrationOptions.migrate_translations}
                  onChange={() => setMigrationOptions(prev => ({ ...prev, migrate_translations: !prev.migrate_translations }))}
                  size="sm"
                  disabled={!migrationOptions.migrate_languages}
                />
                <Checkbox
                  label={{
                    heading: __('Migrate Settings', 'linguator-multilingual-ai-translation'),
                    description: sprintf(__('Import %s settings (URL structure, post types, taxonomies, etc.).', 'linguator-multilingual-ai-translation'), selectedPlugin === 'polylang' ? 'Polylang' : 'WPML')
                  }}
                  checked={migrationOptions.migrate_settings}
                  onChange={() => setMigrationOptions(prev => ({ ...prev, migrate_settings: !prev.migrate_settings }))}
                  size="sm"
                />
                <Checkbox
                  label={{
                    heading: __('Migrate Static Strings', 'linguator-multilingual-ai-translation'),
                    description: sprintf(__('Import translated static strings from %s String Translation.', 'linguator-multilingual-ai-translation'), selectedPlugin === 'polylang' ? 'Polylang' : 'WPML')
                  }}
                  checked={migrationOptions.migrate_strings}
                  onChange={() => setMigrationOptions(prev => ({ ...prev, migrate_strings: !prev.migrate_strings }))}
                  size="sm"
                />
              </div>
            </div>
          </Container.Item>

          <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />

          <Container.Item>
            <div className="mb-6">
              <Label size='md' className='font-bold mb-2 text-green-600'>
                {__('Step 3: Start Migration', 'linguator-multilingual-ai-translation')}
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                {__('Click the button below to start the migration process. This may take a few minutes depending on the amount of data.', 'linguator-multilingual-ai-translation')}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleSkip}
                  disabled={isMigrating || isDetecting}
                  variant="outline"
                  size="md"
                >
                  {__('Skip Migration', 'linguator-multilingual-ai-translation')}
                </Button>
                <Button
                  onClick={handleMigrate}
                  disabled={isMigrating || isDetecting}
                  variant="primary"
                  size="md"
                  icon={isMigrating ? <LoaderPinwheel className="animate-spin" /> : null}
                >
                  {isMigrating ? __('Migrating...', 'linguator-multilingual-ai-translation') : __('Start Migration', 'linguator-multilingual-ai-translation')}
                </Button>
              </div>
            </div>
          </Container.Item>
        </>
      )}
      </Container>
    </div>
  )
}

export default Migration
