import React from 'react'
import { Button } from '@bsf/force-ui'
import { __, sprintf } from '@wordpress/i18n'
import { setupContext } from '../pages/setup-page'
import { getNonce } from '../utils'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { IoIosWarning } from "react-icons/io";
import { CheckCircle2, XCircle } from "lucide-react";

const Migration = ({ onComplete, onSkip }) => {
  const { setupProgress, setSetupProgress, selectedLanguageData, setSelectedLanguageData } = React.useContext(setupContext)
  const [migrationData, setMigrationData] = React.useState(() => {
    // Initialize from localized data if available
    const localizedData = window.lmat_setup?.polylang_detection
    return localizedData && localizedData.has_polylang ? localizedData : false
  })
  const [migrating, setMigrating] = React.useState(false)
  const [migrationComplete, setMigrationComplete] = React.useState(false)
  const [migrationResults, setMigrationResults] = React.useState(null)

  React.useEffect(() => {
    // Check for Polylang on component mount
    // First check the localized data, then check via API if needed
    const localizedData = window.lmat_setup?.polylang_detection
    if (localizedData && typeof localizedData === 'object' && localizedData.has_polylang === true) {
      setMigrationData(localizedData)
    } else if (!migrationData) {
      // If no localized data, try API call
      checkPolylang()
    }
  }, [])

  const checkPolylang = async () => {
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
      }
    } catch (error) {
      console.error('Error checking Polylang:', error)
    }
  }

  const handleMigrate = async () => {
    setMigrating(true)
    try {
      const response = await apiFetch({
        path: 'lmat/v1/settings/migration/migrate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        },
        body: JSON.stringify({
          migrate_languages: true,
          migrate_translations: true,
          migrate_settings: true,
          migrate_strings: true,
        })
      })

      if (response.success) {
        setMigrationComplete(true)
        setMigrationResults(response.data)
        
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
        
        toast.success(__('Migration completed successfully!', 'linguator-multilingual-ai-translation'))
      } else {
        throw new Error(response.message || __('Migration failed', 'linguator-multilingual-ai-translation'))
      }
    } catch (error) {
      console.error('Migration error:', error)
      toast.error(error.message || __('Migration failed. Please try again.', 'linguator-multilingual-ai-translation'))
    } finally {
      setMigrating(false)
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

  const handleContinue = () => {
    if (onComplete) {
      onComplete()
    } else {
      setSetupProgress("default")
      localStorage.setItem("setupProgress", "default")
    }
  }

  // If no Polylang detected, skip this step
  if (!migrationData || !migrationData.has_polylang) {
    // Auto-advance to next step
    React.useEffect(() => {
      if (onComplete) {
        onComplete()
      } else {
        handleContinue()
      }
    }, [])
    return null
  }

  return (
    <div className="mx-auto max-w-[600px] p-10 min-h-[38vh] bg-white shadow-sm flex flex-col" style={{marginTop: "12px"}}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-text-primary mb-3">
          {__('Migrate from Polylang', 'linguator-multilingual-ai-translation')}
        </h3>
        <p className="text-text-secondary mb-6">
          {__('We detected that you have Polylang installed. You can migrate your languages, translation links, and settings to Linguator.', 'linguator-multilingual-ai-translation')}
        </p>
      </div>

      <div className="flex-grow">
        {!migrationComplete ? (
          <>
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
              <div className='flex items-start gap-2'>
                <IoIosWarning className='text-yellow-500 text-xl mt-0.5 flex-shrink-0' />
                <div>
                  <p className='m-0 text-sm font-medium text-yellow-800'>
                    {__('What will be migrated:', 'linguator-multilingual-ai-translation')}
                  </p>
                  <ul className='mt-2 space-y-1 text-sm text-yellow-700 list-disc list-inside'>
                    {migrationData.languages_count > 0 && (
                      <li>{sprintf(__('%d language(s)', 'linguator-multilingual-ai-translation'), migrationData.languages_count)}</li>
                    )}
                    {migrationData.post_translations > 0 && (
                      <li>{sprintf(__('%d post translation group(s)', 'linguator-multilingual-ai-translation'), migrationData.post_translations)}</li>
                    )}
                    {migrationData.term_translations > 0 && (
                      <li>{sprintf(__('%d term translation group(s)', 'linguator-multilingual-ai-translation'), migrationData.term_translations)}</li>
                    )}
                    {migrationData.strings_count > 0 && (
                      <li>{sprintf(__('%d static string(s)', 'linguator-multilingual-ai-translation'), migrationData.strings_count)}</li>
                    )}
                    {migrationData.has_settings && (
                      <li>{__('Settings (default language, URL structure, etc.)', 'linguator-multilingual-ai-translation')}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
            <div className='flex items-start gap-2'>
              <CheckCircle2 className='text-green-500 text-xl mt-0.5 flex-shrink-0' />
              <div>
                <p className='m-0 text-sm font-medium text-green-800 mb-2'>
                  {__('Migration completed successfully!', 'linguator-multilingual-ai-translation')}
                </p>
                {migrationResults && (
                  <ul className='space-y-1 text-sm text-green-700'>
                    {migrationResults.languages?.migrated > 0 && (
                      <li>{sprintf(__('%d language(s) migrated', 'linguator-multilingual-ai-translation'), migrationResults.languages.migrated)}</li>
                    )}
                    {migrationResults.language_assignments?.posts_assigned > 0 && (
                      <li>{sprintf(__('%d post(s)/page(s) language assigned', 'linguator-multilingual-ai-translation'), migrationResults.language_assignments.posts_assigned)}</li>
                    )}
                    {migrationResults.language_assignments?.terms_assigned > 0 && (
                      <li>{sprintf(__('%d term(s) language assigned', 'linguator-multilingual-ai-translation'), migrationResults.language_assignments.terms_assigned)}</li>
                    )}
                    {migrationResults.translations?.post_translations > 0 && (
                      <li>{sprintf(__('%d post translation group(s) migrated', 'linguator-multilingual-ai-translation'), migrationResults.translations.post_translations)}</li>
                    )}
                    {migrationResults.translations?.term_translations > 0 && (
                      <li>{sprintf(__('%d term translation group(s) migrated', 'linguator-multilingual-ai-translation'), migrationResults.translations.term_translations)}</li>
                    )}
                    {migrationResults.settings?.migrated?.length > 0 && (
                      <li>{sprintf(__('%d setting(s) migrated', 'linguator-multilingual-ai-translation'), migrationResults.settings.migrated.length)}</li>
                    )}
                    {migrationResults.strings?.strings_migrated > 0 && (
                      <li>{sprintf(__('%d static string(s) migrated', 'linguator-multilingual-ai-translation'), migrationResults.strings.strings_migrated)}</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3 pt-4">
        {!migrationComplete ? (
          <>
            <Button
              variant='outline'
              onClick={handleSkip}
              disabled={migrating}
              className="px-8 py-3"
            >
              {__('Skip Migration', 'linguator-multilingual-ai-translation')}
            </Button>
            <Button
              onClick={handleMigrate}
              disabled={migrating}
              className="px-8 py-3"
            >
              {migrating ? (
                <>
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>
                  {__('Migrating...', 'linguator-multilingual-ai-translation')}
                </>
              ) : (
                __('Migrate', 'linguator-multilingual-ai-translation')
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              const adminUrl = window.lmat_setup?.admin_url || ''
              window.location.href = `${adminUrl}admin.php?page=lmat_settings&tab=translation`
            }}
            className="px-8 py-3"
          >
            {__('Go to Settings', 'linguator-multilingual-ai-translation')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Migration

