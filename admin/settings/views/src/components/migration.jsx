import React, { useState, useEffect } from 'react'
import apiFetch from "@wordpress/api-fetch"
import { Button, Container, Label, Checkbox } from '@bsf/force-ui'
import { toast } from 'sonner'
import { getNonce } from '../utils'
import { __, sprintf } from '@wordpress/i18n'
import { LoaderPinwheel } from "lucide-react"

const Migration = ({ data, setData }) => {
    const [migrationCompleted, setMigrationCompleted] = useState(data?.lmat_migration_completed || false)
    const [isDetecting, setIsDetecting] = useState(false)
    const [isMigrating, setIsMigrating] = useState(false)
    const [migrationData, setMigrationData] = useState(null)
    const [selectedPlugin, setSelectedPlugin] = useState(null) // 'polylang' or 'wpml'
    const [migrationOptions, setMigrationOptions] = useState({
        migrate_languages: true,
        migrate_translations: true,
        migrate_settings: true,
        migrate_strings: true
    })

    // Check migration status on component mount
    useEffect(() => {
        if (data?.lmat_migration_completed) {
            setMigrationCompleted(true)
        }
    }, [data])

    // Detect migration data for a specific plugin
    const detectMigration = async (plugin) => {
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

            if (response[hasKey] === false) {
                toast.error(response.message || sprintf(__('No %s data found.', 'linguator-multilingual-ai-translation'), pluginName))
                setMigrationData(null)
            } else {
                setMigrationData(response)
                toast.success(sprintf(__('%s data detected successfully.', 'linguator-multilingual-ai-translation'), pluginName))
            }
        } catch (error) {
            const pluginName = plugin === 'polylang' ? 'Polylang' : 'WPML'
            toast.error(error?.message || sprintf(__('Failed to detect %s data.', 'linguator-multilingual-ai-translation'), pluginName))
            setMigrationData(null)
        } finally {
            setIsDetecting(false)
        }
    }

    // Perform migration
    const performMigration = async () => {
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
                // Mark migration as completed
                await apiFetch({
                    path: 'lmat/v1/settings/migration-status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': getNonce()
                    },
                    body: JSON.stringify({ completed: true })
                })

                setMigrationCompleted(true)
                setData(prev => ({ ...prev, lmat_migration_completed: true }))
                toast.success(response.message || __('Migration completed successfully.', 'linguator-multilingual-ai-translation'))
            } else {
                toast.error(response.message || __('Migration failed.', 'linguator-multilingual-ai-translation'))
            }
        } catch (error) {
            toast.error(error?.message || __('Migration failed. Please try again.', 'linguator-multilingual-ai-translation'))
        } finally {
            setIsMigrating(false)
        }
    }

    // If migration is already completed, show message
    if (migrationCompleted) {
        return (
            <Container className='bg-white p-10 rounded-lg shadow-sm' cols="1" containerType='grid'>
                <Container.Item>
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="mb-4 text-center">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{__('Migration Already Completed', 'linguator-multilingual-ai-translation')}</h2>
                        <p className="text-gray-600 text-center max-w-md">
                            {__('You have already completed the migration to Linguator. All your data has been successfully migrated.', 'linguator-multilingual-ai-translation')}
                        </p>
                    </div>
                </Container.Item>
            </Container>
        )
    }

    return (
        <Container className='bg-white p-10 rounded-lg shadow-sm' cols="1" containerType='grid'>
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
                            onClick={() => detectMigration('polylang')}
                            disabled={isDetecting || isMigrating || (migrationData !== null && selectedPlugin === 'polylang')}
                            variant={selectedPlugin === 'polylang' ? "primary" : "outline"}
                            size="md"
                            icon={isDetecting && selectedPlugin === 'polylang' ? <LoaderPinwheel className="animate-spin" /> : null}
                        >
                            {isDetecting && selectedPlugin === 'polylang' ? __('Detecting...', 'linguator-multilingual-ai-translation') : __('Detect Polylang', 'linguator-multilingual-ai-translation')}
                        </Button>
                        <Button
                            onClick={() => detectMigration('wpml')}
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

            {migrationData && (
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
                            <Button
                                onClick={performMigration}
                                disabled={isMigrating || isDetecting}
                                variant="primary"
                                size="md"
                                icon={isMigrating ? <LoaderPinwheel className="animate-spin" /> : null}
                            >
                                {isMigrating ? __('Migrating...', 'linguator-multilingual-ai-translation') : __('Start Migration', 'linguator-multilingual-ai-translation')}
                            </Button>
                        </div>
                    </Container.Item>
                </>
            )}
        </Container>
    )
}

export default Migration

