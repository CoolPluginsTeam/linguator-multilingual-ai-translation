import React, { useState, useEffect } from 'react'
import { Button, Container, Label, Checkbox } from '@bsf/force-ui'
import { __, sprintf } from '@wordpress/i18n'
import { setupContext } from '../pages/setup-page'
import { getNonce } from '../utils'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { LoaderPinwheel } from "lucide-react"

const Migration = ({ onComplete, onSkip }) => {
  const { setupProgress, setSetupProgress, selectedLanguageData, setSelectedLanguageData } = React.useContext(setupContext)
  const [migrationData, setMigrationData] = useState(null)
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

  useEffect(() => {
    // Check for Polylang on component mount
    // First check the localized data, then check via API if needed
    const localizedData = window.lmat_setup?.polylang_detection
    if (localizedData && typeof localizedData === 'object' && localizedData.has_polylang === true) {
      // Don't auto-set migrationData, let user click detect button
      // Just check if Polylang exists to show the step
    } else if (!migrationData) {
      // If no localized data, component will show detection step
    }
  }, [])

  const handleContinue = () => {
    if (onComplete) {
      onComplete()
    } else {
      setSetupProgress("default")
      localStorage.setItem("setupProgress", "default")
    }
  }

  // Check if Polylang exists (from localized data) to determine if we should show this step
  const hasPolylangData = () => {
    const localizedData = window.lmat_setup?.polylang_detection
    return localizedData && typeof localizedData === 'object' && localizedData.has_polylang === true
  }

  // If no Polylang detected at all, skip this step immediately
  useEffect(() => {
    // Check both localized data and if user hasn't detected yet
    if (!hasPolylangData() && !migrationData) {
      // Auto-advance to next step if no Polylang exists
      // This ensures the migration step is skipped when there's no Polylang data
      if (onComplete) {
        onComplete()
      } else {
        handleContinue()
      }
    }
  }, [])

  // If no Polylang exists and no detection done, don't render the migration component
  // This prevents the migration step from showing when there's no Polylang data
  if (!hasPolylangData() && !migrationData) {
    return null
  }

  const checkPolylang = async () => {
    setIsDetecting(true)
    try {
      const response = await apiFetch({
        path: 'lmat/v1/settings/migration/detect',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        }
      })
      if (response && response.has_polylang === true) {
        setMigrationData(response)
        setDetectionCompleted(true)
        toast.success(__('Polylang data detected successfully.', 'linguator-multilingual-ai-translation'))
      } else {
        setMigrationData(null)
        setDetectionCompleted(true)
        toast.error(response?.message || __('No Polylang data found.', 'linguator-multilingual-ai-translation'))
      }
    } catch (error) {
      console.error('Error checking Polylang:', error)
      toast.error(error?.message || __('Failed to detect Polylang data.', 'linguator-multilingual-ai-translation'))
      setMigrationData(null)
      setDetectionCompleted(true)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleMigrate = async () => {
    setIsMigrating(true)
    try {
      const response = await apiFetch({
        path: 'lmat/v1/settings/migration/migrate',
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
            {__('Your Polylang data has been successfully migrated to Linguator. You can now continue with the setup.', 'linguator-multilingual-ai-translation')}
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
        <h1 className='font-bold mb-4'>{__('Polylang to Linguator Migration', 'linguator-multilingual-ai-translation')}</h1>
        <p className="mb-6 text-gray-600">
          {__('Migrate your Polylang data (languages, translations, settings, and strings) to Linguator. This process will preserve all your existing multilingual content.', 'linguator-multilingual-ai-translation')}
        </p>
      </Container.Item>

      <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />

      <Container.Item>
        <div className="mb-6">
          <Label size='md' className='font-bold mb-2 text-green-600'>
            {__('Step 1: Detect Polylang Data', 'linguator-multilingual-ai-translation')}
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            {__('First, check if Polylang data exists on your site.', 'linguator-multilingual-ai-translation')}
          </p>
          <Button
            onClick={checkPolylang}
            disabled={isDetecting || isMigrating}
            variant="primary"
            size="md"
            icon={isDetecting ? <LoaderPinwheel className="animate-spin" /> : null}
          >
            {isDetecting ? __('Detecting...', 'linguator-multilingual-ai-translation') : __('Detect Polylang Data', 'linguator-multilingual-ai-translation')}
          </Button>
        </div>

        {migrationData && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">{__('Polylang Data Detected:', 'linguator-multilingual-ai-translation')}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {migrationData.languages_count > 0 && (
                <li>{sprintf(__('%d language(s) found', 'linguator-multilingual-ai-translation'), migrationData.languages_count)}</li>
              )}
              {migrationData.posts_count > 0 && (
                <li>{sprintf(__('%d post(s) with language assignments', 'linguator-multilingual-ai-translation'), migrationData.posts_count)}</li>
              )}
              {migrationData.translations_count > 0 && (
                <li>{sprintf(__('%d translation group(s) found', 'linguator-multilingual-ai-translation'), migrationData.translations_count)}</li>
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
                {__('Choose what data you want to migrate from Polylang. Unchecked items will not be migrated.', 'linguator-multilingual-ai-translation')}
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
                    description: __('Import all languages configured in Polylang.', 'linguator-multilingual-ai-translation')
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
                    description: __('Import Polylang settings (URL structure, post types, taxonomies, etc.).', 'linguator-multilingual-ai-translation')
                  }}
                  checked={migrationOptions.migrate_settings}
                  onChange={() => setMigrationOptions(prev => ({ ...prev, migrate_settings: !prev.migrate_settings }))}
                  size="sm"
                />
                <Checkbox
                  label={{
                    heading: __('Migrate Static Strings', 'linguator-multilingual-ai-translation'),
                    description: __('Import translated static strings from Polylang String Translation.', 'linguator-multilingual-ai-translation')
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
