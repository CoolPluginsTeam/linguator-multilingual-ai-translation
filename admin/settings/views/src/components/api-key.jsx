import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Input, Label } from '@bsf/force-ui'
import apiFetch from "@wordpress/api-fetch"
import { toast } from 'sonner'
import { __, sprintf } from '@wordpress/i18n'
import { getNonce } from '../utils'
import { GeminiIcon } from '../../../../../assets/logo/gemini'

const providerIcons = {
  gemini: GeminiIcon,
}

const providerKeyLinks = {
  gemini: 'https://aistudio.google.com/app/api-keys',
}

const providerKeyLabels = {
  gemini: 'Gemini',
}

const providerMeta = [
  {
    key: 'gemini',
    modelKey: 'gemini_model',
    heading: __('Add Gemini API key', 'linguator-multilingual-ai-translation'),
    modelHeading: __('Select Gemini Model', 'linguator-multilingual-ai-translation'),
    placeholder: 'AIza…',
  },
]

const ApiKey = ({ data, setData }) => {
  const [loading, setLoading] = useState(true)
  const [masked, setMasked] = useState({ gemini: '' })
  const [configured, setConfigured] = useState({ gemini: false })
  const [keyDrafts, setKeyDrafts] = useState({ gemini: '' })
  const [availableModels, setAvailableModels] = useState({ gemini: [] })
  const [models, setModels] = useState({
    gemini_model: 'gemini-2.5-flash',
  })
  const [handleButtonDisabled, setHandleButtonDisabled] = useState(true)
  const initialModelsRef = useRef({
    gemini_model: 'gemini-2.5-flash',
  })

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiFetch({
          path: 'lmat/v1/api-keys',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce(),
          },
        })

        const keys = resp?.keys || {}
        const m = resp?.models || {}
        const discovered = resp?.available_models || {}

        const nextMasked = {
          gemini: keys?.gemini || '',
        }

        setMasked(nextMasked)
        setConfigured({
          gemini: Boolean(nextMasked.gemini),
        })
        const nextModels = {
          gemini_model: m?.gemini_model || 'gemini-2.5-flash',
        }
        setModels(nextModels)
        initialModelsRef.current = nextModels
        setAvailableModels({
          gemini: Array.isArray(discovered?.gemini) ? discovered.gemini : [],
        })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    const hasKeyChanges = Object.values(keyDrafts).some((v) => (v || '').trim() !== '')
    const initial = initialModelsRef.current || {}
    const hasModelChanges =
      (models.gemini_model || '') !== (initial.gemini_model || '')

    setHandleButtonDisabled(!(hasKeyChanges || hasModelChanges))
  }, [keyDrafts, models, configured.gemini])

  async function SaveSettings({ resetProvider } = {}) {
    try {
      const keys = {}
      const modelsBody = {
        gemini_model: models.gemini_model,
      }

      for (const { key } of providerMeta) {
        const draft = (keyDrafts[key] || '').trim()

        if (resetProvider === key) {
          keys[key] = ''
          continue
        }

        if (draft !== '') {
          keys[key] = draft
        }
      }

      const apiBody = { keys, models: modelsBody }

      const response = apiFetch({
        path: 'lmat/v1/api-keys',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce(),
        },
        body: JSON.stringify(apiBody),
      })
        .then((resp) => {
          const nextMasked = {
            gemini: resp?.keys?.gemini || '',
          }
          setMasked(nextMasked)
          setConfigured({
            gemini: Boolean(nextMasked.gemini),
          })
          const m = resp?.models || {}
          const nextModels = {
            gemini_model: m?.gemini_model || models.gemini_model,
          }
          setModels(nextModels)
          initialModelsRef.current = nextModels
          const discovered = resp?.available_models || {}
          setAvailableModels({
            gemini: Array.isArray(discovered?.gemini) ? discovered.gemini : [],
          })
          setKeyDrafts({ gemini: '' })
          setHandleButtonDisabled(true)
          return resp
        })
        .catch((error) => {
          if (error?.message) {
            throw new Error(error.message)
          }
          throw new Error(__("Something went wrong", 'linguator-multilingual-ai-translation'))
        })

      toast.promise(response, {
        loading: __('Saving Settings', 'linguator-multilingual-ai-translation'),
        success: __('Settings Saved', 'linguator-multilingual-ai-translation'),
        error: (error) => error.message,
      })
    } catch (error) {
      toast.error(error?.message || __("Something went wrong", "linguator-multilingual-ai-translation"))
    }
  }

  // Keep provider visibility in sync with Translation Config + Wizard toggles (both persist to ai_translation_configuration.provider)
  const wpAiClientAvailable = Boolean(window?.lmat_settings?.wp_ai_client_available)
  const providerConfig = data?.ai_translation_configuration?.provider
  const visibleProviders = providerMeta.filter((p) => {
    if (!wpAiClientAvailable) return false
    // If provider settings aren't present yet, default to showing the inputs.
    if (!providerConfig) return true
    // If provider settings exist, show only the providers that are explicitly enabled.
    return Boolean(providerConfig?.[p.key])
  })

  return (
    <Container className='bg-white p-10 rounded-lg shadow-sm' cols="1" containerType='grid'>
      <Container.Item className="flex items-start justify-between gap-6">
        <div>
          <h2 className="m-0 text-lg font-semibold">{__('Gemini API Key & Model', 'linguator-multilingual-ai-translation')}</h2>
          <p className="mt-1 mb-0 text-sm text-gray-600">{__('Configure Gemini API key and model for the AI translation.', 'linguator-multilingual-ai-translation')}</p>
        </div>
        <Button
          disabled={handleButtonDisabled}
          size="md"
          tag="button"
          type="button"
          onClick={() => SaveSettings()}
          variant="primary"
        >
          {loading ? __('Loading…', 'linguator-multilingual-ai-translation') : __('Save', 'linguator-multilingual-ai-translation')}
        </Button>
      </Container.Item>

      <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />

      <Container cols="1" containerType="grid" className="gap-8">
        {visibleProviders.map((p) => {
          const isConfigured = configured[p.key]
          const draft = keyDrafts[p.key] || ''
          const displayValue = draft === '' && isConfigured ? (masked[p.key] || '') : draft
          const Icon = providerIcons[p.key]
          const selectedModel = (models?.[p.modelKey] || '').trim()
          const listFromApi = Array.isArray(availableModels?.[p.key]) ? availableModels[p.key] : []
          const providerModelList = [
            ...listFromApi,
            ...(selectedModel && !listFromApi.includes(selectedModel) ? [selectedModel] : []),
          ]

          return (
            <Container.Item
              key={p.key}
              className="p-6 rounded-lg bg-white"
              style={{ border: "1px solid #e5e7eb" }}
            >
              {Icon ? (
                <h3 className="flex items-center gap-2 m-0 text-base font-semibold mb-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {p.heading}
                </h3>
              ) : null}

              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <Input
                    aria-label={`${p.key}-api-key`}
                    id={`${p.key}-api-key`}
                    size="md"
                    type="text"
                    placeholder={p.placeholder}
                    disabled={isConfigured}
                    value={displayValue}
                    onChange={(v) => {
                      if (isConfigured) return
                      setKeyDrafts((prev) => ({ ...prev, [p.key]: v }))
                    }}
                  />
                  {providerKeyLinks[p.key] ? (
                    <div className="mt-2 text-sm text-gray-600">
                      {sprintf(__('Get your %s API key from ', 'linguator-multilingual-ai-translation'), providerKeyLabels[p.key] || p.key)}{' '}
                      <a href={providerKeyLinks[p.key]} target="_blank" rel="noopener noreferrer">
                        {__('here', 'linguator-multilingual-ai-translation')}
                      </a>
                    </div>
                  ) : null}
                </div>

                <div className="flex-shrink-0">
                  <Button
                    size="md"
                    tag="button"
                    type="button"
                    variant="primary"
                    onClick={() => SaveSettings({ resetProvider: p.key })}
                    disabled={!isConfigured}
                  >
                    {__('Reset', 'linguator-multilingual-ai-translation')}
                  </Button>
                </div>
              </div>

              {isConfigured ? (
                <div className="mt-8">
                  <Label size="sm" className="font-medium mb-2 block">{p.modelHeading}</Label>
                  <div className="mt-0" style={{ maxWidth: 320 }}>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      value={models[p.modelKey] || ''}
                      onChange={(e) => setModels((prev) => ({ ...prev, [p.modelKey]: e.target.value }))}
                    >
                      <option value="">{__('Select model…', 'linguator-multilingual-ai-translation')}</option>
                      {providerModelList.map((id) => (
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
            </Container.Item>
          )
        })}
      </Container>
    </Container>
  )
}

export default ApiKey